# Connecting NEXTime to a server database

Start here. This is the step-by-step plan for moving NEXTime Rota & Timesheet from browser-only storage to a shared server database.

## Where things are

| File | Purpose |
| --- | --- |
| `docs/architecture.md` | How the app is built today, data model (section 2), login, build |
| `docs/api-contract.md` | Every endpoint, status code and rule |
| `api/openapi.yaml` | The same contract in OpenAPI 3 (import into Postman, Swagger UI or a code generator) |
| `database/schema-postgresql.sql` | Tables for PostgreSQL 14+ (recommended) |
| `database/schema-mysql.sql` | The same tables for MySQL 8 / MariaDB 10.6 (for example cPanel hosting) |
| `server/` | Working reference server: Node.js 18+, Express, PostgreSQL. Snapshot API, sign-in, audit log, serves the app |
| `integration/config.js` | Switches the app between browser storage and the server |
| `integration/store-adapter.js` | Loads and saves the snapshot over the API with ETag conflict handling and an offline cache |
| `integration/app-changes.md` | The exact edits to `src/index.html` (six changes) |
| `docs/go-live-checklist.md` | What to check before switching real users over |

## How it works today

The whole organisation is one JSON document (the snapshot). The app loads it once at start-up, and every change goes through `commit()` → `persist()`, which saves the whole document to `localStorage`. Each browser has its own copy; nothing is shared.

## The plan

### Step 1 — shared snapshot (1–3 days)

Store the same JSON document on the server, one row per organisation. The app is unchanged apart from where it loads and saves. This gives every manager the same data, real accounts, server-side backups and a permanent audit trail.

Concurrency: each save sends the version it started from (`If-Match`). If someone else saved in between, the server refuses (`412`) and the app asks the user to reload. Fine for one to three people editing; for more, do Step 2.

### Step 2 — record-level API (when several managers edit at once)

Split the snapshot into the normalised tables already in Part B of the schema and add the record endpoints in `api-contract.md`. Each `commit()` in the app already describes exactly what changed (`entity`, `ref`, `changes`, `reason`), so each one maps to a single record call. Enforce approval locks and amendment reasons on the server.

## Step 1, in order

### 1. Create the database

PostgreSQL (recommended):

```bash
createdb nextime
createuser nextime_app --pwprompt
psql nextime -c "grant all on database nextime to nextime_app"
psql "postgres://nextime_app:PASSWORD@localhost:5432/nextime" -f database/schema-postgresql.sql
```

Managed options that work unchanged: AWS RDS, Azure Database for PostgreSQL, Google Cloud SQL, DigitalOcean, Supabase, Neon. Set `DATABASE_SSL=true` for these.

MySQL / cPanel: create the database and user in cPanel, then import `database/schema-mysql.sql` in phpMyAdmin. Implement the endpoints in `api-contract.md` in PHP (or your stack); the reference server is PostgreSQL only.

### 2. Run the reference server

```bash
cd server
cp env-example.txt .env      # then edit .env
npm install
npm run create-user -- you@example.com "Your Name" Administrator
npm start
```

`create-user` prints a temporary password. Open `http://localhost:8080/api/health` — it should return `{"ok":true}`.

The server also serves `../../deploy/nextime/`, so the app and API share one address and the session cookie works with no CORS set-up.

### 3. Change the app

Follow `integration/app-changes.md`. Test with `dataSource: 'local'` first, then `'api'`.

### 4. Move existing data

The first time an Administrator signs in on a browser that already has data, the app finds no snapshot on the server (`404`) and uploads that browser's data as version 1. Do this from the browser that holds the real data, **before** anyone else signs in. If the wrong browser goes first, delete the row (`delete from organisation_snapshots where organisation_id = 'default'`) and repeat.

### 5. Deploy

Run the server behind HTTPS (Nginx, Caddy, IIS, a PaaS such as Render, Railway, Azure App Service or Fly.io). Point the domain at it. The app is then at `https://your-domain/` and the API at `https://your-domain/api/`.

Minimal Nginx example:

```nginx
server {
  listen 443 ssl http2;
  server_name rota.example.com;
  # ssl_certificate / ssl_certificate_key …
  client_max_body_size 20m;
  location / { proxy_pass http://127.0.0.1:8080; proxy_set_header Host $host; proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; proxy_set_header X-Forwarded-Proto $scheme; }
}
```

Keep the server running with `systemd`, `pm2` or your platform's process manager.

### 6. Back up

- Daily `pg_dump` (or the managed provider's automatic backups) kept for at least 30 days.
- Test a restore once before go-live.
- `audit_log` is append-only by trigger; give the app user `INSERT, SELECT` only on it if you want the database to enforce that too.

## Security

- Passwords are stored as scrypt hashes; sessions are signed httpOnly, Secure, SameSite=Strict cookies that expire after `SESSION_HOURS`.
- 5 failed sign-ins from one address pause sign-in for 5 minutes.
- Every API call checks that the signed-in user belongs to the organisation in the URL; only Administrators and Managers can save.
- The browser PIN screen is replaced by real accounts in API mode. Remove the `AUTH` digest from `src/index.html` once API mode is live.
- For single sign-on (Microsoft 365, Google Workspace), replace `/auth/login` with an OIDC flow and keep the same session cookie and `/auth/me`.
- Personal data (names, hours, sickness) is stored. Agree retention periods and who can export it; record that in your GDPR / data-protection register.

## Keeping data compatible

- The snapshot format is version `2` (`snapshot.version`). If you change it, bump the number and migrate on load.
- Browser storage keys still begin `nexyra.rota-timesheet` on purpose, so data saved before the NEXTime rename keeps loading. Don't rename them.
- The server must keep fields it doesn't recognise; the app may add some later.
