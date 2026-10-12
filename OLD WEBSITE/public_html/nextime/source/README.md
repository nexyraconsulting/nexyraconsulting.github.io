# source/ — editable sources (not deployed)

| File | Compiles to |
| --- | --- |
| `pages/nextime-website.dc.html` | `public/index.html` |
| `pages/nextime-account.dc.html` | `public/account.html` |
| `pages/nextime-app.dc.html` | `public/app.html` |
| `pages/nextime-platform-console.dc.html` | `public/admin/console.html` |
| `pages/NxSiteNav.dc.html` | the Nexyra Consulting main navigation (same as nexyraconsulting.co.uk), embedded in `public/index.html`. Links resolve against `site-url`, and NEXTime links stay local |
| `js/zx-search-index.js`, `js/zx-search-engine.js` | Nexyra site search used by the navigation (`Assets/nexyra/` in the design project) |
| `js/nextime-saas.js` | embedded in every page (prototype account/workspace/billing layer) |

These sources reference the original design-project paths (`app/nextime-saas.js`, `Assets/…`, `_ds/…`) and the Design Component runtime. They're the readable reference for the logic and markup. To change the UI, edit them in the Claude Design project and re-export, or port them to your own React build (see DEVELOPER_HANDOVER.md section 6).
