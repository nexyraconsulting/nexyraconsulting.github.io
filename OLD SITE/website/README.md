# NEXYRA Consulting — deployment package

A plain static site. No build step, no framework, no server code. Upload the **contents of this folder** to any static host and it works.

## Structure

```
index.html            Homepage
404.html              Not-found page (most hosts serve this automatically)
services/index.html   Services
work/index.html       Work — category filter
pricing/index.html    Pricing — both engines, stage switcher
about/index.html      About
location/index.html   Location — world map + studio details
contact/index.html    Contact — validated form, live email delivery
assets/css/styles.css One stylesheet, shared by every page
assets/js/site.js     One script: nav, filters, tabs, map, form
assets/brand/         Logo lockup + monogram (SVG)
```

Pages link to each other with relative paths, so the site works at a domain root **or** in a subfolder (e.g. GitHub Pages project sites) with no changes. URLs come out clean: `/services/`, `/work/`, `/contact/`.

## Deploying

- **Netlify** — drag this folder onto app.netlify.com/drop.
- **Vercel** — run `vercel deploy` inside this folder; framework preset "Other".
- **Cloudflare Pages** — connect the repo, leave the build command empty, output directory `/`.
- **GitHub Pages** — commit these files to the branch/folder you serve from.
- **cPanel / FTP** — upload the contents into `public_html`.

Do not upload the folder itself as a nested directory unless you intend the site to live under that path.

## What runs where

Everything is server-free. Interactivity is vanilla JS in `assets/js/site.js`:

- mobile nav toggle (under 860px)
- Work page category filter
- Pricing page Discover / Build / Run switcher (tabs and pills stay in sync)
- Location page pin + studio-card selection
- Contact form validation and submission

## External resources

The pages fetch a few things from public CDNs, so visitors need normal internet access:

- **Google Fonts** — DM Sans, Hanken Grotesk, Inter Tight, JetBrains Mono, DM Mono
- **d3-geo + topojson + world-atlas** (jsDelivr) — only on `location/`, to draw the world map. If it fails to load, the page falls back to the studio list; nothing breaks.
- **Unsplash** — the six project images on `work/`

To self-host any of these, download the file, drop it in `assets/`, and repoint the URL in the page `<head>` (fonts, images) or in `assets/js/site.js` (map libraries).

## Contact form

`contact/index.html` submits to **Web3Forms** with access key
`30117b51-b50f-4e59-9611-f16935eb19f7`, delivering to hello@nexyraconsulting.co.uk.
It works the moment the site is live — nothing to configure.

Required fields are name, email and project description (min. 20 characters); errors show inline. On success the form is replaced by a confirmation panel.

To change the recipient: create a new access key at web3forms.com and replace the `KEY` value near the bottom of `assets/js/site.js`.

## Editing content

All copy is plain HTML — open the page and edit the text. Colors, type and spacing are CSS variables at the top of `assets/css/styles.css` (`--accent`, `--bg`, `--f-head`, …); change one there and it updates site-wide.

## Not included

The hidden internal routes from the Figma Make package (`/brand`, `/brandbook`) have not been rebuilt.
