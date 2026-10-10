-- NEXTime — complete database schema (migrations 0001 + 0002 combined).
-- Run once in the Supabase SQL editor on an empty project, then run database/seed.sql.

-- NEXTime SaaS — Supabase schema, tenant isolation (RLS), roles, billing and workspace data.
-- Applied by `supabase db push`. For a manual install use database/schema.sql (0001 + 0002 combined).

create extension if not exists citext;
create extension if not exists pgcrypto;

-- ───────────────────────── Core tenancy ─────────────────────────
create type public.member_role as enum ('Owner', 'Admin', 'Manager', 'Employee');
create type public.tenant_status as enum ('trialing', 'active', 'past_due', 'cancelled', 'suspended');
create type public.plan_id as enum ('starter', 'team', 'business', 'enterprise');

create table public.plans (
  id public.plan_id primary key,
  name text not null,
  staff_limit int,                       -- null = unlimited (Enterprise)
  monthly_pence int,                     -- ex VAT
  annual_pence int
);
insert into public.plans values
  ('starter', 'Starter', 10, 2900, 29000),
  ('team', 'Team', 50, 7900, 79000),
  ('business', 'Business', 200, 17900, 179000),
  ('enterprise', 'Enterprise', null, null, null);

create table public.profiles (
  user_id uuid primary key references auth.users on delete cascade,
  full_name text not null default '',
  email citext not null,
  created_at timestamptz not null default now()
);

create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  slug text not null unique,
  region text not null default 'United Kingdom',
  timezone text not null default 'Europe/London',
  currency char(3) not null default 'GBP',
  plan public.plan_id not null default 'starter',
  cycle text not null default 'monthly' check (cycle in ('monthly', 'annual')),
  status public.tenant_status not null default 'trialing',
  trial_ends timestamptz not null default now() + interval '14 days',
  require_2fa boolean not null default false,
  owner_id uuid not null references auth.users,
  gc_customer_id text,
  gc_mandate_id text,
  gc_subscription_id text,
  mandate_status text,                   -- pending_submission | active | cancelled | failed | expired
  next_charge_at date,
  cancelled_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.memberships (
  tenant_id uuid not null references public.tenants on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  role public.member_role not null,
  emp_id text not null default '',       -- links an Employee login to a staff record (employees.id)
  status text not null default 'active' check (status in ('active', 'disabled')),
  created_at timestamptz not null default now(),
  primary key (tenant_id, user_id)
);
create unique index one_owner_per_tenant on public.memberships (tenant_id) where role = 'Owner';

