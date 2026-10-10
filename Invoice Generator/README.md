# Nexyra Consulting — Invoice Generator

Static site. No build step, no server-side code, no dependencies to install.

## Contents

    index.html                          the application
    .nojekyll                           keeps GitHub Pages from filtering files
    site.webmanifest                    PWA manifest (installable, themed #9333EA)
    scripts/
      support.js                        runtime required by index.html
      ds-bundle.js                      design-system component bundle
    styles/
      styles.css                        all colours, type and spacing tokens
    assets/icons/                       favicons and app icons
      favicon.svg                       primary icon (scalable)
      favicon.ico                       legacy fallback, 32×32
      favicon-16/32/48.png              raster fallbacks
      apple-touch-icon.png              180×180, iOS home screen
      icon-192.png, icon-512.png        PWA icons
      icon-maskable-512.png             Android adaptive (square, no rounding)
    assets/brand/                       source brand artwork (reference copies)

## Deploying

All paths are relative and plainly named — no underscore-prefixed folders, which
GitHub Pages and some other hosts silently skip.

Upload the whole folder, preserving structure, to any static host — Netlify, Vercel,
Cloudflare Pages, GitHub Pages, S3 + CloudFront, or a plain Apache/nginx directory.
Serve `index.html` at the site root. Nothing needs Node, PHP or a database.

Local check before you upload — open a terminal in this folder and run:

    python3 -m http.server 8080

then visit http://localhost:8080. Opening `index.html` by double-click also works,
but a local server is a truer test of the relative paths.

## External requests

The page loads two third-party resources over HTTPS at runtime:

  - fonts.googleapis.com / fonts.gstatic.com — Hanken Grotesk (the logo wordmark)
  - cdnjs.cloudflare.com — QR code generator (qrcodejs)
  - cdnjs.cloudflare.com — html2canvas + jsPDF (the Download PDF function)

To run fully offline or behind a strict CSP, download those two files into
`assets/vendor/` and repoint the `<link>` and `<script>` tags at the top of
`index.html`. The invoice degrades gracefully without the QR library: all payment
details still print as text.

## Data storage

Invoices, client profiles and the working draft are held in the browser's
localStorage on the user's own device. Nothing is transmitted anywhere. Clearing
site data clears saved invoices, and they do not sync between devices or browsers.
Use **Save to folder…** (Chrome/Edge) to keep durable copies on disk.

## Invoice PDFs

**Download PDF** builds a multi-page A4 PDF in the browser and downloads it
directly — no print dialog. The file is named after the invoice number. Pages are
rendered at 3× so the small print and QR code stay sharp; the trade-off is that
the text is rasterised rather than selectable.

If the html2canvas/jsPDF libraries cannot load, the button falls back to the
browser print dialog. There, choose "Save as PDF", margins None, scale 100%.

**Save to folder…** writes a print-ready HTML copy plus a JSON record into a
directory you choose (Chrome and Edge only; elsewhere it downloads). That HTML
carries its own A4 print rules and prints faithfully, backgrounds included.

## Fixed company details

The Nexyra name, address, company registration number (17399742) and bank details
are hard-coded in `index.html` and deliberately not editable in the interface.
To amend them, search `index.html` for "Boveney" (address), "17399742"
(registration) and "33219546" (bank).
