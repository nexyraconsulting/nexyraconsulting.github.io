# API contract

Base path: `/api`. JSON in and out, UTF-8. Same origin as the app is recommended, so the session cookie works without CORS. Machine-readable version: `../api/openapi.yaml`.

## Authentication

| Method | Path | Request | Response |
| --- | --- | --- | --- |
| `POST` | `/auth/login` | `{ "email", "password" }` | `200 { user }` and sets `nextime_session` (httpOnly, Secure, SameSite=Strict). `401` wrong details. `429` after 5 failures (5-minute pause per IP) |
| `POST` | `/auth/logout` | none | `204`, clears the cookie |
| `GET` | `/auth/me` | none | `200 { user: { id, name, email, role, organisationId } }` or `401` |

Roles: `Administrator` (whole organisation), `Manager` (read and write; scope to `user_locations` in Step 2), `Employee` (read only in Step 1).

## Step 1 — snapshot

| Method | Path | Request | Response |
| --- | --- | --- | --- |
| `GET` | `/organisations/{orgId}/snapshot` | none | `200 { "snapshot": Snapshot }` and header `ETag: "v12"`. `404` when nothing has been saved yet |
| `PUT` | `/organisations/{orgId}/snapshot` | `{ "snapshot": Snapshot }` and header `If-Match: "v12"` (leave it out only for the very first save) | `204` and the new `ETag: "v13"`. `412` someone else saved first. `428` `If-Match` missing on an existing snapshot. `400` invalid shape. `403` wrong organisation or role |
| `GET` | `/organisations/{orgId}/audit?from=YYYY-MM-DD&to=YYYY-MM-DD` | none | `200 { "entries": [AuditEntry] }`, newest first, max 5,000 |
| `GET` | `/health` | none | `200 { "ok": true }` when the database answers |

`Snapshot` is the document described in `architecture.md` section 2. The server must accept unknown extra fields and store them unchanged.

On every `PUT` the server copies the snapshot's newest `audit` entries into `audit_log` (ignoring ids it already has), so the full history is kept even though the app only holds 3,000 entries.

### Errors

```json
{ "error": "version_conflict" }
```

Codes: `unauthorised`, `forbidden`, `not_found`, `invalid_snapshot`, `if_match_required`, `version_conflict`, `invalid_credentials`, `too_many_attempts`, `server_error`.

## Step 2 — records (multi-user editing)

Add when several managers edit at the same time. Each record carries `rowVersion`; updates send `If-Match: "<rowVersion>"` and get `412` on conflict. Every write also inserts an `audit_log` row server-side with the same `entity`, `ref`, `changes` and `reason` the app already builds in `commit()`.

| Resource | Endpoints |
| --- | --- |
| Employees | `GET /employees` · `POST /employees` · `PATCH /employees/{ref}` · `DELETE /employees/{ref}` (sets status `Left`, never hard-deletes) |
| Shifts | `GET /shifts?from=&to=&location=` · `POST /shifts` · `PATCH /shifts/{ref}` · `DELETE /shifts/{ref}`. A change to a shift in an approved week requires `reason` |
| Actual times | `PATCH /shifts/{ref}/actuals` `{ aStart, aEnd, aBrk, reason? }` |
| Leave | `GET /leave?from=&to=` · `POST /leave` · `PATCH /leave/{ref}` · `DELETE /leave/{ref}` |
| Swaps | `GET /swaps?status=` · `POST /swaps` · `POST /swaps/{ref}/approve` · `POST /swaps/{ref}/decline` · `POST /swaps/{ref}/cancel` |
| Approvals | `PUT /approvals/{empRef}/{weekStart}` `{ hours }` · `DELETE /approvals/{empRef}/{weekStart}` `{ reason }` |
| Publishing | `POST /rota-weeks/{weekStart}/publish` `{ location? }` · `DELETE /rota-weeks/{weekStart}/publish` |
| Settings | `GET /settings` · `PATCH /settings` (Administrator only) |
| Audit | `GET /audit?from=&to=&entity=&q=` (read only, append-only table) |

All paths are under `/organisations/{orgId}`.

## Rules the server must enforce (Step 2)

- Approved weeks are locked: edits need a non-empty `reason` and are logged as amendments.
- A published week keeps its publish record; later edits are logged with entity `Rota`.
- Times are `HH:MM` 24-hour; `end <= start` means the shift ends the next day.
- Working-time rules (`minRest`, `maxWeekly`, `maxDays`) are **warnings** today. Agree the policy before making them blocking.
- Dates are local calendar dates of the organisation (no timezone shift). Timestamps (`at`, `savedAt`) are ISO-8601 UTC.
