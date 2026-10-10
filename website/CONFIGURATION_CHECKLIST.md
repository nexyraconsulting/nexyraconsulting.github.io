# Configuration checklist

Tick each value before go-live. **Never** put a secret in a file under `public_html/`.

## A. Website (required for go-live)

| ✓ | Value | Where | Required? |
| --- | --- | --- | --- |
| ☐ | Web3Forms access key | `public_html/assets/js/site-config.js` → `web3formsAccessKey` | **Required** |
| ☐ | Contact fallback email | same file → `contactEmail` | Optional (default hello@nexyraconsulting.co.uk) |
| ☐ | Domain + DNS A/AAAA records | DNS provider | **Required** |
| ☐ | TLS certificate | host / certbot | **Required** |
| ☐ | Restrict Web3Forms key to your domain | web3forms.com dashboard | Optional (recommended) |
| ☐ | `<base href>` in `404.html` | only if not hosted at domain root | Optional |
| ☐ | NEXTime admin password file | `htpasswd`; path in `nextime/admin/.htaccess` | **Required** (protects console) |

## B. Product front ends (browser config: public values only)

| ✓ | Value | File | Required? |
| --- | --- | --- | --- |
| ☐ | `mode` (`demo` / `live`) | `nexdrive/js/config.js` | Required when going live |
| ☐ | `apiBaseUrl` | `nexdrive/js/config.js` | Required for live |
| ☐ | `referralBaseUrl` | `nexdrive/js/config.js` | Required for live |
| ☐ | `showDemoPanel: false` | `nexdrive/js/config.js` | Required for live |
| ☐ | `mode` (`demo` / `api`), `baseDomain` | `nexhr/assets/js/appConfig.js` | Required for live |
| ☐ | `supportEmail`, `qrScriptUrl` | `nexhr/assets/js/appConfig.js` | Optional |
| ☐ | `demoMode: false`, `appOrigin` | `nextime/config/app-config.js` + `nextime/admin/config/app-config.js` | Required for live |
| ☐ | `supabaseUrl`, `supabaseAnonKey`, `functionsUrl` | same two files | Required for live |
| ☐ | `stripePublishableKey` (`pk_live_…`) | same two files | Required if cards offered |
| ☐ | `YOUR-PROJECT-REF` in CSP | `nextime/.htaccess` | Required for live |

## C. NEXHR server (`backend/nexhr/server/.env`)

**Required:** `NODE_ENV`, `PORT`, `BASE_DOMAIN`, `DATABASE_URL` (host, db name `nexhr`, user `nexyra_app`, password), `DATA_ENCRYPTION_KEY`, `FILE_URL_SECRET`, `STORAGE_DIR`, `SMTP_URL` (SMTP host, user, password, port), `MAIL_FROM`.
**Required for billing:** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_MONTHLY`, `STRIPE_PRICE_YEARLY`.
**Optional:** `STRIPE_TAX`, `SESSION_HOURS`, `SESSION_IDLE_MINUTES`, `LOGIN_MAX_ATTEMPTS`, `LOGIN_WINDOW_MINUTES`, `VIRUS_SCAN`, `CORS_ORIGINS`.
**Setup-time only:** `OWNER_DATABASE_URL`, `APP_DB_PASSWORD` (for `setup_database.sh`; do not keep in `.env`).

## D. NEXTime (Supabase secrets via `supabase secrets set`)

**Required:** `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`, `SUPABASE_DB_PASSWORD` (CLI machine only), `APP_ORIGIN`, `CRON_SECRET` (+ same value in Vault), `RESEND_API_KEY`, `EMAIL_FROM`.
**Required if Direct Debit offered:** `GOCARDLESS_ENV`, `GOCARDLESS_ACCESS_TOKEN`, `GOCARDLESS_WEBHOOK_SECRET`.
**Required if cards/invoices offered:** `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`.
**Optional:** `STRIPE_AUTOMATIC_TAX`, `VAT_RATE`, `SUPABASE_DB_URL` (tools/backups).
**Automatic (do not set):** `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

## E. NEXDrive API (`backend/nexdrive/.env`, when built)

The template ships with **development** defaults (`localhost`); change all of them for production.
**Required:** `NODE_ENV=production`, `PORT`, `APP_URL`, `API_BASE_URL`, `CORS_ORIGINS`, `DATABASE_URL` (host, db, user, password), `DATABASE_SSL=require`, `REDIS_URL`, `JWT_ACCESS_SECRET`, `FIELD_ENCRYPTION_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_1M/12M/24M/36M`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_MESSAGING_SERVICE_SID`, `EMAIL_PROVIDER_API_KEY`, `EMAIL_FROM`, `STORAGE_BUCKET`, `STORAGE_REGION`, `STORAGE_ACCESS_KEY_ID`, `STORAGE_SECRET_ACCESS_KEY`, `REFERRAL_BASE_URL`.
**Optional:** `STORAGE_ENDPOINT`, `TWILIO_WHATSAPP_FROM`, `FEATURE_WHATSAPP`, `PUSH_EXPO_ACCESS_TOKEN`, `SENTRY_DSN`, `LOG_LEVEL`, `RATE_LIMIT_PER_MIN`, `FIELD_ENCRYPTION_KEY_PREVIOUS`, `JWT_ACCESS_TTL`, `REFRESH_TOKEN_TTL`, `TRIAL_DAYS`, `REMINDER_DEFAULT_MINUTES`, `REFERRAL_*` tuning, `PASSWORD_HASH_MEMORY_KIB`, `DATABASE_POOL_MAX`, `TZ`.

## F. Webhooks to register (when products go live)

| Provider | URL |
| --- | --- |
| Stripe → NEXHR | `https://www.nexhr.com/api/stripe/webhook` |
| Stripe → NEXTime | `https://<ref>.functions.supabase.co/stripe-webhook` |
| GoCardless → NEXTime | `https://<ref>.functions.supabase.co/gocardless-webhook` |
| Stripe → NEXDrive | `https://api.nexdrive.co.uk/v1/webhooks/stripe` |
| Twilio → NEXDrive | `https://api.nexdrive.co.uk/v1/webhooks/messaging` |

Generate secrets with `openssl rand -base64 48`.
