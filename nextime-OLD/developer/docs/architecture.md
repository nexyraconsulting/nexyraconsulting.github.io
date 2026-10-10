# NEXTime Rota & Timesheet — architecture

Version 1.1 · October 2026 · browser edition, no server yet

> Step-by-step server and database work is in `database-integration.md`. This file explains how the app is built today.

> Storage keys still start with `nexyra.rota-timesheet` on purpose, so data saved before the NEXTime rename keeps loading.

## 1. What exists today

A single-page application that runs entirely in the browser. There is no build step, no backend and no third-party service at runtime.

| Path | Role |
| --- | --- |
| `src/index.html` | The whole application: template (markup), logic class, demo data, calculations, PDF and CSV export, admin login |
| `src/vendor/dc-runtime.js` | Component runtime. Renders the template, binds `{{ }}` values and events, runs the logic class (React-based, bundled) |
| `src/vendor/design-system/` | Base component classes (`.btn`, `.field`, `.input`, `.table`, `.dialog`, `.tag`). Nexyra tokens override them inside `src/index.html` |
| `src/assets/` | `brand/logos/` NEXTime logos, `brand/icons/` app icons, `icons/` Lucide UI icons (1.5px stroke), `fonts/` Hanken Grotesk |
| `integration/store-adapter.js` | Reference implementation of a REST store adapter with ETag concurrency (see section 6). Not loaded by the app |
| `../deploy/nextime/index.html` | Production build: `src/index.html` with every script, style, font and image inlined into one file |

### Running locally

Serve `src/` with any static server and open it, for example `npx serve src` or `python3 -m http.server -d src`. Opening the file directly from disk also works in Chromium browsers.

The PDF library (`html2pdf.js 0.10.1`) loads from cdnjs in `src/`. The production build inlines it.

### Brand

Logo, colours, type and voice: `../../brand/nextime-visual-language.md`.

### Sidebar (Violet Tint)

Panel `#EDE9FE` with a 2px `#7C3AED` right edge and the gradient (reverse) logo. Inactive items `#5B21B6`, hover `#DDD6FE` / `#2E1065`, active `#7C3AED` / white. Alert badges (swaps, missing times) are `#DC2626`; the staff count badge is neutral. A 3px brand-gradient stripe closes the panel. Item colours are set in `renderVals()` → `tabs`; labels are 14px and the reverse logo is 202px wide; nav icons are data URIs in `NAV_ICONS` (Lucide, 1.5px stroke) drawn through a CSS mask so they take the text colour.

### Structure of `src/index.html`

1. `<helmet>`: title, favicon, stylesheets, `@font-face`, Nexyra token overrides, print rules.
2. Template: login screen, then (when signed in) sidebar, header, filter bar, the seven views, dialogs and the hidden PDF report. Values come from `renderVals()` by name. Control flow uses `<sc-if>` and `<sc-for>`.
3. `<script type="text/x-dc">`: plain JavaScript.
   - Constants and helpers: dates, times, hour calculations, SHA-256, labels.
   - `seed()`: the Nexyra Hospitality Group demo organisation.
   - `class Component`:
     - `constructor`: loads the snapshot from localStorage.
     - `persist()`: saves it.
     - `commit(patch, auditEntries)`: the single write path for every change.
     - Domain methods: shifts, employees, leave, approvals, publishing, swaps, rules, attendance, PDF, payroll CSV, auth.
     - `renderVals()`: derives everything the template shows.

Search the file for `const KEY =`, `function seed()`, `constructor(props)`, `persist(extra)`, `commit(patch` and `renderVals()` to find each part.

## 2. Data model (organisation snapshot)

The entire organisation is one JSON document, stored under the localStorage key `nexyra.rota-timesheet.v1`.

