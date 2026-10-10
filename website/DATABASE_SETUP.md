# Database setup

The NEXYRA website has **no database**. Each product has its own **PostgreSQL** database; never share one database between products.

| Product | Engine | Hosting | Files |
| --- | --- | --- | --- |
| NEXHR | PostgreSQL 15+ | Self-hosted or managed (RDS, Cloud SQL, DigitalOcean) | `backend/nexhr/database/` |
| NEXTime | PostgreSQL 15 (Supabase) | Supabase | `backend/nextime/supabase/migrations/`, `backend/nextime/database/` |
| NEXDrive | PostgreSQL 15+ (+ Redis 7) | Self-hosted or managed | `backend/nexdrive/database/` |

Full field-level detail is in each product's docs (`backend/<product>/docs/DATABASE_SETUP.md`, NEXDrive: `database/database-tables.md`, `database-schema.md`, `relationships.md`).

---

## 1. NEXHR

### Requirements
PostgreSQL 15+, extensions `pgcrypto` and `citext` (created by `schema.sql`), an owner role for migrations and the runtime role `nexyra_app` (created by `rls_and_roles.sql`).

### Create

```bash
cd backend/nexhr
OWNER_DATABASE_URL='postgres://OWNER_USER:OWNER_PASSWORD@DB_HOST:5432/postgres' \
APP_DB_PASSWORD='CHOOSE_A_STRONG_PASSWORD' \
bash database/setup_database.sh            # --with-demo loads the demo workspace (never in production)
```

The script creates the `nexhr` database and runs, in order: `schema.sql` → `indexes.sql` → `rls_and_roles.sql` → `migrations/001_saas_upgrade.sql` → `migrations/001_saas_upgrade_functions.sql` → (optional) `seed.sql`.

### Tables (31)

| Area | Tables |
| --- | --- |
| Tenancy & billing | organisations, reserved_slugs, subscriptions, stripe_events |
| Structure | locations, departments, people |
| Auth | users, sessions, auth_tokens, auth_attempts |
| Time | clock_events, timesheets, timesheet_days |
| Leave | leave_types, leave_entitlements, leave_requests |
| Rota | shifts, unavailability, rota_publications |
| Documents | files, document_requests, document_request_events, documents, document_acknowledgements, payslips |
| Finance | bank_details (encrypted) |
| Comms | notifications, notification_prefs, news_posts |
| Compliance | audit_log |

### Relationships
Every tenant table carries `org_id → organisations.id`; row-level security restricts each query to `current_setting('app.org_id')`. `users.person_id → people.id`, `people.manager_id → people.id` (self-reference), `timesheet_days.timesheet_id → timesheets.id`, `leave_requests.person_id → people.id`, `shifts.person_id → people.id`, `documents.file_id / payslips.file_id → files.id`, `subscriptions.org_id → organisations.id`.

### Indexes
`database/indexes.sql`: tenant + foreign-key composites (`(org_id, person_id)`, `(org_id, date)` …), unique `(org_id, lower(email))`, session and token lookups.

### Seed data
`seed.sql` = demo workspace "larkspur" for staging only. Production: create the first admin with `node server/createAdmin.js <workspace> <email> "<Name>"`.

### Migrations / updates
New files go in `database/migrations/NNN_description.sql`; apply in numeric order with `psql "$OWNER_DATABASE_URL" -v ON_ERROR_STOP=1 -f FILE`. Back up first (`pg_dump -Fc`).

---

## 2. NEXTime (Supabase)

### Requirements
A Supabase project (region near users, e.g. London `eu-west-2`), Supabase CLI, extensions `pg_cron`, `pg_net` and Vault (enable in Dashboard > Database > Extensions).

### Create

```bash
cd backend/nextime
supabase link --project-ref YOUR_PROJECT_REF
supabase db push                          # 0001_initial.sql, 0002_payment_methods.sql
psql "$SUPABASE_DB_URL" -f supabase/seed.sql      # plans price list (required)
```

`database/schema.sql` is the same schema as one file, for review or for a non-CLI setup (SQL editor). `database/seed.sql` contains optional demo data.

### Tables (16, schema `public`)
plans, profiles, tenants, memberships, invitations, platform_admins, invoices, billing_events, platform_events, workspace_snapshots, employees, shifts, leave, approvals, published_weeks, audit_log.

### Relationships
`profiles.id → auth.users.id`; `memberships (tenant_id → tenants, user_id → profiles)` with role O/A/M/E; `invitations.tenant_id → tenants`; `invoices / billing_events / platform_events / workspace_snapshots / employees / shifts / leave / approvals / published_weeks / audit_log .tenant_id → tenants`; `tenants.plan → plans`. RLS on every table: members see only their tenant; platform_admins see all.

### Scheduled task
Store `CRON_SECRET` in Vault and schedule the `scheduled-tasks` function with pg_cron (exact SQL in `backend/nextime/docs/DATABASE_SETUP.md`).

### Migrations / updates
Add `supabase/migrations/NNNN_name.sql`, then `supabase db push`.

---

## 3. NEXDrive

### Requirements
PostgreSQL 15+ (`pgcrypto`, `citext`), Redis 7 for rate limits and queues.

### Create

```bash
createdb nexdrive
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f backend/nexdrive/database/migrations/001_initial_schema.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f backend/nexdrive/database/migrations/002_referral_programme.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f backend/nexdrive/database/seeds/001_subscription_plans.sql   # required
psql "$DATABASE_URL" -f backend/nexdrive/database/seeds/002_demo_data.sql                               # staging only
```

### Tables (21)
instructors, coverage_areas, rate_cards, bank_accounts, learners, lesson_packages, bookings, booking_events, messages, notifications, notification_preferences, device_tokens, subscription_plans, subscriptions, auth_sessions, verification_codes, referral_codes, referrals, referral_fraud_signals, credit_accounts, credit_transactions.

### Relationships
All instructor data references `instructors.id` (single-tenant per instructor). `bookings.learner_id → learners`, `bookings.package_id → lesson_packages`, `booking_events.booking_id → bookings`, `subscriptions.plan_code → subscription_plans`, `referrals (referrer_id, referee_id) → instructors`, `credit_transactions.account_id → credit_accounts`. Diagram: `database/relationships.md`.

### Migrations
Numbered SQL files in `database/migrations/`, applied in order.

---

## Backups (all products)
Daily `pg_dump -Fc` kept 30 days, stored off-server; Supabase Pro includes daily backups / PITR. Back up `DATA_ENCRYPTION_KEY` (NEXHR) and `FIELD_ENCRYPTION_KEY` (NEXDrive) separately: without them encrypted columns cannot be recovered.
