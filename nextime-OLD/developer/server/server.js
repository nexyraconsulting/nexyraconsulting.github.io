'use strict';
/*
  NEXTime Rota & Timesheet — reference API server (Node.js 18+, Express, PostgreSQL).
  Implements the Step 1 snapshot API from docs/api-contract.md plus email/password sign-in
  with an httpOnly session cookie. It also serves the app (deploy/nextime) so app and API share one origin.

  Start:        npm install && npm start
  Create user:  npm run create-user -- admin@example.com "Site Admin" Administrator
*/
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

loadEnv(path.join(__dirname, '.env'));

const express = require('express');
const { Pool } = require('pg');

const cfg = {
  port: Number(process.env.PORT || 8080),
  databaseUrl: process.env.DATABASE_URL,
  databaseSsl: process.env.DATABASE_SSL === 'true',
  sessionSecret: process.env.SESSION_SECRET || '',
  sessionHours: Number(process.env.SESSION_HOURS || 8),
  cookieSecure: process.env.COOKIE_SECURE !== 'false',
  staticDir: path.resolve(__dirname, process.env.STATIC_DIR || '../../deploy/nextime'),
  corsOrigin: process.env.CORS_ORIGIN || ''
};
if (!cfg.databaseUrl) fail('DATABASE_URL is not set. Copy env-example.txt to .env and fill it in.');
if (cfg.sessionSecret.length < 32) fail('SESSION_SECRET must be at least 32 characters.');

const pool = new Pool({ connectionString: cfg.databaseUrl, ssl: cfg.databaseSsl ? { rejectUnauthorized: false } : false });

if (process.argv[2] === 'create-user') { createUser(process.argv.slice(3)).then(() => process.exit(0), (e) => fail(e.message)); return; }

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.json({ limit: '15mb' }));
app.use(securityHeaders);
app.use(cors);

/* ---------- auth ---------- */
const COOKIE = 'nextime_session';
const attempts = new Map(); // ip -> { n, until }

app.post('/api/auth/login', wrap(async (req, res) => {
  const ip = req.ip;
  const a = attempts.get(ip) || { n: 0, until: 0 };
  if (a.until > Date.now()) return res.status(429).json({ error: 'too_many_attempts', retryAt: new Date(a.until).toISOString() });
  const email = String((req.body && req.body.email) || '').trim().toLowerCase();
  const password = String((req.body && req.body.password) || '');
  const r = await pool.query('select id, organisation_id, name, role, password_hash from users where lower(email) = $1 and disabled_at is null', [email]);
  const u = r.rows[0];
  if (!u || !verifyPassword(password, u.password_hash)) {
    a.n += 1; if (a.n >= 5) { a.n = 0; a.until = Date.now() + 5 * 60 * 1000; } attempts.set(ip, a);
    await audit(u ? u.organisation_id : null, u ? u.id : null, 'Failed sign-in', 'Security', 'login', email);
    return res.status(401).json({ error: 'invalid_credentials' });
  }
  attempts.delete(ip);
  setSession(res, { uid: u.id, org: u.organisation_id, role: u.role });
  await pool.query('update users set last_login_at = now() where id = $1', [u.id]);
  await audit(u.organisation_id, u.id, 'Signed in', 'Security', 'login', u.name);
  res.json({ user: { id: u.id, name: u.name, role: u.role, organisationId: u.organisation_id } });
}));

app.post('/api/auth/logout', (req, res) => { res.setHeader('Set-Cookie', COOKIE + '=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0' + (cfg.cookieSecure ? '; Secure' : '')); res.status(204).end(); });

app.get('/api/auth/me', requireUser, wrap(async (req, res) => {
  const r = await pool.query('select id, name, email, role, organisation_id from users where id = $1', [req.user.uid]);
  if (!r.rows[0]) return res.status(401).json({ error: 'unauthorised' });
  const u = r.rows[0];
  res.json({ user: { id: u.id, name: u.name, email: u.email, role: u.role, organisationId: u.organisation_id } });
}));

/* ---------- snapshot API ---------- */
const etagOf = (v) => '"v' + v + '"';

app.get('/api/health', wrap(async (req, res) => { await pool.query('select 1'); res.json({ ok: true }); }));

