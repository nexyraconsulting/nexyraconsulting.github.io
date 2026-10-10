-- NEXTime Rota & Timesheet — PostgreSQL schema (14+)
-- Part A is required for Step 1 (snapshot API + sign-in + audit).
-- Part B is the normalised model for Step 2 (record-level API, multi-user editing). Create it now or later.
-- Run:  psql "$DATABASE_URL" -f schema-postgresql.sql

begin;

create extension if not exists pgcrypto;

-- ===================== PART A — Step 1 =====================

create table if not exists organisations (
  id           text primary key,                 -- e.g. 'default' or a slug; matches NEXTIME_CONFIG.organisationId
  name         text not null,
  created_at   timestamptz not null default now()
);

create table if not exists users (
  id             uuid primary key default gen_random_uuid(),
  organisation_id text not null references organisations(id) on delete cascade,
  email          text not null,
  name           text not null,
  role           text not null check (role in ('Administrator', 'Manager', 'Employee')),
  password_hash  text,                           -- scrypt$salt$key; null when using SSO
  employee_ref   text,                           -- links an Employee login to employees.ref
  created_at     timestamptz not null default now(),
  last_login_at  timestamptz,
  disabled_at    timestamptz
);
create unique index if not exists users_email_uq on users (lower(email));

-- The whole organisation document the app works with today (see docs/architecture.md section 2).
create table if not exists organisation_snapshots (
  organisation_id text primary key references organisations(id) on delete cascade,
  version         integer not null,              -- sent to the app as ETag "v<version>"
  data            jsonb not null,
  updated_at      timestamptz not null default now(),
  updated_by      uuid references users(id)
);

-- Permanent, append-only audit trail. The app keeps only the newest 3,000 entries; this table keeps all.
create table if not exists audit_log (
  organisation_id text not null references organisations(id) on delete cascade,
  id              text not null,                 -- app audit id (A…) or server id (SRV-…)
  at              timestamptz not null,
  action          text not null,
  entity          text,                          -- Shift | Timesheet | Rota | Employee | Leave | Swap | Settings | Security | Data
  ref             text,
  employee_ref    text,
  work_date       date,
  summary         text,
  changes         jsonb not null default '[]'::jsonb,
  reason          text,
  actor_user_id   uuid references users(id),
  received_at     timestamptz not null default now(),
  primary key (organisation_id, id)
);
create index if not exists audit_log_at_idx on audit_log (organisation_id, at desc);

-- Block edits and deletes on the audit trail.
create or replace function audit_log_readonly() returns trigger language plpgsql as $$
begin raise exception 'audit_log is append-only'; end $$;
drop trigger if exists audit_log_no_update on audit_log;
create trigger audit_log_no_update before update or delete on audit_log for each row execute function audit_log_readonly();

-- ===================== PART B — Step 2 (normalised) =====================

create table if not exists locations (
  id uuid primary key default gen_random_uuid(),
  organisation_id text not null references organisations(id) on delete cascade,
  name text not null,
  unique (organisation_id, name)
);

create table if not exists departments (
  id uuid primary key default gen_random_uuid(),
  organisation_id text not null references organisations(id) on delete cascade,
  name text not null,
  unique (organisation_id, name)
);

create table if not exists job_roles (
  id uuid primary key default gen_random_uuid(),
  organisation_id text not null references organisations(id) on delete cascade,
  name text not null,
  unique (organisation_id, name)
);

create table if not exists user_locations (            -- Manager scope
  user_id uuid not null references users(id) on delete cascade,
  location_id uuid not null references locations(id) on delete cascade,
  primary key (user_id, location_id)
);

