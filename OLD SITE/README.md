# Nexyra Consulting: deployment package

A plain static site. No build step, no framework, no server code. Upload the **contents of this folder** to any static host and it works.

## Structure

```
index.html              Homepage
404.html                Not-found page (most hosts serve this automatically)
about/index.html        About
work/index.html         Work (category filter)
insight/index.html      Insight (topic filter, article overlay)
careers/index.html      Careers (five remote roles)
services/index.html     Services (core + extended sections, anchored)
services/<slug>/        One page per service (eleven, incl. accounts-business-services)
pricing/index.html      Pricing (both engines, stage switcher; ten priced services
                        - Accounts & Business Services not yet priced)
contact/index.html      Contact (validated form, live email delivery)
location/index.html     Location (world map, studio index) - built but NOT linked in the nav
assets/css/styles.css   One stylesheet, shared by every page
assets/js/site.js       One script: nav, filters, tabs, map, form
assets/img/             All site photography, named by page/section
                        (services-*, work-*, insights-*, about-team, careers-hero,
                        contact-office, home-partnership)
assets/brand/           The Nexyra horizontal lock-up (SVG)
```

Links are relative, so the site works at a domain root **or** inside a subfolder. URLs come out clean: `/about/`, `/work/`, `/contact/`.

## Deploying

- **Netlify** - drag this folder onto app.netlify.com/drop.
- **Vercel** - run `vercel deploy` inside this folder; framework preset "Other".
- **Cloudflare Pages** - connect the repo, leave the build command empty, output directory `/`.
- **GitHub Pages** - commit these files to the branch or folder you serve from.
- **cPanel / FTP** - upload the contents into `public_html`.

## Interactivity

All vanilla JS in `assets/js/site.js`, no dependencies:

- fixed header (always visible), with the mobile menu toggle under 880px
- gradient text hover on every nav and footer link
- Work page category filter
- Pricing page Discover / Build / Run stage switcher
- Location page studio selection (map pins and the index stay in sync)
- Contact form validation, submission, success and error states

## External resources

Fetched from public CDNs, so visitors need normal internet access:

- **Google Fonts** - Hanken Grotesk (the brand typeface)
- **d3-geo, topojson, world-atlas** (jsDelivr) - only on `location/`, to draw the map. If it fails, the studio details still show.
- **Unsplash** - the six project photographs on `work/`

To self-host any of these, download the file into `assets/` and repoint the URL in the page `<head>` or in `assets/js/site.js`.

## Contact form

`contact/index.html` submits to **Web3Forms** with access key
`30117b51-b50f-4e59-9611-f16935eb19f7`, delivering to hello@nexyraconsulting.co.uk.
It works the moment the site is live. Nothing to configure.

Required fields: name, email, and a project description of at least 20 characters. To change the recipient, create a new key at web3forms.com and replace `KEY` near the bottom of `assets/js/site.js`.

## Editing content

Copy is plain HTML: open a page and edit the text. Colours, type and spacing are CSS variables at the top of `assets/css/styles.css` (`--violet`, `--ink`, `--pad`, and so on); change one there and it updates site-wide.

## Notes

- The **Location** page is included but deliberately not linked from the navigation or footer. Delete the folder if you do not want it reachable.
- The hidden `/brand` and `/brandbook` routes from the original Figma Make package have not been rebuilt.
- X and Instagram footer icons are intentionally disabled pending account URLs. LinkedIn and Facebook are live.

## Images

Every image is local: no external image URLs remain anywhere in this package. Files are named for the page and section that uses them (`services-brand.jpg`, `work-gtm-launch.jpg`, `insights-ai-integration.jpg`, `about-team.jpg`, `careers-hero.jpg`, `contact-office.jpg`, `home-partnership.jpg`). Only fonts are loaded from a third party (Google Fonts).
