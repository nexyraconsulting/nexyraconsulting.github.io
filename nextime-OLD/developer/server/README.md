# NEXTime reference server

Node.js 18+, Express, PostgreSQL. Implements `../docs/api-contract.md` Step 1:

- `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` — email and password, scrypt hashes, signed httpOnly session cookie, 5-attempt lockout
- `GET` / `PUT /api/organisations/{orgId}/snapshot` — ETag versioning, `412` on conflict
- `GET /api/organisations/{orgId}/audit` — permanent audit history (copied from each save)
- `GET /api/health`
- Serves the built app from `STATIC_DIR` (default `../../deploy/nextime`)

## Run

```bash
cp env-example.txt .env        # edit it
npm install
psql "$DATABASE_URL" -f ../database/schema-postgresql.sql
npm run create-user -- admin@example.com "Site Admin" Administrator
npm start
```

Open `http://localhost:8080/`. For local http testing set `COOKIE_SECURE=false` in `.env`.

## Files

| File | Purpose |
| --- | --- |
| `server.js` | The whole server (about 250 lines) |
| `package.json` | Dependencies: `express`, `pg` |
| `env-example.txt` | Settings template; copy to `.env` |

## Notes

- One organisation per deployment by default (`ORGANISATION_ID`). For several, create users with different `ORGANISATION_ID` values; every request is checked against the user's organisation.
- `PUT` bodies up to 15 MB are accepted. A year of data for 50 staff is typically under 3 MB.
- Not included on purpose: password reset email, SSO, rate limiting beyond sign-in. Add them with your organisation's standard tools.
