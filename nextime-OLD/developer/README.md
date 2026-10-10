# NEXTime Rota & Timesheet — developer pack

```
developer/
├── README.md                       This file
├── src/                            Editable source; serve this folder to run it
│   ├── index.html                  Application (template + logic + login)
│   ├── vendor/
│   │   ├── dc-runtime.js           Component runtime (React-based, bundled)
│   │   └── design-system/          styles.css (base classes), ds-bundle.js
│   └── assets/
│       ├── brand/logos/            NEXTime logos (used by the app: reverse, dark)
│       ├── brand/icons/            nextime-icon.svg (favicon), gradient icon
│       ├── icons/                  Lucide icons, 1.5px stroke
│       └── fonts/                  Hanken Grotesk (OFL.txt)
├── docs/
│   ├── database-integration.md     START HERE for the server database work
│   ├── architecture.md             Code map, data model, login, build
│   ├── api-contract.md             Endpoints, status codes, server rules
│   ├── go-live-checklist.md        Switch-over steps
│   └── product-notes.html          Feature parity and recommended improvements
├── api/
│   └── openapi.yaml                OpenAPI 3 contract
├── database/
│   ├── schema-postgresql.sql       PostgreSQL 14+ (recommended)
│   └── schema-mysql.sql            MySQL 8 / MariaDB 10.6+
├── server/                         Reference API server: Node.js 18+, Express, PostgreSQL
│   ├── server.js · package.json · env-example.txt · README.md
└── integration/
    ├── config.js                   NEXTIME_CONFIG: 'local' or 'api'
    ├── store-adapter.js            Snapshot load/save with ETag and offline cache
    └── app-changes.md              The six edits to src/index.html
```

## Quick start (as it is today)

1. `npx serve src` (or `python3 -m http.server -d src`).
2. Open the printed URL and sign in with the admin PIN (supplied separately; it isn't in the code).
3. Sample data loads on first run.

## Quick start (with the server database)

```bash
cd server && cp env-example.txt .env    # edit DATABASE_URL, SESSION_SECRET
npm install
psql "$DATABASE_URL" -f ../database/schema-postgresql.sql
npm run create-user -- you@example.com "Your Name" Administrator
npm start                               # http://localhost:8080
```

Then apply `integration/app-changes.md` and set `dataSource: 'api'` in `config.js`.

## Build for deployment

`../deploy/nextime/index.html` is `src/index.html` with every script, stylesheet, font and image inlined (architecture.md section 5). Rebuild it after any change in `src/`.

## Brand

`../brand/nextime-visual-language.md`. Use the SVG logos as files; don't retype the wordmark.
