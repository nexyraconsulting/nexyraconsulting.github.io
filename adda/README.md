# ADDA Slough: website package

A static site with no build step. Upload the contents of this folder, as is, to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages, or an Apache/Nginx web root).

## Structure

```
addaslough/
  index.html            entry point, redirects to Home.dc.html
  Home.dc.html          homepage
  Events.dc.html        Events, Durga Pujo 2026 and programme registration
  SiteHeader.dc.html    shared header (loaded by every page)
  SiteFooter.dc.html    shared footer (loaded by every page)
  css/
    modernist.css       base design system
    theme.css           ADDA colours and type
  js/
    support.js          page runtime (required)
    imageslot.js        image frames
  images/
    addalogo.png        ADDA logo, transparent background
  data/
    imageslots.json     images swapped in during review
```

Folder names use plain lowercase letters only. The page files must stay together in the root folder: each page loads SiteHeader.dc.html and SiteFooter.dc.html from beside itself.

## Requirements

- Serve the folder over **http(s)**. Opening the files straight from disk (`file://`) won't work, because pages load the header and footer with fetch.
- Event photos, posters, family photos and press clippings load live from `https://media.adda-slough.org`. That server must stay online. Alternatively, copy the images into `images/` and update the URLs at the top of the script in each page.

## Before going live

1. **Forms**: the Durga Pujo registration form validates input and shows a confirmation, but doesn't send data anywhere yet. Connect it to the existing registration back end, or to a form service (Formspree, Netlify Forms). The `submit` handler in `Events.dc.html` is the place to do this.
2. **Links**: menu items for pages not yet built (About, Adda Aid, News & Media, Contact, Gallery, Sign-in, Terms, Privacy) point to `#`. Replace them with the live URLs, or build those pages.
3. **Cookies**: the footer's "Cookie settings" link is a placeholder.
4. **Clean URLs (optional)**: to serve `/events` instead of `/Events.dc.html`, add a rewrite rule on your host.
