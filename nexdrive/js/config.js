/* NexDrive front-end runtime configuration. Loaded before the app.
   Never put secrets here — this file is public. See docs/environment.md. */
window.NEXDRIVE_CONFIG = {
  // 'demo' = in-memory sample data (current build). 'live' is reserved for the backend integration (docs/developer-guide.md §4).
  mode: 'demo',
  // Base URL of the NexDrive API, e.g. 'https://api.nexdrive.co.uk/v1'. Unused while mode is 'demo'.
  apiBaseUrl: '',
  // Public sign-up URL used in referral links and QR codes. The app reads ?ref=CODE on load.
  referralBaseUrl: 'https://app.nexdrive.co.uk/join',
  // Show the workflow shortcuts panel and demo-only buttons. Set false for real users.
  showDemoPanel: true,
  // false = app fills the browser viewport instead of sitting in a phone frame on desktop.
  deviceFrame: true,
  // Show the Admin login (PIN) screen before the app. The PIN is verified against a salted hash —
  // see docs/security.md. This is a demo gate only; production access must be enforced server-side.
  adminLogin: true,
  // Play the NEXDrive lock-up animation on start.
  launchAnimation: true,
  timezone: 'Europe/London',
  currency: 'GBP'
};