app.get('/api/organisations/:orgId/snapshot', requireUser, requireOrg, wrap(async (req, res) => {
  const r = await pool.query('select version, data from organisation_snapshots where organisation_id = $1', [req.params.orgId]);
  if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
  res.set('ETag', etagOf(r.rows[0].version)).set('Cache-Control', 'no-store').json({ snapshot: r.rows[0].data });
}));

app.put('/api/organisations/:orgId/snapshot', requireUser, requireOrg, requireRole('Administrator', 'Manager'), wrap(async (req, res) => {
  const orgId = req.params.orgId;
  const snap = req.body && req.body.snapshot;
  if (!validSnapshot(snap)) return res.status(400).json({ error: 'invalid_snapshot' });
  const ifMatch = req.get('If-Match');
  const client = await pool.connect();
  try {
    await client.query('begin');
    const cur = await client.query('select version from organisation_snapshots where organisation_id = $1 for update', [orgId]);
    let version;
    if (!cur.rows.length) {
      version = 1;
      await client.query('insert into organisation_snapshots (organisation_id, version, data, updated_by) values ($1, 1, $2, $3)', [orgId, snap, req.user.uid]);
    } else {
      if (!ifMatch) { await client.query('rollback'); return res.status(428).json({ error: 'if_match_required' }); }
      if (ifMatch !== etagOf(cur.rows[0].version)) { await client.query('rollback'); return res.status(412).json({ error: 'version_conflict' }); }
      version = cur.rows[0].version + 1;
      await client.query('update organisation_snapshots set version = $2, data = $3, updated_at = now(), updated_by = $4 where organisation_id = $1', [orgId, version, snap, req.user.uid]);
    }
    // Copy the newest audit entries into the permanent, append-only audit_log (idempotent on id).
    const entries = (Array.isArray(snap.audit) ? snap.audit : []).slice(0, 500);
    if (entries.length) {
      await client.query(
        `insert into audit_log (organisation_id, id, at, action, entity, ref, employee_ref, work_date, summary, changes, reason, actor_user_id)
         select $1, x.id, x.at::timestamptz, x.action, x.entity, x.ref, nullif(x."empId", ''), nullif(x.date, '')::date, x.summary, coalesce(x.changes, '[]'::jsonb), x.reason, $3
         from jsonb_to_recordset($2::jsonb) as x(id text, at text, action text, entity text, ref text, "empId" text, date text, summary text, changes jsonb, reason text)
         where x.id is not null and x.at is not null
         on conflict (organisation_id, id) do nothing`,
        [orgId, JSON.stringify(entries), req.user.uid]);
    }
    await client.query('commit');
    res.set('ETag', etagOf(version)).status(204).end();
  } catch (e) {
    await client.query('rollback').catch(() => {});
    throw e;
  } finally { client.release(); }
}));

app.get('/api/organisations/:orgId/audit', requireUser, requireOrg, wrap(async (req, res) => {
  const from = req.query.from || '1970-01-01', to = req.query.to || '9999-12-31';
  const r = await pool.query('select id, at, action, entity, ref, employee_ref as "empId", work_date as date, summary, changes, reason from audit_log where organisation_id = $1 and at::date between $2 and $3 order by at desc limit 5000', [req.params.orgId, from, to]);
  res.json({ entries: r.rows });
}));

/* ---------- app ---------- */
if (fs.existsSync(cfg.staticDir)) {
  app.use(express.static(cfg.staticDir, { setHeaders: (res, p) => { if (p.endsWith('index.html')) res.setHeader('Cache-Control', 'no-cache'); } }));
}
app.use('/api', (req, res) => res.status(404).json({ error: 'not_found' }));
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ error: 'server_error' }); });

app.listen(cfg.port, () => console.log('NEXTime API on http://localhost:' + cfg.port + (fs.existsSync(cfg.staticDir) ? ' (serving ' + cfg.staticDir + ')' : '')));

/* ---------- helpers ---------- */
function wrap(fn) { return (req, res, next) => fn(req, res, next).catch(next); }
function fail(msg) { console.error(msg); process.exit(1); }

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  fs.readFileSync(file, 'utf8').split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  });
}

function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
}

