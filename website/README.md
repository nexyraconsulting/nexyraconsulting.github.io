# Nexyra Consulting — latest site (deployment package)

Static site exported from the current live design. No build step. Upload the **contents of this folder** to any static host (Netlify drop, Vercel, Cloudflare Pages, GitHub Pages, cPanel `public_html`).

## Pages

- `index.html` — Home
- `about.html`, `services.html`, `work.html`, `pricing.html`, `insight.html`, `careers.html`, `contact.html`, `location.html`
- `services-<name>.html` — the eleven service detail pages
- `privacy-policy.html`, `terms-of-use.html`, `cookie-policy.html`, `sitemap.html`
- `404.html` — not-found page

## Assets

- `assets/` — all site photography
- `brand/` — logo lock-ups, monogram, favicon
- `zx-search-index.js`, `zx-search-engine.js`, `zx-parallax.js` — site search and scroll motion, loaded by every page

Each page is self-contained (code, styles and most images are embedded); `assets/` and `brand/` cover images loaded at runtime. Keep both folders beside the pages.

## Includes

All approved changes: restored Accounts & Business Services page and Services entry, Signature Gradient CTA on service pages, 15% larger logo, 30px top spacing below the header.

## External

Google Fonts (Hanken Grotesk) loads from its CDN; the Contact form posts to Web3Forms.
