# Developer handover

## 1. What you are taking over

- **NEXYRA Consulting website** (`public_html/`): finished, static, production-ready. 30 pages, no build, no database.
- **Three product front ends** inside the site: `/nexdrive/`, `/nexhr/`, `/nextime/`. All three run in **demo mode** (data in the visitor's browser, simulated email/payments).
- **Product backends** (`backend/`): NEXHR has working server code; NEXTime has Supabase migrations + Edge Functions; NEXDrive has a schema and API **specification only**.

## 2. How the website is built

- Each `*.html` page is pre-rendered markup plus a small logic block, executed by `assets/js/dc-runtime-2e38395c4a.js` with React 18 (self-hosted in `assets/js/`).
- Shared parts are loaded at runtime from `assets/components/`:
  - `Nav-v2-46414690b2.dc.html`: header, full-screen menu, Products menu, search. **Products links live in the `PRODUCTS` array** near the top of its script.
  - `Footer-v3-f7036af1a1.dc.html`: footer.
  - `Service-Page-3de9921c13.dc.html`: template for the 11 service pages (content per page in its `SERVICES` data).
- Each page maps the components' original names to these files via `window.__resources` in its `<head>`; keep the file names or update every page's map.
- Search: `assets/js/zx-search-index.js` (content) + `zx-search-engine.js`. Add new pages to the index.
- Pages must be served over HTTP(S) (components are fetched).

## 3. Taking each product out of demo mode

| Product | Steps | Effort |
| --- | --- | --- |
| NEXHR | Deploy server (DEPLOYMENT.md §8), then wire `nexhr/assets/js/platform.js` + `app.html` to the API per `backend/nexhr/docs/INTEGRATION_GUIDE.md`; set `mode: 'api'`. Point nav "Start free trial"/"Sign in" to the production NEXHR domain. | Medium |
| NEXTime | Create Supabase project, `db push`, deploy functions, set secrets and webhooks, fill `nextime/config/app-config.js` (+ admin copy), `demoMode: false`. Follow `backend/nextime/docs/DEVELOPER_HANDOVER.md` §4 for the front-end wiring. | Medium |
| NEXDrive | Implement the API from the spec, then `mode: 'live'` + `apiBaseUrl` in `nexdrive/js/config.js`; set `showDemoPanel: false`. | Large |

## 4. Authentication and permissions

| System | Method | Roles |
| --- | --- | --- |
| Website | none (public) | — |
| NEXTime admin console | HTTP Basic auth via `nextime/admin/.htaccess` + Supabase `platform_admins` | NEXTime staff |
| NEXHR | email + password (argon2id) + mandatory-capable TOTP, server sessions in HttpOnly cookies | employee, manager, hr, admin |
| NEXTime | Supabase Auth + optional MFA, RLS | owner, admin, manager, employee; platform admin |
| NEXDrive | JWT access + rotating refresh tokens, phone verification | instructor |

## 5. Third-party services

| Service | Used by | Purpose |
| --- | --- | --- |
| Web3Forms | Website | Contact form email delivery |
| Stripe | NEXHR, NEXTime, NEXDrive | Subscriptions, cards, invoices |
| GoCardless | NEXTime | Direct Debit |
| SMTP provider | NEXHR | Verification, invitations, resets |
| Resend | NEXTime | Trial reminders, invites |
| Twilio | NEXDrive | SMS / WhatsApp lesson messages |
| S3-compatible storage | NEXDrive | Photos |
| Supabase | NEXTime | DB, auth, functions |

## 6. Scheduled tasks / background processes

| Product | Job | Schedule |
| --- | --- | --- |
| NEXHR | `jobs.js seats` (sync billable seats) | hourly :15 |
| NEXHR | `jobs.js cleanup` (expired sessions/tokens) | daily 03:30 |
| NEXHR | `jobs.js trial-reminders` | daily 09:00 |
| NEXHR | API process | systemd `nexhr-api.service` (always on) |
| NEXTime | `scheduled-tasks` Edge Function | pg_cron (see its DATABASE_SETUP.md) |
| NEXDrive | lesson reminders, message queue, referral hold release | to be implemented (Redis queue) |

## 7. File uploads and storage

- Website: none.
- NEXHR: `STORAGE_DIR` (private, outside web root), 10 MB limit, signed download URLs (`FILE_URL_SECRET`), optional virus-scan hold.
- NEXTime: none (workspace data stored as JSON snapshots in Postgres).
- NEXDrive: pre-signed PUT to S3-compatible bucket, JPEG/PNG/WebP ≤ 5 MB.

## 8. Security notes

- No secrets are in `public_html/`. Browser config files contain only public values (Web3Forms key, Supabase anon key, Stripe publishable key).
- Secrets live only in `backend/<product>/.env` (copied from `.env.example`) or Supabase secrets; never commit them.
- `.htaccess` blocks dotfiles, `.md`, `.sql`, `.ts`, `.env` etc. and forces HTTPS.
- Demo seed data (`seed.sql` / `002_demo_data.sql`) is for staging only.
- Full detail: `backend/nexhr/docs/SECURITY.md`, `backend/nexdrive/docs/security.md`.

## 9. Known limitations / outstanding items

1. All three products are demo-mode front ends; no live sign-up or payment is possible yet.
2. NEXDrive backend is not implemented (specification + schema only).
3. NEXHR production expects its own wildcard domain; `/nexhr/` on this site is the marketing/demo copy.
4. NEXTime runs under `/nextime/`; its `.htaccess` CSP still contains `YOUR-PROJECT-REF` placeholders (harmless in demo mode, must be set for live).
5. NEXHR loads the QR library from unpkg in demo mode; run `scripts/vendor_frontend_libs.sh` to self-host.
6. Page markup requires `'unsafe-inline'` / `'unsafe-eval'` in any Content-Security-Policy (runtime compiles page logic in the browser).
7. A blank, non-breaking console message has been observed on some pages; its source is not yet traced.
8. Some runtime file names contain hashes and dots (e.g. `react.production.min-aa77ae4c49.js`); they are referenced by every page and were left unchanged to avoid breaking paths.
