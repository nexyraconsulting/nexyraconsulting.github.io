# NEXTime update — Timesheets table actions

Date: 2026-10-08

## Deploy
Replace one file on the server:

- `deploy/nextime/index.html` → overwrite `nextime/index.html`

No other files changed. Browser data is unaffected.

## Developer source (optional)
- `developer/src/index.html` → overwrite `developer/src/index.html` in the source package.

## Changes (UI only — no functional changes)
- Timesheets table stays inside its container; a horizontal scrollbar appears only when the columns don't fit. Keyboard-scrollable (focusable region).
- Actions column is pinned to the right edge while scrolling, so actions are always reachable.
- "As scheduled", "Edit/Amend" and "Delete" text buttons replaced with calendar, pencil and bin icons.
- Hover / keyboard-focus tooltips show the action name; each icon has an `aria-label`.
- Mobile cards use the same icons at 44px touch size.
