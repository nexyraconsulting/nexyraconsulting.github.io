# API documentation

The NEXYRA website has no API of its own. It makes one outbound call (Contact form → Web3Forms). The products each expose an API, documented in full in:

| Product | Full specification | Base URL (production) |
| --- | --- | --- |
| NEXHR | `backend/nexhr/docs/API_DOCUMENTATION.md` | `https://<workspace>.nexhr.com/api` and `https://www.nexhr.com/api` |
| NEXTime | `backend/nextime/docs/API_DOCUMENTATION.md` | `https://<ref>.supabase.co/rest/v1`, `https://<ref>.functions.supabase.co` |
| NEXDrive | `backend/nexdrive/api/api-documentation.md` | e.g. `https://api.nexdrive.co.uk/v1` |

This file summarises every endpoint; request/response field lists, examples and error codes are in the full specifications.

---

## 0. Website: Contact form (Web3Forms)

`POST https://api.web3forms.com/submit` · no auth header · key in body

```json
{ "access_key": "<web3formsAccessKey>", "subject": "New enquiry from Jane: NEXYRA Consulting", "from_name": "NEXYRA Website",
  "name": "Jane Doe", "email": "jane@example.com", "company": "Acme", "service": "Brand Building", "budget": "£25k-£50k",
  "message": "…", "replyto": "jane@example.com", "botcheck": "" }
```

Response `200 { "success": true, "message": "Email sent successfully!" }`; on failure `{ "success": false, "message": "…" }` (shown to the visitor). Validation runs client-side first (name, valid email, message required).

---

## 1. NEXHR (REST, JSON, cookie session)

**Auth:** HttpOnly session cookie set by `/auth/login` (+ TOTP two-step). Short-lived "ticket" for sign-up / 2FA steps. CSRF: same-origin + `Content-Type: application/json`. **Roles:** `employee`, `manager` (own reports), `hr`, `admin`. **Errors:** `{ "error": "code", "message": "…" }` with 400 validation, 401 unauthenticated, 403 forbidden, 404, 409 conflict, 429 rate-limited, 503 billing_not_configured.

| Method | Path | Auth / role |
| --- | --- | --- |
| GET | /health | Public |
| GET | /public/workspaces/check?slug= | Public |
| POST | /signup · /workspaces/find | Public |
| POST | /stripe/webhook | Stripe signature |
| POST | /signup/verify · /signup/resend | Public |
| POST | /auth/login · /auth/totp · /auth/totp/enrol/start · /auth/totp/enrol/finish | Public / ticket |
| POST | /auth/password/forgot · /auth/password/reset | Public |
| GET, POST | /invitations/:token · /invitations/:token/accept | Public |
| GET | /auth/me · /workspaces/mine · /auth/sessions | Session |
| POST | /auth/logout · /auth/password | Session |
| DELETE | /auth/sessions/:id · /auth/sessions?others=1 | Session |
| GET, PATCH | /org | Session / hr, admin |
| POST | /org/locations · /org/departments · /org/invitations | hr, admin |
| GET | /org/users | hr, admin |
| POST, PATCH, DELETE | /org/users/:id/resend · /org/users/:id · /org/users/:id/reset-2fa | hr, admin (reset-2fa: admin) |
| GET, PATCH | /billing | admin |
| POST | /billing/checkout · /billing/portal | admin |
| GET | /people · /people/:id | Session (scoped) |
| POST | /people · /people/:id/archive | hr, admin |
| PATCH | /people/:id | self (limited fields) / hr, admin |
| GET, PUT | /people/:id/bank | self, hr, admin |
| POST | /people/:id/bank/reveal | self, hr, admin (audited) |
| GET, POST | /clock/today · /clock | Session |
| GET | /attendance/today | manager, hr, admin |
| GET, POST | /timesheets | Session |
| GET | /timesheets/team | manager, hr, admin |
| PATCH | /timesheets/:id/days/:date | owner |
| POST | /timesheets/:id/submit | owner |
| POST | /timesheets/:id/decision | manager, hr, admin |
| GET | /leave · /leave/types · /leave/balance | Session |
| POST | /leave · /leave/:id/cancel | Session / owner |
| POST | /leave/:id/decision | manager, hr, admin |
| PUT | /leave/entitlements/:pid | hr, admin |
| GET | /rota | Session |
| POST, PUT, DELETE | /rota/shifts · /rota/shifts/:id · /rota/copy · /rota/publish | manager, hr, admin |
| PUT | /rota/unavailability | Session |
| GET, POST | /document-requests | Session |
| POST | /document-requests/:id/status | hr, admin |
| GET, POST | /documents | Session / hr, admin |
| POST | /documents/:id/acknowledge | Session |
| GET | /payslips | self, hr, admin |
| — | files, notifications, news, audit endpoints | see full spec §10-12 |