create table public.invitations (
  token uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants on delete cascade,
  email citext not null,
  role public.member_role not null check (role <> 'Owner'),
  emp_id text not null default '',
  invited_by uuid references auth.users,
  expires_at timestamptz not null default now() + interval '7 days',
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.platform_admins (user_id uuid primary key references auth.users on delete cascade);

-- ───────────────────────── Billing ─────────────────────────
create table public.invoices (
  id text primary key,                   -- INV-0001 per tenant, or GoCardless payment id
  tenant_id uuid not null references public.tenants on delete cascade,
  gc_payment_id text unique,
  amount_pence int not null,
  vat_pence int not null default 0,
  currency char(3) not null default 'GBP',
  plan public.plan_id not null,
  cycle text not null,
  status text not null,                  -- pending_submission | submitted | confirmed | paid_out | failed | cancelled
  charge_date date,
  created_at timestamptz not null default now()
);

create table public.billing_events (
  gc_event_id text primary key,          -- idempotency: GoCardless resends events
  tenant_id uuid references public.tenants on delete set null,
  resource_type text not null,
  action text not null,
  payload jsonb not null,
  processed_at timestamptz not null default now()
);

create table public.platform_events (
  id bigint generated always as identity primary key,
  tenant_id uuid references public.tenants on delete set null,
  type text not null,
  summary text not null,
  actor uuid,
  at timestamptz not null default now()
);

-- ───────────────────────── Workspace data ─────────────────────────
-- Phase 1 (go-live): one JSON snapshot per tenant, exactly the shape the app already reads and writes
-- (see docs/saas-architecture.md → Data model). Zero change to app behaviour.
create table public.workspace_snapshots (
  tenant_id uuid primary key references public.tenants on delete cascade,
  snapshot jsonb not null,
  version int not null default 1,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users
);

-- Phase 2 (scale): record-level tables so concurrent managers never overwrite each other.
create table public.employees (
  tenant_id uuid not null references public.tenants on delete cascade,
  id text not null, first text not null, last text not null default '', role text not null default '',
  department text not null default '', location text not null default '',
  contract text not null check (contract in ('Full Time', 'Part Time', 'Zero Hour Contract')),
  status text not null default 'Active' check (status in ('Active', 'On Leave', 'Left')),
  start_date date, unavailable_days int[] not null default '{}', notes text not null default '',
  primary key (tenant_id, id)
);
create table public.shifts (
  tenant_id uuid not null references public.tenants on delete cascade,
  id text not null, emp_id text not null, date date not null,
  start_time text not null, end_time text not null, brk int not null default 0,
  a_start text not null default '', a_end text not null default '', a_brk int,
  notes text not null default '',
  primary key (tenant_id, id),
  foreign key (tenant_id, emp_id) references public.employees (tenant_id, id) on delete cascade
);
create index shifts_tenant_date on public.shifts (tenant_id, date);
create table public.leave (
  tenant_id uuid not null references public.tenants on delete cascade,
  id text not null, emp_id text not null, type text not null, date_from date not null, date_to date not null, notes text not null default '',
  primary key (tenant_id, id)
);
create table public.approvals (
  tenant_id uuid not null references public.tenants on delete cascade,
  emp_id text not null, week_start date not null, approved_at timestamptz not null default now(), hours numeric(7,2) not null, approved_by uuid,
  primary key (tenant_id, emp_id, week_start)
);
create table public.published_weeks (
  tenant_id uuid not null references public.tenants on delete cascade,
  week_start date not null, published_at timestamptz not null default now(), shifts int not null, published_by uuid,
  primary key (tenant_id, week_start)
);
create table public.audit_log (               -- append-only
  tenant_id uuid not null references public.tenants on delete cascade,
  id text not null, at timestamptz not null default now(), by_email citext,
  action text not null, entity text not null, ref text, emp_id text, date date, summary text, changes jsonb, reason text,
  primary key (tenant_id, id)
);

-- ───────────────────────── Helpers (security definer, no RLS recursion) ─────────────────────────
create or replace function public.is_platform_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from platform_admins where user_id = auth.uid());
$$;

create or replace function public.my_role(t uuid) returns public.member_role
language sql stable security definer set search_path = public as $$
  select role from memberships where tenant_id = t and user_id = auth.uid() and status = 'active';
$$;

create or replace function public.has_role(t uuid, roles public.member_role[]) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.my_role(t) = any (roles), false);
$$;

-- Effective status: a trial past its end without an active mandate counts as expired.
create or replace function public.tenant_effective_status(t uuid) returns text
language sql stable security definer set search_path = public as $$
  select case
    when status = 'trialing' and trial_ends < now() then case when mandate_status = 'active' then 'active' else 'expired' end
    else status::text end
  from tenants where id = t;
$$;

create or replace function public.tenant_open(t uuid) returns boolean
language sql stable as $$ select public.tenant_effective_status(t) in ('trialing', 'active', 'past_due'); $$;

