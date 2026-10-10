# DEPLOYMENT

Two tracks:
- **Track A (prototype go-live, about 30 minutes):** upload `public/`, keep `demoMode: true`. Good for demos, pilots and sales; data stays in each visitor's browser.
- **Track B (production, multi-device):** everything in Track A, plus Supabase, payments and email (steps 5–8), and the client wiring in DEVELOPER_HANDOVER.md section 4.

## 1. Server requirements

- Static hosting with HTTPS. No PHP, Node or database server is needed on the web host.
- Serves `.html` as `text/html` and `.js` as `application/javascript`; supports custom headers (`.htaccess`, Nginx config or a host headers file).
- About 2 MB of disk; bandwidth: about 1 MB for the first app load (pages are self-contained), gzip/brotli recommended.
- Backend: Supabase project (managed Postgres 15, Auth, Edge Functions).

## 2. Required software (deployer's machine)

- Supabase CLI ≥ 1.200 (`npm i -g supabase` or `brew install supabase/tap/supabase`)
- `psql` (PostgreSQL client) for the seed, optional
- Stripe CLI, optional (local webhook testing)
- SFTP/rsync or your host's deploy tool

## 3. Uploading the files

Upload **the contents of `public/`** (not the folder itself) to the web root, **including the dotfiles** `.htaccess` and `admin/.htaccess`:
```bash
rsync -avz --delete public/ user@server:/var/www/nextime/
```
Don't upload `supabase/`, `database/`, `source/`, `.env.example` or the `.md` files. The `.htaccess` blocks them anyway.

## 4. Folder structure on the server

```text
/var/www/nextime/
├── index.html  account.html  app.html  robots.txt  .htaccess
├── config/app-config.js
├── js/nextime-supabase.js
└── admin/ console.html  .htaccess  config/app-config.js
```
Every page must be served from the **same origin** (sign-in state is shared). Keep the relative layout exactly as above: each page loads `config/app-config.js` relative to itself.

## 5. Environment configuration

1. Edit `config/app-config.js` and `admin/config/app-config.js` (see CONFIGURATION_CHECKLIST.md section A).
2. Copy `.env.example` to `supabase/.env`, fill in the values (section B), then:
```bash
supabase secrets set --env-file supabase/.env
supabase secrets list
```

## 6. Database connection

```bash
supabase login                                   # uses SUPABASE_ACCESS_TOKEN
supabase link --project-ref $SUPABASE_PROJECT_REF   # asks for SUPABASE_DB_PASSWORD
```
For `psql`, use `SUPABASE_DB_URL` (Project settings → Database → Connection string → Session pooler).

## 7. Database import / setup

```bash
supabase db push                                  # applies 0001_initial, 0002_payment_methods
# edit supabase/seed.sql (Stripe Price ids), then
psql "$SUPABASE_DB_URL" -f supabase/seed.sql
```
Then in the SQL editor:
```sql
select vault.create_secret('<CRON_SECRET>', 'nextime_cron_secret');
-- replace YOUR-PROJECT-REF in the nextime-daily-tasks job (see DATABASE_SETUP.md)
```
After your first sign-up, grant the platform admin (statement in `seed.sql`).

## 8. API configuration (edge functions, payments, email)

```bash
supabase functions deploy invite-member
supabase functions deploy stripe-create-setup
supabase functions deploy stripe-webhook --no-verify-jwt
supabase functions deploy gocardless-create-flow
supabase functions deploy gocardless-webhook --no-verify-jwt
supabase functions deploy billing-manage
supabase functions deploy scheduled-tasks --no-verify-jwt
```
- **Stripe:** Developers → Webhooks → Add endpoint `https://<ref>.functions.supabase.co/stripe-webhook`. Select the events in API_DOCUMENTATION.md, copy the signing secret into `STRIPE_WEBHOOK_SECRET`, run `secrets set` again and redeploy `stripe-webhook`.
- **GoCardless:** Developers → Webhook endpoints → `https://<ref>.functions.supabase.co/gocardless-webhook`. Copy the secret into `GOCARDLESS_WEBHOOK_SECRET`.
- **Supabase Auth:** set Site URL, redirect URLs, SMTP, MFA and email templates (checklist section D).
- **CORS:** functions only accept `APP_ORIGIN`. Change it if the domain changes, then redeploy.

