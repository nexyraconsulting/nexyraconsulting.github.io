# API (v1)

Base URL: `${API_BASE_URL}`, e.g. `https://api.nexdrive.co.uk/v1`. JSON only. All times are ISO 8601 with offset, all money is integer pence, durations are minutes. `data/sample-data.json` shows real payload shapes.

## 1. Authentication & authorisation

- `POST /auth/login` → `{ accessToken, refreshToken, expiresIn }`. The access token is a JWT (15 min, `sub` = instructor id). The refresh token is opaque (30 days), rotated on every use, and stored hashed.
- Send `Authorization: Bearer <accessToken>` on every request except `/auth/*` and `/webhooks/*`.
- Web clients should receive the refresh token as an `httpOnly; Secure; SameSite=Strict` cookie. Native clients keep it in Keychain/Keystore.
- **Authorisation:** single-tenant per instructor. Every resource is filtered by `instructor_id = sub`, and another instructor's id returns `404` (not `403`).
- **Subscription gate:** when the subscription is `expired`, write endpoints that create bookings return `402 SUBSCRIPTION_REQUIRED`. Reads still work.

## 2. Errors

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Enter a full UK postcode, like SL1 3NY", "fields": { "postcode": "Enter a full UK postcode, like SL1 3NY" } } }
```

| HTTP | code | When |
| --- | --- | --- |
| 400 | `VALIDATION_ERROR` | Field errors (phone, email, licence, postcode, past date/time) |
| 401 | `UNAUTHENTICATED` / `TOKEN_EXPIRED` | Missing or expired token → client refreshes once |
| 402 | `SUBSCRIPTION_REQUIRED` / `PAYMENT_FAILED` | Expired or past-due subscription |
| 404 | `NOT_FOUND` | Missing or belongs to another instructor |
| 409 | `BOOKING_CONFLICT` | Overlaps an existing lesson. `details.conflict` = booking |
| 409 | `DUPLICATE_BOOKING` | Same learner, same start |
| 409 | `EMAIL_TAKEN` / `PHONE_TAKEN` / `ADI_TAKEN` | Registration |
| 422 | `LEARNER_INCOMPLETE` | `details.missing: ["provisionalLicenceNumber", …]` |
| 422 | `DISCOUNT_TOO_LARGE` | Discount > lesson value |
| 429 | `RATE_LIMITED` | |
| 502 | `MESSAGE_FAILED` | Provider error. The booking is still saved |
| 503 | `SERVICE_UNAVAILABLE` | Maintenance or dependency down |

The `message` text is written for display in the app.

## 3. Endpoints

### Auth & onboarding
| Method | Path | Body → Response |
| --- | --- | --- |
| POST | `/auth/register` | `{ fullName, phone, email, password, acceptedTermsVersion, referralCode? }` → `201 { instructorId, verification: { channel: "sms", expiresAt } }` |
| POST | `/auth/verify` | `{ destination, code, purpose: "phone_verify" }` → tokens |
| POST | `/auth/resend` | `{ destination, purpose }` → `204` (max 1 per 30 s, 5 per hour) |
| POST | `/auth/login` | `{ email \| phone, password }` → tokens |
| POST | `/auth/refresh` | `{ refreshToken }` or cookie → tokens |
| POST | `/auth/logout` | → `204`, revokes the session |
| POST | `/auth/password/forgot` · `/auth/password/reset` | Code-based reset |
| POST | `/auth/password/change` | `{ currentPassword, newPassword }` → `204`, revokes other sessions |

### Instructor profile
| Method | Path | Notes |
| --- | --- | --- |
| GET | `/me` | Profile, coverage areas, rate cards, default duration, verification flags |
| PATCH | `/me` | `{ fullName?, phone?, email?, address?, postcode?, adiNumber?, instructorStatus?, businessName?, coverageAreas?[], defaultDurationMinutes? }`. Changing phone or e-mail triggers re-verification |
| POST | `/me/photo` | → `{ uploadUrl, key }` (pre-signed PUT, JPEG/PNG/WebP ≤ 5 MB). Then `PATCH /me { photoKey }` |
| GET / PUT | `/me/rates` | `[{ code, label, hourlyRatePence, isDefault }]`. Changes apply to new bookings only |
| GET | `/me/bank-account` | Masked: `{ accountHolder, sortCodeMasked: "••-••-77", accountNumberLast4, includeInMessages }` |
| PUT | `/me/bank-account` | `{ accountHolder, sortCode: "204577", accountNumber: "73015521", includeInMessages }` |
| POST | `/me/bank-account/reveal` | `{ password }` → full values (rate-limited, audited) |
| DELETE | `/me/bank-account` | |
| GET / PUT | `/me/notification-preferences` | `{ lessonReminderEnabled, lessonReminderMinutes: 15\|30\|60, bookingAlerts, learnerAlerts, billingAlerts, confirmBeforeMessaging, defaultChannel }` |
| POST | `/me/devices` | `{ platform, token }` push registration |

### Dashboard
| GET | `/dashboard/today` | `{ greetingName, todayLessons, upcoming7d: { count, hours }, earningsTodayPence: { done, booked }, activeLearners, incompleteLearners, ongoing, next: [booking×2], reminder?: booking }` |
| --- | --- | --- |

### Learners
| Method | Path | Notes |
| --- | --- | --- |
| GET | `/learners?q=&status=active\|archived\|incomplete&cursor=` | Search by name, phone or postcode |
| POST | `/learners` | `{ fullName*, phone, email, address, postcode, provisionalLicenceNumber, theoryCertificateNumber, notes }`. Required to book: phone, address, postcode, licence |
| GET | `/learners/:id` | Includes `isBookingReady`, `missing[]`, `stats { totalLessons, upcoming, chargedPence }` |
| PATCH | `/learners/:id` | Partial update |
| DELETE | `/learners/:id` | **Archives**: cancels future lessons (returned in `cancelledBookingIds`), keeps history |
| GET | `/learners/:id/bookings?when=upcoming\|past` | |

### Bookings
| Method | Path | Notes |
| --- | --- | --- |
| GET | `/bookings?from=&to=&status=&learnerId=` | Calendar and history. Includes `displayStatus` |
| POST | `/bookings/check` | `{ learnerId, sessions:[{ startsAt }], durationMinutes, excludeBookingId? }` → `{ ok, conflicts:[{ index, booking }] }` |
| POST | `/bookings` | See below → `201 { bookings:[…], package?, messagePreview }` |
| GET | `/bookings/:id` | Learner summary, location, pricing, `events[]` |
| PATCH | `/bookings/:id` | `{ startsAt?, durationMinutes?, rateCode?, discountPence?, location? }` → `{ booking, previous, changed:["startsAt"], messagePreview }`. A time change sets `rescheduledFrom` |
| POST | `/bookings/:id/cancel` | `{ reason }` → `{ booking, messagePreview }` |
| POST | `/bookings/:id/no-show` | |

Create a booking (single lesson, or package when `sessions.length > 1`):

```json
{
  "learnerId": "00000000-0000-4000-8000-0000001e8481",
  "sessions": [{ "startsAt": "2026-10-09T09:30:00+01:00" }, { "startsAt": "2026-10-16T09:30:00+01:00" }],
  "durationMinutes": 120,
  "rateCode": "std",
  "discountPence": 2000,
  "location": { "type": "learner_home" },
  "idempotencyKey": "c9e1…"
}
```

The server checks: learner ready (422), subscription live (402), dates in the future (400), no conflicts (409), discount ≤ subtotal (422). It then snapshots the rate, writes `bookings`, `lesson_packages`, `booking_events` and a notification in one transaction, and returns a message preview. **Messages are never sent automatically.** The client asks first (brief §15–17).

### Messages
| Method | Path | Notes |
| --- | --- | --- |
| POST | `/messages/preview` | `{ kind, bookingIds[] \| packageId, channel }` → `{ body, recipient, includesBank }` |
| POST | `/messages` | `{ kind, bookingIds[] \| packageId, channel }` → `202 { messageId, status:"queued" }`. Failures are reported in notifications and `GET /messages/:id` |
| GET | `/messages/:id` | Status |

Message content (rendered server-side): instructor name, learner name, date, time, duration, location and postcode, price, discount, final amount. A reschedule shows previous → new. A cancellation shows the reason. A package lists every session. A "Pay by bank transfer" block (holder, sort code, account number, reference = learner surname + date) is added only when `includeInMessages`.

### Notifications
| GET | `/notifications?category=lessons\|billing\|learners&cursor=` | |
| --- | --- | --- |
| POST | `/notifications/read` | `{ ids[] }` or `{ all: true }` |

### Subscription
| Method | Path | Notes |
| --- | --- | --- |
| GET | `/subscription/plans` | Catalogue with `savingPence` vs monthly |
| GET | `/subscription` | `{ planCode, status, trialEndsAt, currentPeriodEnd, termEndsAt, cancelAtPeriodEnd, paymentMethod }` |
| POST | `/billing/setup-intent` | → Stripe `clientSecret` for card capture (no card data touches NexDrive) |
| POST | `/subscription/trial` | `{ planCode, paymentMethodId }` → starts the 14-day trial. Nothing charged today |
| POST | `/subscription/quote` | `{ planCode, useCredit }` → `{ quoteId, chargePence, creditAppliedPence, amountPayablePence, creditBalanceAfterPence, startsAt }` |
| POST | `/subscription/change-plan` | `{ planCode, useCredit?, quoteId? }`. Credit is applied server-side and recorded as a `redemption`. Upgrades to a longer term take effect immediately (prorated) |
| POST | `/subscription/cancel` | In trial: ends at trial end, never charged. Otherwise `cancelAtPeriodEnd=true` |
| POST | `/subscription/resume` | Undo a pending cancellation |

### Webhooks (no bearer auth; signature-verified)
| POST | `/webhooks/stripe` | `customer.subscription.*`, `invoice.paid`, `invoice.payment_failed` → update `subscriptions`, notify |
| --- | --- | --- |
| POST | `/webhooks/messaging` | Twilio status callbacks → `messages.status` |

### Health
`GET /health` → `200 { status: "ok", db: "ok", redis: "ok", version }`

## 5. Referral programme

All referral and credit amounts are **calculated and returned by the server**. There is no endpoint that lets a client create rewards, set balances, change percentages or change referral status.

### Authentication
- `POST /referrals/validate` is **public** (used before the account exists). It is rate-limited to 10/min/IP and 30/day/device, and accepts an optional `phone`/`email` so "already used" and self-referral checks can run early.
- Every other endpoint needs a bearer token and returns only the caller's own data.

### Endpoints
| Method | Path | Response |
| --- | --- | --- |
| POST | `/referrals/validate` | `{ code, phone?, email? }` → `200 { valid: true, code, referrerDisplayName: "Daniel W.", benefit: { trialDays: 14, extraFreeMonths: 1 } }` or `422` (below) |
| GET | `/referrals/code` | `{ code: "NEXDANIEL25", url: "https://app.nexdrive.co.uk/join?ref=NEXDANIEL25", status: "active", shareMessage }` |
| GET | `/referrals/summary` | `{ rewardPercent: 20, newInstructorBenefit, totalReferrals, successful, pending, notQualified, totalEarnedPence, creditUsedPence, balancePence, pendingRewardPence }` |
| GET | `/referrals?status=&cursor=` | `{ items: [{ id, name, registeredAt, planCode, qualifyingValuePence, rewardPence, status, rewardStatus, awardedAt, reason }], nextCursor }` |
| GET | `/referrals/:id` | The item above plus `steps: [{ key, label, state: "done"\|"current"\|"todo"\|"stopped", at }]` |
| GET | `/credit` | `{ balancePence, totalEarnedPence, totalUsedPence, pendingPence, applyAutomatically }` |
| GET | `/credit/transactions?type=referral_reward\|redemption\|reversal&cursor=` | `{ items: [{ id, createdAt, type, amountPence, description, referralId, balanceAfterPence }], nextCursor }` |
| PUT | `/credit/preferences` | `{ applyAutomatically: boolean }` |

Credit is applied through `/subscription/quote` + `/subscription/change-plan` (above) or automatically at renewal. There is deliberately no generic "apply credit" endpoint.

### Validation errors (`422`, `error.code`)
| code | message (display as-is) |
| --- | --- |
| `REFERRAL_INVALID` | This referral code is not valid. Please check the code and try again. |
| `REFERRAL_INACTIVE` | This referral code is no longer active. |
| `REFERRAL_ALREADY_USED` | This referral code has already been used. |
| `REFERRAL_NOT_ALLOWED` | This referral code cannot be used with this account. *(self-referral or fraud rule; the reason is never exposed)* |
| `REFERRAL_LOCKED` | Your referral can't be changed after your subscription has started. |

`POST /auth/register` with a failing `referralCode` returns the same 422. The client then lets the user remove the code and continue.

### Webhooks used
`invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`, `charge.refunded`, `charge.dispute.created` → referral lifecycle (developer-guide §10).

### Security
- Reward percentage, hold days and free months are server config. Clients receive them only for display.
- Referral history exposes name, plan, value, reward and status only (no contact or payment data).
- All ledger writes are idempotent and audited (`created_by`), and admin adjustments need a reason.

## 4. Conventions

- Pagination: `?cursor=&limit=` (default 50, max 200) → `{ items, nextCursor }`
- Idempotency: `POST /bookings` and `POST /messages` accept `Idempotency-Key`
- Rate limits: 100 req/min per token; auth endpoints 10/min per IP
- Versioning: path prefix `/v1`. Breaking changes go in `/v2`
