# Shared Nexyra navigation + search

NEXCut pages no longer carry their own copy of the header. The pill menu, product drill-down, search and
light/dark tone come from the same shared files as the main Nexyra site:

```
assets/nav/
  nexyra-nav.js            behaviour only (builds the header, menu overlay, search, tone detection)
  nexyra-nav.css           styles
  nexyra-menu.js           menu content — the ONLY file to edit when the navigation changes
  nexyra-search-engine.js  search ranking
  nexyra-search-index.js   search content
assets/css/hanken-grotesk-5ccee00e74.css + assets/fonts/font-*.woff2   font, @import-ed by nexyra-nav.css
```

Each page loads it with one line in `<head>`:

```html
<script src="../assets/nav/nexyra-nav.js" data-site="https://nexyraconsulting.co.uk/" data-active="products" data-product="nexcut" defer></script>
```

- `data-active` highlights the main menu item; `data-product` opens Products on NEXCut.
- `data-site` makes menu and search links point at the main site while this folder is served on its own.

## In production (hosted once)

When NEXCut is deployed inside the main site, point every page at the main site's copy and drop `data-site`:

```html
<script src="/assets/nav/nexyra-nav.js" data-active="products" data-product="nexcut" defer></script>
```

Then delete `nexcut_production/assets/nav/`. Menu or search changes are made once in the main site's
`assets/nav/nexyra-menu.js` / `nexyra-search-index.js` and appear on every page, NEXCut included.

The local copy matches the main site's files except for three changes:
- `nexyra-nav.js` adds the optional `data-site` attribute (backwards compatible).
- `nexyra-menu.js` and `nexyra-search-index.js` point the NEXCut links at `/nexcut/product/*.html`.

Copy all three to the main site's `/assets/nav/` (`DEPLOYMENT.md §1.4`) so both copies match again.
