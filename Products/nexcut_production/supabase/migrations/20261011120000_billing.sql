-- NEXCut Business — subscriptions, trials and billing.
-- Single source of truth for terms: js/nexcut-plans.js (website + apps) ⇄ public.billing_terms (server).
-- The server ALWAYS reads prices/Stripe price IDs from billing_terms; the JS file is for display only.
-- Requires: auth schema (Supabase). Creates minimal businesses/business_members tables if the core schema
-- has not been applied yet (the core migration from the handover package supersedes them).

create extension if not exists pgcrypto;

-- ---------- core (minimal, idempotent) ----------
create sequence if not exists public.business_public_id_seq start 1000;
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  public_id text unique not null default ('NC-' || lpad(nextval('public.business_public_id_seq')::text, 6, '0')),
  name text not null check (char_length(name) between 2 and 120),
  business_type text,
  status text not null default 'draft' check (status in ('draft','awaiting','under_review','verified','published','suspended')),
  created_at timestamptz not null default now()
);
create table if not exists public.business_members (
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','manager','reception','staff')),
  created_at timestamptz not null default now(),
  primary key (business_id, user_id)
);
create unique index if not exists one_owner_per_business on public.business_members(business_id) where role = 'owner';

-- ---------- terms (stripe_price_id is set after creating Prices in Stripe) ----------
create table if not exists public.billing_terms (
  code text primary key check (code in ('monthly','m12','m24','m36')),
  name text not null,
  months int not null check (months in (1,12,24,36)),
  commitment_months int not null default 0,
  billing text not null check (billing in ('monthly','upfront')),
  price_pence int check (price_pence is null or price_pence > 0),
  stripe_price_id text unique,
  apple_product_id text unique,
  google_product_id text unique,
  trial_days int not null default 14 check (trial_days = 14),
  active boolean not null default true,
  updated_at timestamptz not null default now()
);
-- Prices match NEXDrive: £25/month; £240, £420, £540 for 12/24/36 months, billed once per term.
insert into public.billing_terms (code, name, months, commitment_months, billing, price_pence) values
  ('monthly','Monthly',1,0,'monthly',2500),
  ('m12','12 months',12,12,'upfront',24000),
  ('m24','24 months',24,24,'upfront',42000),
  ('m36','36 months',36,36,'upfront',54000)
on conflict (code) do update set price_pence = excluded.price_pence, billing = excluded.billing;

-- ---------- one subscription record per business (no duplicates across web / App Store / Play) ----------
do $$ begin
  create type public.subscription_status as enum ('incomplete','trialing','trial_cancelled','active','past_due','paused','cancelled','expired');
exception when duplicate_object then null; end $$;

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null unique references public.businesses(id) on delete cascade,
  term_code text not null references public.billing_terms(code),
  status public.subscription_status not null default 'incomplete',
  channel text not null check (channel in ('stripe','app_store','google_play')),
  trial_start timestamptz,
  trial_end timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  commitment_ends_at timestamptz,
  cancel_at_period_end boolean not null default false,
  cancelled_at timestamptz,
  ended_at timestamptz,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  stripe_checkout_session_id text unique,
  store_original_transaction_id text unique,   -- Apple
  store_purchase_token text unique,            -- Google
  payment_method_type text,                    -- 'card' | 'bacs_debit' | 'apple_iap' | 'google_play'
  payment_method_label text,                   -- e.g. "Visa ending 4242" (last4 only; never full numbers)
  last_payment_status text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint trial_window check (trial_start is null or trial_end = trial_start + interval '14 days')
);
create index if not exists subscriptions_status_idx on public.subscriptions(status);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  stripe_invoice_id text unique,
  amount_due_pence int, amount_paid_pence int, currency text default 'gbp',
  status text, hosted_invoice_url text, invoice_pdf text,
  period_start timestamptz, period_end timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.consents (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  kind text not null check (kind in ('terms','privacy','trial_terms','marketing')),
  version text not null,
  accepted boolean not null,
  ip inet, user_agent text,
  created_at timestamptz not null default now()
);

-- Webhook idempotency (Stripe, Apple, Google): every event id processed exactly once.
create table if not exists public.billing_events (
  id text primary key,
  source text not null check (source in ('stripe','app_store','google_play')),
  type text not null,
  business_id uuid,
  payload jsonb not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  error text
);

-- Transactional email queue, drained by the send-notifications function (cron).
create table if not exists public.notifications_outbox (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  template text not null check (template in ('trial_started','trial_ending','trial_cancelled','payment_succeeded','payment_failed','renewal_upcoming','subscription_cancelled','payment_method_updated')),
  to_email text not null,
  payload jsonb not null default '{}',
  status text not null default 'queued' check (status in ('queued','sent','failed')),
  attempts int not null default 0,
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  unique (business_id, template, payload)
);

-- ---------- entitlement: the ONE rule both apps and the website use ----------
create or replace view public.business_entitlements with (security_invoker = true) as
select s.business_id,
       s.status, s.channel, s.term_code, s.trial_start, s.trial_end, s.current_period_end, s.cancel_at_period_end,
       (s.status in ('trialing','active','past_due')
         or (s.status = 'trial_cancelled' and s.trial_end > now())
         or (s.status = 'cancelled' and s.current_period_end > now())) as has_access
from public.subscriptions s;

-- ---------- RLS: members read; only the service role (Edge Functions) writes ----------
create or replace function public.is_business_member(bid uuid) returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.business_members m where m.business_id = bid and m.user_id = auth.uid()) $$;

alter table public.businesses enable row level security;
alter table public.business_members enable row level security;
alter table public.billing_terms enable row level security;
alter table public.subscriptions enable row level security;
alter table public.invoices enable row level security;
alter table public.consents enable row level security;
alter table public.billing_events enable row level security;
alter table public.notifications_outbox enable row level security;

drop policy if exists terms_read on public.billing_terms;
create policy terms_read on public.billing_terms for select using (active);
drop policy if exists biz_read on public.businesses;
create policy biz_read on public.businesses for select using (public.is_business_member(id));
drop policy if exists members_read on public.business_members;
create policy members_read on public.business_members for select using (public.is_business_member(business_id));
drop policy if exists sub_read on public.subscriptions;
create policy sub_read on public.subscriptions for select using (public.is_business_member(business_id));
drop policy if exists inv_read on public.invoices;
create policy inv_read on public.invoices for select using (public.is_business_member(business_id));
-- consents, billing_events, notifications_outbox: no client policies (service role only).

create or replace function public.touch_updated_at() returns trigger language plpgsql as
$$ begin new.updated_at = now(); return new; end $$;
drop trigger if exists subscriptions_touch on public.subscriptions;
create trigger subscriptions_touch before update on public.subscriptions for each row execute function public.touch_updated_at();

-- Realtime: apps subscribe to their own row so status changes appear instantly on every device.
do $$ begin
  alter publication supabase_realtime add table public.subscriptions;
exception when others then null; end $$;
