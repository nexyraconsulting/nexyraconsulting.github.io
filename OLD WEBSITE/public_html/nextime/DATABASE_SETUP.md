# DATABASE_SETUP

## Requirements

- PostgreSQL 15 on **Supabase** (managed). Region: choose where most customers are (e.g. `eu-west-2` London). Data scope is global.
- Extensions: `citext`, `pgcrypto` (migration 0001), `pg_cron`, `pg_net` (migration 0002). Enable them under Database → Extensions if `create extension` is refused.
- Supabase Vault (built in) for the cron secret.
- Plan: Pro or higher for production (daily backups, point-in-time recovery, no auto-pause).

## Creating the database

**Option A: Supabase CLI (recommended)**
```bash
supabase link --project-ref YOUR-PROJECT-REF
supabase db push                                  # runs supabase/migrations/*.sql in order
# edit Stripe price ids in supabase/seed.sql first
psql "$SUPABASE_DB_URL" -f supabase/seed.sql
```

**Option B: SQL editor**
1. Supabase → SQL editor → paste `database/schema.sql` → Run.
2. Edit and run `database/seed.sql`.

Before running, replace `YOUR-PROJECT-REF` in the `nextime-daily-tasks` cron job (end of 0002 / schema.sql), or update it afterwards:
```sql
select cron.alter_job((select jobid from cron.job where jobname = 'nextime-daily-tasks'),
  command := $$ select net.http_post(url := 'https://<ref>.functions.supabase.co/scheduled-tasks',
    headers := jsonb_build_object('Content-Type','application/json','x-cron-secret',
      (select decrypted_secret from vault.decrypted_secrets where name = 'nextime_cron_secret')), body := '{}'::jsonb) $$);
```
Store the cron secret (same value as `CRON_SECRET`):
```sql
select vault.create_secret('<CRON_SECRET value>', 'nextime_cron_secret');
```

## Enumerated types

| Type | Values |
| --- | --- |
| `member_role` | Owner, Admin, Manager, Employee |
| `tenant_status` | trialing, active, past_due, cancelled, suspended (`expired` is computed) |
| `plan_id` | starter, team, business, enterprise |
| `payment_method_type` | card, direct_debit, invoice |

## Tables

### Tenancy and accounts

**`plans`**: price list (seeded)
| Field | Type | Notes |
| --- | --- | --- |
| id | plan_id PK | |
| name | text | |
| staff_limit | int | null = unlimited |
| monthly_pence / annual_pence | int | ex VAT |
| stripe_price_monthly / stripe_price_annual | text | Stripe Price ids |

**`profiles`**: one per auth user, created by trigger `on_auth_user_created`
| user_id uuid PK → auth.users | full_name text | email citext | created_at |

**`tenants`**: one per company workspace
| Field | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| name, slug (unique), region, timezone, currency | text | |
| plan | plan_id | default starter |
| cycle | text | monthly / annual |
| status | tenant_status | default trialing |
| trial_ends | timestamptz | now() + 14 days |
| require_2fa | bool | Owner/Admin policy |
| owner_id | uuid → auth.users | |
| payment_method | payment_method_type | null until set |
| gc_customer_id, gc_mandate_id, gc_subscription_id, mandate_status | text | GoCardless |
| stripe_customer_id, stripe_subscription_id, stripe_payment_method_id | text | Stripe |
| card_brand, card_last4, card_wallet | text | display only |
| invoice_email, invoice_address, invoice_po | text | invoice billing |
| next_charge_at | date | |
| cancelled_at, trial_reminder_sent_at, created_at | timestamptz | |

Billing columns are protected by trigger `tenants_billing_guard`: only the service role (edge functions) or a platform admin can change them.

**`memberships`**: user ↔ tenant with role
| tenant_id → tenants (cascade) | user_id → auth.users (cascade) | role member_role | emp_id text | status active/disabled | created_at |
PK (tenant_id, user_id). Unique partial index `one_owner_per_tenant`.

**`invitations`**
| token uuid PK | tenant_id → tenants | email citext | role (not Owner) | emp_id | invited_by | expires_at (+7 days) | accepted_at | created_at |

**`platform_admins`**: NEXTime staff: `user_id` PK → auth.users

### Billing

**`invoices`**
| id text PK | tenant_id → tenants | provider gocardless/stripe | gc_payment_id unique | stripe_invoice_id unique | amount_pence | vat_pence | currency | plan | cycle | status | charge_date | hosted_url | created_at |

Status values: pending_submission, submitted, confirmed, paid_out, failed, cancelled, open.

**`billing_events`**: raw webhook log, idempotency key = provider event id
| gc_event_id text PK | provider | tenant_id | resource_type | action | payload jsonb | processed_at |

