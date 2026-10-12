# Deployment

Two independent deployments:

- **A. Website + product front ends** (static, required): sections 1-7, 9-15.
- **B. Product backends** (optional now, required before any product leaves demo mode): section 8.

## 1. Server requirements

| Item | Minimum |
| --- | --- |
| Web server | Apache 2.4 / LiteSpeed (uses `.htaccess`), or Nginx 1.20+, or a static host |
| Modules (Apache) | `mod_rewrite`, `mod_headers`, `mod_mime`, `mod_deflate` (all standard on cPanel) |
| HTTPS | TLS certificate for the domain (Let's Encrypt is fine) |
| Disk | ~40 MB for `public_html` |
| NEXHR backend | 2 vCPU / 2 GB RAM Linux VM, Node.js 20, PostgreSQL 15+ |
| NEXTime backend | Supabase project (Pro plan recommended for pg_cron and backups) |

## 2. Required software

- Website: none beyond the web server.
- Deploy machine for backends: `git`, `psql` 15+, Node.js 20 + npm (NEXHR), Supabase CLI 1.200+ (NEXTime), `openssl` (secret generation).

## 3. Uploading the files

1. Upload the **contents** of `public_html/` (not the folder itself) to the domain root, e.g. cPanel `public_html/`, `/var/www/nexyraconsulting/`.
2. Include the hidden files: `.htaccess`, `nextime/.htaccess`, `nextime/admin/.htaccess`.
3. Do **not** upload `backend/` or the root documentation files to the web root.
4. Static hosts (Netlify / Cloudflare Pages / Vercel): set the publish directory to `public_html`. Headers from `.htaccess` do not apply there; add them in the host's headers config (see section 9).

## 4. Folder structure on the server

```text
/ (web root)
├── index.html … sitemap.html, 404.html, .htaccess
├── assets/   brand/
├── nexdrive/   → https://DOMAIN/nexdrive/
├── nexhr/      → https://DOMAIN/nexhr/
└── nextime/    → https://DOMAIN/nextime/   (admin/ is password-protected)
```

The navigation uses root-relative paths (`nexhr/index.html`, `nextime/index.html#/pricing`, …), so the site must be served from the **domain root**. To host in a sub-folder, change `<base href="/">` in `404.html` and the `/nextime/` paths in `nextime/.htaccess`.

> NEXTime path: the folder and every link use `/nextime`. Earlier requirements mentioned `/nextile` / `/nexttile`; those routes do not exist and were not created.

## 5. Environment configuration

Edit these public (browser) config files before go-live. They must never contain secrets.

| File | Set |
| --- | --- |
| `assets/js/site-config.js` | `web3formsAccessKey` (**required**), `contactEmail` |
| `nexdrive/js/config.js` | `mode`, `apiBaseUrl`, `referralBaseUrl`, `showDemoPanel` |
| `nexhr/assets/js/appConfig.js` | `mode`, `baseDomain`, `supportEmail`, `qrScriptUrl` |
| `nextime/config/app-config.js` and `nextime/admin/config/app-config.js` (keep identical) | `demoMode`, `appOrigin` (= `https://DOMAIN/nextime` origin), Supabase URL + anon key, functions URL, Stripe publishable key |

Leave product front ends in demo mode until section 8 is complete for that product.

## 6. Database connection

The website has no database. Each backend connects to its own database (see DATABASE_SETUP.md):

- NEXHR: `DATABASE_URL` in `backend/nexhr/server/.env`, connecting as the non-owner role `nexyra_app`.
- NEXTime: managed by Supabase; the browser uses the anon key, Edge Functions get the service role automatically.
- NEXDrive: `DATABASE_URL` in the future API's `.env`.

## 7. Database import / setup

See DATABASE_SETUP.md for exact commands per product.

## 8. API configuration (backends)

### NEXHR (Node.js + PostgreSQL)

```bash
sudo useradd -r -s /usr/sbin/nologin nexhr
sudo mkdir -p /var/www/nexhr /var/lib/nexhr_storage /var/log/nexhr
# copy backend/nexhr/* and the NEXHR front end (public_html/nexhr/*) to /var/www/nexhr
cd /var/www/nexhr/server && npm ci --omit=dev
cp ../.env.example .env && chmod 600 .env       # fill in values (CONFIGURATION_CHECKLIST.md)
bash ../database/setup_database.sh               # see DATABASE_SETUP.md
sudo cp ../config/nexhr-api.service /etc/systemd/system/ && sudo systemctl enable --now nexhr-api
sudo cp ../config/nginx.conf /etc/nginx/sites-available/nexhr && sudo ln -s ../sites-available/nexhr /etc/nginx/sites-enabled/
sudo crontab -u nexhr ../config/crontab.txt
node createAdmin.js <workspace> <email> "<Full name>"   # first admin
```

NEXHR in production is a multi-tenant app on its **own domain** with wildcard sub-domains (`<workspace>.nexhr.com`). The `/nexhr/` folder on the NEXYRA site remains the marketing/demo front end; once the API is live, point the NEXHR "Start free trial" and "Sign in" links in `assets/components/Nav-v2-46414690b2.dc.html` to the production NEXHR domain. Full detail: `backend/nexhr/docs/DEPLOYMENT.md` and `INTEGRATION_GUIDE.md`.

### NEXTime (Supabase)

```bash
cd backend/nextime
supabase login && supabase link --project-ref YOUR_PROJECT_REF
supabase db push                                         # runs supabase/migrations/*
cp .env.example supabase/.env                            # fill in, never commit
supabase secrets set --env-file supabase/.env
supabase functions deploy invite-member stripe-create-setup gocardless-create-flow billing-manage scheduled-tasks
supabase functions deploy stripe-webhook --no-verify-jwt
supabase functions deploy gocardless-webhook --no-verify-jwt
```

Then: register webhook URLs in Stripe and GoCardless, schedule `scheduled-tasks` with pg_cron, update `connect-src` in `nextime/.htaccess` with your project ref, set `demoMode: false`. Full detail: `backend/nextime/docs/DEPLOYMENT.md`.

### NEXDrive

No server code exists yet. Build the API from `backend/nexdrive/api/api-documentation.md` and `backend/nexdrive/docs/developer-guide.md`, run the migrations, then set `mode: 'live'` and `apiBaseUrl` in `nexdrive/js/config.js`.

## 9. Domain configuration

| Record | Value |
| --- | --- |
| `A` / `AAAA` for `nexyraconsulting.co.uk` and `www` | web server IP |
| NEXHR (when live) | `A` for `nexhr.com` and `*.nexhr.com` → NEXHR server |
| NEXDrive (when live) | e.g. `api.nexdrive.co.uk`, `app.nexdrive.co.uk` |

Pick one canonical host (www or apex) and 301-redirect the other.

**Nginx equivalent of the root `.htaccess`:**

```nginx
server {
  listen 443 ssl http2;
  server_name nexyraconsulting.co.uk www.nexyraconsulting.co.uk;
  root /var/www/nexyraconsulting;
  index index.html;
  error_page 404 /404.html;
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  location ~ /\.(?!well-known) { deny all; }
  location ~ \.(md|sql|ts|toml|env|bak|log|sh)$ { deny all; }
  location ~ \.(html|js)$ { add_header Cache-Control "no-cache, must-revalidate"; }
  location = /nextime/pricing { return 302 /nextime/index.html#/pricing; }
  location ~ ^/nextime/(login|signin|sign-in)/?$ { return 302 /nextime/account.html; }
  location ~ ^/nextime/(signup|sign-up|trial)/?$ { return 302 /nextime/account.html?view=signup; }
  location /nextime/admin/ { auth_basic "NEXTime platform console"; auth_basic_user_file /etc/nginx/.nextime-admin; }
  location /nextime/ { error_page 404 /nextime/index.html; }
}
server { listen 80; server_name nexyraconsulting.co.uk www.nexyraconsulting.co.uk; return 301 https://$host$request_uri; }
```

## 10. SSL / HTTPS

- cPanel: AutoSSL. VPS: `certbot --nginx -d nexyraconsulting.co.uk -d www.nexyraconsulting.co.uk`.
- NEXHR needs a wildcard certificate (DNS-01 challenge).
- `.htaccess` forces HTTPS and sends HSTS; enable HSTS only after HTTPS works on every host name.

## 11. Permissions

| Path | Permission |
| --- | --- |
| Web root files / folders | 644 / 755, owned by the deploy user, readable by the web server |
| `nextime/admin/` | Basic auth: `htpasswd -c /etc/apache2/.nextime-admin USER` (file **outside** the web root), path set in `nextime/admin/.htaccess` |
| `backend/nexhr/server/.env` | 600, owned by `nexhr` |
| `/var/lib/nexhr_storage` | 700, owned by `nexhr`, outside the web root |

## 12. Build process

None. All pages are pre-built HTML. (Optional for NEXHR: `bash backend/nexhr/scripts/vendor_frontend_libs.sh` to self-host the QR library instead of unpkg.)

## 13. Testing (go-live checklist)

- [ ] Every page in `sitemap.html` loads over HTTPS with no console errors
- [ ] A missing URL shows the styled 404 page
- [ ] Menu > Products > NEXDrive / NEXHR / NEXTime: every link opens the right page (desktop hover, mobile tap, keyboard Tab/Enter/Escape)
- [ ] Contact form sends and the email arrives at the configured inbox
- [ ] `https://DOMAIN/README.md` and `https://DOMAIN/.htaccess` return 403/404
- [ ] `/nextime/admin/console.html` asks for a password
- [ ] `/nextime/pricing`, `/nextime/login`, `/nextime/signup` redirect correctly
- [ ] http:// redirects to https://

## 14. Troubleshooting

See README.md "Troubleshooting" and each product's `backend/<product>/docs/DEPLOYMENT.md`.

## 15. Updating / redeploying

1. Back up the web root (or keep the previous release folder).
2. Upload changed files only. Do not overwrite your edited config files (section 5) unless the release notes say so.
3. Changes to navigation are in one file: `assets/components/Nav-v2-46414690b2.dc.html` (footer: `Footer-v3-f7036af1a1.dc.html`).
4. Backends: NEXHR `git pull && npm ci --omit=dev && systemctl restart nexhr-api`, apply new files in `database/migrations/` in order; NEXTime `supabase db push && supabase functions deploy`.
5. Re-run section 13.