## 9. Domain configuration

Point DNS at the host: `A`/`AAAA` for a server, or `CNAME` for Netlify, Vercel or Cloudflare. Suggested layout: `nextime.example.com` (website + app). Optionally `admin.nextime.example.com` for the console on a separate host (copy `admin/` there).

**Nginx equivalent of `.htaccess`**
```nginx
server {
  listen 443 ssl http2; server_name nextime.example.com;
  root /var/www/nextime; index index.html;
  ssl_certificate /etc/letsencrypt/live/nextime.example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/nextime.example.com/privkey.pem;
  location ~ /\.(?!well-known) { deny all; }
  location ~* \.(md|sql|ts|toml|env)$ { deny all; }
  location /admin/ { auth_basic "NEXTime console"; auth_basic_user_file /etc/nginx/.nextime-admin; }
  location ~* \.(html|js)$ { add_header Cache-Control "no-cache, must-revalidate"; }
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header X-Content-Type-Options nosniff always;
  add_header X-Frame-Options DENY always;
  add_header Referrer-Policy strict-origin-when-cross-origin always;
  # add the Content-Security-Policy line from public/.htaccess
  gzip on; gzip_types text/html application/javascript image/svg+xml;
}
server { listen 80; server_name nextime.example.com; return 301 https://$host$request_uri; }
```
**Netlify / Cloudflare Pages:** publish directory `public`; copy the headers into a `public/_headers` file; protect `/admin/*` with the host's password or access feature.

## 10. SSL / HTTPS

HTTPS is mandatory: Web Crypto (password hashing, TOTP), Apple Pay and secure cookies all require it.
```bash
sudo certbot --apache -d nextime.example.com     # or --nginx
```
Managed hosts issue certificates automatically. `.htaccess` redirects HTTP → HTTPS and sends HSTS.

## 11. Permissions

- Files `644`, folders `755`, owned by the web user (e.g. `www-data`). No folder needs write access: there are no uploads.
- `htpasswd` file outside the web root, `640`.
- Supabase: the service role key exists only in function secrets. Limit dashboard access to named team members with 2FA.

## 12. Build process

None for deployment. The HTML files are pre-built and self-contained. UI changes: see DEVELOPER_HANDOVER.md section 6.

## 13. Testing (run in order after each deployment)

1. `https://domain/` loads; Pricing switch works; no console errors.
2. **Start free trial**, create a workspace, verify email (prototype: Demo inbox), turn on two-factor.
3. Add a card with the Stripe test card `4242 4242 4242 4242` (any future date, any CVC). With Track B, check that the Stripe dashboard shows a trialing subscription.
4. Direct Debit in GoCardless sandbox: sort code `200000`, account `55779911`.
5. Invite an Employee, accept in a private window, check they see only **My shifts**.
6. Add staff beyond the plan limit; it should be blocked.
7. Console (`/admin/console.html`) asks for Basic Auth, then platform sign-in, then shows the workspace.
8. Simulate a failed payment (Stripe: card `4000 0000 0000 0341`); the workspace shows "Payment failed".
9. `curl -I https://domain/supabase/` and `/README.md` return 403/404; check headers with securityheaders.com.
10. Mobile (iOS Safari, Android Chrome): sign in, rota scroll, timesheet table scroll.

## 14. Troubleshooting

See the table in README.md. Also:
- Function logs: Supabase → Edge Functions → *name* → Logs, or `supabase functions logs stripe-webhook`
- Webhook delivery: Stripe → Webhooks → endpoint → Events; GoCardless → Developers → Events
- Database: `select * from platform_events order by at desc limit 50;`
- Cron: `select * from cron.job_run_details order by start_time desc limit 20;`

## 15. Updating / redeploying

1. Back up: `supabase db dump -f backup_$(date +%F).sql`.
2. `supabase db push` (new migrations only).
3. `supabase functions deploy <changed>`.
4. Upload changed files from `public/` (`rsync --delete` keeps the server clean). Keep the server's own `config/app-config.js`: exclude it with `--exclude config/`.
5. Re-run the tests in step 13.
6. Rollback: redeploy the previous `public/` and functions from git; for the database, restore the dump or use PITR.
