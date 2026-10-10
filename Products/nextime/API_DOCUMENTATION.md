# API_DOCUMENTATION

NEXTime has no custom API server. All calls go to Supabase:

| Base URL | Used for |
| --- | --- |
| `https://<ref>.supabase.co/auth/v1` | Auth (sign-up, sign-in, MFA, reset). Use the supabase-js client |
| `https://<ref>.supabase.co/rest/v1` | Tables and RPCs (PostgREST), protected by RLS |
| `https://<ref>.functions.supabase.co` | Edge functions (server logic, payments, webhooks) |

**Common headers**
```
apikey: <SUPABASE_ANON_KEY>
Authorization: Bearer <user access token>        (from supabase.auth.getSession())
Content-Type: application/json
```

**Error format.** Edge functions return `{ "error": "Human-readable message" }` with status 400 (validation), 401 (not signed in), 403 (role), 404 (not found) or 500. PostgREST/RPC errors return `{ "code", "message", "details", "hint" }`; NEXTime raises these messages: `forbidden`, `workspace paused`, `two-factor required`, `conflict`, `plan limit: N active staff allowed`, `billing fields are managed by NEXTime`, `invitation expired or used`, `invitation is for a different email`.

**Roles.** O = Owner, A = Admin, M = Manager, E = Employee, P = platform admin.

---

## 1. Authentication (Supabase Auth)

| Action | supabase-js call | Notes |
| --- | --- | --- |
| Sign up | `auth.signUp({ email, password, options: { data: { full_name }, emailRedirectTo } })` | Sends confirmation email. Password ≥ 10 chars |
| Sign in | `auth.signInWithPassword({ email, password })` | 5 failures → Supabase rate limit |
| MFA enrol | `auth.mfa.enroll({ factorType: 'totp', issuer: 'NEXTime' })` | Returns `{ id, totp: { qr_code, secret, uri } }` |
| MFA verify | `auth.mfa.challengeAndVerify({ factorId, code })` | Raises session to `aal2` |
| MFA level | `auth.mfa.getAuthenticatorAssuranceLevel()` | `{ currentLevel, nextLevel }` |
| Reset request | `auth.resetPasswordForEmail(email, { redirectTo: '<origin>/account.html?view=reset' })` | |
| Set new password | `auth.updateUser({ password })` | After following the reset link |
| Sign out | `auth.signOut()` | |

Sessions: JWT access token (1 h, auto-refresh), app enforces 30 min inactivity and 12 h maximum.

---

## 2. RPC endpoints: `POST /rest/v1/rpc/<name>`

### `create_workspace`
Signed-in user creates a company and becomes Owner.
```json
// request
{ "p_name": "Demo Hospitality Ltd", "p_plan": "team", "p_region": "United Kingdom", "p_timezone": "Europe/London", "p_snapshot": null }
// response
"7c1e…-uuid"
```
`p_snapshot` (optional) imports existing browser data.

### `accept_invitation`
```json
{ "p_token": "uuid" }   →   "tenant-uuid"
```
Errors: `invitation expired or used`, `invitation is for a different email`.

### `save_snapshot`  (O, A, M · workspace open · MFA if required)
Optimistic concurrency + plan limit.
```json
// request
{ "p_tenant": "uuid", "p_snapshot": { "employees": [], "shifts": [], "...": "..." }, "p_expected_version": 12 }
// response
13
```
Errors: `forbidden`, `workspace paused`, `two-factor required`, `plan limit: 10 active staff allowed`, `conflict` (someone saved first: reload).

### `my_shifts`  (E, any member)
```json
{ "p_tenant": "uuid", "p_from": "2026-10-01", "p_to": "2026-11-05" }
→ { "employee": { … }, "shifts": [ … ], "leave": [ … ] }
```

### Helpers
| RPC | Body | Returns |
| --- | --- | --- |
| `my_role` | `{ "t": "uuid" }` | `"Owner"` / … / `null` |
| `tenant_effective_status` | `{ "t": "uuid" }` | `"trialing"`, `"active"`, `"past_due"`, `"expired"`, `"cancelled"`, `"suspended"` |
| `is_platform_admin` | `{}` | boolean |

---

## 3. Table endpoints: `/rest/v1/<table>` (RLS-filtered)

