# CONFIGURATION_CHECKLIST

Tick each item. **Required** = the system won't work correctly in production without it. **Optional** = sensible defaults exist.

No real secrets are included anywhere in this package.

## A. Public browser configuration: `public/config/app-config.js` and `public/admin/config/app-config.js`

Keep both files identical.

| Key | Required? | Where to get it | Example |
| --- | --- | --- | --- |
| `demoMode` | **Required** | `true` until the Supabase wiring is done, then `false` | `false` |
| `appOrigin` | **Required** | Your app's https origin | `https://app.nextime.co.uk` |
| `supabaseUrl` | **Required** | Supabase → Project settings → API → Project URL | `https://abcd.supabase.co` |
| `supabaseAnonKey` | **Required** | Supabase → Project settings → API → anon public key | `eyJ…` |
| `functionsUrl` | **Required** | `https://<ref>.functions.supabase.co` | |
| `stripePublishableKey` | Required if cards are offered | Stripe → Developers → API keys | `pk_live_…` |
| `supportEmail` | Optional | Your support inbox | `hello@…` |

## B. Server secrets: `.env.example` → `supabase/.env` → `supabase secrets set`

| Variable | Required? | Source |
| --- | --- | --- |
| `APP_ORIGIN` | **Required** | Same as `appOrigin` |
| `GOCARDLESS_ENV` | Required for Direct Debit | `sandbox` while testing, then `live` |
| `GOCARDLESS_ACCESS_TOKEN` | Required for Direct Debit | GoCardless → Developers → Create access token (read-write) |
| `GOCARDLESS_WEBHOOK_SECRET` | Required for Direct Debit | GoCardless → Developers → Webhook endpoints |
| `STRIPE_SECRET_KEY` | Required for cards/invoices | Stripe → Developers → API keys (`sk_…`); a restricted key is fine |
| `STRIPE_PUBLISHABLE_KEY` | Required for cards | Stripe → API keys (`pk_…`) |
| `STRIPE_WEBHOOK_SECRET` | Required for cards/invoices | Stripe → Webhooks → endpoint → Signing secret (`whsec_…`) |
| `STRIPE_AUTOMATIC_TAX` | Optional | `true` if Stripe Tax is enabled |
| `VAT_RATE` | Optional | Default `0.2` (UK) |
| `RESEND_API_KEY` | **Required** (reminders, invites to existing users) | resend.com → API keys (or swap `sendEmail` in `_shared/common.ts` for your provider) |
| `EMAIL_FROM` | **Required** | Verified sender, e.g. `NEXTime <no-reply@nextime.co.uk>` |
| `CRON_SECRET` | **Required** | Generate: `openssl rand -hex 32`. Also store in Vault |
| `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Automatic | Injected by Supabase into functions. Never put the service role key in the browser |

## C. Database connection (CLI / admin tools only)

The web pages never connect to Postgres directly.

| Value | Required? | Source |
| --- | --- | --- |
| Database host | **Required** for CLI/psql | Supabase → Project settings → Database (pooler host) |
| Database name | **Required** | `postgres` |
| Database user | **Required** | `postgres.<project-ref>` (pooler) |
| Database password | **Required** | Set at project creation (reset in the same page) |
| Port | **Required** | `5432` (session) or `6543` (transaction pooler) |
| `SUPABASE_PROJECT_REF`, `SUPABASE_ACCESS_TOKEN` | **Required** for CLI | Dashboard URL / Account → Access tokens |

## D. Supabase dashboard settings

- [ ] **Required** Auth → URL configuration: Site URL = `appOrigin`; Redirect URLs include `<appOrigin>/account.html` and `<appOrigin>/account.html?*`
- [ ] **Required** Auth → Providers → Email: confirm email ON, secure email change ON, minimum password 10
- [ ] **Required** Auth → Multi-factor: TOTP enabled
- [ ] **Required** Auth → SMTP settings: your provider (the built-in sender is rate-limited and for testing only)
- [ ] **Required** Auth → Email templates: brand the Confirm, Invite, Magic link and Reset templates; invite link → `{{ .RedirectTo }}`
- [ ] **Required** Database → Extensions: `pg_cron`, `pg_net`
- [ ] **Required** Vault secret `nextime_cron_secret`, and replace `YOUR-PROJECT-REF` in the daily cron job
- [ ] **Required** First platform admin inserted (see `seed.sql`)
- [ ] Optional: Auth → Rate limits, leaked-password protection (Pro), CAPTCHA (hCaptcha/Turnstile)
- [ ] Optional: Database → Backups → enable Point-in-Time Recovery

## E. Stripe dashboard

- [ ] **Required** Products: Starter, Team, Business, each with a monthly and a yearly GBP recurring price (ex VAT), with the Price ids put in `seed.sql`
- [ ] **Required** Settings → Payment methods: Cards, Apple Pay, Google Pay ON
- [ ] **Required** Apple Pay → register your domain (Stripe hosts the verification file; or place `/.well-known/apple-developer-merchantid-domain-association` in `public/`)
- [ ] **Required** Webhook endpoint → `https://<ref>.functions.supabase.co/stripe-webhook` with the events listed in API_DOCUMENTATION.md
- [ ] **Required** Settings → Billing → Invoices: bank transfer (customer balance) enabled for invoice billing; your company details and VAT number
- [ ] Optional: Stripe Tax; Customer emails (receipts, failed-payment emails); Smart Retries

## F. GoCardless dashboard

- [ ] **Required** Company verification complete (live)
- [ ] **Required** Schemes enabled: Bacs (and SEPA/ACH/BECS/PAD as needed)
- [ ] **Required** Webhook endpoint → `https://<ref>.functions.supabase.co/gocardless-webhook`
- [ ] Optional: Success+ (smart retries), custom payment-page branding

## G. Web server

- [ ] **Required** Domain DNS → host; HTTPS certificate (Let's Encrypt / host-managed)
- [ ] **Required** Replace `YOUR-PROJECT-REF` in `public/.htaccess` CSP (or the equivalent header on Nginx/Netlify)
- [ ] **Required** `public/admin/.htaccess` → create the `htpasswd` file; or serve `admin/` from a separate restricted host
- [ ] Optional: CDN, `www` → apex redirect, uptime monitoring

## H. Content and legal

- [ ] **Required** Terms of Service, Privacy Policy and Data Processing Agreement pages. The footer currently lists them as text; add the URLs in `source/pages/nextime-website.dc.html` (footer "Legal") and the sign-up terms checkbox in `nextime-account.dc.html`
- [ ] **Required** Company name, address and VAT number on invoices (Stripe/GoCardless settings)
- [ ] Optional: change prices. Update `plans` (DB), Stripe Prices and the `PLANS` arrays in `source/js/nextime-saas.js` and `source/pages/nextime-website.dc.html`
- [ ] Optional: contact email `hello@nexyraconsulting.co.uk` (website footer, Enterprise CTA)
