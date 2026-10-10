// Supabase Edge Function: invite-member
// Owner/Admin invites a colleague. Creates the invitation row and sends the Supabase invite email
// whose link opens account.html?invite=<token>.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const cors = { 'Access-Control-Allow-Origin': Deno.env.get('APP_ORIGIN')!, 'Access-Control-Allow-Headers': 'authorization, content-type' };
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  const { tenantId, email, role, empId = '' } = await req.json();
  const user = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: req.headers.get('Authorization')! } } });
  const { data: myRole } = await user.rpc('my_role', { t: tenantId });
  const allowed = myRole === 'Owner' ? ['Admin', 'Manager', 'Employee'] : myRole === 'Admin' ? ['Manager', 'Employee'] : [];
  if (!allowed.includes(role)) return new Response(JSON.stringify({ error: 'You cannot invite that role.' }), { status: 403, headers: cors });

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { data: { user: me } } = await user.auth.getUser();
  await admin.from('invitations').delete().eq('tenant_id', tenantId).eq('email', email).is('accepted_at', null);
  const { data: inv, error } = await admin.from('invitations').insert({ tenant_id: tenantId, email, role, emp_id: empId, invited_by: me!.id }).select('token').single();
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: cors });

  const redirectTo = Deno.env.get('APP_ORIGIN') + '/account.html?invite=' + inv.token;
  const { error: mailErr } = await admin.auth.admin.inviteUserByEmail(email, { redirectTo });
  if (mailErr && !/already been registered/i.test(mailErr.message)) return new Response(JSON.stringify({ error: mailErr.message }), { status: 400, headers: cors });
  // Existing users: send your own transactional email with redirectTo (Resend/Postmark), or use a magic link.
  await admin.from('platform_events').insert({ tenant_id: tenantId, type: 'member.invited', summary: email + ' invited as ' + role, actor: me!.id });
  return new Response(JSON.stringify({ token: inv.token }), { headers: { ...cors, 'Content-Type': 'application/json' } });
});
