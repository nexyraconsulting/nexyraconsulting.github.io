# NEXTime Rota & Timesheet

NEXTime is a multi-tenant SaaS product for rotas, timesheets, approvals and payroll-ready hours. Companies sign up, start a 14-day trial, invite their team and pay for a plan sized by active staff. It's a product of Nexyra Consulting.


## Navigation and product header

The top navigation and search are **not part of the NEXTime pages**. They are the shared Nexyra Consulting files in `public/assets/nav/`, identical to `/assets/nav/` on nexyraconsulting.co.uk, and `nextime/index.html` loads them with one line, exactly like NEXCut, NEXDrive and NEXHR:

```html
<script src="../assets/nav/nexyra-nav.js" data-active="products" data-product="nextime" defer></script>
```

| Shared file | Holds |
| --- | --- |
| `assets/nav/nexyra-nav.js` | behaviour: menu overlay, dropdowns, product drill-down, search box, light/dark tone, mobile |
| `assets/nav/nexyra-nav.css` | styles (loaded automatically by the script) |
| `assets/nav/nexyra-menu.js` | menu content. The only file to edit when the menu changes; NEXTime's entries are under `products` |
| `assets/nav/nexyra-search-engine.js`, `nexyra-search-index.js` | site search |

Menu links resolve against the site root (two folders above the script), so on nexyraconsulting.co.uk they reach the main site, and NEXTime links go to `/nextime/…`. Change the menu once in `nexyra-menu.js` and every product page picks it up. Below the navigation, the page shows the breadcrumbs Products / NEXTime (not links) followed by the NEXTime logo.

## Main features

**Product (unchanged from the single-user app)**
- Weekly rota: drag to move, Alt-drag to copy, repeat weekly, copy last week, shift templates, publish weeks
- Timesheets: actual start/finish/break, late and early flags, overnight-safe hours
- Week approval and locking, with reasons logged for any amendment
- Working-time rules (weekly maximum per contract, minimum rest, consecutive days)
- Leave, sickness and regular unavailable days; shift-swap requests
- Payroll CSV, A4 PDF reports, breakdowns by location, department and role
- Full activity (audit) history and settings

**SaaS layer**
- Marketing site with product and pricing pages
- Company sign-up, email verification, password reset
- Two-factor sign-in (TOTP authenticator apps); Owners can make it mandatory
- Roles: Owner, Admin, Manager, Employee. Employees get a read-only "My shifts" view
- Team invitations by email, linking logins to staff records
- Plans by active staff (Starter 10, Team 50, Business 200, Enterprise), monthly or yearly
- Payment by card, Apple Pay, Google Pay (Stripe), Direct Debit (GoCardless) or annual invoice (Stripe Invoicing)
- Trial, past-due, expired, cancelled and suspended states, each with the right access rules
- Platform console for NEXTime staff: tenants, MRR, trials, suspensions

## Technology stack

| Layer | Technology |
| --- | --- |
| Front end | Static HTML pages, React 18. `index.html` loads the shared Nexyra navigation and runtime from `/assets/`; `account.html`, `app.html` and `console.html` are self-contained bundles. No build step |
| Hosting | Any static host with HTTPS: Apache, Nginx, Netlify, Vercel, Cloudflare Pages, S3 + CloudFront |
| Database | PostgreSQL 15, managed by **Supabase** |
| Auth | Supabase Auth (email + password, TOTP MFA) |
| Server logic | Supabase Edge Functions (Deno / TypeScript) |
| Payments | Stripe (cards, wallets, invoices) and GoCardless (Direct Debit) |
| Email | Supabase Auth SMTP (auth emails) and Resend API (transactional) |
| Scheduling | pg_cron + pg_net |

## Project structure

