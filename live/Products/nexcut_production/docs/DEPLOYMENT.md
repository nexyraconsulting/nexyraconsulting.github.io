# NEXCut — developer deployment guide

Everything needed to put the NEXCut product pages, checkout and subscription backend live on
nexyraconsulting.co.uk. Work through the sections in order. Each step ends with a check.

---

## 0. What you are deploying

| Part | Where it runs | Folder |
|---|---|---|
| 5 static pages (overview, customers, business, pricing, checkout) | Main site web server, under `/nexcut/` | `product/`, `css/`, `js/`, `assets/` |
| Shared Nexyra navigation + search | Main site `/assets/nav/` (one copy for every page) | `assets/nav/` (copy of the main site's files) |
| Database, billing tables, RLS | Supabase (Postgres) | `supabase/migrations/` |
| Checkout, webhook, subscription API, emails | Supabase Edge Functions (Deno) | `supabase/functions/` |
| Payments, trials, Direct Debit, billing portal | Stripe | configured in the Stripe Dashboard |
| Transactional email | Postmark | templates in Postmark |

The site works **without** the backend: with `supabaseUrl: null` in `js/config.js` (as shipped) every page renders
and checkout runs in a clearly labelled **demo mode**. You can deploy section 1 first and switch to live later.

**Tools:** Supabase CLI ≥ 1.200, Stripe CLI, Node 18+ (for `npx serve` only), SFTP/SSH access to the web host (Apache).

---

## 1. Website (static files)

### 1.1 Local preview
```bash
npx serve nexcut_production
# open http://localhost:3000/product/index.html
```
Locally, the nav loads from `assets/nav/` and its links point at the live site (`data-site` attribute).

### 1.2 Upload
Upload the contents of `nexcut_production/` to the web root as **`/nexcut/`**:

```
/nexcut/.htaccess
/nexcut/product/*.html
/nexcut/css/  /nexcut/js/  /nexcut/assets/
```
Do **not** upload `supabase/`, `docs/`, `.env.example` or `README.md` (the `.htaccess` blocks them anyway).

Public URLs:
```
/nexcut/                      → 301 to /nexcut/product/index.html
/nexcut/product/index.html    overview
/nexcut/product/customers.html
/nexcut/product/business.html
/nexcut/product/pricing.html
/nexcut/product/checkout.html
```
`.htaccess` also redirects the short URLs (`/nexcut/business.html` etc.) to the `product/` pages, so any older
links keep working.

### 1.3 Use the main site's navigation (hosted once)
In each of the 5 pages in `product/`, replace the two nav lines in `<head>`:

```html
<link rel="stylesheet" href="../assets/nav/nexyra-nav.css">
<script src="../assets/nav/nexyra-nav.js" data-site="https://nexyraconsulting.co.uk/" data-active="products" data-product="nexcut" defer></script>
```
with:
```html
<script src="/assets/nav/nexyra-nav.js" data-active="products" data-product="nexcut" defer></script>
```
(The script injects its own stylesheet.) Then delete `/nexcut/assets/nav/` and `/nexcut/assets/css/` from the server.

### 1.4 Update the main site's shared nav files
Copy these from `nexcut_production/assets/nav/` over the main site's `/assets/nav/` versions:

- `nexyra-menu.js`: the NEXCut links now point at `/nexcut/product/*.html`
- `nexyra-search-index.js`: the NEXCut result URLs, updated the same way
- `nexyra-nav.js`: adds the optional `data-site` attribute (backwards compatible, nothing else changed)

Add the five NEXCut pages under Products in `/sitemap.html`.

**Check:** on any main-site page, Menu → Products → NEXCut lists the pages and every link opens. Searching "nexcut"
returns NEXCut results. On a NEXCut page, the pill turns white over the dark CTA band, and search opens and closes with Esc.

### 1.5 Public config: `js/config.js`
| Key | Value |
|---|---|
| `supabaseUrl`, `supabaseAnonKey` | from section 2. Leave `null` to stay in demo mode |
| `appStoreCustomer`, `playStoreCustomer`, `appStoreBusiness`, `playStoreBusiness` | listing URLs. Buttons show "Coming soon" while `null` |
| `termsUrl`, `termsVersion` | NEXCut Business Terms of Service. Checkout labels it "(to be published)" while `null` |
| `customerDemoUrl`, `businessDemoUrl` | **Change before upload.** They point at prototype files that are not part of this package. Set them to hosted demo builds, or `null` to hide the demo panel |

Only public values go here. Never put a secret key in this file.

### 1.6 Plans: `js/nexcut-plans.js`
This is the single source of plan names, prices, savings and trial length, used by the website and bundled into
the NEXCut Business app. If a price changes, update this file **and** `billing_terms` in the database (2.3)
**and** the Stripe Price (3.2). The three must match.

---

## 2. Supabase

```bash
cd nexcut_production
supabase login
supabase link --project-ref YOUR-REF          # UK/EU region project
supabase db push                              # applies migrations/20261011120000_billing.sql
cp .env.example .env                          # fill in real values, never commit .env
supabase secrets set --env-file .env
supabase functions deploy create-checkout stripe-webhook checkout-status subscription store-sync send-notifications
```
`supabase/config.toml` sets `verify_jwt = false` for every function except `subscription`. `stripe-webhook` and
`store-sync` check the provider signature, `send-notifications` checks `CRON_SECRET`, and `create-checkout` /
`checkout-status` are called before the user has a session.

### 2.1 What the migration creates
`billing_terms` (master pricing), `subscriptions` (one per business), `invoices`, `consents` (trial-terms
agreement with version and timestamp), `billing_events` (idempotent webhook log), `notification_outbox`, RLS
policies, and the `business_entitlement` view the app reads.

### 2.2 Functions
| Function | Called by | Purpose |
|---|---|---|
| `create-checkout` | checkout step 4 | creates account + business, records consent, opens Stripe Checkout with a 14-day trial |
| `stripe-webhook` | Stripe | records trial / payment / cancellation state |
| `checkout-status` | checkout step 5 | confirms the trial is active and shows the dates |
| `subscription` | Business app | GET entitlement; POST cancel / resume / switch; billing-portal link |
| `store-sync` | Apple / Google | in-app subscriptions (**skeleton, returns 501 until store verification is implemented**) |
| `send-notifications` | Cron | sends queued emails (trial started, 3-day reminder, payment taken/failed, cancelled) |

### 2.3 Prices in the database
After section 3.2:
```sql
update billing_terms set stripe_price_id = 'price_…' where code = 'monthly';
update billing_terms set stripe_price_id = 'price_…' where code = 'm12';
update billing_terms set stripe_price_id = 'price_…' where code = 'm24';
update billing_terms set stripe_price_id = 'price_…' where code = 'm36';
```
Checkout refuses to start for any term whose price or `stripe_price_id` is still null.

### 2.4 Cron and auth
- Dashboard → Integrations → Cron: every 5 minutes, `POST {SUPABASE_URL}/functions/v1/send-notifications` with
  header `Authorization: Bearer {CRON_SECRET}`.
- Auth: turn email confirmation on, and configure an SMS provider for mobile OTP.
- Add bot protection (Turnstile or hCaptcha) and rate limiting in front of `create-checkout`.

**Check:** `curl -i {SUPABASE_URL}/functions/v1/subscription` returns 401 without a token. The `billing_terms`
table has 4 rows.

---

## 3. Stripe

1. Activate the account (UK entity and bank account). Enable **Bacs Direct Debit**, **Apple Pay** and **Google Pay**
   (Settings → Payment methods). Register the domain `nexyraconsulting.co.uk` for Apple Pay.
2. Create one Product, **NEXCut Business**, with four GBP Prices:
   - £25 every 1 month
   - £240 every 12 months
   - £420 every 24 months
   - £540 every 36 months

   Copy the four `price_…` IDs into 2.3. See `PAYMENTS.md §1` for multi-year interval limits.
3. Developers → Webhooks → add endpoint `{SUPABASE_URL}/functions/v1/stripe-webhook` with the events listed in
   `CONFIGURATION_CHECKLIST.md`. Put its signing secret in `STRIPE_WEBHOOK_SECRET` and re-run `supabase secrets set`.
4. Customer Portal: allow cancel, payment-method update and invoice history. Turn on Smart Retries.

Local webhook testing:
```bash
supabase functions serve
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook
stripe trigger checkout.session.completed
```
Use `sk_test_…` keys until launch, then swap to live keys and live price IDs.

---

## 4. Email (Postmark)
Create a server and verify the sender domain (SPF/DKIM). Create the templates whose aliases are listed at the top
of `supabase/functions/send-notifications/index.ts`. Set `POSTMARK_SERVER_TOKEN` and `EMAIL_FROM`.

---

## 5. Go-live test (Stripe test mode)

1. `/nexcut/product/pricing.html`: four options, correct prices and savings badges.
2. Checkout: choose 12 months → create account → step 3 shows today's date, the trial end date (today + 14) and
   the first payment → agree → step 4 opens Stripe → pay with `4242 4242 4242 4242` → step 5 shows "Trial active".
3. Stripe: subscription is `trialing`, £0 charged, trial end matches. Supabase: `subscriptions.status = 'trialing'`,
   with a `consents` row.
4. "Trial started" email arrives.
5. Business app → Subscription & billing → Cancel free trial → status `canceled`, nothing charged at trial end.
6. Repeat with Bacs test details (`PAYMENTS.md §4`) and with Apple Pay in Safari.
7. Advance a Stripe test clock past the trial end → invoice paid, "Payment taken" email sent.

Full acceptance criteria: `TESTING.md`.

---

## 6. Mobile apps
- Bundle `js/nexcut-plans.js` values at build time. Read entitlement from `GET /functions/v1/subscription`.
- Subscribe to Realtime on `subscriptions` filtered by `business_id`.
- iOS/Android purchases go through Apple/Google billing → `store-sync`. Do not include web checkout links in store
  builds (`PAYMENTS.md §2`).

---

## 7. Still open before launch (business decisions, not code)
Renewal policy for 12/24/36-month terms · VAT wording · NEXCut Business Terms of Service · app-store listing URLs ·
`store-sync` verification. Tracked in `CONFIGURATION_CHECKLIST.md`.
