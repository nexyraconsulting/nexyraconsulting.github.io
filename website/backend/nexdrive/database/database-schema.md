# Database schema

See also [database-tables.md](database-tables.md) for the column reference and [relationships.md](relationships.md) for cardinality and delete rules.

PostgreSQL 15+. Source of truth: `database/migrations/001_initial_schema.sql` and `002_referral_programme.sql`.

## Entity relationships

```
instructors 1───* coverage_areas
     │ 1───* rate_cards
     │ 1───1 bank_accounts            (encrypted)
     │ 1───1 notification_preferences
     │ 1───* device_tokens
     │ 1───* subscriptions *───1 subscription_plans
     │ 1───* auth_sessions / verification_codes
     │ 1───* notifications
     │ 1───* learners 1───* bookings *───0..1 lesson_packages
     │                     │ 1───* booking_events (audit)
     └──────────────────── messages (learner, booking?, package?)
```

Every business table carries `instructor_id`. Every query **must** filter by the authenticated instructor. Row-level security (below) enforces this as a second layer.

## Tables

| Table | Purpose | Key rules |
| --- | --- | --- |
| `instructors` | Account owner | Unique email (citext), phone (E.164 UK mobile), ADI number (6 digits). Password stored as argon2id hash |
| `coverage_areas` | Postcode districts covered | Outward code format `SL1`, `RG40` |
| `rate_cards` | Hourly rates (Standard, Intensive, Pass Plus…) | One `is_default` per instructor |
| `bank_accounts` | Payout details for learner messages | Sort code and account number encrypted, plus masked last digits |
| `learners` | Learner drivers | `is_booking_ready` is generated from the required fields. Archived learners stay in the table |
| `lesson_packages` | Multi-lesson purchase | `total_pence = subtotal − discount`, discount ≤ subtotal |
| `bookings` | One lesson | Rate snapshot. Generated `price_pence`/`total_pence`. `ends_at` set by trigger. **Overlap exclusion constraint** |
| `booking_events` | Append-only audit | Previous/current JSON used for "moved from" and reschedule messages |
| `messages` | Outbound learner messages | Provider id and status, retries |
| `notifications` | In-app notification centre | `payload` holds deep-link ids |
| `notification_preferences` | Reminder timing, alerts, default channel | |
| `device_tokens` | Push tokens | |
| `subscription_plans` | Plan catalogue | Reference data, seeded in every environment |
| `subscriptions` | Instructor plan state | One live (trialing/active/past_due) subscription per instructor. Mirrors Stripe |
| `auth_sessions` | Refresh tokens (hashed) | Rotation and revocation |
| `verification_codes` | SMS/e-mail codes, password reset | Hashed, 5 attempts, short expiry |

View: `booking_display` adds `display_status` (`upcoming | ongoing | completed | cancelled | rescheduled`), matching the five calendar states.

## Business rules enforced in the database

1. **No double-booking (§27).** `bookings_no_overlap` excludes overlapping `[starts_at, ends_at)` ranges per instructor unless cancelled. The API catches SQLSTATE `23P01`, looks up the clashing booking and returns `409 BOOKING_CONFLICT`.
2. **History survives learner removal (§9, §22).** `bookings.learner_id` and `messages.learner_id` are `ON DELETE RESTRICT`. "Delete learner" sets `status='archived', archived_at=now()`.
3. **Booking readiness (§7).** `learners.is_booking_ready`. The API refuses `POST /bookings` with `422 LEARNER_INCOMPLETE` when it is false and lists the missing fields.
4. **Pricing integrity (§12).** The rate is copied into the booking. Price and total are generated. A discount can't exceed the price.
5. **Cancelled means a timestamp.** The `status='cancelled'` ⇔ `cancelled_at IS NOT NULL` check.

## Encryption

Licence numbers and bank details are encrypted with `pgp_sym_encrypt(value, key)` (pgcrypto, AES-256). The key comes from `FIELD_ENCRYPTION_KEY`. It is passed as a query parameter, never stored in the database and never logged.

```sql
-- write
UPDATE learners SET licence_number_enc = pgp_sym_encrypt($1, $2), licence_last4 = right($1, 4) WHERE id = $3 AND instructor_id = $4;
-- read (only where the full value is needed, e.g. edit form)
SELECT pgp_sym_decrypt(licence_number_enc, $1) AS licence FROM learners WHERE id = $2 AND instructor_id = $3;
```

