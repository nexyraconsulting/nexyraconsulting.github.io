# Environment & configuration

Secrets live only in the environment: a local `.env` (git-ignored) or the hosting platform's secret manager. `.env.example` lists every variable with placeholders. **Never hard-code credentials, and never put secrets in `js/config.js`**, which is public.

## Front end — `js/config.js`

| Key | Default | Meaning |
| --- | --- | --- |
| `mode` | `'demo'` | `'demo'` = in-memory sample data. `'live'` is reserved for the API integration (docs/developer-guide.md §4) |
| `apiBaseUrl` | `''` | e.g. `https://api.nexdrive.co.uk/v1` |
| `showDemoPanel` | `true` | Workflow shortcut panel on wide screens. **Set `false` for real users** |
| `deviceFrame` | `true` | `false` = fill the viewport on desktop instead of showing a phone frame |
| `referralBaseUrl` | `'https://app.nexdrive.co.uk/join'` | Public sign-up URL used in referral links and QR codes. The app reads `?ref=` |
| `adminLogin` | `true` | Admin PIN screen before the app (demo gate, see security.md) |
| `launchAnimation` | `true` | NEXDrive lock-up animation on start (tap to skip) |
| `timezone` / `currency` | `Europe/London` / `GBP` | |

Generate it per environment at deploy time, e.g. `envsubst < config.template.js > js/config.js`.

## Backend — required

| Variable | Example / format | Purpose |
| --- | --- | --- |
| `NODE_ENV` | `production` | |
| `PORT` | `8080` | API port |
| `APP_URL` | `https://app.nexdrive.co.uk` | Links in e-mails, CORS default |
| `API_BASE_URL` | `https://api.nexdrive.co.uk/v1` | |
| `CORS_ORIGINS` | `https://app.nexdrive.co.uk` | Comma-separated allow-list |
| `TZ` | `Europe/London` | Display-time zone for jobs and templates |
| `DATABASE_URL` | `postgres://user:pass@host:5432/nexdrive` | |
| `DATABASE_SSL` | `require` | `disable` only locally |
| `DATABASE_POOL_MAX` | `10` | |
| `REDIS_URL` | `rediss://…` | Job queue |
| `JWT_ACCESS_SECRET` | 64+ random bytes, base64 | Sign access tokens (or use `JWT_PRIVATE_KEY` for RS256) |
| `JWT_ACCESS_TTL` | `15m` | |
| `REFRESH_TOKEN_TTL` | `30d` | |
| `FIELD_ENCRYPTION_KEY` | 32+ random bytes, base64 | pgcrypto key for licence and bank fields |
| `PASSWORD_HASH_MEMORY_KIB` | `19456` | argon2id cost |
| `STRIPE_SECRET_KEY` | `sk_live_…` | |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` | |
| `STRIPE_PRICE_1M` · `_12M` · `_24M` · `_36M` | `price_…` | Map `subscription_plans.code` → Stripe Price |
| `TRIAL_DAYS` | `14` | |
| `TWILIO_ACCOUNT_SID` · `TWILIO_AUTH_TOKEN` | | SMS/WhatsApp |
| `TWILIO_MESSAGING_SERVICE_SID` | `MG…` | Alphanumeric sender "NexDrive" |
| `TWILIO_WHATSAPP_FROM` | `whatsapp:+44…` | Optional |
| `EMAIL_PROVIDER_API_KEY` · `EMAIL_FROM` | `NexDrive <no-reply@nexdrive.co.uk>` | Postmark or SES |
| `STORAGE_BUCKET` · `STORAGE_REGION` · `STORAGE_ENDPOINT` | `eu-west-2` | Profile photos (private bucket) |
| `STORAGE_ACCESS_KEY_ID` · `STORAGE_SECRET_ACCESS_KEY` | | Prefer an IAM role instead |
| `PUSH_EXPO_ACCESS_TOKEN` or `FCM_SERVICE_ACCOUNT_JSON` · `APNS_KEY_*` | | Lesson reminders |

## Backend — referral programme

| Variable | Default | Purpose |
| --- | --- | --- |
| `REFERRAL_BASE_URL` | `https://app.nexdrive.co.uk/join` | Builds referral URLs. Must match `referralBaseUrl` in `js/config.js` |
| `REFERRAL_REWARD_PERCENT` | `20` | Reward percentage, snapshotted on each referral |
| `REFERRAL_FREE_MONTHS` | `1` | Extra free months for the new instructor after the trial |
| `REFERRAL_HOLD_DAYS` | `14` | Refund window before credit is awarded |
| `REFERRAL_VALIDATE_RATE_LIMIT` | `10` | Public validate calls per minute per IP |

## Backend — optional

`SENTRY_DSN`, `LOG_LEVEL` (`info`), `RATE_LIMIT_PER_MIN` (`100`), `REMINDER_DEFAULT_MINUTES` (`30`), `FIELD_ENCRYPTION_KEY_PREVIOUS` (key rotation), `FEATURE_WHATSAPP` (`false`).

## Local only — docker-compose

`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`. Pick your own local values.

## Generating secrets

```bash
openssl rand -base64 64   # JWT_ACCESS_SECRET
openssl rand -base64 32   # FIELD_ENCRYPTION_KEY
```

The API should validate env at boot (Zod) and refuse to start if anything required is missing.
