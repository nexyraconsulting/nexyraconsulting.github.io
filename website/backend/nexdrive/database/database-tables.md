# Database tables

Column reference. DDL: `migrations/001_initial_schema.sql`, `migrations/002_referral_programme.sql`. Unless stated otherwise, every table has `id uuid PK`, and timestamps are `timestamptz`.

## Core

| Table | Key columns |
| --- | --- |
| **instructors** | full_name · email (citext, unique) · phone_e164 (unique, `+447…`) · password_hash (argon2id) · adi_number (6 digits, unique) · instructor_status (`adi`/`pdi`) · business_name · address_line · postcode · photo_key · default_duration_minutes · timezone · email_verified_at · phone_verified_at · created_at · updated_at · deleted_at |
| **coverage_areas** | instructor_id · outward_code (PK pair) |
| **rate_cards** | instructor_id · code · label · hourly_rate_pence · is_default (one per instructor) · is_active |
| **bank_accounts** | instructor_id (PK) · account_holder · sort_code_enc · account_number_enc · sort_code_last2 · account_number_last4 · include_in_messages |
| **learners** | instructor_id · full_name · phone_e164 · email · address_line · postcode · licence_number_enc · licence_last4 · theory_certificate_number · notes · status (`active`/`archived`) · archived_at · is_booking_ready (generated) |
| **lesson_packages** | instructor_id · learner_id · lesson_count (≥2) · subtotal_pence · discount_pence · total_pence (generated) |
| **bookings** | instructor_id · learner_id · package_id · rate_card_id · starts_at · duration_minutes · ends_at (trigger) · status (`scheduled`/`completed`/`cancelled`/`no_show`) · location_type · location_address · location_postcode · hourly_rate_pence · discount_pence · price_pence/total_pence (generated) · rescheduled_from · reschedule_count · cancel_reason · cancelled_at · completed_at · **EXCLUDE overlap** |
| **booking_events** | booking_id · instructor_id · event_type · previous (jsonb) · current (jsonb) |
| **messages** | instructor_id · learner_id · booking_id · package_id · kind · channel · recipient · body · included_bank · status · provider_message_id · error_code · sent_at · delivered_at |
| **notifications** | instructor_id · category (`lessons`/`billing`/`learners`/`rewards`/`system`) · type · title · body · payload · read_at |
| **notification_preferences** | instructor_id (PK) · lesson_reminder_enabled · lesson_reminder_minutes · booking/learner/billing alerts · confirm_before_messaging · default_channel |
| **device_tokens** | instructor_id · platform · token (unique) · last_seen_at |
| **subscription_plans** | code (PK: `1m`,`12m`,`24m`,`36m`) · name · term_months · monthly_price_pence · **term_price_pence** · is_active · sort_order |
| **subscriptions** | instructor_id · plan_code · status (`trialing`/`active`/`past_due`/`cancelled`/`expired`) · trial_starts_at · trial_ends_at · **referral_free_until** · current_period_start/end · term_ends_at · cancel_at_period_end · **apply_credit_automatically** · payment_method_brand/last4 · provider_customer_id · provider_subscription_id |
| **auth_sessions** | instructor_id · refresh_token_hash · user_agent · ip · expires_at · revoked_at |
| **verification_codes** | instructor_id · purpose · destination · code_hash · attempts (≤5) · expires_at · consumed_at |

## Referral programme

### referral_codes
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | Referral code ID |
| instructor_id | uuid FK, **unique** | Referring instructor (one code each) |
| code | citext, **unique** | `^NEX[A-Z]{1,8}[2-9][0-9]$`, e.g. `NEXDANIEL25` |
| status | `active` / `inactive` | |
| created_at · expires_at · deactivated_at | timestamptz | `expires_at` NULL = never expires |
| *(referral URL)* | derived | `REFERRAL_BASE_URL?ref=CODE`. Not stored, so a domain change needs no migration |

### referrals (referral relationships)
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | Referral relationship ID |
| referral_code_id | uuid FK | |
| referrer_instructor_id | uuid FK | |
| referred_instructor_id | uuid FK, **unique** | One referral per new instructor |
| code_used · channel | citext · `manual`/`qr`/`link` | |
| status | referral_status | `started` … `awarded` / `not_qualified` / `reversed` |
| subscription_id | uuid FK | Referred instructor's subscription |
| qualifying_plan_code · qualifying_value_pence | | Set from the first paid invoice |
| reward_percent · reward_pence | numeric(5,2) · int | Snapshot of the rate. Reward is calculated on the server |
| reward_status | `none`/`pending`/`held`/`awarded`/`reversed`/`forfeited` | |
| qualifying_payment_ref · hold_until | text · timestamptz | Stripe invoice and the end of the refund window |
| qualified_at · awarded_at · reversed_at · reversal_reason · not_qualified_reason | | |
| registered_at · created_at · updated_at | timestamptz | |
| CHECK | referrer ≠ referred | Self-referral guard |

### referral_fraud_signals
referral_id · signal · detail (jsonb) · created_at. Internal only.

### credit_accounts (NexDrive Credit account)
| Column | Notes |
| --- | --- |
| id | Credit account ID |
| instructor_id | unique |
| balance_pence | ≥ 0. Equals the last ledger `balance_after_pence` |
| total_earned_pence · total_used_pence | Running totals for the UI |
| owed_pence | Clawback not yet recovered |
| updated_at | |

### credit_transactions (append-only ledger)
| Column | Notes |
| --- | --- |
| id | Transaction ID |
| credit_account_id · instructor_id | |
| referral_id | Required for `referral_reward` and `reversal` |
| subscription_id | For `redemption` |
| type | `referral_reward` (+) · `redemption` (−) · `reversal` (−) · `adjustment` (±) |
| amount_pence | ≠ 0 |
| description | Shown in the UI, e.g. "Referral reward — Sarah Smith" |
| balance_after_pence | ≥ 0. Gives the running balance |
| provider_ref · idempotency_key (unique) · created_by · created_at | |
| Guards | One `referral_reward` per referral (unique index). UPDATE and DELETE are blocked by a trigger |