```json
{
  "version": 2,
  "savedAt": "ISO-8601",
  "demo": false,
  "settings": {
    "orgName": "string", "standardWeekly": 40, "longShift": 10,
    "roles": ["string"], "locations": ["string"], "departments": ["string"],
    "templates": [{ "id": "T1", "name": "Early", "start": "07:00", "end": "15:00", "brk": 30 }],
    "lateMins": 5, "minRest": 11, "maxDays": 6,
    "maxWeekly": { "Full Time": 48, "Part Time": 30, "Zero Hour Contract": 40 }
  },
  "employees": [{
    "id": "EMP-001", "first": "string", "last": "string", "role": "string",
    "department": "string", "location": "string",
    "contract": "Full Time | Part Time | Zero Hour Contract",
    "status": "Active | On Leave | Left", "startDate": "YYYY-MM-DD",
    "unavailableDays": [0, 6], "notes": "string"
  }],
  "shifts": [{
    "id": "S0001", "empId": "EMP-001", "date": "YYYY-MM-DD",
    "start": "HH:MM", "end": "HH:MM", "brk": 30,
    "aStart": "HH:MM | ''", "aEnd": "HH:MM | ''", "aBrk": "number | ''", "notes": "string"
  }],
  "leave": [{ "id": "L0001", "empId": "EMP-001", "type": "Holiday | Sickness | Unavailable | Other", "from": "YYYY-MM-DD", "to": "YYYY-MM-DD", "notes": "string" }],
  "approvals": { "EMP-001|YYYY-MM-DD": { "at": "ISO-8601", "hours": 38.75 } },
  "published": { "YYYY-MM-DD": { "at": "ISO-8601", "shifts": 32 } },
  "swaps": [{ "id": "W…", "shiftId": "S0001", "fromEmp": "EMP-001", "toEmp": "EMP-002 | ''", "reason": "string", "status": "Pending | Approved | Declined | Cancelled", "createdAt": "ISO-8601", "decidedAt": "ISO-8601" }],
  "audit": [{ "id": "A…", "at": "ISO-8601", "action": "string", "entity": "Shift | Timesheet | Rota | Employee | Leave | Swap | Settings | Security | Data", "ref": "string", "empId": "string", "date": "YYYY-MM-DD", "summary": "string", "changes": [{ "f": "field", "from": "any", "to": "any" }], "reason": "string" }]
}
```

Keys of `approvals` and `published` use the week-start date (Monday by default, or Sunday via the `weekStartsOn` prop). `toEmp: ''` on a swap means an open offer. `audit` is newest-first and capped at 3,000 entries.

### Derived, never stored

| Value | Rule |
| --- | --- |
| Scheduled hours | `end − start − break`. If `end ≤ start`, the shift crosses midnight |
| Actual hours | Same rule, applied to the actual times |
| Paid hours | Actual where recorded, otherwise scheduled |
| Overtime | Paid hours above `standardWeekly`, per employee per week |
| Flags | Missing times, Missing actuals (past and no actuals), Over schedule (+15 min), Long shift, Scheduled, Complete |
| Late / early | Actual start or end more than `lateMins` from schedule |
| Rule breaches | Rest gap < `minRest`, week > `maxWeekly[contract]`, consecutive days > `maxDays`. These are warnings only |
| Locked | `approvals[empId|weekStart]` exists. Edits need a reason and are logged as amendments |

## 3. Persistence today

- **Load:** the `constructor` reads `localStorage[KEY]` synchronously. If it is empty, `seed()` is used and saved on mount.
- **Save:** `persist()` writes the whole snapshot after every change. Changes reach it through `commit()` → `setState` → `persist()`.
- **Audit:** `commit(patch, entries)` prepends audit entries. Every user action passes through this, so it is the one place to hook a server write.

## 4. Admin login (browser-level)

- **PIN storage:** only a digest is stored. The constant `AUTH = { salt, hash, rounds: 60000 }` holds the result of SHA-256 run 60,000 times over `salt + ':' + PIN`, re-salted each round. `derivePin()` reproduces it.
- **Session:** `sessionStorage['nexyra.rota-timesheet.session']`. It is cleared on tab close, after 30 minutes idle (`IDLE_MS`), or by Lock.
- **Lockout:** 5 failed attempts pause sign-in for 5 minutes, tracked in `localStorage['nexyra.rota-timesheet.lockout']`.
- **Audit:** sign-in, failure and sign-out are logged with entity `Security`.
- **Limits:** this deters casual access only. It is not access control: anyone with developer tools on the device can read localStorage or bypass the screen. Replace it with server authentication (section 6).