```text
nextime/
├── README.md                    this file
├── DEPLOYMENT.md                step-by-step production deployment
├── DEVELOPER_HANDOVER.md        what to know before taking over; wiring guide
├── DATABASE_SETUP.md            tables, fields, relationships, indexes, RLS, migrations
├── API_DOCUMENTATION.md         every RPC, table endpoint and edge function
├── CONFIGURATION_CHECKLIST.md   every value to provide, required vs optional
├── .env.example                 server-side secrets template
│
├── public/                      ← merge into the Nexyra web root (same layout as nexyraconsulting.co.uk)
│   ├── assets/                  SHARED with the Nexyra site — already on the server; identical copies
│   │   ├── nav/                 nexyra-nav.js, nexyra-nav.css, nexyra-menu.js, nexyra-search-engine.js, nexyra-search-index.js
│   │   └── js/                  dc-runtime-2e38395c4a.js, react + react-dom 18.3.1
│   └── nextime/                 the product, served at /nextime/
│       ├── index.html           website: product (#/), pricing (#/pricing), FAQ (#/faq); loads ../assets/nav and ../assets/js
│       ├── account.html         sign up, sign in, 2FA, invitations, password reset
│       ├── app.html             the NEXTime application
│       ├── .htaccess            HTTPS, security headers, CSP, caching (Apache), clean URLs under /nextime/
│       ├── robots.txt
│       ├── assets/              fonts/, brand/ (icon, logos), img/ (marketing screenshot) used by index.html
│       ├── config/app-config.js public runtime configuration (edit after upload)
│       ├── js/nextime-saas.js   prototype account/workspace/billing layer used by index.html
│       ├── js/nextime-supabase.js  production client for Supabase, Stripe and GoCardless
│       └── admin/               platform console (password-protected)
│           ├── console.html
│           ├── .htaccess
│           └── config/app-config.js
│
├── supabase/                    Supabase CLI project
│   ├── config.toml
│   ├── migrations/0001_initial.sql, 0002_payment_methods.sql
│   ├── seed.sql
│   └── functions/               edge functions (one folder each) + _shared/
│
├── database/                    same SQL as one file, for manual installs
│   ├── schema.sql
│   └── seed.sql
│
└── source/                      editable sources of the pages (not deployed)
```

Each page opens with the Nexyra brand loader, an animated violet "N" on white. It fades out once the page has rendered, stays up for at least 0.5 s, gives up after 6 s at most and holds still when the user has reduced motion turned on. It's inline markup at the top of `<body>` in each page.

`index.html` loads its fonts, logos and screenshot from `nextime/assets/`, and the navigation and runtime from the shared `/assets/`. `account.html`, `app.html` and `console.html` still embed everything. No file-upload storage is used.

## System requirements

- A static web host with HTTPS (TLS 1.2+), able to serve `.html` and `.js` files
- A Supabase project (Free tier is fine for testing; Pro tier recommended for production: daily backups, PITR, no pausing)
- Stripe account and/or GoCardless account
- An email-sending domain (Resend, Postmark, SES or SMTP)
- For deployment from a workstation: Node 18+ and the Supabase CLI 1.200+ (`npm i -g supabase`), Deno 1.40+ optional for local function testing
- Browsers: current Chrome, Edge, Firefox, Safari (desktop and mobile)

## Two run modes

| | Prototype mode (`demoMode: true`, default) | Production mode (`demoMode: false`) |
| --- | --- | --- |
| Where data lives | Visitor's browser (localStorage) | Supabase Postgres |
| Emails | Shown in the on-screen **Demo inbox** | Real emails |
| Payments | Simulated | Stripe and GoCardless |
| Backend needed | None | Supabase + functions |

**Important:** the pages currently run on the browser-storage layer. Switching to production mode means connecting the pages to `js/nextime-supabase.js`. That's a defined, bounded task described in **DEVELOPER_HANDOVER.md section 4**. The database, security rules, server functions and client adapter are all included and ready.

## Installation (quick start)

```bash
# 1. Database + functions
supabase login
supabase link --project-ref YOUR-PROJECT-REF
supabase db push                       # applies supabase/migrations
psql "$SUPABASE_DB_URL" -f supabase/seed.sql   # after editing price ids
cp .env.example supabase/.env          # fill in values
supabase secrets set --env-file supabase/.env
supabase functions deploy              # deploys every function in supabase/functions

# 2. Front end
#    edit public/nextime/config/app-config.js, then upload public/nextime/ to /nextime/ on the Nexyra web root
#    (public/assets/ is already on nexyraconsulting.co.uk; upload it only to a server that lacks it)
```

