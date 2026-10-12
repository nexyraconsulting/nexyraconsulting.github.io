NEXYRA CONSULTING: COMPLETE DEPLOYMENT PACKAGE
Main website + NEXDrive + NEXCut + NEXHR + NEXTime, with shared navigation, search, fonts, logos and icons.
Date: 11 October 2026

WHAT'S IN public_html/
  (root)            Main website pages, .htaccess, 404.html
  assets/nav/       SHARED navigation + search (every page)
  assets/fonts/     SHARED Hanken Grotesk fonts (main site + all products)
  assets/icons/     SHARED line icons (NEXDrive, NEXCut)
  brand/            SHARED Nexyra logos and favicon (main site + all products)
  nexdrive/         NEXDrive app (index.html) + product page (product/)
  nexcut/           NEXCut: index, customers, business, pricing, checkout
                    + demo/customer.html and demo/business.html (live app demos, self-contained)
  nexhr/            NEXHR: index, pricing, signup, login, app
  nextime/          NEXTime: index, account, app, admin/console

SHARED FILES (moved out of the product folders)
  Fonts      nexdrive, nexcut, nexhr font copies   -> assets/fonts/font-38c3847fad.woff2 (Latin)
                                                    assets/fonts/font-2cba32d0c1.woff2 (Latin Extended)
  Logos      Nexyra favicon, horizontal logo,       -> brand/favicon.svg, brand/lockup-horizontal-on-light.svg,
             monogram variants                          brand/monogram-*.svg (monogram-padded.svg = NEXHR footer mark,
                                                        monogram-mono-black.svg added)
  Icons      nexdrive + nexcut icon sets             -> assets/icons/
Product-specific files stay in each product: NEXDrive/NEXHR logos and app icons, NEXHR favicon,
NEXDrive product images. NEXTime embeds its fonts and logos inside its pages, so it has none to move.

CHECKED
  Every page in nexdrive, nexcut and nexhr was loaded: all images display (0 broken), fonts load (0 errors),
  no references remain to the old per-product font/logo/icon files.

HOW TO DEPLOY
1. Back up your live public_html folder.
2. Delete the old /nexdrive, /nexcut, /nexhr and /nextime folders on the server (old duplicate files would be left behind).
3. Upload the contents of public_html/ to your live public_html root, overwriting when prompted.
   Turn on "Show hidden files": each product folder has its own .htaccess.
4. Clear any server/CDN cache, then hard-refresh (Ctrl+Shift+R / Cmd+Shift+R).

UPDATING SHARED FILES LATER
Upload only the file you changed. Every page picks it up:
  assets/nav/nexyra-menu.js           menu links
  assets/nav/nexyra-search-index.js   search results
  assets/nav/nexyra-search-engine.js  search matching
  assets/nav/nexyra-nav.js / .css     navigation behaviour and styling
  brand/*.svg                         Nexyra logos (keep the same filenames)
  assets/fonts/, assets/icons/        fonts and icons (keep the same filenames)

LIVE ADDRESSES
  /nexdrive/product/  NEXDrive product page      /nexdrive/  NEXDrive app
  /nexcut             NEXCut                     /nexhr/     NEXHR
  /nextime/           NEXTime
  /products-nexdrive.html redirects to /nexdrive/product/.

STILL TO CONFIGURE BEFORE GOING LIVE (unchanged)
- NEXDrive: nexdrive/js/config.js; product page data-app-url.
- NEXCut: nexcut/js/config.js (Supabase, store links, terms URL). The demo apps are already switched on.
- NEXHR: nexhr/assets/js/appConfig.js; server and database run separately.
- NEXTime: nextime/config/app-config.js and admin/config/app-config.js (appOrigin, Supabase, Stripe);
  YOUR-PROJECT-REF in nextime/.htaccess; AuthUserFile in nextime/admin/.htaccess.