| Method & path | Who | Purpose |
| --- | --- | --- |
| `GET /plans?select=*` | anyone | price list |
| `GET /memberships?select=tenant_id,role,tenants(name,require_2fa)&status=eq.active` | self | my workspaces |
| `GET /tenants?id=eq.<id>` | members | workspace details |
| `PATCH /tenants?id=eq.<id>` body `{ name, region, timezone, require_2fa }` | O, A | settings (billing columns rejected) |
| `DELETE /tenants?id=eq.<id>` | O | delete workspace (cascade) |
| `GET /memberships?tenant_id=eq.<id>&select=*,profiles(full_name,email)` | members | team list |
| `PATCH /memberships?tenant_id=eq.<id>&user_id=eq.<uid>` body `{ role, emp_id }` | O; A for M/E | change role / link staff record |
| `DELETE /memberships?tenant_id=eq.<id>&user_id=eq.<uid>` | O; A for M/E | remove member |
| `GET /invitations?tenant_id=eq.<id>&accepted_at=is.null` | O, A | pending invites |
| `DELETE /invitations?token=eq.<token>` | O, A | revoke |
| `GET /workspace_snapshots?tenant_id=eq.<id>&select=snapshot,version` | O, A, M | load workspace |
| `GET /invoices?tenant_id=eq.<id>&order=created_at.desc` | O, A | invoice list |
| `GET /platform_events?tenant_id=eq.<id>&order=at.desc` | O, A, P | history |
| `GET /tenants?select=*` (all) | P | console |

Example:
```bash
curl "https://<ref>.supabase.co/rest/v1/tenants?id=eq.$TID" \
  -X PATCH -H "apikey: $ANON" -H "Authorization: Bearer $JWT" -H "Content-Type: application/json" \
  -d '{"require_2fa": true}'
```

---

## 4. Edge functions: `POST https://<ref>.functions.supabase.co/<name>`

CORS: only `APP_ORIGIN` is allowed. All user-called functions need `Authorization: Bearer <JWT>`.

### `invite-member`  (O → A/M/E; A → M/E)
```json
// request
{ "tenantId": "uuid", "email": "sam@company.com", "role": "Employee", "empId": "E014" }
// 200
{ "token": "uuid" }
```
Sends an email whose link opens `account.html?invite=<token>`. Errors: 403 `You cannot invite that role.`

### `stripe-create-setup`  (O)
Starts saving a card, Apple Pay or Google Pay.
```json
{ "tenantId": "uuid" }
→ { "clientSecret": "seti_…_secret_…", "publishableKey": "pk_…", "customerId": "cus_…" }
```
Client mounts the Stripe Payment Element with `clientSecret` and calls `stripe.confirmSetup`. The subscription is created by `stripe-webhook`.

### `gocardless-create-flow`  (O)
```json
{ "tenantId": "uuid", "scheme": "bacs" }      // bacs | sepa | ach | becs | becs_nz | pad
→ { "url": "https://pay.gocardless.com/billing/static/flow?id=…" }
```
Redirect the browser to `url`; GoCardless returns to `app.html?billing=done` or `?billing=cancelled`.

### `billing-manage`  (O)
| action | extra fields | effect |
| --- | --- | --- |
| `change_plan` | `plan`, `cycle` | Updates Stripe (prorated) or recreates the GoCardless subscription; checks staff limit |
| `use_invoice` | `email`, `address`, `po?` | Annual Stripe subscription, invoice + bank transfer, 30 days |
| `remove_method` | – | Detaches card / cancels mandate |
| `cancel` | – | Cancels subscription, status `cancelled` |
| `reactivate` | – | Restores status; `{ needsPaymentMethod: true }` if none on file |
```json
{ "tenantId": "uuid", "action": "change_plan", "plan": "business", "cycle": "annual" }
→ { "ok": true }
```

### `stripe-webhook`  (Stripe only, signature `Stripe-Signature`)
Handles `setup_intent.succeeded`, `invoice.finalized`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`, `payment_method.detached`. Returns 200 `ok` / `duplicate`, 400 bad signature, 500 to trigger a retry.

### `gocardless-webhook`  (GoCardless only, signature `Webhook-Signature`)
Handles `billing_requests.fulfilled`, `mandates.active|cancelled|failed|expired`, `payments.confirmed|paid_out|failed|cancelled`, `subscriptions.cancelled`. Returns 200, or 498 on a bad signature.

### `scheduled-tasks`  (pg_cron only, header `x-cron-secret`)
```json
{}  →  { "sent": 3 }
```

---

## 5. Permissions matrix

| Capability | O | A | M | E | P |
| --- | --- | --- | --- | --- | --- |
| Rota, timesheets, staff, reports, activity | ✓ | ✓ | ✓ | | |
| Settings | ✓ | ✓ | | | |
| Invite / manage members | all | M, E | | | |
| Security policy (require 2FA), organisation | ✓ | ✓ | | | |
| Plan, payment method, cancel | ✓ | view | | | |
| Transfer ownership, delete workspace | ✓ | | | | |
| Own shifts and leave | ✓ | ✓ | ✓ | ✓ | |
| All tenants, suspend, extend trial | | | | | ✓ |

Workspace state also gates access: `expired`/`cancelled` → Owner only, billing page only; `suspended` → nobody.