-- Two-factor: when the workspace requires it, the session must be aal2 (Supabase MFA).
create or replace function public.mfa_ok(t uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select not (select require_2fa from tenants where id = t) or coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2';
$$;

-- ───────────────────────── RPCs ─────────────────────────
create or replace function public.create_workspace(p_name text, p_plan public.plan_id default 'starter', p_region text default 'United Kingdom', p_timezone text default 'Europe/London', p_snapshot jsonb default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare tid uuid; base text := lower(regexp_replace(p_name, '[^a-zA-Z0-9]+', '-', 'g')); s text;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  s := trim(both '-' from base) || '-' || substr(gen_random_uuid()::text, 1, 6);
  insert into tenants (name, slug, plan, region, timezone, owner_id) values (p_name, s, p_plan, p_region, p_timezone, auth.uid()) returning id into tid;
  insert into memberships (tenant_id, user_id, role) values (tid, auth.uid(), 'Owner');
  if p_snapshot is not null then insert into workspace_snapshots (tenant_id, snapshot, updated_by) values (tid, p_snapshot, auth.uid()); end if;
  insert into platform_events (tenant_id, type, summary, actor) values (tid, 'tenant.created', p_name || ' created on ' || p_plan || ' trial', auth.uid());
  return tid;
end $$;

create or replace function public.accept_invitation(p_token uuid) returns uuid
language plpgsql security definer set search_path = public as $$
declare inv invitations;
begin
  select * into inv from invitations where token = p_token and accepted_at is null and expires_at > now();
  if not found then raise exception 'invitation expired or used'; end if;
  if inv.email <> (select email from auth.users where id = auth.uid())::citext then raise exception 'invitation is for a different email'; end if;
  insert into memberships (tenant_id, user_id, role, emp_id) values (inv.tenant_id, auth.uid(), inv.role, inv.emp_id)
    on conflict (tenant_id, user_id) do update set role = excluded.role, emp_id = excluded.emp_id, status = 'active';
  update invitations set accepted_at = now() where token = p_token;
  return inv.tenant_id;
end $$;

-- Optimistic save: fails with 'conflict' if someone saved first (the app shows "someone else saved a newer version").
-- Also enforces the plan's active-staff limit server-side.
create or replace function public.save_snapshot(p_tenant uuid, p_snapshot jsonb, p_expected_version int)
returns int language plpgsql security definer set search_path = public as $$
declare v int; lim int; active int;
begin
  if not public.has_role(p_tenant, array['Owner','Admin','Manager']::member_role[]) then raise exception 'forbidden'; end if;
  if not public.tenant_open(p_tenant) then raise exception 'workspace paused'; end if;
  if not public.mfa_ok(p_tenant) then raise exception 'two-factor required'; end if;
  select p.staff_limit into lim from tenants t join plans p on p.id = t.plan where t.id = p_tenant;
  select count(*) into active from jsonb_array_elements(coalesce(p_snapshot -> 'employees', '[]')) e where e ->> 'status' <> 'Left';
  if lim is not null and active > lim then raise exception 'plan limit: % active staff allowed', lim; end if;
  update workspace_snapshots set snapshot = p_snapshot, version = version + 1, updated_at = now(), updated_by = auth.uid()
    where tenant_id = p_tenant and version = p_expected_version returning version into v;
  if v is null then
    if exists (select 1 from workspace_snapshots where tenant_id = p_tenant) then raise exception 'conflict'; end if;
    insert into workspace_snapshots (tenant_id, snapshot, updated_by) values (p_tenant, p_snapshot, auth.uid()) returning version into v;
  end if;
  return v;
end $$;

-- Employees read only their own shifts and leave.
create or replace function public.my_shifts(p_tenant uuid, p_from date, p_to date) returns jsonb
language sql stable security definer set search_path = public as $$
  with me as (select emp_id from memberships where tenant_id = p_tenant and user_id = auth.uid() and status = 'active'),
       s as (select snapshot from workspace_snapshots where tenant_id = p_tenant)
  select jsonb_build_object(
    'employee', (select e from s, jsonb_array_elements(s.snapshot -> 'employees') e, me where e ->> 'id' = me.emp_id limit 1),
    'shifts', coalesce((select jsonb_agg(x) from s, jsonb_array_elements(s.snapshot -> 'shifts') x, me where x ->> 'empId' = me.emp_id and (x ->> 'date')::date between p_from and p_to), '[]'),
    'leave', coalesce((select jsonb_agg(l) from s, jsonb_array_elements(s.snapshot -> 'leave') l, me where l ->> 'empId' = me.emp_id and (l ->> 'to')::date >= p_from), '[]'))
  where public.tenant_open(p_tenant) and public.mfa_ok(p_tenant);
$$;

-- Billing columns can only be changed by the service role (edge functions) or a platform admin.
create or replace function public.guard_tenant_billing() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if coalesce(auth.jwt() ->> 'role', '') = 'service_role' or public.is_platform_admin() then return new; end if;
  if new.plan is distinct from old.plan or new.cycle is distinct from old.cycle or new.status is distinct from old.status
     or new.trial_ends is distinct from old.trial_ends or new.gc_customer_id is distinct from old.gc_customer_id
     or new.gc_mandate_id is distinct from old.gc_mandate_id or new.gc_subscription_id is distinct from old.gc_subscription_id
     or new.mandate_status is distinct from old.mandate_status or new.owner_id is distinct from old.owner_id then
    raise exception 'billing fields are managed by NEXTime';
  end if;
  return new;
end $$;
create trigger tenants_billing_guard before update on public.tenants for each row execute function public.guard_tenant_billing();

-- ───────────────────────── Row-level security ─────────────────────────
alter table public.profiles enable row level security;
alter table public.tenants enable row level security;
alter table public.memberships enable row level security;
alter table public.invitations enable row level security;
alter table public.invoices enable row level security;
alter table public.billing_events enable row level security;
alter table public.platform_events enable row level security;
alter table public.platform_admins enable row level security;
alter table public.plans enable row level security;
alter table public.workspace_snapshots enable row level security;
alter table public.employees enable row level security;
alter table public.shifts enable row level security;
alter table public.leave enable row level security;
alter table public.approvals enable row level security;
alter table public.published_weeks enable row level security;
alter table public.audit_log enable row level security;

create policy plans_read on public.plans for select using (true);

create policy profiles_self on public.profiles for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy profiles_teammates on public.profiles for select using (
  exists (select 1 from memberships a join memberships b on a.tenant_id = b.tenant_id where a.user_id = auth.uid() and b.user_id = profiles.user_id)
  or public.is_platform_admin());

create policy tenants_read on public.tenants for select using (public.my_role(id) is not null or public.is_platform_admin());
create policy tenants_update on public.tenants for update using (public.has_role(id, array['Owner','Admin']::member_role[]) or public.is_platform_admin());
create policy tenants_delete on public.tenants for delete using (public.has_role(id, array['Owner']::member_role[]));

create policy members_read on public.memberships for select using (public.my_role(tenant_id) is not null or public.is_platform_admin());
-- Owners manage everyone except themselves; Admins manage Managers and Employees only.
create policy members_write on public.memberships for update using (
  user_id <> auth.uid() and role <> 'Owner' and (public.has_role(tenant_id, array['Owner']::member_role[]) or (public.has_role(tenant_id, array['Admin']::member_role[]) and role in ('Manager','Employee'))))
  with check (role <> 'Owner' and (public.has_role(tenant_id, array['Owner']::member_role[]) or role in ('Manager','Employee')));
create policy members_delete on public.memberships for delete using (
  role <> 'Owner' and (public.has_role(tenant_id, array['Owner']::member_role[]) or (public.has_role(tenant_id, array['Admin']::member_role[]) and role in ('Manager','Employee'))));

create policy invites_read on public.invitations for select using (public.has_role(tenant_id, array['Owner','Admin']::member_role[]));
create policy invites_delete on public.invitations for delete using (public.has_role(tenant_id, array['Owner','Admin']::member_role[]));
-- invitations are inserted by the invite-member edge function (service role).

create policy invoices_read on public.invoices for select using (public.has_role(tenant_id, array['Owner','Admin']::member_role[]) or public.is_platform_admin());
create policy billing_events_admin on public.billing_events for select using (public.is_platform_admin());
create policy platform_events_read on public.platform_events for select using (public.is_platform_admin() or public.has_role(tenant_id, array['Owner','Admin']::member_role[]));
create policy platform_admins_self on public.platform_admins for select using (user_id = auth.uid());

-- Workspace data: managers and above, open workspace, two-factor when required. Writes go through save_snapshot().
create policy snapshot_read on public.workspace_snapshots for select using (
  public.has_role(tenant_id, array['Owner','Admin','Manager']::member_role[]) and public.tenant_open(tenant_id) and public.mfa_ok(tenant_id));

-- Phase 2 tables share one rule set.
do $$ declare tbl text; begin
  foreach tbl in array array['employees','shifts','leave','approvals','published_weeks'] loop
    execute format('create policy %1$s_read on public.%1$s for select using (public.has_role(tenant_id, array[''Owner'',''Admin'',''Manager'']::member_role[]) and public.tenant_open(tenant_id) and public.mfa_ok(tenant_id))', tbl);
    execute format('create policy %1$s_write on public.%1$s for all using (public.has_role(tenant_id, array[''Owner'',''Admin'',''Manager'']::member_role[]) and public.tenant_open(tenant_id) and public.mfa_ok(tenant_id)) with check (public.has_role(tenant_id, array[''Owner'',''Admin'',''Manager'']::member_role[]) and public.tenant_open(tenant_id))', tbl);
  end loop;
end $$;
create policy audit_read on public.audit_log for select using (public.has_role(tenant_id, array['Owner','Admin','Manager']::member_role[]));
create policy audit_append on public.audit_log for insert with check (public.has_role(tenant_id, array['Owner','Admin','Manager']::member_role[]) and public.tenant_open(tenant_id));
-- no update/delete policy on audit_log: it is append-only.

-- Profile row on sign-up.
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin insert into profiles (user_id, full_name, email) values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), new.email); return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();


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