Full detail is in **DEPLOYMENT.md**.

## Local development

```bash
# Static pages: serve public/ (it mirrors the Nexyra web root), then open /nextime/
npx serve public            # or: python3 -m http.server 8080 --directory public
                            # → http://localhost:3000/nextime/

# Local Supabase (Docker required)
supabase start              # local Postgres, Auth, Studio on http://localhost:54323
supabase db reset           # re-applies migrations + seed
supabase functions serve --env-file supabase/.env
```

For local testing set `appOrigin`, `supabaseUrl` and `functionsUrl` in `public/nextime/config/app-config.js` to the values printed by `supabase start`. Stripe webhooks locally: `stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook`.

Opening the HTML files straight from disk (`file://`) works in prototype mode, but use a local server so `config/app-config.js` loads reliably.

## Environment variables

- **Server secrets:** `.env.example` (loaded into Supabase function secrets)
- **Public browser values:** `public/nextime/config/app-config.js`

Both are explained line by line in **CONFIGURATION_CHECKLIST.md**.

## Build / deployment process

There's no build step for deployment: the HTML files are pre-built. The database and functions deploy with the Supabase CLI. To change the UI, edit the sources in `source/` (see DEVELOPER_HANDOVER.md section 6) and replace the files in `public/nextime/`. Navigation changes are made in the shared `/assets/nav/nexyra-menu.js`, not in NEXTime.

## Starting the application

- Website: `https://nexyraconsulting.co.uk/nextime/` · pricing `/nextime/#/pricing` · FAQ `/nextime/#/faq` (deep links such as `#/pricing/ways-to-pay`, `#/faq/can-we-cancel`)
- Sign in / sign up: `/nextime/account.html`
- App: `/nextime/app.html` (redirects to sign-in when signed out)
- Platform console: `/nextime/admin/console.html`

## Updating

1. Database: add a new numbered file to `supabase/migrations/` and run `supabase db push`. Never edit an applied migration.
2. Functions: `supabase functions deploy <name>`.
3. Front end: replace the changed files in `/nextime/`. `.html` and `.js` are served `no-cache`, so users get the new version on their next load.
4. Config only: edit `config/app-config.js` on the server; no redeploy needed.

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Blank page | JavaScript blocked by CSP | Check the browser console; update `connect-src`/`script-src` in `nextime/.htaccess` with your Supabase ref |
| No top navigation on the website | `/assets/nav/` missing on the server, or `index.html` not two levels below it | Keep `nextime/` directly under the web root beside `assets/`; check `/assets/nav/nexyra-nav.js` loads |
| Sign-in loops back to the sign-in page | Session from another origin, or cookies/storage blocked | Serve every page from one origin over HTTPS; allow site storage |
| "Demo inbox" visible in production | `demoMode` still `true` | Set `demoMode: false` in **both** `config/app-config.js` files |
| CORS error calling functions | `APP_ORIGIN` mismatch | Set `APP_ORIGIN` to the exact origin (scheme + host, no slash) and redeploy functions |
| Webhook returns 400/498 | Wrong webhook secret | Copy the signing secret again from Stripe/GoCardless, `supabase secrets set`, redeploy |
| "billing fields are managed by NEXTime" | Client tried to change plan/status directly | Use the `billing-manage` function |
| "plan limit" on save | More active staff than the plan allows | Upgrade the plan or mark staff as Left |
| Console shows no workspaces (prototype) | Console opened on a different origin | Prototype data is per browser and origin; open it on the same site |
| Trial reminders not sent | Cron secret or URL wrong | See DATABASE_SETUP.md "Scheduled jobs"; check `cron.job_run_details` |

## Brand logos

All NEXTime logos in `brand/logos/` follow the NexDrive lockup format: the Nexyra "N" monogram at NexDrive's size beside a larger NEXTime wordmark, with no tagline. The vertical logos also have no tagline. The product line "Rota & timesheets" appears in the hero instead.