create table if not exists organisation_settings (
  organisation_id text primary key references organisations(id) on delete cascade,
  standard_weekly numeric(5,2) not null default 40,
  long_shift      numeric(4,2) not null default 10,
  late_mins       integer not null default 5,
  min_rest        numeric(4,2) not null default 11,
  max_days        integer not null default 6,
  max_weekly      jsonb not null default '{"Full Time":48,"Part Time":30,"Zero Hour Contract":40}'::jsonb,
  week_starts_on  smallint not null default 1 check (week_starts_on in (0, 1)),
  updated_at      timestamptz not null default now()
);

create table if not exists shift_templates (
  id uuid primary key default gen_random_uuid(),
  organisation_id text not null references organisations(id) on delete cascade,
  ref text not null,                                     -- T1, T2…
  name text not null,
  start_time time not null,
  end_time time not null,
  break_mins integer not null default 0,
  unique (organisation_id, ref)
);

create table if not exists employees (
  id uuid primary key default gen_random_uuid(),
  organisation_id text not null references organisations(id) on delete cascade,
  ref text not null,                                     -- EMP-001
  first_name text not null,
  last_name text not null,
  job_role text,
  department_id uuid references departments(id),
  location_id uuid references locations(id),
  contract text not null check (contract in ('Full Time', 'Part Time', 'Zero Hour Contract')),
  status text not null default 'Active' check (status in ('Active', 'On Leave', 'Left')),
  start_date date,
  unavailable_days smallint[] not null default '{}',     -- 0 = Sunday … 6 = Saturday
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  row_version integer not null default 1,
  unique (organisation_id, ref)
);

create table if not exists shifts (
  id uuid primary key default gen_random_uuid(),
  organisation_id text not null references organisations(id) on delete cascade,
  ref text not null,                                     -- S0001
  employee_id uuid not null references employees(id),
  location_id uuid references locations(id),
  work_date date not null,
  start_time time not null,
  end_time time not null,                                -- end <= start means the shift crosses midnight
  break_mins integer not null default 0,
  actual_start time,
  actual_end time,
  actual_break_mins integer,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  row_version integer not null default 1,
  unique (organisation_id, ref)
);
create index if not exists shifts_date_idx on shifts (organisation_id, work_date);
create index if not exists shifts_emp_idx on shifts (employee_id, work_date);

create table if not exists leave_requests (
  id uuid primary key default gen_random_uuid(),
  organisation_id text not null references organisations(id) on delete cascade,
  ref text not null,                                     -- L0001
  employee_id uuid not null references employees(id),
  leave_type text not null check (leave_type in ('Holiday', 'Sickness', 'Unavailable', 'Other')),
  from_date date not null,
  to_date date not null check (to_date >= from_date),
  notes text,
  created_at timestamptz not null default now(),
  unique (organisation_id, ref)
);

create table if not exists shift_swaps (
  id uuid primary key default gen_random_uuid(),
  organisation_id text not null references organisations(id) on delete cascade,
  ref text not null,
  shift_id uuid not null references shifts(id) on delete cascade,
  from_employee_id uuid not null references employees(id),
  to_employee_id uuid references employees(id),          -- null = open offer
  reason text,
  status text not null default 'Pending' check (status in ('Pending', 'Approved', 'Declined', 'Cancelled')),
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid references users(id),
  unique (organisation_id, ref)
);

create table if not exists timesheet_approvals (
  organisation_id text not null references organisations(id) on delete cascade,
  employee_id uuid not null references employees(id),
  week_start date not null,
  approved_at timestamptz not null default now(),
  approved_by uuid references users(id),
  hours numeric(6,2) not null,
  primary key (employee_id, week_start)
);

create table if not exists rota_publications (
  id uuid primary key default gen_random_uuid(),
  organisation_id text not null references organisations(id) on delete cascade,
  location_id uuid references locations(id),             -- null = all locations
  week_start date not null,
  published_at timestamptz not null default now(),
  published_by uuid references users(id),
  shift_count integer not null default 0
);
create unique index if not exists rota_pub_uq on rota_publications (organisation_id, coalesce(location_id, '00000000-0000-0000-0000-000000000000'::uuid), week_start);

commit;
