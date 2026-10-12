# Testing and acceptance status

Legend: **✔ Done** = built and checked in this package (demo mode) · **⚙ Needs config** = code written, runs once
credentials/prices are set · **◻ Placeholder** = clearly-labelled stand-in, needs content or a decision.

| Acceptance criterion | Status | How it is met / how to test |
|---|---|---|
| NEXCut under Products in the Nexyra navigation | ✔ | Shared `assets/nav/nexyra-nav.js` + `nexyra-menu.js` (same as main site) |
| Customer page says NEXCut is free; no plans or trial messaging | ✔ | `customers.html`; sub-nav CTA is “Get the app” |
| Business page explains product and trial | ✔ | `business.html` §02 timeline, terms, five steps |
| Four billing options shown correctly | ✔ (prices ◻) | Cards + billing table render from `nexcut-plans.js` |
| Plan selection leads to checkout with that plan | ✔ | `checkout.html?plan=m24` preselects; can change at step 1 |
| Trial starts at activation, dates recorded | ⚙ | `checkout.session.completed` → `trial_start/trial_end` from Stripe; DB constraint = 14 days |
| No charge during the trial | ⚙ | Stripe trial; “Due today £0.00”; £0 trial invoice ignored |
| Cancel in trial prevents conversion | ⚙ | `POST /subscription {action:"cancel"}` → `cancel_at_period_end` while trialing; test with Stripe test clock |
| Trial converts when not cancelled | ⚙ | Test clock: advance 14 days → `invoice.paid` → `active` |
| Payment failure, cancellation, status changes | ⚙ | Test cards `4000 0000 0000 0341` (attach ok, charge fails); Bacs test sort code `108800` |
| Website ⇄ app consistency | ⚙ | One `subscriptions` row per business; app reads `GET /subscription` + Realtime |
| Responsive desktop / tablet / mobile | ✔ | Check at 1440, 1024, 768, 390 px |
| Links, buttons, forms, errors | ✔ | Step 2 validation + error summary; step 3 required consents; back/forward |
| Existing Nexyra pages unaffected | ✔ | Self-contained folder; main-site change is additive (one array entry) |
| App store purchase (Route A) | ⚙ / ◻ | `store-sync` skeleton returns 501 until verification is implemented |
| Emails (trial started, ending, failed, receipt…) | ⚙ | Outbox + Postmark; templates to create |

## Stripe test plan (test mode + test clocks)
1. Start checkout for each term with a card → confirm `trialing`, dates = activation + 14 days.
2. Repeat with Bacs Direct Debit (test sort code / account from Stripe docs).
3. Cancel during trial → `trial_cancelled`; advance clock past trial end → no invoice, `has_access=false`.
4. Do not cancel → advance clock → first invoice paid → `active`; receipt email queued.
5. Use a card that fails on charge → `past_due` → payment-failed email → update method in Portal → retry succeeds.
6. Replay a webhook from the Dashboard → second delivery is ignored (`billing_events`).
7. Try to register the same email twice → 409, no second subscription.
