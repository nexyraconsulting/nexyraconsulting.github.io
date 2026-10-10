// Supabase Edge Function: gocardless-create-flow
// Owner clicks "Set up Direct Debit" → returns a GoCardless hosted Billing Request Flow URL.
// NEXTime never sees bank details. Deploy: supabase functions deploy gocardless-create-flow
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GC = Deno.env.get('GOCARDLESS_ENV') === 'live' ? 'https://api.gocardless.com' : 'https://api-sandbox.gocardless.com';
const SCHEMES: Record<string, string> = { bacs: 'bacs', sepa: 'sepa_core', ach: 'ach', becs: 'becs', becs_nz: 'becs_nz', pad: 'pad' };

async function gc(path: string, body: unknown) {
  const r = await fetch(GC + path, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + Deno.env.get('GOCARDLESS_ACCESS_TOKEN'), 'GoCardless-Version': '2015-07-06', 'Content-Type': 'application/json', 'Idempotency-Key': crypto.randomUUID() },
    body: JSON.stringify(body)
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j?.error?.message || 'GoCardless error');
  return j;
}

Deno.serve(async (req) => {
  const cors = { 'Access-Control-Allow-Origin': Deno.env.get('APP_ORIGIN')!, 'Access-Control-Allow-Headers': 'authorization, content-type' };
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  try {
    const { tenantId, scheme = 'bacs' } = await req.json();
    const user = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: req.headers.get('Authorization')! } } });
    const { data: role } = await user.rpc('my_role', { t: tenantId });
    if (role !== 'Owner') return new Response(JSON.stringify({ error: 'Only the Owner can set up billing.' }), { status: 403, headers: cors });

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: t } = await admin.from('tenants').select('id,name,gc_customer_id').eq('id', tenantId).single();
    const { data: { user: u } } = await user.auth.getUser();

    const br = await gc('/billing_requests', {
      billing_requests: {
        mandate_request: { scheme: SCHEMES[scheme] ?? 'bacs', verify: 'when_available' },
        metadata: { tenant_id: tenantId },
        ...(t?.gc_customer_id ? { links: { customer: t.gc_customer_id } } : {})
      }
    });
    const flow = await gc('/billing_request_flows', {
      billing_request_flows: {
        redirect_uri: Deno.env.get('APP_ORIGIN') + '/app.html?billing=done',
        exit_uri: Deno.env.get('APP_ORIGIN') + '/app.html?billing=cancelled',
        prefilled_customer: { email: u?.email, company_name: t?.name },
        links: { billing_request: br.billing_requests.id }
      }
    });
    return new Response(JSON.stringify({ url: flow.billing_request_flows.authorisation_url }), { headers: { ...cors, 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 400, headers: cors });
  }
});
