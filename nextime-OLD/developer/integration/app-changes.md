# App changes to connect NEXTime to the server

Six small edits to `src/index.html`. Nothing else in the app changes: every screen still reads one organisation snapshot and every change still flows through `commit()` → `persist()`.

Search the file for the text in each **Find** line.

---

## Change 1 — load the config and store adapter

Copy `integration/config.js` and `integration/store-adapter.js` into `src/`.

**Find** (top of the file, inside `<head>`):

```html
<script src="./vendor/dc-runtime.js"></script>
```

**Replace with:**

```html
<script src="./config.js"></script>
<script src="./store-adapter.js"></script>
<script src="./vendor/dc-runtime.js"></script>
```

They must be in `<head>` (not inside `<helmet>`) so they run before the app.

---

## Change 2 — read the config

**Find:**

```js
const KEY = 'nexyra.rota-timesheet.v1';
```

**Add below it:**

```js
const NX_CFG = (typeof window !== 'undefined' && window.NEXTIME_CONFIG) || { dataSource: 'local' };
const USE_API = NX_CFG.dataSource === 'api' && !!NX_CFG.apiBaseUrl && !!window.NextimeStore;
const pickSnapshot = (b) => ({
  employees: b.employees || [], shifts: b.shifts || [], leave: b.leave || [],
  approvals: b.approvals || {}, published: b.published || {}, audit: b.audit || [], swaps: b.swaps || [],
  settings: Object.assign(baseSettings(), b.settings || {}), demo: b.demo === true,
  isEmpty: !(b.employees || []).length && !(b.shifts || []).length
});
```

---

## Change 3 — constructor: start in "booting" when using the API

**Find** (in `constructor(props)`):

```js
    this._fresh = !saved;
```

**Replace with:**

```js
    this._fresh = !saved && !USE_API;
```

**Find** (last line of the initial state object):

```js
      authed: hasSession(), pin: '', authErr: '', authBusy: false, showPin: false, lockUntil: readLockout().until || 0
```

**Replace with:**

```js
      authed: USE_API ? false : hasSession(), pin: '', authErr: '', authBusy: false, showPin: false, lockUntil: readLockout().until || 0,
      booting: USE_API, bootErr: '', email: ''
```

---

## Change 4 — componentDidMount: check the session and load from the server

**Find** (end of `componentDidMount()`):

```js
    if (this._fresh) this.persist();
  }
```

**Replace with:**

```js
    if (this._fresh) this.persist();
    if (USE_API) {
      this._store = window.NextimeStore.create(Object.assign({ storageKey: KEY }, NX_CFG));
      fetch(NX_CFG.apiBaseUrl + '/auth/me', { credentials: 'same-origin' })
        .then((r) => (r.ok ? this.loadFromServer() : this.setState({ booting: false, authed: false })))
        .catch(() => this.setState({ booting: false, bootErr: 'The server could not be reached.' }));
    }
  }

  loadFromServer() {
    this.setState({ booting: true });
    return this._store.load().then((snap) => {
      if (snap) this.setState(Object.assign(pickSnapshot(snap), { booting: false, authed: true }));
      else { this.setState({ booting: false, authed: true }); this.persist(); } // first run: upload what this browser has
    }).catch((e) => this.setState({ booting: false, bootErr: e.message }));
  }
```

---

## Change 5 — persist(): also save to the server

**Find** (inside `persist(extra)`):

```js
      localStorage.setItem(KEY, JSON.stringify(payload));
```

**Replace with:**

```js
      if (USE_API && this.state.booting) return; // never overwrite the server with a stale cache
      localStorage.setItem(KEY, JSON.stringify(payload));
      if (this._store) this._store.save(payload).catch((e) => this.flash(e.message));
```

`store-adapter.js` debounces saves (600 ms), sends `If-Match`, and rejects with "Someone else saved a newer version. Reload to see their changes" on `412`.

---

## Change 6 — sign in with email and password instead of the PIN

**Find** the start of `submitPin(ev)`:

```js
  submitPin(ev) {
    if (ev && ev.preventDefault) ev.preventDefault();
    const s = this.state;
```

**Add directly after those three lines:**

```js
    if (USE_API) {
      this.setState({ authBusy: true, authErr: '' });
      return fetch(NX_CFG.apiBaseUrl + '/auth/login', {
        method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: s.email, password: s.pin })
      }).then((r) => {
        if (r.status === 429) return this.setState({ authBusy: false, pin: '', authErr: 'Too many attempts. Try again in 5 minutes.' });
        if (!r.ok) return this.setState({ authBusy: false, pin: '', authErr: 'Email or password is incorrect.' });
        this.setState({ authBusy: false, pin: '' });
        return this.loadFromServer();
      }).catch(() => this.setState({ authBusy: false, authErr: 'The server could not be reached.' }));
    }
```

In `lockApp(msg)` add, as the first line:

```js
    if (USE_API) fetch(NX_CFG.apiBaseUrl + '/auth/logout', { method: 'POST', credentials: 'same-origin' });
```

In `renderVals()` add these values to the returned object:

```js
      useApi: USE_API, booting: s.booting, bootErr: s.bootErr,
      email: s.email, onEmail: (ev) => this.setState({ email: String(ev.target.value || '').trim() }),
```

and change the save status values:

```js
      dotLabel: USE_API ? 'CLOUD' : 'SAVED',
      dotSub: USE_API ? 'Server database' : (this._savedAt ? 'This browser · ' + this._savedAt : 'This browser'),
```

In the template, on the Admin Login form, add an email field above the PIN field (search for `Admin Login`), shown only in API mode, and relax the PIN input to a password:

```html
<sc-if value="{{ useApi }}" hint-placeholder-val="{{ false }}">
  <div class="field"><label for="nx-email">Email</label>
    <input id="nx-email" class="input" type="email" autocomplete="username" value="{{ email }}" onChange="{{ onEmail }}"></div>
</sc-if>
```

The PIN input (`id="nx-pin"`) becomes the password input in API mode. On it, remove `inputmode="numeric"` and `maxlength="8"`, set `autocomplete="current-password"`, and change its label from "Admin PIN" to "Password". In `renderVals()` → `onPin`, skip `.replace(/[^0-9]/g, '').slice(0, 8)` when `USE_API` is true, so letters and longer passwords are kept.

Add a loading screen just inside the signed-in area (search for `<sc-if value="{{ unlocked }}"`):

```html
<sc-if value="{{ booting }}" hint-placeholder-val="{{ false }}">
  <div style="position:fixed;inset:0;z-index:250;background:#FFFFFF;display:grid;place-items:center;font-size:15px;color:#4A4A5A">Loading your organisation…</div>
</sc-if>
```

Also replace the sidebar line "Local data only. Nothing leaves this device." and the footer "Local data only · nothing leaves this device" with "Saved to your organisation's server" when `useApi` is true.

---

## After the changes

1. Keep `dataSource: 'local'` in `config.js` and check the app works exactly as before.
2. Switch to `'api'`, start the server (`server/README.md`), sign in and check that the first load uploads this browser's data (`organisation_snapshots` gets version 1).
3. Open the app in a second browser, sign in, and check the same data appears.
4. Edit in both browsers. The second save must show the "newer version" message (HTTP 412).
5. Rebuild the single-file `deploy/nextime/index.html` (architecture.md section 5). `config.js` and `store-adapter.js` get inlined; to change the config later without a rebuild, leave `config.js` out of the inlining and deploy it next to `index.html`.
