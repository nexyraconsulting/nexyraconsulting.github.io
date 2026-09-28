# ÉlanPro — installable web apps (PWA)

Two separate installable apps that share one salon database on the same device:

| App | Path | Who it is for |
|---|---|---|
| Customer | `/customer/` | Clients — book, reschedule, cancel, offers, profile |
| Admin | `/admin/` | Salon staff — dashboard, calendar, services, customers, offers, hours (PIN **2468**) |

The root `/` redirects to the customer app, so the link you share with clients is just the site address. Share `/admin/` only with staff.

## Folder contents

```
index.html            → redirects to customer/
.nojekyll             → tells GitHub Pages to serve files as-is
customer/
  index.html          → the complete customer app (self-contained)
  manifest.webmanifest, sw.js, icons/
admin/
  index.html          → the complete admin app (self-contained)
  manifest.webmanifest, sw.js, icons/
```

## Deploy on GitHub Pages (about 5 minutes)

1. Sign in at https://github.com and click **New repository**. Name it e.g. `elanpro`, set it to **Public**, and click **Create repository**.
2. On the new repo page click **uploading an existing file**. Drag in **everything inside this `deploy` folder** (the `customer` and `admin` folders, `index.html`, `README.md`). Click **Commit changes**.
   - `.nojekyll` is a hidden file; if your computer hides it, that is fine — the site still works.
3. Go to **Settings → Pages**. Under *Build and deployment* choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
4. Wait 1–2 minutes. Your site will be live at:
   - Customer: `https://<your-username>.github.io/elanpro/`
   - Admin: `https://<your-username>.github.io/elanpro/admin/`

Using the command line instead:

```bash
cd deploy
git init && git add . && git commit -m "ÉlanPro PWA"
git branch -M main
git remote add origin https://github.com/<your-username>/elanpro.git
git push -u origin main
# then enable Settings → Pages → main / (root)
```

## Install on a phone

**iPhone (Safari):** open the link → tap **Share** → **Add to Home Screen** → **Add**.
**Android (Chrome):** open the link → tap **⋮** → **Install app** (or **Add to Home screen**).

Install the customer link and the admin link separately — each gets its own icon (pink = customer, blue = admin). Both open full-screen and keep working offline after the first visit.

## Updating the app later

Replace `customer/index.html` and/or `admin/index.html` in the repo with new versions. Then open `sw.js` in the same folder and bump the version (`elanpro-customer-v1` → `-v2`) so phones pick up the update on their next launch.

## Important limitations of this version

- **Data is stored on each device** (browser storage). Customer and admin share data only when both are used **on the same phone/browser**. A booking made on a client's phone will *not* appear on the salon's tablet yet.
- The admin PIN (2468) is a demo gate, not real security — anyone with the admin link and PIN can open it.
- No real push notifications, emails or payments.
- Photos load from Unsplash (free licence) and need an internet connection the first time.

To go live with real customers, the next step is a shared online backend (e.g. Supabase or Firebase) for accounts, bookings and notifications — the app's data model is already structured for this.
