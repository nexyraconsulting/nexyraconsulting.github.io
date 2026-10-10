# NEXYRA Consulting website: production package

The public website for NEXYRA Consulting (consulting services, case studies, insights, careers, contact), plus the three NEXYRA products served from sub-folders of the same site:

| Product | Live path | What it is | Current mode |
| --- | --- | --- | --- |
| NEXDrive | `/nexdrive/` (app), `/products-nexdrive.html` (product page) | Booking, learner and billing app for driving instructors | Demo (in-browser sample data) |
| NEXHR | `/nexhr/` | All-in-one HR workspace: people, time, leave, rota, documents, payslips | Demo (in-browser) |
| NEXTime | `/nextime/` | Rota, timesheet and leave SaaS with billing | Demo (in-browser) |

The marketing website is fully production-ready as a static site. The three product front ends run in **demo mode** until each product's backend is deployed and connected (see DEVELOPER_HANDOVER.md, section 3).

## Main features

- 30 static pages (home, about, services + 11 service detail pages, work, pricing, insight, careers, contact, location, legal pages, sitemap, 404, NEXDrive product page)
- Shared navigation with a three-level Products menu (Products > product > product pages), keyboard and touch support
- Site search (client-side index), animated hero, page loader, reduced-motion support
- Contact form posting to Web3Forms (no server required)
- Self-hosted fonts and scripts; no CDN dependency for the marketing site

## Technology stack

| Layer | Technology |
| --- | --- |
| Website | Static HTML, React 18 (self-hosted UMD), DC page runtime (`assets/js/dc-runtime-*.js`), no build step |
| Contact form | Web3Forms (third-party HTTPS form API) |
| NEXHR backend | Node.js 20 + Express, PostgreSQL 15+ with row-level security, Stripe, SMTP, cron |
| NEXTime backend | Supabase (PostgreSQL 15, Auth, Edge Functions in Deno/TypeScript, pg_cron), Stripe, GoCardless, Resend |
| NEXDrive backend | Specified, not yet implemented: PostgreSQL 15 schema + REST API spec (Node.js recommended), Redis, Stripe, Twilio, S3-compatible storage |

## Project structure

```text
nexyra_consulting/
├── README.md                    this file
├── DEPLOYMENT.md                step-by-step production deployment
├── DEVELOPER_HANDOVER.md        what to know before taking over
├── DATABASE_SETUP.md            all three product databases
├── API_DOCUMENTATION.md         all endpoints (summary + links to full specs)
├── CONFIGURATION_CHECKLIST.md   every value to provide, Required vs Optional
├── .env.example                 index of every environment variable
│
├── public_html/                 THE WEB ROOT: upload the contents to the domain root
│   ├── index.html, *.html       website pages
│   ├── .htaccess                Apache/LiteSpeed config (HTTPS, 404, headers)
│   ├── assets/                  images (top level + img/), css/, fonts/, js/, components/
│   ├── brand/                   logos, favicon, icons
│   ├── nexdrive/                NEXDrive app (front end)
│   ├── nexhr/                   NEXHR front end
│   └── nextime/                 NEXTime front end (+ admin/ console, own .htaccess)
│
└── backend/                     NEVER upload into the web root
    ├── nexhr/                   server/, database/, config/, scripts/, docs/, .env.example
    ├── nextime/                 supabase/ (functions, migrations), database/, docs/, .env.example
    └── nexdrive/                api/ (spec), database/ (migrations, seeds), config/, docs/, .env.example
```

`public_html/` and `backend/` are separated on purpose: backend code, SQL and secrets must never be reachable over HTTP.

## System requirements

- **Website only:** any static host or web server serving HTTPS (Apache 2.4 / LiteSpeed / Nginx / Netlify / Cloudflare Pages / Vercel). No PHP, no database.
- **NEXHR backend:** Linux server, Node.js 20 LTS, PostgreSQL 15+, Nginx, a wildcard TLS certificate, SMTP account, Stripe account.
- **NEXTime backend:** a Supabase project (hosted), Supabase CLI on the deploy machine, Stripe and/or GoCardless account, Resend account.
- **NEXDrive backend:** to be built against `backend/nexdrive/api/api-documentation.md`; PostgreSQL 15+, Redis 7.

## Installation and local development

```bash
# Website (no build): serve public_html on any local static server
cd public_html
python3 -m http.server 8000      # then open http://localhost:8000
```

Pages must be served over HTTP(S), not opened as `file://`, because pages load shared components with fetch.

Backends: follow `backend/<product>/docs/README.md` for local setup of each product.

## Environment variables

The website itself has no server environment. Its only setting is in `public_html/assets/js/site-config.js` (Web3Forms key). Product settings are listed in `.env.example` and in full in CONFIGURATION_CHECKLIST.md.

## Database setup

The website has no database. Each product has its own PostgreSQL database; see DATABASE_SETUP.md.

## Build and deployment

There is no build step. Upload the **contents** of `public_html/` to the web root. Full steps: DEPLOYMENT.md.

## Starting the application

- Website: starts as soon as the files are served.
- NEXHR API: `systemctl start nexhr-api` (unit file in `backend/nexhr/config/`).
- NEXTime: `supabase db push` and `supabase functions deploy` (see DEPLOYMENT.md section 8).

## Updating the application

Replace the changed files in the web root (keep `assets/js/site-config.js` and the product `config` files you edited). HTML and JS are served with `Cache-Control: no-cache`, so visitors get updates immediately. See DEPLOYMENT.md section 15.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Blank page, header missing | Files opened from disk, or `assets/components/*.dc.html` not uploaded. Serve over HTTP and upload every file. |
| 404 page unstyled | `404.html` uses `<base href="/">`; if the site is in a sub-folder, change it to that folder. |
| Contact form says "not configured" | Set `web3formsAccessKey` in `assets/js/site-config.js`. |
| 500 error on Apache | A directive in `.htaccess` isn't allowed by the host. Remove the `<IfModule mod_headers.c>` block and retest. |
| `.htaccess` missing after upload | It is a hidden file: enable "Show hidden files" in the file manager / FTP client. |
| NEXTime `/nextime/pricing` loops | `mod_rewrite` disabled, or NEXTime moved to another path: update `RewriteBase` in `nextime/.htaccess`. |
