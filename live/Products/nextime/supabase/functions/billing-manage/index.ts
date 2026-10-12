// billing-manage — Owner billing actions, provider-aware.
// POST { tenantId, action, ...params }
//   action = 'change_plan'    { plan: 'starter'|'team'|'business', cycle: 'monthly'|'annual' }
//   action = 'use_invoice'    { email, address, po? }   → yearly Stripe subscription, invoice + bank transfer, 30 days
//   action = 'remove_method'
//   action = 'cancel'
//   action = 'reactivate'
import Stripe from 'https://esm.sh/stripe@14.25.0?target=deno';
import { admin, cors, env, fail, json, logEvent, requireRole, VAT_RATE } from '../_shared/common.ts';

const stripe = new Stripe(env('STRIPE_SECRET_KEY'), { apiVersion: '2024-06-20', httpClient: Stripe.createFetchHttpClient() });
const GC = env('GOCARDLESS_ENV') === 'live' ? 'https://api.gocardless.com' : 'https://api-sandbox.gocardless.com';
async function gc(method: string, path: string, body?: unknown) {
  const r = await fetch(GC + path, { method, headers: { Authorization: 'Bearer ' + env('GOCARDLESS_ACCESS_TOKEN'), 'GoCardless-Version': '2015-07-06', 'Content-Type': 'application/json', 'Idempotency-Key': crypto.randomUUID() }, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json(); if (!r.ok) throw new Error(j?.error?.message ?? 'GoCardless error'); return j;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors() });
  try {
    const p = await req.json();
    const { user } = await requireRole(req, p.tenantId, ['Owner']);
    const db = admin();
    const { data: t } = await db.from('tenants').select('*, plans(*)').eq('id', p.tenantId).single();
    if (!t) return fail('Workspace not found.', 404);

    if (p.action === 'change_plan') {
      const { data: plan } = await db.from('plans').select('*').eq('id', p.plan).single();
      if (!plan || plan.id === 'enterprise') return fail('Choose Starter, Team or Business.');
      const cycle = p.cycle === 'annual' ? 'annual' : 'monthly';
      // Server-side limit check against the current snapshot.
      const { data: snap } = await db.from('workspace_snapshots').select('snapshot').eq('tenant_id', t.id).maybeSingle();
      const active = ((snap?.snapshot?.employees ?? []) as any[]).filter((e) => e.status !== 'Left').length;
      if (plan.staff_limit != null && active > plan.staff_limit) return fail('You have ' + active + ' active staff; ' + plan.name + ' allows ' + plan.staff_limit + '.');
      if (t.stripe_subscription_id) {
        const sub = await stripe.subscriptions.retrieve(t.stripe_subscription_id);
        const price = cycle === 'annual' ? plan.stripe_price_annual : plan.stripe_price_monthly;
        await stripe.subscriptions.update(sub.id, { items: [{ id: sub.items.data[0].id, price }], proration_behavior: 'create_prorations', metadata: { tenant_id: t.id, plan: plan.id, cycle } });
      } else if (t.gc_subscription_id) {
        // GoCardless subscriptions cannot change interval; cancel and recreate from the next charge date.
        await gc('POST', '/subscriptions/' + t.gc_subscription_id + '/actions/cancel');
        const net = cycle === 'annual' ? plan.annual_pence : plan.monthly_pence;
        const start = t.next_charge_at ?? new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10);
        const s = await gc('POST', '/subscriptions', { subscriptions: { amount: Math.round(net * (1 + VAT_RATE)), currency: t.currency, name: 'NEXTime ' + plan.name, interval_unit: cycle === 'annual' ? 'yearly' : 'monthly', start_date: start, metadata: { tenant_id: t.id }, links: { mandate: t.gc_mandate_id } } });
        await db.from('tenants').update({ gc_subscription_id: s.subscriptions.id }).eq('id', t.id);
      }
      await db.from('tenants').update({ plan: plan.id, cycle }).eq('id', t.id);
      await logEvent(t.id, 'billing.plan', 'Plan changed to ' + plan.name + ' (' + cycle + ')', user.id);
      return json({ ok: true });
    }

    if (p.action === 'use_invoice') {
      if (!p.email || !p.address) return fail('Invoice email and billing address are required.');
      const price = t.plans.stripe_price_annual;
      if (!price) return fail('Annual Stripe price id missing for this plan.');
      let customer = t.stripe_customer_id;
      if (!customer) { customer = (await stripe.customers.create({ name: t.name, email: p.email, metadata: { tenant_id: t.id } })).id; }
      await stripe.customers.update(customer, { email: p.email, address: { line1: String(p.address).slice(0, 200) }, invoice_settings: { custom_fields: p.po ? [{ name: 'PO number', value: String(p.po).slice(0, 30) }] : [] } });
      if (t.stripe_subscription_id) await stripe.subscriptions.cancel(t.stripe_subscription_id);
      const trialEnd = Math.floor(new Date(t.trial_ends).getTime() / 1000);
      const sub = await stripe.subscriptions.create({ customer, items: [{ price }], collection_method: 'send_invoice', days_until_due: 30, ...(trialEnd > Date.now() / 1000 + 60 ? { trial_end: trialEnd } : {}), metadata: { tenant_id: t.id, plan: t.plan, cycle: 'annual' } });
      if (t.gc_subscription_id) await gc('POST', '/subscriptions/' + t.gc_subscription_id + '/actions/cancel').catch(() => {});
      await db.from('tenants').update({ payment_method: 'invoice', cycle: 'annual', stripe_customer_id: customer, stripe_subscription_id: sub.id, gc_subscription_id: null, invoice_email: p.email, invoice_address: p.address, invoice_po: p.po ?? null }).eq('id', t.id);
      await logEvent(t.id, 'billing.method', 'Switched to invoice billing', user.id);
      return json({ ok: true });
    }

    if (p.action === 'remove_method') {
      if (t.stripe_payment_method_id) await stripe.paymentMethods.detach(t.stripe_payment_method_id).catch(() => {});
      if (t.gc_mandate_id) await gc('POST', '/mandates/' + t.gc_mandate_id + '/actions/cancel').catch(() => {});
      await db.from('tenants').update({ payment_method: null, stripe_payment_method_id: null, card_brand: null, card_last4: null, card_wallet: null, mandate_status: t.gc_mandate_id ? 'cancelled' : t.mandate_status }).eq('id', t.id);
      await logEvent(t.id, 'billing.method_removed', 'Payment method removed', user.id);
      return json({ ok: true });
    }

    if (p.action === 'cancel') {
      if (t.stripe_subscription_id) await stripe.subscriptions.cancel(t.stripe_subscription_id);
      if (t.gc_subscription_id) await gc('POST', '/subscriptions/' + t.gc_subscription_id + '/actions/cancel').catch(() => {});
      await db.from('tenants').update({ status: 'cancelled', cancelled_at: new Date().toISOString(), stripe_subscription_id: null, gc_subscription_id: null }).eq('id', t.id);
      await logEvent(t.id, 'billing.cancelled', 'Subscription cancelled', user.id);
      return json({ ok: true });
    }

    if (p.action === 'reactivate') {
      // Needs a payment method; the client then re-runs card setup / Direct Debit flow if none is active.
      const hasMethod = !!t.stripe_payment_method_id || t.mandate_status === 'active' || t.payment_method === 'invoice';
      await db.from('tenants').update({ status: new Date(t.trial_ends) > new Date() ? 'trialing' : 'active', cancelled_at: null }).eq('id', t.id);
      await logEvent(t.id, 'billing.reactivated', 'Subscription reactivated', user.id);
      return json({ ok: true, needsPaymentMethod: !hasMethod });
    }

    return fail('Unknown action.');
  } catch (e) {
    return fail((e as Error).message, (e as { status?: number }).status ?? 400);
  }
});
