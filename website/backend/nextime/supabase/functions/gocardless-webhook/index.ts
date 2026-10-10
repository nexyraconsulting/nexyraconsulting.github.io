// Supabase Edge Function: gocardless-webhook
// Point the GoCardless webhook endpoint at https://<project>.functions.supabase.co/gocardless-webhook
// Verifies the signature, stores every event once (idempotent) and updates the tenant's subscription state.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GC = Deno.env.get('GOCARDLESS_ENV') === 'live' ? 'https://api.gocardless.com' : 'https://api-sandbox.gocardless.com';
const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const VAT = 0.2;

async function hmac(secret: string, body: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
}
async function gc(method: string, path: string, body?: unknown) {
  const r = await fetch(GC + path, { method, headers: { Authorization: 'Bearer ' + Deno.env.get('GOCARDLESS_ACCESS_TOKEN'), 'GoCardless-Version': '2015-07-06', 'Content-Type': 'application/json', 'Idempotency-Key': crypto.randomUUID() }, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json(); if (!r.ok) throw new Error(j?.error?.message || 'GoCardless error'); return j;
}
const log = (tenant_id: string | null, type: string, summary: string) => db.from('platform_events').insert({ tenant_id, type, summary });

async function tenantFor(ev: any): Promise<string | null> {
  if (ev.metadata?.tenant_id) return ev.metadata.tenant_id;
  const l = ev.links || {};
  const col = l.mandate ? ['gc_mandate_id', l.mandate] : l.subscription ? ['gc_subscription_id', l.subscription] : l.customer ? ['gc_customer_id', l.customer] : null;
  if (!col) return null;
  const { data } = await db.from('tenants').select('id').eq(col[0], col[1]).maybeSingle();
  return data?.id ?? null;
}

async function startSubscription(tenantId: string, mandateId: string) {
  const { data: t } = await db.from('tenants').select('*, plans(*)').eq('id', tenantId).single();
  if (!t || t.plan === 'enterprise') return;
  const net = t.cycle === 'annual' ? t.plans.annual_pence : t.plans.monthly_pence;
  const start = new Date(Math.max(Date.now() + 3 * 86400000, new Date(t.trial_ends).getTime())).toISOString().slice(0, 10);
  const s = await gc('POST', '/subscriptions', { subscriptions: {
    amount: Math.round(net * (1 + VAT)), currency: t.currency, name: 'NEXTime ' + t.plans.name,
    interval_unit: t.cycle === 'annual' ? 'yearly' : 'monthly', start_date: start,
    metadata: { tenant_id: tenantId, plan: t.plan, cycle: t.cycle }, links: { mandate: mandateId }
  } });
  await db.from('tenants').update({ gc_subscription_id: s.subscriptions.id, next_charge_at: start }).eq('id', tenantId);
}

Deno.serve(async (req) => {
  const raw = await req.text();
  if ((await hmac(Deno.env.get('GOCARDLESS_WEBHOOK_SECRET')!, raw)) !== req.headers.get('Webhook-Signature')) return new Response('Invalid signature', { status: 498 });
  const { events } = JSON.parse(raw);
  for (const ev of events) {
    const { error: dup } = await db.from('billing_events').insert({ gc_event_id: ev.id, resource_type: ev.resource_type, action: ev.action, payload: ev });
    if (dup) continue; // already processed
    const tid = await tenantFor(ev);
    if (tid) await db.from('billing_events').update({ tenant_id: tid }).eq('gc_event_id', ev.id);
    if (!tid) continue;
    const key = ev.resource_type + '.' + ev.action;
    switch (key) {
      case 'billing_requests.fulfilled': {
        const br = await gc('GET', '/billing_requests/' + ev.links.billing_request);
        const mandate = br.billing_requests.links.mandate_request_mandate;
        const { data: prev } = await db.from('tenants').select('stripe_subscription_id').eq('id', tid).single();
        if (prev?.stripe_subscription_id) await db.from('billing_events').insert({ gc_event_id: ev.id + '-switch', resource_type: 'note', action: 'stripe_subscription_to_cancel', payload: { stripe_subscription_id: prev.stripe_subscription_id }, tenant_id: tid }).then(() => {}, () => {});
        await db.from('tenants').update({ payment_method: 'direct_debit', gc_customer_id: br.billing_requests.links.customer, gc_mandate_id: mandate, mandate_status: 'pending_submission' }).eq('id', tid);
        await startSubscription(tid, mandate);
        await log(tid, 'billing.mandate', 'Direct Debit mandate ' + mandate + ' created');
        break;
      }
      case 'mandates.active':
        await db.from('tenants').update({ mandate_status: 'active' }).eq('id', tid);
        await log(tid, 'billing.mandate_active', 'Direct Debit mandate active');
        break;
      case 'mandates.cancelled': case 'mandates.failed': case 'mandates.expired':
        await db.from('tenants').update({ mandate_status: ev.action }).eq('id', tid);
        await log(tid, 'billing.mandate_' + ev.action, 'Direct Debit mandate ' + ev.action);
        break;
      case 'payments.confirmed': case 'payments.paid_out': case 'payments.failed': case 'payments.cancelled': {
        const p = (await gc('GET', '/payments/' + ev.links.payment)).payments;
        const { data: t } = await db.from('tenants').select('plan,cycle,status').eq('id', tid).single();
        const gross = p.amount, net = Math.round(gross / (1 + VAT));
        await db.from('invoices').upsert({ id: p.id, tenant_id: tid, gc_payment_id: p.id, amount_pence: net, vat_pence: gross - net, currency: p.currency, plan: t!.plan, cycle: t!.cycle, status: ev.action, charge_date: p.charge_date }, { onConflict: 'id' });
        if (ev.action === 'failed') await db.from('tenants').update({ status: 'past_due' }).eq('id', tid);
        if ((ev.action === 'confirmed' || ev.action === 'paid_out') && (t!.status === 'past_due' || t!.status === 'trialing')) await db.from('tenants').update({ status: 'active' }).eq('id', tid);
        await log(tid, 'billing.payment_' + ev.action, 'Payment ' + p.id + ' ' + ev.action);
        break;
      }
      case 'subscriptions.cancelled':
        await db.from('tenants').update({ gc_subscription_id: null }).eq('id', tid);
        break;
    }
  }
  return new Response('ok');
});
