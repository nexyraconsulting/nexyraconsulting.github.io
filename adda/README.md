# ADDA Slough website: deployment package

A static website with no build step. Upload everything in this folder, keeping the folder structure, to any static web host (Apache/Nginx web root, Netlify, Vercel, Cloudflare Pages, GitHub Pages). Pages must be served over http(s); opening them straight from disk (file://) will not work.

## Before you upload: one step

36 Adda images could not be copied automatically, because the current media server blocks copying them from another site. Run the fetch script once, from inside this folder, and it saves them into the right place under `assets/`:

- Mac/Linux: `bash scripts/fetch-remaining-assets.sh`
- Windows: `powershell -ExecutionPolicy Bypass -File scripts\fetch-remaining-assets.ps1`

## Folder structure

```
adda-slough-website/
├── index.html              Redirects to Home.dc.html
├── Home.dc.html …          One file per page (see list below)
├── SiteHeader.dc.html      Shared header (navigation + search)
├── SiteFooter.dc.html      Shared footer
├── AidYear, Coverage, EventArchive, Legal (.dc.html)   Shared page templates
├── support.js              Page runtime (required by every page)
├── css/                    modernist.css (design system), theme.css (ADDA colours)
├── js/                     site.js (site data, event archive, search), imageslot.js
├── data/                   imageslots.json (logos dropped into image slots)
├── images/                 Unsplash photographs used in page banners
├── assets/
│   ├── images/             Adda Slough's own images (logo, family, events, promotions, charity, press)
│   └── videos/             Adda Slough's own videos (ABP News coverage)
└── scripts/                Fetch script for the remaining Adda images
```

`assets/images/` mirrors the folder layout of media.adda-slough.org/public/images/, so new images can be dropped in using the same paths.

## Pages

- Home: Home.dc.html (replaces /)
- About: About.dc.html (/about-us)
- Events: Events.dc.html (/events)
- Festivals, Cultural & Other, Sports & Leisure: Festivals.dc.html, Cultural.dc.html, Sports.dc.html
- Past event detail: Event.dc.html?id=durga-pujo-2025 (one URL per event)
- Durga Pujo 2026 registration: Registration.dc.html (/dp-2026-reg)
- Charity: Charity.dc.html (/charities); Adda Aid 2022, 2021, 2020: AddaAid2022.dc.html …
- Media, Print, Digital: Media.dc.html, Print.dc.html, Digital.dc.html
- Contact: Contact.dc.html (/contact-us)
- Sign in: SignIn.dc.html (/sign-in)
- Terms, Privacy: Terms.dc.html, Privacy.dc.html
- Search results: Search.dc.html?q=…

## Unsplash photographs

Banner photos in `images/` are free to use under the Unsplash licence. Every page shows the photographer credit in the banner's bottom-right corner; keep those credits.

## Still to do before going live

1. Forms (Contact, Registration, Sign in) validate and confirm, but they are not yet connected to the existing back end. Connect their submit handlers to the current endpoints.
2. Sponsor logos: the live site publishes none. Add them to the homepage "Our Sponsors" strip.
3. Optional clean URLs: add host rewrites, e.g. /events → /Events.dc.html.
4. Pages not yet checked word for word against the live site: Media, Print, Digital, the Festivals/Cultural/Sports archives and event write-ups, Adda Aid 2020–2022, Registration and Sign in.