Example:

```http
POST https://acme.nexhr.com/api/auth/login
Content-Type: application/json

{ "email": "sam@acme.com", "password": "••••••••" }
```
```json
200 { "next": "totp", "ticket": "t_8f…" }
```

---

## 2. NEXTime (Supabase)

**Auth:** Supabase Auth (email + password, optional TOTP MFA). Every request sends `apikey: <anon key>` and `Authorization: Bearer <user JWT>`. Authorisation is enforced by row-level security. **Roles per workspace:** O owner, A admin, M manager, E employee; P platform admin (console).

| Kind | Endpoint | Who |
| --- | --- | --- |
| Auth | `/auth/v1/signup`, `/auth/v1/token?grant_type=password`, `/auth/v1/factors` (MFA), `/auth/v1/recover` | Public / self |
| RPC | `POST /rest/v1/rpc/create_workspace` | signed-in user |
| RPC | `POST /rest/v1/rpc/accept_invitation` | invitee |
| RPC | `POST /rest/v1/rpc/save_snapshot` | O, A, M (MFA if required) |
| RPC | `POST /rest/v1/rpc/my_shifts` | any member |
| Table | `GET /plans` | anyone |
| Table | `GET /memberships` (mine) · `GET /tenants?id=eq.` | self / members |
| Table | `PATCH /tenants` | O, A |
| Table | `DELETE /tenants` | O |
| Table | `GET /memberships?tenant_id=` · `PATCH` · `DELETE` | members / O; A for M, E |
| Table | `GET /invitations` · `DELETE /invitations` | O, A |
| Table | `GET /workspace_snapshots` | O, A, M |
| Table | `GET /invoices` · `GET /platform_events` | O, A (P) |
| Function | `POST /invite-member` | O → A/M/E; A → M/E |
| Function | `POST /stripe-create-setup` · `/gocardless-create-flow` · `/billing-manage` | O |
| Webhook | `POST /stripe-webhook` (`Stripe-Signature`) · `/gocardless-webhook` (`Webhook-Signature`) | providers only |
| Cron | `POST /scheduled-tasks` (`x-cron-secret`) | pg_cron only |

Errors: PostgREST `{ code, message, details, hint }` (401, 403 RLS denial, 409 unique violation); functions return `{ error: "code" }` with 4xx/5xx. Permissions matrix: full spec §5.

---

## 3. NEXDrive (REST v1, specified, not yet implemented)

**Auth:** Bearer JWT access token (15 min) + rotating refresh token (30 days, HttpOnly cookie or body). Single role: instructor (all data scoped to `instructors.id`). **Errors:** `{ "error": { "code", "message", "fields"? } }`; 400, 401, 403, 404, 409 conflict, 422 validation, 429.

| Area | Endpoints |
| --- | --- |
| Auth | POST /auth/register, /auth/verify, /auth/resend, /auth/login, /auth/refresh, /auth/logout, /auth/password/forgot, /auth/password/reset, /auth/password/change |
| Profile | GET, PATCH /me · POST /me/photo · GET, PUT /me/rates · GET, PUT, DELETE /me/bank-account · POST /me/bank-account/reveal · GET, PUT /me/notification-preferences · POST /me/devices |
| Dashboard | GET /dashboard/today |
| Learners | GET, POST /learners · GET, PATCH, DELETE /learners/:id · GET /learners/:id/bookings |
| Bookings | GET, POST /bookings · POST /bookings/check · GET, PATCH /bookings/:id · POST /bookings/:id/cancel · POST /bookings/:id/no-show |
| Messages | POST /messages/preview · POST /messages · GET /messages/:id |
| Notifications | GET /notifications · POST /notifications/read |
| Subscription | GET /subscription/plans · GET /subscription · POST /billing/setup-intent · POST /subscription/trial, /quote, /change-plan, /cancel, /resume |
| Referrals | POST /referrals/validate · GET /referrals/code, /referrals/summary, /referrals, /referrals/:id · GET /credit, /credit/transactions · PUT /credit/preferences |
| Webhooks | POST /webhooks/stripe · POST /webhooks/messaging (signature-verified) |
| Health | GET /health |

---

## CORS

| API | Allowed origins |
| --- | --- |
| Web3Forms | handled by Web3Forms; restrict the key to your domain in its dashboard |
| NEXHR | same-origin by default; set `CORS_ORIGINS` only if the front end is on another origin |
| NEXTime functions | `APP_ORIGIN` (exact origin, no trailing slash) |
| NEXDrive | `CORS_ORIGINS` (comma-separated, e.g. `https://app.nexdrive.co.uk`) |
