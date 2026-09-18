# Nexyra Consulting — Digital Business Card

## Files

- `index.html` — **the deployable file.** Fully self-contained: logos, fonts, favicon, QR library and runtime are all inlined. No build step, no dependencies, works offline. This is the only file you need to host.
- `favicon.svg` — the violet Nexyra app icon. Already inlined in `index.html`; this loose copy is only for hosts that also want a `/favicon.svg` at the domain root.
- `source/Nexyra Digital Card.dc.html` — editable source, with `source/support.js` (its runtime) and `source/assets/` (nine logo variations + app icon). Keep these three together; open the `.dc.html` in a browser to work on it.

## Owner vs. recipient

Share links carry the card's details in the URL fragment (`…/#c=…`), so a recipient sees the owner's card exactly as shared, **view-only**: the style switcher, Edit details, Save contact and Share controls are all absent for them. Only **Flip card** and the card's own contact links (tap to call, email, LinkedIn) stay live. Nothing a recipient does is saved.

The owner — anyone opening the plain URL with no `#c=` fragment — keeps full editing and management access.

## Two card styles

The header switcher offers **Ink** (dark, default) and **White**. The choice — like the field edits — is remembered per visitor. To ship one style as the published default, set the `cardTheme` prop (`ink` | `white`) in the source component and re-export. Logo variants swap automatically on the white card so white-on-white never occurs.

## Deploy

Any static host works. Upload `index.html` as-is:

- **Netlify / Vercel** — drag the file into the dashboard, or `netlify deploy --prod --dir .`
- **Cloudflare Pages / GitHub Pages** — commit `index.html` on the published branch
- **Own server** — drop it in the web root; nothing else is required

Recommended URL: `card.nexyraconsulting.co.uk` or `nexyraconsulting.co.uk/card`.

## Share links

No third-party shortener is used — nothing leaves your site. The card packs its details positionally (no field names), compresses them with the browser's own deflate, and base64url-encodes the result, so the share link is roughly a third the length of the raw data and looks like:

```
https://card.nexyraconsulting.co.uk/#k=z<compressed>
```

WhatsApp, Email, Copy link, LinkedIn, native share and the QR code all use this one link, and the share sheet shows it with its own Copy button. Older `#c=` links still open correctly.

For a genuinely tiny address, host at a short path (see below) — the fragment length is the price of a card that works with no server or database behind it.

## Point the share links at your live address

Share links and the QR code use, in order: the **Published card URL** field in Edit details → the `shareUrl` prop → the page's own address.

So: open `index.html` on the host, open Edit details, and put the live address (e.g. `https://card.nexyraconsulting.co.uk`) in **Published card URL**. Every share target and the QR code then point there. Opening the file straight from your computer (`file://…`) without that field set cannot produce a shareable link — the share sheet says so.

To bake it in for everyone, set `cardUrl` in `DEFAULTS` in the source component and re-export.

Use **Preview as recipient** at the bottom of Edit details to see exactly what a recipient gets.

## Editing details

Details entered in the "Edit details" drawer are saved in the visitor's own browser (localStorage), so they do not change what other people see. To change the **published** defaults, edit `DEFAULTS` in the source component and re-export:

1. Update `DEFAULTS` (name, job title, phone, email, website, address, LinkedIn, WhatsApp, tagline).
2. Re-run the standalone export to regenerate `index.html`.

Leaving a field empty removes it from the card entirely — no gaps, no placeholders.

## Brand notes

Colours, type and logo treatment are taken from the supplied Nexyra logo artwork:

- Gradient: `#A78BFA` → `#7C3AED` (39%) → `#3B82F6`
- Accents: violet `#9333EA`, blue `#2563EB`
- Ground: `#07070C` page, `#0B0B12` card
- Typeface: Hanken Grotesk (500/600 display, 300/400 text)
- Zero corner radius throughout; flush-left hierarchy

Default logo: **lockup — on dark**. Light-ground logo variants are given a white plate automatically so clear-space rules hold.
