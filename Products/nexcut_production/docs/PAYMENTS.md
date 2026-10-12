# Payments: provider evaluation, app-store rules and implementation

Checked 11 October 2026. Re-check fees and store rules before launch; both change.

## 1. Recommendation

**Stripe Billing + Stripe-hosted Checkout + Customer Portal** for the website (Route B), with **Apple In-App Purchase**
and **Google Play Billing** for subscriptions started inside the NEXCut Business app (Route A). All three write
the same `public.subscriptions` row (one per business), so status is identical on every device.

### Why Stripe (vs the alternatives considered)

| Need | Stripe | GoCardless | Paddle (merchant of record) |
|---|---|---|---|
| Recurring subscriptions, trials, trial→paid | Native (`trial_period_days`, `trial_settings`) | Direct Debit only | Native |
| Cards + Apple Pay + Google Pay | Yes, in hosted Checkout | No cards | Yes |
| UK Bacs Direct Debit | Yes, hosted mandate | Yes (specialist) | Limited |
| Customer self-service (update method, invoices, cancel) | Customer Portal | Partial | Yes |
| Fits existing plan (blueprint D5: Stripe Connect for deposits) | Same account/vendor | Separate | Separate |

Paddle is worth reconsidering only if Nexyra wants a merchant of record to handle VAT for them.

### Fees found (UK, standard pricing — confirm on stripe.com/gb/pricing)
- Standard UK cards: 1.5% + 20p. EU cards 2.5% + 20p.
- Bacs Direct Debit: 1%, minimum 20p, capped at £4.00 per payment.
- Stripe Billing has its own fee on recurring revenue — check the current rate for your account.

### Capabilities confirmed in Stripe’s documentation
- Checkout in `mode=subscription` with `subscription_data.trial_period_days=14` collects a payment method and charges nothing until the trial ends.
- `trial_settings.end_behavior.missing_payment_method=cancel` cancels at trial end if no method exists (our safety net).
- `customer.subscription.trial_will_end` fires about 3 days before the trial ends (drives the reminder email).
- Bacs: Stripe-hosted Checkout is the Bacs-compliant way to collect a mandate (custom Bacs forms need Stripe sales approval) and can save details in advance for a free trial. Stripe sends the mandate confirmation and advance notices. Bacs must be activated on the account and needs a UK bank account on the customer side; collections take ~3 working days to confirm, so `invoice.paid` (not checkout) is the source of truth for a successful payment.

### Must verify in the Dashboard before launch
- Recurring price interval for 24 and 36 months (`interval=month`, `interval_count=24/36`). If the account will not accept it, use a 12-month price inside a Subscription Schedule for the term.
- Apple Pay / Google Pay enabled under Payment methods (hosted Checkout shows them on supported devices).
- Customer Portal configuration: allow update payment method, view invoices; set cancellation to “at end of period”; **do not** allow plan switching (term changes go through `/subscription` so commitment rules are enforced).
- Smart Retries + failed-payment emails on; “Cancel subscription after all retries fail” → mark unpaid.

## 2. App-store rules (Route A)

- **Apple:** Guideline 3.1.1 requires In-App Purchase to unlock features or subscriptions used in the app. 3.1.3(b) *Multiplatform Services* lets the app honour a subscription bought on the website **only if it is also available as an In-App Purchase**. 3.1.3(c) *Enterprise Services* (sold only to organisations for their staff) is a weak fit for a self-serve salon subscription — do not rely on it. On the **UK** storefront the anti-steering rule still applies: the iOS app must not link to or promote the web checkout. (The US storefront allows links; the UK CMA consulted on removing UK steering restrictions in June–July 2026 but had published no decision at the time of checking.)
- **Google Play:** the Payments policy lists *cloud software and services (business productivity software)* among purchases that must use Play Billing in Play-distributed apps. UK alternative/user-choice billing availability should be checked in Play Console for the account.
- **Consequence for the build**
  - iOS: auto-renewable subscriptions for the four terms, each with a **2-week free trial introductory offer**. StoreKit 2 → `store-sync`.
  - Android: Play subscription with four base plans, each with a **14-day free-trial offer**. Play Billing → `store-sync`.
  - In both apps: **no Apple Pay / Google Pay / card / Direct Debit / web checkout links**. A business that subscribed on the website simply signs in; the app reads `GET /subscription` and unlocks.
  - Store prices are set in store price tiers and may differ slightly from web prices; the pricing page says so.
  - Store commission applies (Small Business Program rates may reduce it) — factor it into app prices.
  - Optional: RevenueCat can replace `store-sync` and normalise both stores’ entitlements.

## 3. Trial lifecycle (all channels)

```
incomplete ──checkout/store purchase confirmed──▶ trialing (trial_start = activation, trial_end = +14 days)
trialing ──owner cancels──▶ trial_cancelled ──trial_end──▶ (Stripe deletes sub, no invoice) cancelled/ended, has_access=false
trialing ──trial_end, method OK──▶ active (first invoice) ──invoice.paid──▶ active
active ──invoice.payment_failed──▶ past_due ──retries succeed──▶ active │ retries exhausted──▶ expired
active ──owner cancels──▶ active + cancel_at_period_end ──period end──▶ cancelled
```
- The trial starts at **activation** (web: Checkout completed and method saved; app: store purchase confirmed) — never at app download.
- `trial_end - trial_start = 14 days` is enforced by a database constraint.
- Cancel during trial = `cancel_at_period_end=true` while trialing → Stripe ends it at `trial_end` without invoicing. No conversion, no charge.
- `business_entitlements.has_access` is the only access rule. Past-due keeps access during retries (the booking page stays live).

## 4. What the code does

| Concern | Where |
|---|---|
| Server-side price lookup (never trust the browser) | `create-checkout` reads `billing_terms` |
| Duplicate prevention | `subscriptions.business_id UNIQUE`; `create-checkout` 409 on existing email; `store-sync` 409 if a web subscription exists |
| Consent audit (terms, privacy, trial terms, marketing) | `consents` table |
| Webhook security + idempotency | signature check; `billing_events` primary key |
| Status sync to devices | `subscriptions` in the Realtime publication; apps subscribe to their row |
| Billing history / receipts | `invoices` table + Customer Portal |
| Notifications | `notifications_outbox` → `send-notifications` (Postmark) |
| No raw card/bank data stored | Only Stripe IDs and last-4 labels are stored |

## 5. Plans (single source)

`js/nexcut-plans.js` is what the website and the app **display**. `public.billing_terms` is what the server **charges**.
When prices are confirmed: update both (same values), create Stripe Prices (GBP, tax behaviour set), and paste each
`price_…` id into `billing_terms.stripe_price_id`. Store product IDs go in `apple_product_id` / `google_product_id`.
