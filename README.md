# Nexyra Consulting Ltd. — Landing Page

Static, dependency-free deployment package. No build step: upload the contents of this folder to any web host.

## Structure

```
site/
├── index.html                  # the landing page (hero, capabilities, our works, contact, footer)
├── css/
│   └── styles.css              # all styling + brand tokens (CSS custom properties in :root)
├── assets/
│   ├── logo/                   # Nexyra logo suite (SVG)
│   │   ├── lockup-horizontal-on-light.svg   # header
│   │   ├── lockup-horizontal-on-dark.svg    # footer
│   │   ├── lockup-horizontal-mono-black.svg
│   │   ├── lockup-vertical-on-light.svg
│   │   ├── lockup-vertical-on-dark.svg
│   │   ├── lockup-vertical-gradient.svg
│   │   ├── monogram-gradient.svg            # footer mark + favicon
│   │   ├── monogram-on-light.svg
│   │   └── monogram-on-dark.svg
│   └── img/
│       ├── thepintbar-timesheet.png         # project screenshot
│       ├── thepintbar-inventory.png         # project screenshot
│       └── og-image.png                     # 1200x630 social share image
├── robots.txt
├── sitemap.xml
└── .nojekyll                   # required for GitHub Pages (keeps folders starting with _)
```

## Deploy

- **GitHub Pages** — commit the contents of `site/` to the repository root (or `/docs`) and enable Pages on that branch/folder.
- **Netlify / Vercel / Cloudflare Pages** — drag the folder in, or set publish directory to `site`, build command empty.
- **Traditional hosting** — upload via SFTP to the web root. No server-side requirements.

## Brand tokens

Edit the `:root` block at the top of `css/styles.css`:

| Token | Value | Use |
| --- | --- | --- |
| `--nx-ink` | `#0A0A0B` | body ink, dark grounds |
| `--nx-ink-soft` | `#4A4A52` | body copy |
| `--nx-violet` | `#7C3AED` | accent, focus ring |
| `--nx-violet-deep` | `#5B21B6` | small accent text (AA on white) |
| `--nx-violet-light` | `#A78BFA` | accent on dark grounds |
| `--nx-blue` | `#2563EB` | gradient end |
| `--nx-gradient` | violet → blue | primary buttons, contact band |

Typography: **Hanken Grotesk** (300/400/500/600/700) loaded from Google Fonts. To self-host, drop the woff2 files into `assets/fonts/`, replace the `<link>` in `index.html` with `@font-face` rules in `styles.css`.

## Notes

- The Pint Bar **Brand System** card shows a live, non-interactive `<iframe>` of the project page. To use a static screenshot instead, save a PNG as `assets/img/thepintbar-brand.png` and replace the iframe with:
  `<img src="assets/img/thepintbar-brand.png" alt="The Pint Bar Brand System" loading="lazy">`
- All project links and the Contact Us link open in a new tab (`target="_blank" rel="noopener"`).
- Contact CTA points to `https://nexyraconsulting.co.uk/contact` — update in `index.html` (4 occurrences) if the URL changes.
- Layout is fully fluid (CSS grid `auto-fit` + `clamp()`); tested desktop → mobile. Touch targets are min 44px.
- Update `<link rel="canonical">`, `og:url` and `sitemap.xml` to the production domain before launch.
