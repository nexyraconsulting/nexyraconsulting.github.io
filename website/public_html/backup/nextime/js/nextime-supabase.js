// NEXTime — production adapter. Replaces the browser-only registry (app/nextime-saas.js) and the
// per-tenant localStorage snapshot with Supabase. Every function keeps the same name and return
// shape as the prototype, so the screens do not change.
//
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
// <script src="https://js.stripe.com/v3/"></script>
// <script src="config/app-config.js"></script>      (window.NEXTIME_CONFIG — see CONFIGURATION_CHECKLIST.md)
// <script src="js/nextime-supabase.js"></script>
(function () {
  var cfg = window.NEXTIME_CONFIG;
  var sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true } });
  var TENANT = 'nextime.active-tenant';
  var fn = async function (name, body) {
    var s = (await sb.auth.getSession()).data.session;
    var r = await fetch(cfg.functionsUrl + '/' + name, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (s ? s.access_token : '') }, body: JSON.stringify(body) });
    var j = await r.json(); if (!r.ok) throw new Error(j.error || 'Request failed'); return j;
  };
  var must = function (res) { if (res.error) throw new Error(res.error.message); return res.data; };

  var api = {
    client: sb,

    // ——— Auth (Supabase Auth + MFA) ———
    signup: async function (o) {
      must(await sb.auth.signUp({ email: o.email, password: o.password, options: { data: { full_name: o.name }, emailRedirectTo: location.origin + '/account.html' } }));
      // After email confirmation and first sign-in:
      // await api.createWorkspace(o.company, o.plan, o.region, o.importLegacy ? legacySnapshot : null)
    },
    createWorkspace: async function (name, plan, region, snapshot) { var id = must(await sb.rpc('create_workspace', { p_name: name, p_plan: plan, p_region: region, p_snapshot: snapshot })); localStorage.setItem(TENANT, id); return id; },
    login: async function (email, password) {
      must(await sb.auth.signInWithPassword({ email: email, password: password }));
      var aal = must(await sb.auth.mfa.getAuthenticatorAssuranceLevel());
      var ms = must(await sb.from('memberships').select('tenant_id, role, tenants(name, require_2fa)').eq('status', 'active'));
      return { needsMfa: aal.nextLevel === 'aal2' && aal.currentLevel !== 'aal2', memberships: ms.map(function (m) { return { tenantId: m.tenant_id, role: m.role, name: m.tenants.name, require2fa: m.tenants.require_2fa }; }) };
    },
    mfaEnroll: async function () { return must(await sb.auth.mfa.enroll({ factorType: 'totp', issuer: 'NEXTime' })); }, // { id, totp: { qr_code, secret, uri } }
    mfaVerify: async function (factorId, code) { return must(await sb.auth.mfa.challengeAndVerify({ factorId: factorId, code: code })); },
    mfaFactors: async function () { return must(await sb.auth.mfa.listFactors()).totp; },
    requestReset: async function (email) { must(await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + '/account.html?view=reset' })); },
    resetPassword: async function (pw) { must(await sb.auth.updateUser({ password: pw })); },
    acceptInvite: async function (token) { var id = must(await sb.rpc('accept_invitation', { p_token: token })); localStorage.setItem(TENANT, id); return id; },
    startSession: function (tenantId) { localStorage.setItem(TENANT, tenantId); },
    endSession: async function () { localStorage.removeItem(TENANT); await sb.auth.signOut(); },

    context: async function () {
      var u = (await sb.auth.getUser()).data.user; var tid = localStorage.getItem(TENANT);
      if (!u || !tid) return null;
      var m = must(await sb.from('memberships').select('role, emp_id').eq('tenant_id', tid).eq('user_id', u.id).maybeSingle());
      var t = must(await sb.from('tenants').select('*').eq('id', tid).maybeSingle());
      var st = must(await sb.rpc('tenant_effective_status', { t: tid }));
      return m && t ? { user: u, tenant: t, role: m.role, empId: m.emp_id, status: st } : null;
    },

    // ——— Workspace data (phase 1 snapshot, optimistic concurrency) ———
    loadSnapshot: async function (tenantId) {
      var row = must(await sb.from('workspace_snapshots').select('snapshot, version').eq('tenant_id', tenantId).maybeSingle());
      return row ? { snapshot: row.snapshot, version: row.version } : { snapshot: null, version: 0 };
    },
    saveSnapshot: async function (tenantId, snapshot, expectedVersion) {
      var r = await sb.rpc('save_snapshot', { p_tenant: tenantId, p_snapshot: snapshot, p_expected_version: expectedVersion });
      if (r.error && /conflict/.test(r.error.message)) { var e = new Error('Someone else saved a newer version. Reload to see their changes.'); e.code = 412; throw e; }
      if (r.error) throw new Error(r.error.message);
      return r.data; // new version
    },
    myShifts: async function (tenantId, from, to) { return must(await sb.rpc('my_shifts', { p_tenant: tenantId, p_from: from, p_to: to })); },

    // ——— Team ———
    members: async function (tenantId) {
      var m = must(await sb.from('memberships').select('user_id, role, emp_id, status, profiles(full_name, email)').eq('tenant_id', tenantId));
      var i = must(await sb.from('invitations').select('*').eq('tenant_id', tenantId).is('accepted_at', null));
      return { members: m, invites: i };
    },
    invite: function (tenantId, email, role, empId) { return fn('invite-member', { tenantId: tenantId, email: email, role: role, empId: empId }); },
    setMember: async function (tenantId, userId, patch) { must(await sb.from('memberships').update({ role: patch.role, emp_id: patch.empId }).eq('tenant_id', tenantId).eq('user_id', userId)); },
    removeMember: async function (tenantId, userId) { must(await sb.from('memberships').delete().eq('tenant_id', tenantId).eq('user_id', userId)); },
    revokeInvite: async function (token) { must(await sb.from('invitations').delete().eq('token', token)); },

    // ——— Workspace + billing ———
    updateTenant: async function (tenantId, patch) { must(await sb.from('tenants').update(patch).eq('id', tenantId)); },
    setupDirectDebit: async function (tenantId, scheme) { var r = await fn('gocardless-create-flow', { tenantId: tenantId, scheme: scheme }); location.href = r.url; },
    invoices: async function (tenantId) { return must(await sb.from('invoices').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false })); },

    // ——— Card, Apple Pay, Google Pay (Stripe Payment Element) ———
    // mountCard(tenantId, '#pm-element') shows Stripe's secure fields; confirmCard() saves the card.
    // The stripe-webhook function then creates the subscription (trial honoured).
    mountCard: async function (tenantId, selector) {
      var r = await fn('stripe-create-setup', { tenantId: tenantId });
      api._stripe = window.Stripe(r.publishableKey || cfg.stripePublishableKey);
      api._elements = api._stripe.elements({ clientSecret: r.clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#7C3AED', borderRadius: '0px', fontFamily: 'Hanken Grotesk, Helvetica Neue, Arial, sans-serif' } } });
      api._elements.create('payment', { layout: 'tabs', wallets: { applePay: 'auto', googlePay: 'auto' } }).mount(selector);
    },
    confirmCard: async function () {
      var r = await api._stripe.confirmSetup({ elements: api._elements, redirect: 'if_required', confirmParams: { return_url: location.origin + '/app.html?billing=done' } });
      if (r.error) throw new Error(r.error.message);
      return r.setupIntent.status; // 'succeeded' | 'processing'
    },
    // ——— Plan, invoice billing, cancel, reactivate ———
    changePlan: function (tenantId, plan, cycle) { return fn('billing-manage', { tenantId: tenantId, action: 'change_plan', plan: plan, cycle: cycle }); },
    useInvoice: function (tenantId, email, address, po) { return fn('billing-manage', { tenantId: tenantId, action: 'use_invoice', email: email, address: address, po: po }); },
    removePaymentMethod: function (tenantId) { return fn('billing-manage', { tenantId: tenantId, action: 'remove_method' }); },
    cancelSubscription: function (tenantId) { return fn('billing-manage', { tenantId: tenantId, action: 'cancel' }); },
    reactivate: function (tenantId) { return fn('billing-manage', { tenantId: tenantId, action: 'reactivate' }); }
  };
  window.NXCloud = api;
})();
