-- NEXTime 0002 — multiple payment methods (Stripe card / Apple Pay / Google Pay, GoCardless Direct Debit,
-- Stripe invoice + bank transfer) and scheduled maintenance jobs.

create type public.payment_method_type as enum ('card', 'direct_debit', 'invoice');

alter table public.tenants
  add column payment_method public.payment_method_type,
  add column stripe_customer_id text,
  add column stripe_subscription_id text,
  add column stripe_payment_method_id text,
  add column card_brand text,
  add column card_last4 text,
  add column card_wallet text,                 -- 'Apple Pay' | 'Google Pay' | null
  add column invoice_email citext,
  add column invoice_address text,
  add column invoice_po text,
  add column trial_reminder_sent_at timestamptz;

create index tenants_stripe_customer on public.tenants (stripe_customer_id);
create index tenants_stripe_subscription on public.tenants (stripe_subscription_id);
create index tenants_gc_mandate on public.tenants (gc_mandate_id);
create index tenants_gc_subscription on public.tenants (gc_subscription_id);
create index tenants_status on public.tenants (status);
create index memberships_user on public.memberships (user_id);
create index invitations_tenant_email on public.invitations (tenant_id, email);
create index invoices_tenant on public.invoices (tenant_id, created_at desc);
create index platform_events_tenant on public.platform_events (tenant_id, at desc);
create index audit_tenant_at on public.audit_log (tenant_id, at desc);

alter table public.plans
  add column stripe_price_monthly text,        -- Stripe Price ids, set in seed.sql
  add column stripe_price_annual text;

alter table public.invoices
  add column provider text not null default 'gocardless' check (provider in ('gocardless', 'stripe')),
  add column stripe_invoice_id text unique,
  add column hosted_url text;                  -- Stripe hosted invoice page (invoice + bank transfer)

alter table public.billing_events
  add column provider text not null default 'gocardless' check (provider in ('gocardless', 'stripe'));

-- Billing guard now also protects the Stripe and payment-method columns.
create or replace function public.guard_tenant_billing() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if coalesce(auth.jwt() ->> 'role', '') = 'service_role' or public.is_platform_admin() then return new; end if;
  if new.plan is distinct from old.plan or new.cycle is distinct from old.cycle or new.status is distinct from old.status
     or new.trial_ends is distinct from old.trial_ends or new.owner_id is distinct from old.owner_id
     or new.gc_customer_id is distinct from old.gc_customer_id or new.gc_mandate_id is distinct from old.gc_mandate_id
     or new.gc_subscription_id is distinct from old.gc_subscription_id or new.mandate_status is distinct from old.mandate_status
     or new.payment_method is distinct from old.payment_method or new.stripe_customer_id is distinct from old.stripe_customer_id
     or new.stripe_subscription_id is distinct from old.stripe_subscription_id or new.stripe_payment_method_id is distinct from old.stripe_payment_method_id
     or new.card_brand is distinct from old.card_brand or new.card_last4 is distinct from old.card_last4 or new.card_wallet is distinct from old.card_wallet then
    raise exception 'billing fields are managed by NEXTime';
  end if;
  return new;
end $$;

-- A workspace counts as having a payment method when any provider is active.
create or replace function public.tenant_effective_status(t uuid) returns text
language sql stable security definer set search_path = public as $$
  select case
    when status = 'trialing' and trial_ends < now() then
      case when mandate_status = 'active' or stripe_subscription_id is not null then 'active' else 'expired' end
    else status::text end
  from tenants where id = t;
$$;

-- ───────── Scheduled jobs (requires the pg_cron and pg_net extensions: Database → Extensions) ─────────
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- 1. Delete workspaces 90 days after cancellation (data retention promise).
select cron.schedule('nextime-purge-cancelled', '15 3 * * *', $$
  delete from public.tenants where status = 'cancelled' and cancelled_at < now() - interval '90 days';
$$);

-- 2. Remove invitations that expired more than 30 days ago.
select cron.schedule('nextime-purge-invites', '30 3 * * *', $$
  delete from public.invitations where accepted_at is null and expires_at < now() - interval '30 days';
$$);

-- 3. Daily call to the scheduled-tasks edge function (trial-ending reminders).
--    Replace YOUR-PROJECT-REF and set the CRON_SECRET in Vault first:
--    select vault.create_secret('<same value as CRON_SECRET>', 'nextime_cron_secret');
select cron.schedule('nextime-daily-tasks', '0 8 * * *', $$
  select net.http_post(
    url := 'https://YOUR-PROJECT-REF.functions.supabase.co/scheduled-tasks',
    headers := jsonb_build_object('Content-Type', 'application/json',
      'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'nextime_cron_secret')),
    body := '{}'::jsonb);
$$);
