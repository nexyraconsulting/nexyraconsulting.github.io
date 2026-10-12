# Configuration checklist — outstanding before production launch

## Commercial decisions (Nexyra)
- [x] Prices: £25/month · £240 (12 mo) · £420 (24 mo) · £540 (36 mo), matching NEXDrive
- [x] 12/24/36 billing mode: `upfront` (whole term billed once), matching NEXDrive
- [ ] Renewal behaviour for fixed terms (default shown: renews for the same term unless cancelled)
- [ ] VAT: prices inclusive or exclusive; VAT registration number on invoices (`vatNote`)
- [ ] Policy after trial for term changes and early cancellation of fixed terms
- [ ] Whether to mark a recommended option (`recommended`), only with a supported reason

## Legal
- [ ] NEXCut Business Terms of Service (subscription, trial, auto-renewal, cancellation) → `termsUrl`, `termsVersion`
- [ ] Privacy notice update covering NEXCut billing data and Stripe as processor
- [ ] Review against UK subscription-contract rules for any sole-trader customers

## Stripe
- [ ] Account activated (UK entity, UK bank account); Bacs Direct Debit enabled
- [ ] Products/Prices created (GBP); 24/36-month interval confirmed (see PAYMENTS §1)
- [ ] Apple Pay + Google Pay enabled; Customer Portal configured; Smart Retries on
- [ ] Webhook endpoint → `/functions/v1/stripe-webhook` with events: `checkout.session.completed`, `customer.subscription.created|updated|deleted|paused|resumed|trial_will_end`, `invoice.paid|payment_failed|upcoming`, `payment_method.attached`, `customer.updated`, `mandate.updated`
- [ ] `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` set as function secrets

## Supabase
- [ ] Project created (UK/EU region); migration applied; functions deployed
- [ ] `js/config.js`: `supabaseUrl`, `supabaseAnonKey`
- [ ] Auth: email confirmation on; SMS provider for mobile OTP (Twilio Verify per blueprint)
- [ ] Cron for `send-notifications` (every 5 min) with `CRON_SECRET`
- [ ] Bot protection on `create-checkout` (Cloudflare Turnstile or hCaptcha) and rate limiting

## Email
- [ ] Postmark server + sender domain (SPF/DKIM) + 8 templates (aliases in `send-notifications`)

## App stores
- [ ] Apple: 4 auto-renewable subscriptions with 2-week free-trial offers; App Store Server Notifications V2 URL → `store-sync`; API key
- [ ] Google: subscription with 4 base plans + 14-day free-trial offers; RTDN Pub/Sub push → `store-sync`; service account
- [ ] Implement signature/API verification in `store-sync` (currently a skeleton that returns 501)
- [ ] App-store listing URLs → `js/config.js`

## Website
- [ ] Switch pages to `/assets/nav/nexyra-nav.js` and copy the updated `assets/nav/` files to the main site (`DEPLOYMENT.md §1.3–1.4`); add NEXCut to the sitemap
- [ ] Replace demo iframes (`customerDemoUrl`, `businessDemoUrl`) with production demo builds or screenshots
