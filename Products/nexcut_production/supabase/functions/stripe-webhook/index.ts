// POST /functions/v1/stripe-webhook   (Stripe → NEXCut; verify_jwt = false, signature-verified instead)
// The ONLY writer of subscription state for the web channel. Idempotent via billing_events.
import type Stripe from "npm:stripe@17";
import { admin, stripe, cryptoProvider, mapStripeStatus, ts, enqueue } from "../_shared/billing.ts";

const SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

async function ownerEmail(businessId: string) {
  const { data: m } = await admin.from("business_members").select("user_id").eq("business_id", businessId).eq("role", "owner").single();
  const { data } = await admin.auth.admin.getUserById(m!.user_id);
  return data.user?.email ?? "";
}
async function pmLabel(pmId?: string | null) {
  if (!pmId) return null;
  const pm = await stripe.paymentMethods.retrieve(pmId);
  if (pm.type === "card") return `${(pm.card?.brand ?? "Card").replace(/^\w/, (c) => c.toUpperCase())} ending ${pm.card?.last4}${pm.card?.wallet ? ` (${pm.card.wallet.type.replace("_", " ")})` : ""}`;
  if (pm.type === "bacs_debit") return `Direct Debit · account ending ${pm.bacs_debit?.last4}`;
  return pm.type;
}
async function termFromSub(sub: Stripe.Subscription) {
  const price = sub.items.data[0]?.price.id;
  const { data } = await admin.from("billing_terms").select("code, commitment_months").eq("stripe_price_id", price).maybeSingle();
  return data;
}
async function syncSubscription(sub: Stripe.Subscription) {
  const businessId = sub.metadata.business_id;
  if (!businessId) return null;
  const term = await termFromSub(sub);
  const start = ts(sub.start_date)!;
  const commitmentEnds = term?.commitment_months
    ? new Date(new Date(ts(sub.trial_end) ?? start).setMonth(new Date(ts(sub.trial_end) ?? start).getMonth() + term.commitment_months)).toISOString()
    : null;
  const row = {
    business_id: businessId,
    term_code: term?.code ?? sub.metadata.term_code,
    status: mapStripeStatus(sub),
    channel: "stripe",
    stripe_subscription_id: sub.id,
    stripe_customer_id: String(sub.customer),
    trial_start: ts(sub.trial_start), trial_end: ts(sub.trial_end),
    current_period_start: ts(sub.current_period_start), current_period_end: ts(sub.current_period_end),
    commitment_ends_at: commitmentEnds,
    cancel_at_period_end: sub.cancel_at_period_end,
    cancelled_at: ts(sub.canceled_at), ended_at: ts(sub.ended_at),
    payment_method_label: await pmLabel(typeof sub.default_payment_method === "string" ? sub.default_payment_method : sub.default_payment_method?.id),
  };
  await admin.from("subscriptions").upsert(row, { onConflict: "business_id" });
  return row;
}

Deno.serve(async (req) => {
  const sig = req.headers.get("stripe-signature");
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(raw, sig!, SECRET, undefined, cryptoProvider);
  } catch (e) {
    return new Response(`Bad signature: ${(e as Error).message}`, { status: 400 });
  }

  // Idempotency: first writer wins; replays return 200 without side effects.
  const { error: dup } = await admin.from("billing_events").insert({ id: event.id, source: "stripe", type: event.type, payload: event as unknown as Record<string, unknown> });
  if (dup) return new Response("duplicate", { status: 200 });

  try {
    const o = event.data.object as any;
    switch (event.type) {
      case "checkout.session.completed": {
        const sub = await stripe.subscriptions.retrieve(o.subscription as string);
        const row = await syncSubscription(sub);
        if (row) await enqueue(row.business_id, "trial_started", await ownerEmail(row.business_id), { trial_end: row.trial_end, term: row.term_code });
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.paused":
      case "customer.subscription.resumed": {
        const row = await syncSubscription(o as Stripe.Subscription);
        const prev = (event.data as any).previous_attributes ?? {};
        if (row && row.status === "trial_cancelled" && prev.cancel_at_period_end === false)
          await enqueue(row.business_id, "trial_cancelled", await ownerEmail(row.business_id), { trial_end: row.trial_end });
        break;
      }
      case "customer.subscription.deleted": {
        const row = await syncSubscription(o as Stripe.Subscription);
        if (row && row.status === "cancelled") await enqueue(row.business_id, "subscription_cancelled", await ownerEmail(row.business_id), { ended_at: row.ended_at });
        break;
      }
      case "customer.subscription.trial_will_end": {      // ~3 days before trial end
        const sub = o as Stripe.Subscription;
        if (!sub.cancel_at_period_end && sub.metadata.business_id)
          await enqueue(sub.metadata.business_id, "trial_ending", await ownerEmail(sub.metadata.business_id), { trial_end: ts(sub.trial_end) });
        break;
      }
      case "invoice.paid":
      case "invoice.payment_failed":
      case "invoice.upcoming": {
        const inv = o as Stripe.Invoice;
        const subId = typeof inv.subscription === "string" ? inv.subscription : inv.subscription?.id;
        if (!subId) break;
        const { data: s } = await admin.from("subscriptions").select("business_id").eq("stripe_subscription_id", subId).maybeSingle();
        if (!s) break;
        if (event.type === "invoice.upcoming") { await enqueue(s.business_id, "renewal_upcoming", await ownerEmail(s.business_id), { amount: inv.amount_due, date: ts(inv.next_payment_attempt ?? inv.period_end) }); break; }
        if (inv.amount_due === 0 && inv.billing_reason === "subscription_create") break; // £0 trial invoice: not a payment
        await admin.from("invoices").upsert({
          business_id: s.business_id, stripe_invoice_id: inv.id, amount_due_pence: inv.amount_due, amount_paid_pence: inv.amount_paid,
          currency: inv.currency, status: inv.status, hosted_invoice_url: inv.hosted_invoice_url, invoice_pdf: inv.invoice_pdf,
          period_start: ts(inv.period_start), period_end: ts(inv.period_end),
        }, { onConflict: "stripe_invoice_id" });
        await admin.from("subscriptions").update({ last_payment_status: event.type === "invoice.paid" ? "paid" : "failed" }).eq("stripe_subscription_id", subId);
        await syncSubscription(await stripe.subscriptions.retrieve(subId));
        await enqueue(s.business_id, event.type === "invoice.paid" ? "payment_succeeded" : "payment_failed", await ownerEmail(s.business_id), { invoice: inv.id, amount: inv.amount_due, url: inv.hosted_invoice_url });
        break;
      }
      case "payment_method.attached":
      case "customer.updated": {
        const cust = event.type === "customer.updated" ? o : await stripe.customers.retrieve(o.customer);
        const subs = await stripe.subscriptions.list({ customer: (cust as any).id, status: "all", limit: 1 });
        if (subs.data[0]) await syncSubscription(subs.data[0]);
        break;
      }
      case "mandate.updated": {                            // Bacs mandate revoked/failed → owner must update details
        if (o.status !== "active") console.warn("mandate inactive", o.id);
        break;
      }
    }
    await admin.from("billing_events").update({ processed_at: new Date().toISOString() }).eq("id", event.id);
    return new Response("ok", { status: 200 });
  } catch (e) {
    console.error(event.type, e);
    // Let Stripe retry: remove the idempotency marker so the retry is processed.
    await admin.from("billing_events").delete().eq("id", event.id);
    return new Response("error", { status: 500 });
  }
});
