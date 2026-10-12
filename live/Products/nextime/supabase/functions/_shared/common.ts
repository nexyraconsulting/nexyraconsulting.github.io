// Shared helpers for NEXTime edge functions.
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

export const env = (k: string, required = true) => {
  const v = Deno.env.get(k);
  if (!v && required) throw new Error('Missing environment variable ' + k);
  return v ?? '';
};

export const cors = () => ({
  'Access-Control-Allow-Origin': env('APP_ORIGIN'),
  'Access-Control-Allow-Headers': 'authorization, content-type, x-client-info, apikey',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Vary': 'Origin'
});

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors(), 'Content-Type': 'application/json' } });

export const fail = (message: string, status = 400) => json({ error: message }, status);

export const admin = (): SupabaseClient => createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false } });

/** Client acting as the signed-in caller (RLS applies). */
export const asUser = (req: Request): SupabaseClient =>
  createClient(env('SUPABASE_URL'), env('SUPABASE_ANON_KEY'), { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } }, auth: { persistSession: false } });

/** Returns the caller's user and role in the tenant, or throws. */
export async function requireRole(req: Request, tenantId: string, roles: string[]) {
  const u = asUser(req);
  const { data: { user } } = await u.auth.getUser();
  if (!user) throw Object.assign(new Error('Sign in required.'), { status: 401 });
  const { data: role } = await u.rpc('my_role', { t: tenantId });
  if (!roles.includes(role)) throw Object.assign(new Error('You do not have permission to do that.'), { status: 403 });
  return { user, role: role as string, client: u };
}

export const logEvent = (tenant_id: string | null, type: string, summary: string, actor?: string) =>
  admin().from('platform_events').insert({ tenant_id, type, summary, actor: actor ?? null });

export async function sendEmail(to: string, subject: string, html: string) {
  const key = Deno.env.get('RESEND_API_KEY');
  if (!key) { console.warn('RESEND_API_KEY not set; email to ' + to + ' skipped'); return; }
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env('EMAIL_FROM'), to, subject, html })
  });
  if (!r.ok) console.error('Email failed', await r.text());
}

export const VAT_RATE = Number(Deno.env.get('VAT_RATE') ?? '0.2');
