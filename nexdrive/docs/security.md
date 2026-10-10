# Security & data protection

NexDrive processes personal data about instructors and learners, including identity documents (provisional licence numbers) and bank details. Treat it as **UK GDPR personal data**. Nexyra is the processor for instructors, who are the controllers for their learners' data.

## Data classification

| Class | Fields | Handling |
| --- | --- | --- |
| Restricted | Licence number, sort code, account number, password, tokens | Encrypted or hashed at rest, never logged, never in URLs, masked in UI and API |
| Personal | Names, phones, e-mails, addresses, postcodes, notes, theory certificate number | TLS in transit, encrypted storage volume, tenant-scoped access |
| Operational | Bookings, prices, notifications | Tenant-scoped |

## Controls

- **Transport:** TLS 1.2+ everywhere, HSTS, and TLS to the database (`DATABASE_SSL=require`).
- **Passwords:** argon2id, minimum 8 characters including a letter and a number (the UI enforces the same). Breached-password check recommended.
- **Sessions:** 15-minute JWT access tokens. Rotating refresh tokens stored as SHA-256. Changing the password revokes other sessions. Log out revokes the current one.
- **Verification:** 6-digit codes, hashed, valid for 10 minutes, 5 attempts, resend throttled.
- **Tenancy:** every query is scoped by `instructor_id`, with optional Postgres RLS (database/database-schema.md). Other tenants' ids return 404.
- **Bank details:** encrypted (pgcrypto). The UI shows `••-••-77 / ••••5521` until the user taps Show. The API reveal endpoint requires the password and is audited. Details appear in learner messages only when the instructor has enabled it.
- **Card data:** never touches NexDrive. Stripe Elements or the Payment Sheet collects it (PCI SAQ-A).
- **Input validation:** server-side Zod schemas mirror the client validators. Parameterised SQL only.
- **Rate limiting:** auth 10/min/IP, API 100/min/token, message sending 30/min/instructor.
- **Headers:** CSP (docs/deployment.md), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: geolocation=(), camera=()`, `frame-ancestors 'none'`.
- **Uploads:** pre-signed PUT to a private bucket. Check content type and size (≤ 5 MB) and strip EXIF. Serve through short-lived signed URLs.
- **Logging:** structured logs with PII redaction (phone → `+44770…123`). No request bodies on `/me/bank-account` or `/learners`.
- **Dependencies:** Dependabot/Renovate, `npm audit` in CI. React is vendored with SRI.

## Retention (proposal — confirm with Nexyra's DPO)

| Data | Retention |
| --- | --- |
| Active learner | While active |
| Archived learner PII | 24 months after archive, then anonymised. Booking amounts and dates kept for 6 years for HMRC records |
| Messages | 24 months |
| Auth sessions and codes | 90 days |
| Closed instructor account | Exportable for 30 days, then deleted except financial records |

Provide data export (`GET /me/export`) and account deletion flows, and a learner-facing privacy notice link in messages.

## Reporting

Security issues: security@nexyra.co.uk (assumed address — confirm before launch).

## Referral programme & credit

- Reward eligibility, amounts, percentages and balances are decided **only on the server**, from payment-provider webhooks. The client displays the API's figures.
- No public or authenticated endpoint can create rewards or alter balances. Admin adjustments use a separate, audited back-office route with a mandatory reason.
- The ledger is append-only (a DB trigger blocks changes), uses idempotency keys, allows one reward per referral, and has a nightly reconciliation of balance vs ledger.
- Self-referral and duplicate checks: account id, email, phone, card fingerprint, device id and IP velocity. Users see only "This referral code cannot be used with this account."
- `POST /referrals/validate` is rate-limited and returns no referrer contact data (display name "Daniel W." only).
- Referral history shows only name, plan, value, reward and status. Referred instructors' contact and payment data is never exposed.
- Credit is awarded only after the first paid charge plus a 14-day hold. Refunds and chargebacks reverse it, with clawback via `owed_pence`.

## Admin login (demo access gate)

`index.html` opens on an **Admin login** screen. How it works:

- The PIN is **not in the source**. Only a salted PBKDF2-SHA256 hash is stored (210,000 iterations, constant `GATE` in the logic). The entered PIN is hashed in the browser with Web Crypto and compared with that hash.
- 5 wrong attempts lock the form for 30 seconds. A successful login lasts for the browser tab session (`sessionStorage`).
- It needs HTTPS (or localhost), because Web Crypto is only available in secure contexts.
- Turn it off with `adminLogin: false` in `js/config.js`.

**Limits:** any check that runs in the browser can be bypassed by someone who edits the page or its storage. A 5-digit PIN also has only 100,000 combinations, so the hash can be brute-forced offline. Treat this gate as a way to keep casual visitors out of the demo, **not as security**. For real protection:

1. Put the static site behind server-side auth: HTTP basic auth, Cloudflare Access, or an identity-aware proxy.
2. In production, admins sign in through the API (`POST /auth/login` with an admin role, plus MFA), and the server decides access.
3. To change the demo PIN, generate a new salt and hash with the script in docs/developer-guide.md §11 and replace `GATE.salt` / `GATE.hash`.
