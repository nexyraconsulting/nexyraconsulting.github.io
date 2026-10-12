# NEXCut — product pages, pricing, checkout and subscription backend

Part of the Nexyra Consulting website. These pages use the shared Nexyra navigation + search (same files as the
main site), plus the Nexyra footer, typography and product-page layout.

**Developer: start with `docs/DEPLOYMENT.md`** — the step-by-step deployment guide.

## What is in this folder

```
product/
  index.html        NEXCut overview (both audiences)
  customers.html    NEXCut for customers — free, no plans or trial messaging
  business.html     NEXCut Business — features, 14-day trial terms, plans, FAQ
  pricing.html      Monthly / 12 / 24 / 36-month options, billing table, trial, FAQ
  checkout.html     5-step registration + checkout (plan → account → terms → payment → confirmation)
css/product.css     Footer + page system + NEXCut additions
js/
  config.js         PUBLIC runtime config (Supabase URL + anon key, store links, legal URLs)
  nexcut-plans.js   SINGLE SOURCE for terms shown on the site and in the NEXCut Business app
  product-page.js   FAQ, dates, plan cards, store buttons (navigation is shared: assets/nav/, see docs/NAV_INTEGRATION.md)
  checkout.js       Checkout journey (live mode via Edge Functions, or clearly-labelled demo mode)
assets/
  nav/              Shared Nexyra nav + search (copy of the main site's /assets/nav/, menu links updated for NEXCut)
  css/, fonts/      Hanken Grotesk
  icons/, logos/    Lucide icons, Nexyra logos
.htaccess           /nexcut/ redirects, blocks supabase/ + docs/, caching headers
supabase/
  migrations/20261011120000_billing.sql   terms, subscriptions (1 per business), invoices, consents, events, outbox, RLS, entitlement view
  functions/        create-checkout · stripe-webhook · checkout-status · subscription · store-sync · send-notifications
docs/               PAYMENTS · CONFIGURATION_CHECKLIST · DEPLOYMENT · TESTING · NAV_INTEGRATION
.env.example        Server secrets template (no real values)
```

## Where it goes on nexyraconsulting.co.uk

Upload the folder as `/nexcut/` (pages at `/nexcut/product/business.html` etc.). All paths inside are relative.
Then switch the pages to the main site's `/assets/nav/` and update the main site's menu files (`docs/DEPLOYMENT.md §1.3–1.4`).

## Modes

| Mode | When | What happens |
|---|---|---|
| **Demo** | `js/config.js → supabaseUrl: null` (as shipped) | Every page works. Checkout walks through all 5 steps with a black **DEMO MODE** banner; no account, email or payment method is created. |
| **Live** | `supabaseUrl` + `supabaseAnonKey` set, functions deployed, Stripe configured, prices set | Step 4 creates the account and opens Stripe Checkout; the webhook records the trial; step 5 confirms it. Checkout refuses to start while any selected price is still `null`. |

## Placeholders still in place (do not launch without these)

- **Prices** are set to match NEXDrive (£25 monthly; £240 / £420 / £540 for 12 / 24 / 36 months, billed once per term). Create the matching Stripe Prices and store products before launch.
- **Renewal** behaviour for fixed terms and **VAT** wording.
- **NEXCut Business Terms of Service** (`termsUrl`). The checkbox text says “(to be published)” until set.
- **App Store / Google Play URLs** for both apps (buttons show “Coming soon · link to be added”).
- Store billing (Route A on iOS/Android) — see `docs/PAYMENTS.md`.

Full list: `docs/CONFIGURATION_CHECKLIST.md`. Status of every acceptance criterion: `docs/TESTING.md`.
