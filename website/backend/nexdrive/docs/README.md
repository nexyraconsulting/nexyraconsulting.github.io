# NexDrive

Business management for independent UK driving instructors: learners, lessons, bookings, pricing, discounts, learner messaging and navigation hand-off. A Nexyra product.

This package is the **design-complete front end** (an interactive, high-fidelity application running on in-memory demo data), plus everything a developer needs to build the backend and database and take it to production.

> **Status:** front end = production-quality UI and full interaction logic, *demo data only*. Backend, database, payments and messaging are **specified here but not yet implemented**. See [docs/developer-guide.md](docs/developer-guide.md) §4 for the integration seam.

## Quick start

```bash
cd nexdrive
npx serve .            # or: python3 -m http.server 8080
# open http://localhost:3000 (serve) or http://localhost:8080
```

No build step is needed. `index.html` also opens directly from disk (double-click), but serving over HTTP(S) is recommended and is required for production.

| Page | Purpose |
| --- | --- |
| `index.html` | The NexDrive app. Opens straight to the launch animation → dashboard (no admin PIN). On wide screens a demo panel lists every workflow. |
| `product/index.html` | Public product page for the Nexyra site: toolkit, refer & earn, pricing, 14-day trial (live dates), FAQ, live app demo. |
| `design-system.html` | Visual reference: logo, colour, type, components, empty and error states. |

## Folder structure

```
nexdrive/
├── index.html                 App entry point (reads ?ref=CODE for referral links)
├── product/                   Public product page (Nexyra site) — static, no build
│   ├── index.html             Set <body data-app-url> to the app's URL
│   ├── css/product.css · js/product.js · js/search-*.js
│   └── img/                   Nav preview photography
├── design-system.html         Living design-system reference
├── CHANGELOG.md               What changed in each package
├── manifest.webmanifest       PWA manifest
├── css/nexdrive-base.css      Self-hosted font, design tokens, element reset
├── js/
│   ├── config.js              Public runtime config (mode, apiBaseUrl, referralBaseUrl, demo panel…)
│   ├── nexdrive-runtime.js    Component runtime
│   └── vendor/                React 18.3.1, ReactDOM, qrcode-generator 1.4.4
├── fonts/                     Hanken Grotesk variable woff2 (SIL OFL 1.1)
├── brand/
│   ├── BRAND_GUIDELINES.md    Brand foundations
│   ├── design-system.md       Component catalogue (incl. referral & credit)
│   ├── logos/ · icons/ · tokens/tokens.json
├── data/sample-data.json      Demo data in API v1 shape (incl. referralProgramme)
├── api/api-documentation.md   REST API
├── database/
│   ├── database-schema.md · database-tables.md · relationships.md
│   ├── migrations/001_initial_schema.sql · 002_referral_programme.sql
│   └── seeds/001_subscription_plans.sql · 002_demo_data.sql
├── docs/
│   ├── business-rules.md · user-flows.md · developer-guide.md
│   └── environment.md · deployment.md · security.md
├── deploy/nginx.conf.example
├── docker-compose.yml · .env.example · .gitignore
└── README.md
```

## Documentation

| File | Covers |
| --- | --- |
| [docs/business-rules.md](docs/business-rules.md) | Every product rule: lessons, subscriptions, referral programme, credit |
| [docs/user-flows.md](docs/user-flows.md) | Step-by-step flows, including referral and credit |
| [docs/developer-guide.md](docs/developer-guide.md) | Architecture, how the front end is built, local setup, API integration, jobs, product page (§12) |
| [database/database-schema.md](database/database-schema.md) | Schema overview, DB-enforced rules, encryption, migrations, ledger posting |
| [database/database-tables.md](database/database-tables.md) · [relationships.md](database/relationships.md) | Column reference · cardinality and delete rules |
| [api/api-documentation.md](api/api-documentation.md) | REST endpoints, payloads, errors, auth |
| [docs/environment.md](docs/environment.md) · [deployment.md](docs/deployment.md) · [security.md](docs/security.md) | Config, hosting, data protection |
| [brand/BRAND_GUIDELINES.md](brand/BRAND_GUIDELINES.md) · [design-system.md](brand/design-system.md) | Visual language and components |

## Referral programme

Every instructor gets a unique code (e.g. `NEXDANIEL25`), a link and a QR code. A new instructor who joins with it gets **14-day trial + 1 month free**. The referrer earns **20% of the new instructor's first subscription as NexDrive Credit**, awarded only after the first payment is confirmed and the 14-day refund window passes. Credit doesn't expire and can be used on the referrer's own subscription. The backend owns every calculation. See [business-rules §3](docs/business-rules.md#3-referral-programme).

## Core workflows (must stay fast)

1. Add learner → schedule lesson → notify learner
2. Open lesson → view location → navigate (Google Maps hand-off)
3. Select learner → book multiple lessons → apply discount → send details
4. Get code → share code/QR → instructor joins → earn 20% NexDrive Credit → use it on your subscription

## Third-party

React (MIT), Hanken Grotesk (SIL Open Font License 1.1), Lucide icons (ISC). The Nexyra monogram is Nexyra Consulting property.

## Open questions

- **Nexyra domain.** All Nexyra links use `https://nexyraconsulting.co.uk/<page>.html`, matching the live site's file names. Confirm the domain before go-live (one constant in `product/js/product.js` plus the footer links).
- **Production app URL.** `product/index.html` points at `../index.html`; set `data-app-url` to the real app URL.

## Assumptions

Listed in [docs/developer-guide.md §9](docs/developer-guide.md#9-assumptions). The most important ones: subscription prices are placeholders, and no payment, SMS or e-mail provider has been contracted yet.
