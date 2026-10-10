# DEVELOPER_HANDOVER

## 1. In one paragraph

NEXTime is a multi-tenant rota and timesheet SaaS. The UI is four pre-built, self-contained HTML pages (React 18 inside). Today they run on a browser-storage layer (`source/js/nextime-saas.js`, embedded in the pages), so every flow works with no backend: sign-up, 2FA, invites, roles, plans, payments (simulated), console. The backend is already written: Supabase schema with RLS, seven edge functions for Stripe, GoCardless, invites and cron, and a client adapter (`public/js/nextime-supabase.js`). **Your main task is connecting the pages to that adapter (section 4)**, then configuring and deploying (DEPLOYMENT.md).

## 2. Architecture

```text
Browser (index / account / app / admin/console)
   │ supabase-js (anon key + user JWT)            │ Stripe.js Payment Element
   ▼                                              ▼
Supabase: Auth (email+password, TOTP MFA) ── Postgres + RLS ── Edge Functions ──► Stripe API / GoCardless API / Resend
                                              ▲                    ▲
                                          pg_cron ───────────► scheduled-tasks      webhooks ◄── Stripe, GoCardless
```

Tenant isolation is enforced in the database (RLS + `security definer` helpers), not in the UI. The UI hides what a role can't do; the database refuses it.

## 3. Key decisions

| Decision | Why |
| --- | --- |
| Supabase | Managed Postgres, Auth with MFA, functions and cron in one place; RLS gives tenant isolation |
| Phase 1 = one JSON snapshot per tenant | Zero change to the proven rota/timesheet logic; optimistic versioning prevents silent overwrites |
| Phase 2 tables already created | Move to row-level writes when concurrent editing grows |
| Stripe + GoCardless | Cards and wallets are best on Stripe; UK Direct Debit is cheapest and most reliable on GoCardless |
| Billing columns guarded by trigger | Clients can't grant themselves plans or statuses |
| Plans by active staff | Simple to explain; enforced client-side and in `save_snapshot()` |

## 4. Wiring the pages to Supabase (the outstanding task)

Work in `source/` (section 6). The seams are deliberately small:

**`nextime-app.dc.html`, logic class**
| Today (browser) | Replace with |
| --- | --- |
| `constructor`: `JSON.parse(localStorage.getItem(KEY))` | in `componentDidMount`: `const { snapshot, version } = await NXCloud.loadSnapshot(tenantId)`, then `setState`. Show the existing loading state until it resolves |
| `persist()`: `localStorage.setItem(KEY, …)` | debounce 600 ms, then `this._version = await NXCloud.saveSnapshot(tenantId, payload, this._version)`. On `e.code === 412`, flash "Someone else saved a newer version. Reload to see their changes." |
| `saasCtx()` (sync read of registry) | `await NXCloud.context()` cached in state, refreshed on focus |
| `mineVals()` filters the full snapshot | `await NXCloud.myShifts(tenantId, from, to)` (Employees can't read the snapshot) |
| `wsCall(fn)` → `NXSaaS.invite / setMember / removeMember / revokeInvite / updateTenant` | same-named `NXCloud` functions (async; await then refresh) |
| Plan switch `S.setPlan` | `NXCloud.changePlan(tenantId, plan, cycle)` |
| Payment modal: Card tab, simulated fields | replace the card fields with `<div id="pm-element"></div>`; on open `NXCloud.mountCard(tid, '#pm-element')`; on submit `NXCloud.confirmCard()`. The Payment Element includes Apple Pay and Google Pay, so remove the two separate wallet buttons |
| Payment modal: Direct Debit tab | `NXCloud.setupDirectDebit(tid, scheme)`, which redirects to GoCardless (remove the bank fields) |
| Payment modal: Invoice tab | `NXCloud.useInvoice(tid, email, address, po)` |
| Remove / cancel / reactivate | `removePaymentMethod`, `cancelSubscription`, `reactivate` |
| Workspace delete `S.deleteTenant` | `DELETE /tenants?id=eq.<id>` (Owner), then `NXCloud.endSession()` |
| Read `?billing=done` on load | show "Payment method saved" and refresh the context |

**`nextime-account.dc.html`**
| Today | Replace with |
| --- | --- |
| `S.signup` then verify-code step | `NXCloud.signup` (Supabase sends a confirmation **link**). Show "Check your inbox"; after the link → sign in → `NXCloud.createWorkspace(company, plan, region, importLegacy ? legacySnapshot : null)` |
| `S.login` | `NXCloud.login` → if `needsMfa`, show the code step and call `mfaVerify(factorId, code)` |
| 2FA setup (key shown as text) | `NXCloud.mfaEnroll()` returns `totp.qr_code` (SVG data URI): show it as an `<img>` above the key |
| `S.requestReset` / reset token | `NXCloud.requestReset(email)`; the `?view=reset` page calls `NXCloud.resetPassword(pw)` |
| Invitation `?invite=token` | sign up or sign in as normal, then `NXCloud.acceptInvite(token)` |
| Post-sign-up payment step | `mountCard` / `setupDirectDebit` as above, or Skip |

**`nextime-platform-console.dc.html`**: replace `S.read()` with `select * from tenants` (platform admin RLS), plus `platform_events`. Plan, suspend and extend-trial actions are a direct `PATCH /tenants`, which a platform admin is allowed to do.

**Load order in each page's `<helmet>`**: supabase-js CDN, `https://js.stripe.com/v3/` (app/account), then `config/app-config.js`, then `js/nextime-supabase.js`. Then set `demoMode: false`.

Estimated effort: 3–5 developer days including testing.

## 5. Roles and gates

Defined once in the database (see API_DOCUMENTATION.md section 5) and mirrored in `SAAS_TABS` in the app. Status gates: `expired`/`cancelled` → Owner sees Workspace → Plan & billing only; others see "Workspace paused". `suspended` → nobody. `past_due` → full access plus a red banner.

## 6. Editing the UI

`source/pages/*.dc.html` are the editable sources ("Design Components": plain HTML templates with `{{ }}` bindings plus a logic class). `public/*.html` are their compiled, self-contained bundles. Options:
1. **Recommended for small changes:** open the project in Claude Design (or ask Nexyra for the project link), edit, then re-export the four bundles.
2. **Long-term:** port the pages to your own React/Vite app. The logic classes are plain React class components; the templates map directly to JSX.

The compiled bundles are not hand-editable (assets are base64-packed).

## 7. Security notes

- Passwords: Supabase Auth (bcrypt). The prototype layer's PBKDF2-SHA256 (150k iterations) is replaced by it.
- 2FA: TOTP RFC 6238; workspace policy enforced by `mfa_ok()` requiring `aal2`.
- Sessions: 30 min inactivity sign-out and 12 h maximum in the app; Supabase refresh tokens rotate.
- Brute force: Supabase rate limits; enable CAPTCHA for public sign-up.
- Payments: card and bank data only ever go to Stripe and GoCardless (PCI SAQ-A scope).
- Webhooks: signature-verified and idempotent (`billing_events` primary key).
- Secrets: only in Supabase function secrets. `config/app-config.js` contains public values only.
- Audit: every app change is in the snapshot's `audit` list (phase 2: `audit_log`, append-only); platform and billing events are in `platform_events`.
- GDPR: NEXTime is the processor for customers' staff data. Needs a DPA, a sub-processor list (Supabase, Stripe, GoCardless, Resend, host), 90-day post-cancellation deletion (cron) and full export (Workspace → Organisation → Export).

## 8. Known limitations / outstanding items

1. **Client wiring to Supabase (section 4) isn't done.** Until then the site runs in prototype mode: data is per browser, emails are on screen and payments are simulated.
2. Legal pages (Terms, Privacy, DPA) aren't written; the footer lists their names only.
3. Phase 2 record tables exist but aren't used; concurrent editing relies on snapshot versioning (last-write is rejected, not merged).
4. Invites to people who already have an account: `invite-member` logs it but only Supabase's own invite email is sent to new users. Add a Resend email using `sendEmail` from `_shared/common.ts` for existing users.
5. Enterprise is "contact us", with no self-serve checkout.
6. The marketing screenshot (`app-rota` image inside `index.html`) shows sample data; replace it when real customer-safe imagery is available.
7. Card logos come from the Simple Icons CDN at runtime inside the app's payment modal; CSP allows `cdn.simpleicons.org`. Self-host them if you prefer no third-party image requests.
8. VAT: GoCardless amounts add `VAT_RATE`; for non-UK customers, consider Stripe Tax or a merchant-of-record setup.

## 9. Contacts and accounts to transfer

Supabase organisation, Stripe account, GoCardless account, domain registrar/DNS, web host, email provider. Make sure the owner of each is a company address, with 2FA, and that at least two people have access.
