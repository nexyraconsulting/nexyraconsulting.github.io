# Nexyra Consulting — latest site (deployment package)

Static site exported from the current live design. No build step. Upload the **contents of this folder** to any static host (Netlify drop, Vercel, Cloudflare Pages, GitHub Pages, cPanel `public_html`).

## Pages

- `index.html` — Home
- `about.html`, `services.html`, `work.html`, `pricing.html`, `insight.html`, `careers.html`, `contact.html`, `location.html`
- `services-<name>.html` — the eleven service detail pages
- `privacy-policy.html`, `terms-of-use.html`, `cookie-policy.html`, `sitemap.html`
- `404.html` — not-found page

## Assets

- `assets/` — site photography (top level), plus:
  - `assets/js/` — page runtime, React, site search and scroll motion scripts
  - `assets/css/` — font stylesheets
  - `assets/fonts/` — Hanken Grotesk web fonts (self-hosted)
  - `assets/img/` — page images and the loader graphic
  - `assets/components/` — shared navigation, footer and service-page parts
- `brand/` — logo lock-ups, monogram, favicon

Pages are unbundled: each HTML file is small (3–45 KB) and loads its scripts, fonts and images from `assets/`. This avoids server limits on large files (the cause of the earlier 500 errors). Keep `assets/` and `brand/` beside the pages, and upload every file, including `.dc.html` files in `assets/components/`.

`404.html` uses `<base href="/">` so it renders at any missing URL. It assumes the site is served from the domain root. If you host it in a subfolder, change that line to the subfolder path, e.g. `<base href="/nexyra/">`.

## Includes

All approved changes: restored Accounts & Business Services page and Services entry, Signature Gradient CTA on service pages, 15% larger logo, 30px top spacing below the header, the "Split Assembly" monogram loading animation, mobile search-icon alignment fix, and home page links (hero pillars → matching Services sections; "What we do" list → each service page) (shown only while a page loads; still for visitors with reduced motion turned on).

## External

Fonts and scripts are self-hosted; no CDN is required. The Contact form posts to Web3Forms.