### Changing the PIN

Run this in any browser console with `src/index.html` open, then paste the output over `AUTH` and rebuild:

```js
const salt = Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2, '0')).join('');
// temporarily set AUTH.salt = salt in the console, then:
AUTH.salt = salt; console.log(JSON.stringify({ salt, hash: derivePin('NEW-PIN'), rounds: 60000 }));
```

## 5. Building for deployment

The production `index.html` is `src/index.html` with every external reference (scripts, CSS, fonts, SVGs, the PDF library) inlined. Any HTML inliner works, for example `npx inline-source` or `npx html-inline`. The design tool used for this project also produces the build directly.

Check the build:

- it opens with no network access;
- the file contains no plain-text PIN;
- the sidebar icons show (they are data URIs in `NAV_ICONS`).

## 6. Moving to a server database

Every feature reads one snapshot and writes through `commit()` → `persist()`. A server can be added without changing any screen.

### Step 1 — snapshot API (smallest change)

| Method | Path | Body / response |
| --- | --- | --- |
| `GET` | `/api/organisations/{orgId}/snapshot` | `200 { "snapshot": Snapshot }` with an `ETag`. Returns `404` when the organisation is new |
| `PUT` | `/api/organisations/{orgId}/snapshot` | Request `{ "snapshot": Snapshot }` with `If-Match: <ETag>`. Returns `200`/`204` with a new `ETag`, or `412` if someone else saved first |

Code changes in `src/index.html`:

1. **Boot:** add `booting: true` to state. In `componentDidMount`, `await` the GET, then `setState` with the snapshot. Render a loading screen while `booting` is true.
2. **Save:** in `persist()`, replace `localStorage.setItem` with a debounced (about 600 ms) PUT. Keep localStorage as an offline cache.
3. **Conflict:** on `412`, show "Someone else saved a newer version. Reload to see their changes."

`integration/store-adapter.js` implements this pattern (`load()`, `save()`, ETag handling, local cache fallback) and can be adapted directly.

### Step 2 — record-level API (multi-user)

Add record endpoints so managers editing at the same time don't overwrite each other:

`/employees`, `/shifts?from=&to=&location=`, `/leave`, `/swaps`, `/approvals/{empId}/{weekStart}`, `/rota-weeks/{weekStart}/publish`, `/audit?from=&to=` (append-only, server-timestamped).

Each `commit()` call already carries an audit entry describing exactly what changed (`entity`, `ref`, `changes`). Map those to the matching record call.

### Suggested tables

`organisations`, `locations`, `departments`, `users`, `employees`, `shifts`, `leave`, `shift_swaps`, `timesheet_approvals (employee_id, week_start)`, `rota_publications (location_id, week_start)`, `shift_templates`, `settings`, `audit_log`. Every table carries `organisation_id`, and operational tables also carry `location_id`.

### Authentication and roles

- Replace the PIN screen with server sign-in (OIDC, magic link, or email and password with MFA). Keep the same UI shell.
- Roles: Administrator (organisation-wide), Manager (scoped to locations), Employee (own rota, leave and swap requests).
- Enforce all rules on the server: approval locks, required amendment reasons, and published-week change tracking.

### Migrating existing browser data

Add a one-off **Upload this browser's data** action. It reads `localStorage['nexyra.rota-timesheet.v1']` and PUTs it as the first snapshot.

## 7. Known constraints

- **One store per browser:** data lives in localStorage on each browser and device (typically 5–10 MB). The audit log is capped at 3,000 entries for this reason.
- **Rules warn, never block:** working-time rules don't prevent saving. Confirm the intended policy before enforcing them on the server.
- **No drag and drop on mobile:** below 760px wide, moving a shift is done through the edit form.
- **PDF is generated in the browser:** reports are A4 landscape.