**`platform_events`**: business event log shown in the console
| id bigint PK | tenant_id | type | summary | actor | at |

### Workspace data

**Phase 1, `workspace_snapshots`** (what the app uses today)
| tenant_id PK → tenants | snapshot jsonb | version int | updated_at | updated_by |

Snapshot shape (identical to what the app already stores):
```json
{
  "employees": [{ "id": "E001", "first": "", "last": "", "role": "", "department": "", "location": "",
                  "contract": "Full Time|Part Time|Zero Hour Contract", "status": "Active|On Leave|Left",
                  "start": "YYYY-MM-DD", "unavailable": [0-6], "notes": "" }],
  "shifts":    [{ "id": "", "empId": "", "date": "YYYY-MM-DD", "start": "HH:MM", "end": "HH:MM", "brk": 30,
                  "aStart": "", "aEnd": "", "aBrk": null, "notes": "" }],
  "leave":     [{ "id": "", "empId": "", "type": "", "from": "YYYY-MM-DD", "to": "YYYY-MM-DD", "notes": "" }],
  "approvals": { "<empId>|<weekStart>": { "at": "ISO", "hours": 37.5 } },
  "published": { "<weekStart>": { "at": "ISO", "shifts": 42 } },
  "swaps": [], "templates": [], "audit": [], "settings": { "orgName": "", "...": "..." }
}
```

**Phase 2, record tables** (created now, for later): `employees`, `shifts`, `leave`, `approvals`, `published_weeks`, `audit_log`, all keyed by `(tenant_id, id)` with `tenant_id → tenants (cascade)`. `shifts (tenant_id, emp_id) → employees`. `audit_log` is append-only (no update/delete policy).

## Relationships

```text
auth.users 1─1 profiles
auth.users 1─* memberships *─1 tenants 1─* invitations
tenants 1─1 workspace_snapshots
tenants 1─* invoices, billing_events, platform_events
tenants 1─* employees 1─* shifts | leave | approvals ; tenants 1─* published_weeks, audit_log
plans 1─* tenants
```

## Indexes

Primary and unique keys above, plus `shifts_tenant_date`, `tenants_stripe_customer`, `tenants_stripe_subscription`, `tenants_gc_mandate`, `tenants_gc_subscription`, `tenants_status`, `memberships_user`, `invitations_tenant_email`, `invoices_tenant`, `platform_events_tenant`, `audit_tenant_at`.

## Row-level security (summary)

RLS is enabled on every table. Helper functions (`security definer`): `my_role(t)`, `has_role(t, roles[])`, `is_platform_admin()`, `tenant_effective_status(t)`, `tenant_open(t)`, `mfa_ok(t)`.

| Table | Read | Write |
| --- | --- | --- |
| tenants | members, platform admin | update: Owner/Admin (billing columns blocked); delete: Owner |
| memberships | members | Owner manages all but Owner; Admin manages Manager/Employee |
| invitations | Owner/Admin | delete: Owner/Admin; insert: edge function only |
| invoices | Owner/Admin, platform admin | functions only |
| workspace_snapshots | Owner/Admin/Manager, workspace open, MFA if required | via `save_snapshot()` only |
| phase 2 tables | same as snapshot | Owner/Admin/Manager |
| audit_log | Owner/Admin/Manager | insert only |

Employees never read the snapshot directly: they call `my_shifts()`, which returns only their own records.

## Scheduled jobs (pg_cron)

| Job | Schedule (UTC) | Action |
| --- | --- | --- |
| nextime-purge-cancelled | 03:15 daily | delete tenants cancelled > 90 days |
| nextime-purge-invites | 03:30 daily | delete invitations expired > 30 days |
| nextime-daily-tasks | 08:00 daily | calls `scheduled-tasks` (trial-ending emails) |

Check: `select * from cron.job_run_details order by start_time desc limit 20;`

## Seed data

`seed.sql` sets the Stripe Price ids and contains a commented statement to grant the first platform admin. No demo users or tenants are seeded. For a local demo dataset, sign up in the app in prototype mode instead.

## Migrations and updates

- Add new files as `supabase/migrations/NNNN_description.sql` (next: `0003_…`). Apply with `supabase db push`. Applied files must never be edited.
- Keep `database/schema.sql` in step by appending new migrations (or regenerate it with `supabase db dump --schema public > database/schema.sql`).
- Before every production migration, take a backup: `supabase db dump -f backup_$(date +%F).sql`.
- **Phase 1 → phase 2:** write a migration that explodes each `workspace_snapshots.snapshot` into the record tables (`jsonb_to_recordset`), then switch the client from `saveSnapshot` to per-record upserts.
