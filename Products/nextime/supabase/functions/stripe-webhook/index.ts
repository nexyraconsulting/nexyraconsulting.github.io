// stripe-webhook — Stripe Dashboard → Developers → Webhooks → endpoint
//   https://<project-ref>.functions.supabase.co/stripe-webhook
// Events: setup_intent.succeeded, invoice.finalized, invoice.paid, invoice.payment_failed,
//         customer.subscription.updated, customer.subscription.deleted, payment_method.detached
import Stripe from 'https://esm.sh/stripe@14.25.0?target=deno';
import { admin, env, logEvent } from '../_shared/common.ts';

const stripe = new Stripe(env('STRIPE_SECRET_KEY'), { apiVersion: '2024-06-20', httpClient: Stripe.createFetchHttpClient() });
const crypto = Stripe.createSubtleCryptoProvider();
const db = admin();

async function tenantByCustomer(customer: string | null) {
  if (!customer) return null;
  const { data } = await db.from('tenants').select('*, plans(*)').eq('stripe_customer_id', customer).maybeSingle();
  return data;
}

/** Creates (or re-points) the Stripe subscription once a card/wallet is saved. Trial is honoured. */
async function ensureSubscription(t: any, paymentMethod: string) {
  const price = t.cycle === 'annual' ? t.plans.stripe_price_annual : t.plans.stripe_price_monthly;
  if (!price) throw new Error('Stripe price id missing for plan ' + t.plan + ' (' + t.cycle + '). See seed.sql.');
  await stripe.customers.update(t.stripe_customer_id, { invoice_settings: { default_payment_method: paymentMethod } });
  if (t.stripe_subscription_id) {
    await stripe.subscriptions.update(t.stripe_subscription_id, { default_payment_method: paymentMethod, collection_method: 'charge_automatically' });
    return t.stripe_subscription_id;
  }
  const trialEnd = Math.floor(new Date(t.trial_ends).getTime() / 1000);
  const sub = await stripe.subscriptions.create({
    customer: t.stripe_customer_id,
    items: [{ price }],
    default_payment_method: paymentMethod,
    automatic_tax: { enabled: Deno.env.get('STRIPE_AUTOMATIC_TAX') === 'true' },
    ...(trialEnd > Math.floor(Date.now() / 1000) + 60 ? { trial_end: trialEnd } : {}),
    metadata: { tenant_id: t.id, plan: t.plan, cycle: t.cycle }
  });
  return sub.id;
}

Deno.serve(async (req) => {
  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, req.headers.get('Stripe-Signature') ?? '', env('STRIPE_WEBHOOK_SECRET'), undefined, crypto);
  } catch (e) {
    return new Response('Invalid signature: ' + (e as Error).message, { status: 400 });
  }
  const { error: dup } = await db.from('billing_events').insert({ gc_event_id: event.id, provider: 'stripe', resource_type: event.type.split('.')[0], action: event.type, payload: event as unknown as Record<string, unknown> });
  if (dup) return new Response('duplicate', { status: 200 });

  try {
    const obj: any = event.data.object;
    const t = await tenantByCustomer(obj.customer ?? null);
    if (!t) return new Response('no tenant', { status: 200 });
    await db.from('billing_events').update({ tenant_id: t.id }).eq('gc_event_id', event.id);

    switch (event.type) {
      case 'setup_intent.succeeded': {
        const pm = await stripe.paymentMethods.retrieve(obj.payment_method);
        const wallet = pm.card?.wallet?.type === 'apple_pay' ? 'Apple Pay' : pm.card?.wallet?.type === 'google_pay' ? 'Google Pay' : null;
        const subId = await ensureSubscription(t, pm.id);
        // Switching from Direct Debit: GoCardless subscription is cancelled by billing-manage before this point.
        await db.from('tenants').update({
          payment_method: 'card', stripe_payment_method_id: pm.id, stripe_subscription_id: subId,
          card_brand: pm.card?.brand ?? null, card_last4: pm.card?.last4 ?? null, card_wallet: wallet,
          status: t.status === 'past_due' || (t.status === 'trialing' && new Date(t.trial_ends) < new Date()) ? 'active' : t.status
        }).eq('id', t.id);
        await logEvent(t.id, 'billing.method', (wallet ?? 'Card') + ' saved · ' + (pm.card?.brand ?? '') + ' ' + (pm.card?.last4 ?? ''));
        break;
      }
      case 'invoice.finalized':
      case 'invoice.paid':
      case 'invoice.payment_failed': {
        const status = event.type === 'invoice.paid' ? 'paid_out' : event.type === 'invoice.payment_failed' ? 'failed' : 'open';
        await db.from('invoices').upsert({
          id: obj.number ?? obj.id, tenant_id: t.id, provider: 'stripe', stripe_invoice_id: obj.id,
          amount_pence: obj.subtotal_excluding_tax ?? obj.subtotal, vat_pence: obj.tax ?? 0, currency: String(obj.currency).toUpperCase(),
          plan: t.plan, cycle: t.cycle, status, hosted_url: obj.hosted_invoice_url,
          charge_date: obj.due_date ? new Date(obj.due_date * 1000).toISOString().slice(0, 10) : null
        }, { onConflict: 'stripe_invoice_id' });
        if (status === 'failed') await db.from('tenants').update({ status: 'past_due' }).eq('id', t.id);
        if (status === 'paid_out' && (t.status === 'past_due' || t.status === 'trialing')) await db.from('tenants').update({ status: 'active' }).eq('id', t.id);
        await logEvent(t.id, 'billing.invoice_' + status, 'Stripe invoice ' + (obj.number ?? obj.id) + ' ' + status);
        break;
      }
      case 'customer.subscription.updated': {
        const next = obj.current_period_end ? new Date(obj.current_period_end * 1000).toISOString().slice(0, 10) : null;
        await db.from('tenants').update({ next_charge_at: next, status: obj.status === 'past_due' || obj.status === 'unpaid' ? 'past_due' : t.status === 'cancelled' ? 'cancelled' : obj.status === 'trialing' ? 'trialing' : 'active' }).eq('id', t.id);
        break;
      }
      case 'customer.subscription.deleted':
        await db.from('tenants').update({ stripe_subscription_id: null }).eq('id', t.id);
        await logEvent(t.id, 'billing.subscription_ended', 'Stripe subscription ended');
        break;
      case 'payment_method.detached':
        if (t.stripe_payment_method_id === obj.id) await db.from('tenants').update({ stripe_payment_method_id: null, card_brand: null, card_last4: null, card_wallet: null }).eq('id', t.id);
        break;
    }
  } catch (e) {
    console.error(e);
    return new Response('handler error', { status: 500 }); // Stripe retries
  }
  return new Response('ok');
});
