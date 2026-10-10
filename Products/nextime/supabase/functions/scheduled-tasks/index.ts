// scheduled-tasks — called daily by pg_cron (see migrations/0002). Protected by the x-cron-secret header.
// Sends trial-ending reminders 3 days before the trial ends to Owners without a payment method.
import { admin, env, logEvent, sendEmail } from '../_shared/common.ts';

Deno.serve(async (req) => {
  if (req.headers.get('x-cron-secret') !== env('CRON_SECRET')) return new Response('forbidden', { status: 403 });
  const db = admin();
  const soon = new Date(Date.now() + 3 * 86400000).toISOString();
  const { data: tenants } = await db.from('tenants')
    .select('id, name, trial_ends, owner_id, payment_method, mandate_status, stripe_payment_method_id')
    .eq('status', 'trialing').lte('trial_ends', soon).gt('trial_ends', new Date().toISOString()).is('trial_reminder_sent_at', null);
  let sent = 0;
  for (const t of tenants ?? []) {
    if (t.stripe_payment_method_id || t.mandate_status === 'active' || t.payment_method === 'invoice') continue;
    const { data: owner } = await db.from('profiles').select('email, full_name').eq('user_id', t.owner_id).single();
    if (!owner) continue;
    const day = new Date(t.trial_ends).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
    await sendEmail(owner.email, 'Your NEXTime trial ends on ' + day,
      '<p>Hi ' + (owner.full_name || '').split(' ')[0] + ',</p><p>The free trial for <strong>' + t.name + '</strong> ends on ' + day + '. Add a card, Apple Pay, Google Pay or Direct Debit so your team keeps access:</p><p><a href="' + env('APP_ORIGIN') + '/app.html">Open Plan &amp; billing</a></p><p>Nothing is charged until the trial ends.</p>');
    await db.from('tenants').update({ trial_reminder_sent_at: new Date().toISOString() }).eq('id', t.id);
    await logEvent(t.id, 'billing.trial_reminder', 'Trial-ending reminder sent to ' + owner.email);
    sent++;
  }
  return new Response(JSON.stringify({ sent }), { headers: { 'Content-Type': 'application/json' } });
});
