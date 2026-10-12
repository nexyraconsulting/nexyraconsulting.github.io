# source/ — editable sources (not deployed)

| File | Compiles to |
| --- | --- |
| `pages/nextime-website.dc.html` | `public/nextime/index.html` (same markup and logic, with deployed asset paths; that page is unbundled and can also be edited directly) |
| `pages/nextime-account.dc.html` | `public/nextime/account.html` |
| `pages/nextime-app.dc.html` | `public/nextime/app.html` |
| `pages/nextime-platform-console.dc.html` | `public/nextime/admin/console.html` |
| `js/nextime-saas.js` | `public/nextime/js/nextime-saas.js`, and embedded in the three bundled pages (prototype account/workspace/billing layer) |

The top navigation and search are no longer NEXTime sources. They are the shared Nexyra files in `public/assets/nav/` (the same files as `/assets/nav/` on nexyraconsulting.co.uk). Edit the menu in `nexyra-menu.js` on the Nexyra site, not here.

These sources reference the original design-project paths (`app/nextime-saas.js`, `Assets/…`, `release/nextime/public/assets/nav/…`) and the Design Component runtime. To change the UI, edit them in the Claude Design project and re-export, or port them to your own React build (see DEVELOPER_HANDOVER.md section 6).
