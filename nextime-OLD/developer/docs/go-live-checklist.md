# Go-live checklist (server database)

## Before

- [ ] Database created with `schema-postgresql.sql` (or `schema-mysql.sql`), backups switched on, one restore tested
- [ ] Server running behind HTTPS on the final domain; `/api/health` returns `{"ok":true}`
- [ ] `.env` filled in: strong `SESSION_SECRET` (32+ characters), `COOKIE_SECURE=true`, correct `ORGANISATION_ID`
- [ ] `.env` is not in version control and not inside the public web folder
- [ ] Accounts created for every Administrator and Manager; temporary passwords shared securely and changed
- [ ] `integration/app-changes.md` applied; app rebuilt; `config.js` set to `dataSource: 'api'`
- [ ] Tested in two browsers: same data in both; a conflicting save shows the "newer version" message
- [ ] Sample data (Nexyra Hospitality Group) cleared in Settings → Data if it isn't wanted on the server

## Switch-over day

- [ ] Ask everyone to stop editing in the browser-only version
- [ ] From the browser with the real data, sign in once as an Administrator (uploads it as version 1)
- [ ] Check `select version, updated_at from organisation_snapshots;` shows version 1
- [ ] Spot-check this week's rota, timesheets and approvals against a Payroll CSV exported beforehand
- [ ] Tell everyone the new address and how to sign in

## After

- [ ] Remove the PIN digest (`AUTH`) from `src/index.html` and rebuild
- [ ] Review `audit_log` growth after one week
- [ ] Plan Step 2 (record-level API) if more than three people edit at the same time
