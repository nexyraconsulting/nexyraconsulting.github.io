# NEXTime visual language

Version 1 · October 2026. Visual reference: `nextime-visual-language.html` (open in any browser).

## Character

Flat, architectural and precise. Ink on white, one brand violet, square corners and strong 2px rules. Colour marks the brand, the primary action and status, never decoration.

## Logo

Monogram + **NEXTime** wordmark with **ROTA & TIMESHEET** beneath.

- "NEX" in capitals, in ink (`#0A0A0F`/black) or white.
- "Time" in sentence case (capital T), in Brand Violet `#7C3AED`.
- "ROTA & TIMESHEET" sub-line unchanged: tracked capitals, ink, white or Signal Blue `#2563EB`.
- Wordmark outlined from Hanken Grotesk Medium, tracking 1.94 so NEXTime is the same width as the sub-line. Never retype it; use the SVG files.

| File | Use |
| --- | --- |
| `logos/nextime-logo-reverse.svg` | Gradient monogram, black text. Light and violet-tint grounds (app sidebar) |
| `logos/nextime-logo-light.svg` | Black monogram and text, blue sub-line. White grounds, documents |
| `logos/nextime-logo.svg` | Primary on dark: gradient monogram, white text |
| `logos/nextime-logo-dark.svg` | White monogram and text, blue sub-line. App top bar, PDF header |
| `logos/nextime-logo-mono-black.svg` | One colour black (print, fax, stamps) |
| `logos/nextime-logo-mono-white.svg` | One colour white (violet grounds, photo overlays) |
| `logos/nextime-logo-vertical.svg` / `-vertical-light.svg` | Stacked, for square spaces |
| `icons/nextime-icon.svg` / `nextime-icon-gradient.svg` | Monogram only: favicon, app icon, avatar |
| `logos/nexyra-consulting-logo-on-dark.svg` / `-on-light.svg` | Parent company lock-up (login screen) |

- **Clear space:** the height of the "N" cap on every side (the SVG artboards include it).
- **Minimum size:** horizontal logo 140px / 35mm wide; below that use the icon (16px minimum).
- **Don't:** recolour "NEX", set "TIME" in capitals, stretch, rotate, outline, add shadows, or place the colour logo on busy photos.

## Colour

Balance 60 / 30 / 10: white and ink carry the screen, violet tints carry structure, solid violet is the accent.

| Name | Hex | Use |
| --- | --- | --- |
| Brand Violet | `#7C3AED` | "Time", primary button, active nav item, focus ring |
| Violet Deep | `#6D28D9` | Hover, kicker labels, links |
| Violet Deeper | `#5B21B6` | Pressed, text on violet tint |
| Violet Night | `#2E1065` | Strong text on violet tint |
| Violet Tint | `#EDE9FE` | Sidebar background, selection |
| Violet Mist | `#DDD6FE` | Hover on tint, dividers on tint |
| Violet Light | `#A78BFA` | Gradient start, toast marker |
| Signal Blue | `#2563EB` | Logo sub-line, Publish rota |
| Sky Blue | `#3B82F6` | Gradient end |
| Ink | `#0A0A0F` | Text, 2px section rules, dark bars |
| Graphite | `#4A4A5A` | Secondary text |
| Slate | `#6B6B7B` | Table headers, captions |
| Line | `#E7E7EC` | 1px dividers, input borders |
| Mist | `#F7F7F9` | Row hover, subtle fills |
| Alert | `#DC2626` | Error text, alert badges |
| Success | `#16A34A` (dot `#22C55E`) | Saved / live status |

**Signature gradient:** `linear-gradient(135deg, #A78BFA 0%, #7C3AED 39%, #3B82F6 100%)`. Only on the monogram, the login background and the 3px stripe at the foot of the sidebar.

Contrast: body text is ink or Graphite on white. Violet `#7C3AED` passes for large text, icons and buttons with white labels; use `#5B21B6` or darker for small violet text.

## Type

Hanken Grotesk (SIL Open Font Licence), self-hosted woff2 in `assets/fonts/`. Fallback: Helvetica Neue, Arial, sans-serif.

| Style | Size / weight | Notes |
| --- | --- | --- |
| Page title | 32 / 600 | letter-spacing −0.03em |
| Section heading | 20 / 600 | −0.02em, sits on a 2px ink rule |
| Body | 15 / 400 | line-height 1.6 |
| UI label / button | 14 / 500 | |
| Sidebar item | 14 / 500 | |
| Kicker | 11 / 600 | capitals, letter-spacing 0.2em, Violet Deep |
| Table header | 11 / 600 | capitals, 0.14em, Slate |
| Figures | tabular numerals | `font-variant-numeric: tabular-nums` |

## Layout and components

- Zero corner radius everywhere.
- 2px ink rules between major sections; 1px `#E7E7EC` inside them.
- Content in equal-width grid cells; everything flush left, including button labels.
- Buttons: primary violet with white label (hover `#6D28D9`, pressed `#5B21B6`); secondary 1px ink outline; ghost violet text.
- Focus: 2px `#7C3AED` outline, 2px offset. Never the browser default.
- Sidebar (Violet Tint): 248px, `#EDE9FE`, 2px violet right edge, reverse logo 202px wide, items 14px (resting `#5B21B6`, hover `#DDD6FE` / `#2E1065`, active `#7C3AED` / white), red badges for alerts only, 3px gradient stripe at the foot.
- Dialogs: white, 3px violet top border, backdrop `rgba(10,10,15,0.62)`.

## Icons

Lucide (lucide.dev), 1.5px stroke, square caps where available. 16px in buttons, 18–20px in navigation, 22px in bars. Icons take the text colour; never multi-colour. Files in `assets/icons/`.

## Imagery

The product uses no photography in the interface. In marketing, use real workplace photos (hospitality, care, retail teams), natural light, no stock clichés; put the mono-white logo over photos only on a calm area.

## Voice

Plain British English, sentence case, numbers first, no exclamation marks or emoji. Say what happened and what to do next.

- Write: "3 shifts have no clock-out time." · "Week approved. Edits now need a reason."
- Avoid: "Oops! Something went wrong" · "Successfully completed the approval process!"
