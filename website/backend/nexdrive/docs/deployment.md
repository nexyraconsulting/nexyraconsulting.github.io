# Deployment

## Front end (static)

No build step. Upload the whole `nexdrive/` folder except the backend-only folders (`database/`, `deploy/`, `docs/`, `api/`, `docker-compose.yml`, `.env.example`, `*.md`), which are safe to ship but not needed.

**Files a web server must serve:** `index.html`, `design-system.html`, `manifest.webmanifest`, `css/`, `js/`, `fonts/`, `brand/logos/`, `brand/icons/` (used by the product page), and `product/`. `brand/tokens/` is a design asset and isn't loaded by any page.

### Option A — Nginx

Use `deploy/nginx.conf.example`. It sets gzip, long cache headers for fonts and vendor files, a short cache for HTML and `config.js`, and security headers.

### Option B — Netlify / Vercel / Cloudflare Pages

Publish directory: `nexdrive`. No build command. Add the headers from the nginx example in the platform's headers file.

### Option C — S3 + CloudFront

Upload with `aws s3 sync nexdrive s3://<bucket> --delete`. Default root object `index.html`. Set `Cache-Control: no-cache` on `*.html` and `js/config.js`.

### Release checklist

1. Write `js/config.js` for the environment: `showDemoPanel: false` for real users, plus `apiBaseUrl`.
2. HTTPS only (HSTS).
3. Smoke test: the app opens straight to the launch animation (no PIN screen) → dashboard; open a lesson → Navigate opens Google Maps; book a lesson → message preview.
4. Check the browser console has no 404s (fonts, logos, vendor scripts).

### Content-Security-Policy

The current runtime evaluates the component logic in the browser and uses inline styles, so it needs:

```
default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';
img-src 'self' data:; font-src 'self'; connect-src 'self' https://api.nexdrive.co.uk;
frame-ancestors 'none'; base-uri 'self'; form-action 'self'
```

Tighten this to remove `'unsafe-eval'` once the client is rebuilt with a bundler (docs/developer-guide.md §8).

## Product page

`product/index.html` is the public NexDrive landing page (Nexyra navigation and footer, live trial dates, live app demo). It is static and self-contained under `product/`, using `../brand/` and `../fonts/` from this package.

**Where to host it** (pick one):

- **On the Nexyra site** at `https://nexyraconsulting.co.uk/products/nexdrive/`: copy `product/` there, copy `fonts/`, `brand/logos/` and `brand/icons/` alongside it (or repoint the `../` paths), and set `<body data-app-url="https://app.nexdrive.co.uk/">`. Add the page to the Nexyra nav's Products entry and sitemap.
- **With the app** at `https://app.nexdrive.co.uk/product/`: deploy this folder as-is; `data-app-url="../index.html"` already works. The nginx example has a `/product/` block that makes it indexable and drops `unsafe-eval`.

**Live demo iframe.** The hero frames the app. The app's CSP must allow the product page origin: `frame-ancestors 'self' https://nexyraconsulting.co.uk` (already in the nginx example). On Netlify/Vercel/Cloudflare, put the same value in the headers file. Set `showDemoPanel: false` in the demo build if you don't want the workflow panel visible inside the frame (it only shows on wide screens, so it stays hidden in the phone frame anyway).

**Checks:** all trial CTAs open the app; the iframe loads; "Start today" shows today's date; pricing is 4-across on desktop, 2 × 2 on tablet, stacked on phone; nav menu, search and Esc work; no console 404s.

## Backend

1. Provision a UK region: managed PostgreSQL 15+ (PITR on), Redis, a private object-storage bucket, and a secret manager.
2. Set every required variable (docs/environment.md).
3. Run migrations in CI/CD before the new version starts:
   ```bash
   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f database/migrations/001_initial_schema.sql
   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f database/migrations/002_referral_programme.sql
   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f database/seeds/001_subscription_plans.sql
   ```
   Never run `002_demo_data.sql` in production.
4. Deploy the API container (Fly.io London, AWS ECS/App Runner eu-west-2, Render Frankfurt/London). Run at least 2 instances behind TLS, with `/health` as the health check.
5. Deploy a worker process (same image, `node dist/worker.js`) for BullMQ jobs.
6. Stripe: create 4 Prices (Monthly £25 recurring monthly; £240/£420/£540 recurring every 12/24/36 months). Enable webhooks `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`, `charge.refunded`, `charge.dispute.created`. Create the Prices, set `STRIPE_PRICE_*`, and point the webhook at `/v1/webhooks/stripe`.
7. Twilio: register the alphanumeric sender and set the status callback to `/v1/webhooks/messaging`.
8. Monitoring: Sentry plus uptime checks on `/health`. Alert on failed jobs and on a high `MESSAGE_FAILED` rate.

## Environments

| Env | Front end | API | Data |
| --- | --- | --- | --- |
| local | `npx serve .` | `localhost:8080` | docker-compose + demo seed |
| staging | `staging.app.nexdrive.co.uk` | `staging.api…` | Demo seed, Stripe test mode |
| production | `app.nexdrive.co.uk` | `api.nexdrive.co.uk` | Live |

## Rollback

Front end: redeploy the previous folder or version. API: redeploy the previous image. Migrations must be backward compatible (expand → migrate → contract) so the previous API version still works.

## Native app (phase 2)

Expo EAS Build → TestFlight / Play Console internal testing. Bundle id `uk.co.nexyra.nexdrive` (assumed). Icons come from `brand/logos/app-icon-512.png`.

## Referral links

Route `/join` to `index.html` and keep the query string (the nginx example's `try_files … /index.html` already does this). Smoke test: open `/join?ref=NEXDANIEL25` → the welcome screen shows "You've been invited to NexDrive".
