// stripe-create-setup — Owner adds a card, Apple Pay or Google Pay.
// Returns a SetupIntent client secret for the Stripe Payment Element. Card data never reaches NEXTime.
// POST { tenantId }  →  { clientSecret, publishableKey, customerId }
import Stripe from 'https://esm.sh/stripe@14.25.0?target=deno';
import { admin, cors, env, fail, json, requireRole } from '../_shared/common.ts';

const stripe = new Stripe(env('STRIPE_SECRET_KEY'), { apiVersion: '2024-06-20', httpClient: Stripe.createFetchHttpClient() });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors() });
  try {
    const { tenantId } = await req.json();
    if (!tenantId) return fail('tenantId is required.');
    const { user } = await requireRole(req, tenantId, ['Owner']);
    const db = admin();
    const { data: t, error } = await db.from('tenants').select('id, name, stripe_customer_id').eq('id', tenantId).single();
    if (error || !t) return fail('Workspace not found.', 404);

    let customerId = t.stripe_customer_id;
    if (!customerId) {
      const c = await stripe.customers.create({ name: t.name, email: user.email, metadata: { tenant_id: tenantId } });
      customerId = c.id;
      await db.from('tenants').update({ stripe_customer_id: customerId }).eq('id', tenantId);
    }
    const si = await stripe.setupIntents.create({
      customer: customerId,
      usage: 'off_session',
      automatic_payment_methods: { enabled: true }, // card + Apple Pay + Google Pay as enabled in the Stripe Dashboard
      metadata: { tenant_id: tenantId }
    });
    return json({ clientSecret: si.client_secret, publishableKey: env('STRIPE_PUBLISHABLE_KEY'), customerId });
  } catch (e) {
    return fail((e as Error).message, (e as { status?: number }).status ?? 400);
  }
});
