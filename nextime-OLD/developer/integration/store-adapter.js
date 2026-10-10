/* NEXTime Rota & Timesheet — data store (load with <script src="store-adapter.js"></script> before the app). One interface, two adapters:
   LocalAdapter keeps the organisation snapshot in localStorage.
   ApiAdapter reads and writes it through a REST service (see docs/database-integration.md), keeping a local cache
   so the app still opens, read-write, if the service is briefly unreachable. */
window.NextimeStore = (function () {
  'use strict';

  function LocalAdapter(cfg) {
    const key = cfg.storageKey || 'nexyra.rota-timesheet.v1';
    return {
      kind: 'local',
      label: 'This browser',
      load: async function () {
        try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { return null; }
      },
      save: async function (snapshot) {
        localStorage.setItem(key, JSON.stringify(snapshot));
        return { savedAt: snapshot.savedAt };
      }
    };
  }

  function ApiAdapter(cfg) {
    const base = String(cfg.apiBaseUrl || '').replace(/\/+$/, '');
    const url = base + '/organisations/' + encodeURIComponent(cfg.organisationId || 'default') + '/snapshot';
    let etag = null;
    const headers = async function (extra) {
      const h = Object.assign({ 'Accept': 'application/json' }, extra || {});
      if (typeof cfg.getToken === 'function') h['Authorization'] = 'Bearer ' + (await cfg.getToken());
      return h;
    };
    return {
      kind: 'api',
      label: 'Cloud · ' + base.replace(/^https?:\/\//, ''),
      load: async function () {
        const res = await fetch(url, { headers: await headers() });
        if (res.status === 404) return null;
        if (!res.ok) throw new Error('The service returned ' + res.status);
        etag = res.headers.get('ETag');
        const body = await res.json();
        return body && body.snapshot ? body.snapshot : body;
      },
      save: async function (snapshot) {
        const extra = { 'Content-Type': 'application/json' };
        if (etag) extra['If-Match'] = etag;
        const res = await fetch(url, { method: 'PUT', headers: await headers(extra), body: JSON.stringify({ snapshot: snapshot }) });
        if (res.status === 412) throw new Error('Someone else saved a newer version. Reload to see their changes');
        if (!res.ok) throw new Error('The service returned ' + res.status);
        etag = res.headers.get('ETag') || etag;
        return res.status === 204 ? { savedAt: snapshot.savedAt } : res.json();
      }
    };
  }

  function create(cfg) {
    cfg = cfg || {};
    const local = LocalAdapter(cfg);
    if (cfg.dataSource !== 'api' || !cfg.apiBaseUrl) return local;
    const api = ApiAdapter(cfg);
    let timer = null, pending = null, waiters = [];
    const flush = async function () {
      const snap = pending; pending = null;
      const ws = waiters; waiters = [];
      try { const r = await api.save(snap); ws.forEach((w) => w.resolve(r)); } catch (e) { ws.forEach((w) => w.reject(e)); }
    };
    return {
      kind: 'api',
      label: api.label,
      load: async function () {
        try {
          const data = await api.load();
          if (data) await local.save(data);
          return data;
        } catch (e) {
          const cached = await local.load();
          if (cached) { cached.__offline = true; return cached; }
          throw e;
        }
      },
      save: function (snapshot) {
        local.save(snapshot);
        pending = snapshot;
        clearTimeout(timer);
        timer = setTimeout(flush, 600);
        return new Promise((resolve, reject) => waiters.push({ resolve: resolve, reject: reject }));
      }
    };
  }

  return { create: create, LocalAdapter: LocalAdapter, ApiAdapter: ApiAdapter };
})();