Key rotation: add `FIELD_ENCRYPTION_KEY_PREVIOUS`, re-encrypt in a batched job, then remove the old key.

## Row-level security (recommended second layer)

```sql
ALTER TABLE learners ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON learners
  USING (instructor_id = current_setting('app.instructor_id')::uuid);
-- repeat for every table with instructor_id; the API runs
-- SET LOCAL app.instructor_id = '<id from JWT>' at the start of each transaction.
```

The API should connect as a role that is not the table owner, so policies apply.

## Initialising and migrating

```bash
# 1. schema
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f database/migrations/001_initial_schema.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f database/migrations/002_referral_programme.sql
# 2. reference data (every environment)
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f database/seeds/001_subscription_plans.sql
# 3. demo data (local/staging only)
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -v enc_key="$FIELD_ENCRYPTION_KEY" -f database/seeds/002_demo_data.sql
```

New migrations go in `database/migrations/NNN_description.sql`. Never edit an applied migration. Use a tool such as `node-pg-migrate`, `dbmate`, Drizzle Kit or Prisma Migrate to track applied versions. The demo instructor's password hash can't be used to log in; set one through the password-reset flow.

## Scheduled jobs touching the database

| Job | Schedule | Action |
| --- | --- | --- |
| `complete-lessons` | every 5 min | `UPDATE bookings SET status='completed', completed_at=ends_at WHERE status='scheduled' AND ends_at < now()` |
| `lesson-reminders` | every minute | Bookings starting in `lesson_reminder_minutes` → notification and push (idempotent per booking) |
| `trial-ending` | daily 09:00 | Trials ending in 3 days → notification and e-mail |
| `retention` | monthly | Purge `auth_sessions`/`verification_codes` older than 90 days, and archived learner PII past the retention period (docs/security.md) |

## Backups

Daily automated snapshots with point-in-time recovery (7–35 days), in a UK region. Test a restore every quarter.

## Referral programme

Migration `002_referral_programme.sql` adds:

- `subscription_plans.term_price_pence`: the amount charged per term, which is also the qualifying subscription value.
- `subscriptions.referral_free_until` and `apply_credit_automatically`.
- `referral_codes`: one per instructor, unique code, `active`/`inactive`, optional expiry.
- `referrals`: the referrer ↔ referred relationship. `referred_instructor_id` is **unique**, a CHECK enforces referrer ≠ referred, and the lifecycle status, reward snapshot, hold window and reversal fields live here.
- `referral_fraud_signals`: internal evidence for fraud decisions.
- `credit_accounts`: balance, totals and `owed_pence`. The balance can never go negative.
- `credit_transactions`: **append-only ledger** (a trigger blocks UPDATE/DELETE), at most one reward per referral, idempotency keys and a running `balance_after_pence`.
- The `rewards` value on `notification_category`.

### Posting to the ledger (backend only)

```sql
BEGIN;
SELECT id, balance_pence, owed_pence FROM credit_accounts WHERE instructor_id = $1 FOR UPDATE;
-- compute new_balance in the service (reward: + amount − owed recovery; redemption: − min(balance, charge))
INSERT INTO credit_transactions (credit_account_id, instructor_id, referral_id, type, amount_pence, description, balance_after_pence, idempotency_key)
VALUES ($acct, $1, $ref, 'referral_reward', $amount, $desc, $new_balance, $key);
UPDATE credit_accounts SET balance_pence = $new_balance, total_earned_pence = total_earned_pence + $amount WHERE id = $acct;
UPDATE referrals SET status = 'awarded', reward_status = 'awarded', awarded_at = now() WHERE id = $ref AND status = 'payment_confirmed';
COMMIT;
```

Reconciliation check (run nightly, alert on any row):

```sql
SELECT a.instructor_id FROM credit_accounts a
LEFT JOIN LATERAL (SELECT balance_after_pence FROM credit_transactions t WHERE t.credit_account_id = a.id ORDER BY created_at DESC, id DESC LIMIT 1) l ON true
WHERE a.balance_pence <> COALESCE(l.balance_after_pence, 0);
```

Code generation: `'NEX' || upper(first 8 letters of first name) || 2 digits (20–99)`. Retry with new digits on a unique violation, and after 20 attempts fall back to the first 3 letters of the surname. Creating a code is part of the same transaction that starts the trial.
