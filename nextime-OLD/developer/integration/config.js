/* NEXTime Rota & Timesheet — runtime configuration.
   Place this file next to index.html and load it in <head> BEFORE the app (see app-changes.md, change 1).
   Leave dataSource as 'local' to keep today's browser-only behaviour. */
window.NEXTIME_CONFIG = {
  dataSource: 'api',          // 'local' = this browser only · 'api' = server database
  apiBaseUrl: '/api',         // same origin as the app (recommended). Full URL only if the API is elsewhere
  organisationId: 'default',  // must match ORGANISATION_ID on the server
  storageKey: 'nexyra.rota-timesheet.v1' // offline cache key; keep it so existing browser data is found
};
