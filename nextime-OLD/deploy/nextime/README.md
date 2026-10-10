# NEXTime Rota & Timesheet — deployment

## Folder

```
nextime/
├── index.html        The application (self-contained: styles, scripts, fonts, logos, icons and PDF engine built in)
├── README.md         This file
└── assets/
    ├── brand/logos/  NEXTime logos for brand use (website, documents, email)
    ├── brand/icons/  App icon and favicon SVGs
    ├── icons/        Interface icons (reference copies)
    └── fonts/        Hanken Grotesk webfonts and licence (OFL.txt)
```

`index.html` loads nothing from `assets/` and works on its own. `assets/` is for brand use and can be removed.

## Deploy

1. Upload the whole `nextime` folder to your web root, for example `public_html/nextime/`.
2. Open `https://your-domain.com/nextime/`. The server serves `index.html` automatically.
3. To use a different address, rename the folder (lowercase letters, numbers and hyphens only).

No build step, database, server language or configuration is needed. Any static host works (Apache, Nginx, IIS, cPanel, Netlify, S3).

## Updating from the earlier version

Upload the new `index.html` (or the whole folder). Saved data is kept because it lives in each browser, tied to the domain, not the folder or file.

## Access

The app opens on an Admin Login screen. Only a salted digest of the PIN is in the code. 5 wrong attempts pause sign-in for 5 minutes; sessions end when the tab closes, after 30 minutes idle, or with Lock. This is a browser-level lock: for real protection also password-protect the folder on the web server (cPanel "Directory Privacy", `.htaccess` or Nginx basic auth) until the server database is in place.

## Data

- Saved automatically in the visitor's browser (localStorage), per device.
- Not shared between people or devices until the server database is connected (see `developer/docs/database-integration.md`).
- Clearing browser data deletes it. Use Payroll CSV and Download PDF to keep copies.
- Sample data (Nexyra Hospitality Group) loads on first visit. Clear it in Settings → Data before going live.

## Requirements

- HTTPS recommended.
- No internet connection or CDN needed at runtime.
- Current Chrome, Edge, Safari and Firefox, desktop and mobile.

## Recommended server headers

```
Cache-Control: no-cache            # for index.html, so updates show immediately
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```
