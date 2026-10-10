/* NEXTime runtime configuration. Loaded by every page at start-up.
   These values are PUBLIC (they reach the browser). Never put secret keys here —
   secret keys belong only in the Supabase function secrets (see .env.example). */
window.NEXTIME_CONFIG = {
  // true  = prototype mode: accounts and data are stored in the visitor's browser, emails show in a
  //         Demo inbox, payments are simulated. Works with no backend.
  // false = hides every demo-only control. Set this only after the Supabase wiring in
  //         DEVELOPER_HANDOVER.md section 4 is complete.
  demoMode: true,

  appOrigin: 'https://app.example.com',            // REQUIRED for production: the https origin these pages are served from
  supabaseUrl: 'https://YOUR-PROJECT-REF.supabase.co',
  supabaseAnonKey: 'YOUR-SUPABASE-ANON-KEY',        // public anon key, safe in the browser (RLS protects data)
  functionsUrl: 'https://YOUR-PROJECT-REF.functions.supabase.co',
  stripePublishableKey: 'pk_test_REPLACE',          // pk_live_… in production
  supportEmail: 'hello@nexyraconsulting.co.uk'
};