function cors(req, res, next) {
  if (cfg.corsOrigin && req.get('Origin') === cfg.corsOrigin) {
    res.setHeader('Access-Control-Allow-Origin', cfg.corsOrigin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, If-Match');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
    res.setHeader('Access-Control-Expose-Headers', 'ETag');
    if (req.method === 'OPTIONS') return res.status(204).end();
  }
  next();
}

function sign(v) { return crypto.createHmac('sha256', cfg.sessionSecret).update(v).digest('base64url'); }

function setSession(res, data) {
  const body = Buffer.from(JSON.stringify(Object.assign({ exp: Date.now() + cfg.sessionHours * 3600e3 }, data))).toString('base64url');
  res.setHeader('Set-Cookie', COOKIE + '=' + body + '.' + sign(body) + '; Path=/; HttpOnly; SameSite=Strict; Max-Age=' + cfg.sessionHours * 3600 + (cfg.cookieSecure ? '; Secure' : ''));
}

function readSession(req) {
  const raw = (req.headers.cookie || '').split(/;\s*/).find((c) => c.startsWith(COOKIE + '='));
  if (!raw) return null;
  const [body, sig] = raw.slice(COOKIE.length + 1).split('.');
  if (!body || !sig) return null;
  const good = sign(body);
  if (good.length !== sig.length || !crypto.timingSafeEqual(Buffer.from(good), Buffer.from(sig))) return null;
  try { const s = JSON.parse(Buffer.from(body, 'base64url').toString()); return s.exp > Date.now() ? s : null; } catch (e) { return null; }
}

function requireUser(req, res, next) { const s = readSession(req); if (!s) return res.status(401).json({ error: 'unauthorised' }); req.user = s; next(); }
function requireOrg(req, res, next) { if (req.params.orgId !== req.user.org) return res.status(403).json({ error: 'forbidden' }); next(); }
function requireRole(...roles) { return (req, res, next) => roles.includes(req.user.role) ? next() : res.status(403).json({ error: 'forbidden' }); }

function validSnapshot(s) {
  return s && typeof s === 'object' && Array.isArray(s.employees) && Array.isArray(s.shifts) && Array.isArray(s.leave || []) && Array.isArray(s.audit || []) && s.settings && typeof s.settings === 'object';
}

function hashPassword(pw) { const salt = crypto.randomBytes(16); const key = crypto.scryptSync(pw, salt, 64, { N: 16384, r: 8, p: 1 }); return 'scrypt$' + salt.toString('hex') + '$' + key.toString('hex'); }
function verifyPassword(pw, stored) {
  if (!stored || !stored.startsWith('scrypt$')) { crypto.scryptSync(pw, 'x', 64); return false; }
  const [, saltHex, keyHex] = stored.split('$');
  const key = crypto.scryptSync(pw, Buffer.from(saltHex, 'hex'), 64, { N: 16384, r: 8, p: 1 });
  return crypto.timingSafeEqual(key, Buffer.from(keyHex, 'hex'));
}

async function audit(orgId, userId, action, entity, ref, summary) {
  if (!orgId) return;
  await pool.query('insert into audit_log (organisation_id, id, at, action, entity, ref, summary, actor_user_id) values ($1, $2, now(), $3, $4, $5, $6, $7)',
    [orgId, 'SRV-' + crypto.randomUUID(), action, entity, ref, summary, userId]).catch((e) => console.error(e));
}

async function createUser(args) {
  const [email, name, role = 'Administrator'] = args;
  const orgId = process.env.ORGANISATION_ID || 'default';
  if (!email || !name) throw new Error('Usage: npm run create-user -- email "Full Name" Administrator|Manager|Employee');
  if (!['Administrator', 'Manager', 'Employee'].includes(role)) throw new Error('Role must be Administrator, Manager or Employee');
  const password = process.env.NEW_USER_PASSWORD || crypto.randomBytes(9).toString('base64url');
  await pool.query('insert into organisations (id, name) values ($1, $2) on conflict (id) do nothing', [orgId, process.env.ORGANISATION_NAME || orgId]);
  await pool.query('insert into users (organisation_id, email, name, role, password_hash) values ($1, lower($2), $3, $4, $5)', [orgId, email, name, role, hashPassword(password)]);
  console.log('Created ' + role + ' ' + email + ' in organisation "' + orgId + '"');
  if (!process.env.NEW_USER_PASSWORD) console.log('Temporary password: ' + password + '  (share it securely; it is not stored in plain text)');
}
