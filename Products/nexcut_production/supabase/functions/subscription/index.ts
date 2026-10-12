// /functions/v1/subscription   (NEXCut Business app + website account area; owner JWT required)
//   GET                         → current subscription + entitlement (same record on every device)
//   POST {action:"cancel"}      → during trial: cancels at trial end, NO charge, never converts.
//                                 after trial: stops renewal at the end of the current period / term.
//   POST {action:"resume"}      → undo a pending cancellation before it takes effect
//   POST {action:"change", term} → during trial only: switch term with no charge; trial end unchanged.
//   POST {action:"portal"}      → Stripe Customer Portal URL (update payment method, invoices, receipts)
// App Store / Google Play subscriptions are cancelled in the store; we return 409 + instructions.
import { admin, stripe, json, cors, ownerFromRequest, mapStripeStatus, ts } from "../_shared/billing.ts";

const PORTAL_RETURN = Deno.env.get("BILLING_PORTAL_RETURN_URL")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(req) });
  const owner = await ownerFromRequest(req);
  if (!owner) return json(req, 401, { message: "Sign in as the business owner." });

  const { data: s } = await admin.from("subscriptions").select("*").eq("business_id", owner.businessId).maybeSingle();
  if (req.method === "GET") {
    const { data: ent } = await admin.from("business_entitlements").select("has_access").eq("business_id", owner.businessId).maybeSingle();
    const { data: invoices } = await admin.from("invoices").select("amount_paid_pence, status, hosted_invoice_url, invoice_pdf, period_start, period_end, created_at").eq("business_id", owner.businessId).order("created_at", { ascending: false }).limit(24);
    return json(req, 200, { subscription: s, hasAccess: !!ent?.has_access, invoices: invoices ?? [] });
  }
  if (!s) return json(req, 404, { message: "No subscription found." });

  const body = await req.json().catch(() => ({}));
  if (s.channel !== "stripe" && body.action !== "portal") {
    return json(req, 409, {
      message: s.channel === "app_store"
        ? "This subscription is billed by Apple. Cancel or change it in Settings → your name → Subscriptions on your iPhone."
        : "This subscription is billed by Google Play. Cancel or change it in the Play Store → Payments & subscriptions.",
    });
  }

  switch (body.action) {
    case "cancel": {
      // For a trialing subscription the current period IS the trial, so cancel_at_period_end ends it at
      // trial_end without creating an invoice. Access continues until then.
      const sub = await stripe.subscriptions.update(s.stripe_subscription_id, { cancel_at_period_end: true, metadata: { cancel_source: "owner" } });
      await admin.from("subscriptions").update({ status: mapStripeStatus(sub), cancel_at_period_end: true, cancelled_at: new Date().toISOString() }).eq("id", s.id);
      return json(req, 200, { status: mapStripeStatus(sub), endsAt: ts(sub.trial_end && sub.status === "trialing" ? sub.trial_end : sub.current_period_end) });
    }
    case "resume": {
      const sub = await stripe.subscriptions.update(s.stripe_subscription_id, { cancel_at_period_end: false });
      await admin.from("subscriptions").update({ status: mapStripeStatus(sub), cancel_at_period_end: false, cancelled_at: null }).eq("id", s.id);
      return json(req, 200, { status: mapStripeStatus(sub) });
    }
    case "change": {
      if (s.status !== "trialing") return json(req, 409, { message: "After the trial, changes follow your subscription terms. Contact support to change." });
      const { data: t } = await admin.from("billing_terms").select("*").eq("code", body.term).eq("active", true).maybeSingle();
      if (!t?.stripe_price_id) return json(req, 400, { message: "That billing option is not available yet." });
      const cur = await stripe.subscriptions.retrieve(s.stripe_subscription_id);
      const sub = await stripe.subscriptions.update(s.stripe_subscription_id, {
        items: [{ id: cur.items.data[0].id, price: t.stripe_price_id }],
        proration_behavior: "none", trial_end: cur.trial_end ?? "now", metadata: { ...cur.metadata, term_code: t.code },
      });
      await admin.from("subscriptions").update({ term_code: t.code, status: mapStripeStatus(sub) }).eq("id", s.id);
      return json(req, 200, { term: t.code });
    }
    case "portal": {
      if (!s.stripe_customer_id) return json(req, 409, { message: "Billing is managed in your app store account." });
      const p = await stripe.billingPortal.sessions.create({ customer: s.stripe_customer_id, return_url: PORTAL_RETURN, locale: "en-GB" });
      return json(req, 200, { url: p.url });
    }
  }
  return json(req, 400, { message: "Unknown action." });
});
