/* NEXCut website — public runtime config. Safe to publish: no secrets here.
   Leave a value null to keep the matching feature in its clearly-labelled placeholder state.
   Production values: see .env.example and docs/CONFIGURATION_CHECKLIST.md. */
window.NEXCUT_CONFIG = {
  // Supabase project (Edge Functions live at {supabaseUrl}/functions/v1/*). null → checkout runs in DEMO MODE.
  supabaseUrl: null,            // e.g. "https://abcd1234.supabase.co"
  supabaseAnonKey: null,        // public anon key
  // App-store listings. null → "Coming soon" placeholder buttons, never an invented URL.
  appStoreCustomer: null,
  playStoreCustomer: null,
  appStoreBusiness: null,
  playStoreBusiness: null,
  // Live demos shown in the phone panels (prototype builds in this project).
  customerDemoUrl: "demo/customer.html",   // NEXCut customer app demo (self-contained); null hides the demo panel
  businessDemoUrl: "demo/business.html",   // NEXCut Business app demo (self-contained); null hides the demo panel
  // Legal pages
  termsUrl: null,               // NEXCut Business Terms of Service — to be written
  privacyUrl: "https://nexyraconsulting.co.uk/privacy-policy.html",
  supportEmail: "hello@nexyraconsulting.co.uk"
};
