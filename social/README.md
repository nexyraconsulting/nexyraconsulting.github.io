# Nexyra Consulting — Social Media Template System

Self-contained browser app. No build step, no server-side code, no dependencies to install.

## Contents

```
dist/
├── index.html                 The editor (entry point)
├── js/
│   └── support.js             Runtime that renders the app
├── assets/
│   └── brand/
│       ├── app-icon-violet.svg               favicon / app icon
│       ├── lockup-horizontal-mono-black.svg  UI header lockup
│       └── lockup-horizontal-mono-white.svg  spare, for dark chrome
└── README.md
```

## Deploying

Upload the contents of `dist/` to any static host — Netlify, Vercel, Cloudflare Pages,
GitHub Pages, S3 + CloudFront, or a plain Apache/nginx directory. `index.html` must sit
at the root of whatever path you serve, with `js/` and `assets/` beside it.

Netlify / Vercel: drag the `dist` folder in, or set publish directory to `dist` with no
build command.

Must be served over **http:// or https://**, not opened as a `file://` path — the canvas
export reads pixels back out of the canvas, which browsers block on `file://`.

## Requirements

- Modern Chromium, Safari or Firefox. Chromium recommended.
- Internet access on first load for two external resources:
  - Hanken Grotesk from Google Fonts
  - Unsplash placeholder photography
  Both are cosmetic. If the deployment must be fully offline, self-host the font
  (replace the `fonts.googleapis.com` link in `index.html` with a local `@font-face`)
  and swap the `PH` image ids in the logic block for local files in `assets/`.

## What the app does

Six formats, one shared content model:

| Format | Size | Layout |
|---|---|---|
| Instagram Post | 1080 × 1080 | original — paper split, media above, type below |
| Facebook Post | 1200 × 630 | original — violet field left, angled media right |
| LinkedIn Post | 1200 × 627 | original — photo-dominant, scrim, type bottom-left |
| Instagram Story | 1080 × 1920 | adapted from Instagram |
| LinkedIn Square | 1200 × 1200 | adapted from LinkedIn |
| Facebook Square | 1080 × 1080 | adapted from Facebook |

- Upload JPG, JPEG, PNG, WebP or MP4 (button or drag onto the canvas)
- Drag the media to reposition, scroll or use −/+ to zoom, nudge pad for 24px steps,
  centre and reset. Offsets are clamped so the mask never shows a gap.
- Each format remembers its own crop; **Apply this framing to all formats** pushes the
  current crop, zoom and text placement to all six, rescaled per aspect ratio.
- Editable eyebrow, headline, supporting text and CTA; CTA can be hidden.
  Text block nudges horizontally and vertically within the layout.
- Export: PNG @2x per format, all six PNGs at once, or MP4 of a video composition with
  the branding burned in (Chromium writes H.264 MP4; Safari and Firefox fall back to WebM).
- Caption panel with per-platform character counts and hashtag chips.

Everything renders through one canvas compositor, so the on-screen preview, the PNG and
the MP4 are pixel-identical.

## Content-driven layout

Type sizes are fixed by the design and never shrink. Instead each template measures the
block — eyebrow, headline, supporting text, CTA — at its designed sizes and then allocates
space around it:

- **Instagram / Story (split)** — the media band gives way so the content band can hold the
  block; media never falls below 32% of the height.
- **Facebook / FB Square (field)** — the field widens (up to 74% of the width) or grows
  downward first, so longer copy re-wraps into fewer lines. If the block still needs more
  room, the lockup relocates to the top of the field with its rule beneath it and the copy
  takes the rest.
- **LinkedIn / LI Square (photo)** — the block widens (up to 82%), then climbs from the
  bottom edge, and the scrim grows with it. A ceiling below the lockup stops them colliding.

The text-block nudge sliders are clamped to the space that is actually free, so a nudge can
never push copy into the logo or off the artboard.

## Accent colour

An **Accent** section in the composer changes the accent across all six templates at once —
the violet field and gradient, the CTA fill, the section rules and the eyebrow.

Built-in options:

| Option | Value |
|---|---|
| Signature gradient | 135° · #A78BFA 0% → #7C3AED 39% → #3B82F6 100% |
| Violet — primary | #7C3AED |
| Blue — secondary | #2563EB |

Plus **Custom**, in either mode: a single solid colour, or a two-colour gradient with a
picker at each end. Gradients always run at 135°; solids stay flat except on the large
violet field, which keeps a deep tonal step for depth. Text colours derive automatically
from the chosen accent so contrast holds: small type is darkened step by step until it clears
4.5:1 against the lightest ground it sits on, and labels on an accent fill flip between white and
ink based on the fill's luminance — so even a pale yellow or near-white pick stays legible in the
PNG and MP4 export, not just on screen.

To change the built-in options, edit the `ACCENTS` table at the top of the logic block in
`index.html` — each entry carries its gradient stops, a `key` colour for rules and ticks,
and an `ink` colour for type on light grounds.

## Locked brand elements

Not editable from the UI, by design: the Nexyra lockup and its position, the violet
field geometry, the diagonal cut (set to the angle of the N in the mark), the violet
rules, the type family and the type scale per format.

To change them, edit the constants at the top of the logic block in `index.html`:
`V` / `VD` / `VDK` (violet ramp), `INK`, `PAPER`, `TAN` (the brand diagonal), and the
per-format `FORMATS` table which carries each layout's padding and type sizes.

## Note on brand source

The palette and typography here were derived from the supplied logo files — violet
`#9333EA`, Hanken Grotesk 500/400, and the mark's own cut angle. They were **not**
checked against the Nexyra Brand Guidelines document, which was not accessible.
Confirm the violet ramp and type scale against the guidelines before publishing.
