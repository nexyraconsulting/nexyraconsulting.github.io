/* NEXTime SaaS — account, workspace, subscription and session layer.
   Prototype mode: the registry lives in this browser's localStorage so every flow can be tried end to end.
   Production: replace each function body with the Supabase call noted beside it (see developer/docs/saas-architecture.md). */
(function () {
  var REG = 'nextime.saas.registry.v1';
  var SES = 'nextime.saas.session.v1';
  var LEGACY = 'nexyra.rota-timesheet.v1';
  var SESSION_HOURS = 12;
  /* Runtime configuration lives in config/app-config.js next to the page, so it can be edited after deployment. */
  (function loadConfig() {
    if (window.NEXTIME_CONFIG || !document.head) return;
    var el = document.createElement('script'); el.src = ['config', 'app-config.js'].join('/'); el.async = false;
    document.head.appendChild(el);
  })();
  function config() { return window.NEXTIME_CONFIG || {}; }
  function demo() { return config().demoMode !== false; }
  var TRIAL_DAYS = 14;
  var PLANS = [
    { id: 'starter', name: 'Starter', limit: 10, monthly: 29, annual: 290, blurb: 'Single-site teams getting off spreadsheets.' },
    { id: 'team', name: 'Team', limit: 50, monthly: 79, annual: 790, blurb: 'Growing teams across a few locations.' },
    { id: 'business', name: 'Business', limit: 200, monthly: 179, annual: 1790, blurb: 'Multi-site operators with several managers.' },
    { id: 'enterprise', name: 'Enterprise', limit: null, monthly: null, annual: null, blurb: 'More than 200 staff, custom terms.' }
  ];
  var ROLES = ['Owner', 'Admin', 'Manager', 'Employee'];
  var ROLE_INFO = {
    Owner: 'Everything, including plan, billing and deleting the workspace.',
    Admin: 'Everything except billing changes and deleting the workspace.',
    Manager: 'Rota, timesheets, staff, reports and activity. No settings or workspace.',
    Employee: 'Their own shifts, hours and leave. Read only.'
  };
  var TABS = {
    Owner: ['dashboard', 'rota', 'timesheets', 'employees', 'reports', 'activity', 'settings', 'workspace'],
    Admin: ['dashboard', 'rota', 'timesheets', 'employees', 'reports', 'activity', 'settings', 'workspace'],
    Manager: ['dashboard', 'rota', 'timesheets', 'employees', 'reports', 'activity'],
    Employee: ['mine']
  };
  var PAGES = {
    site: ['NEXTime Website.dc.html', 'index.html'],
    account: ['NEXTime Account.dc.html', 'account.html'],
    app: ['NEXTime App.dc.html', 'app.html'],
    console: ['NEXTime Platform Console.dc.html', 'console.html']
  };

  function now() { return Date.now(); }
  function uid(p) { var a = new Uint8Array(8); crypto.getRandomValues(a); return (p || '') + Array.from(a).map(function (x) { return x.toString(16).padStart(2, '0'); }).join(''); }
  function code6() { var a = new Uint32Array(1); crypto.getRandomValues(a); return String(a[0] % 1000000).padStart(6, '0'); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function emailOk(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(e || '').trim()); }
  function norm(e) { return String(e || '').trim().toLowerCase(); }
  function slug(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'workspace'; }

  function blank() { return { version: 1, tenants: {}, users: {}, members: [], invites: [], outbox: [], resets: [], events: [], platform: null }; }
  function read() { try { var r = JSON.parse(localStorage.getItem(REG) || 'null'); return r && r.tenants ? r : blank(); } catch (e) { return blank(); } }
  function write(r) { localStorage.setItem(REG, JSON.stringify(r)); return r; }
  function mutate(fn) { var r = read(); var out = fn(r); write(r); return out; }
  function log(r, tenantId, type, summary) { r.events.unshift({ at: new Date().toISOString(), tenantId: tenantId || '', type: type, summary: summary }); r.events = r.events.slice(0, 2000); }
  function mail(r, to, subject, body, link, code) { var m = { id: uid('M'), to: norm(to), subject: subject, body: body, link: link || '', code: code || '', at: new Date().toISOString() }; r.outbox.unshift(m); r.outbox = r.outbox.slice(0, 200); return m; }

  function url(page, qs) {
    var p = PAGES[page] || PAGES.site;
    var path = decodeURIComponent(location.pathname || '');
    var file = /\.dc\.html$/.test(path) ? p[0] : p[1];
    var q = qs ? '?' + Object.keys(qs).map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(qs[k]); }).join('&') : '';
    return encodeURI(file) + q;
  }
  function go(page, qs) { location.href = url(page, qs); }

  /* Passwords: PBKDF2-SHA256, 150k iterations. Production: Supabase Auth (bcrypt server-side). */
  function hex(buf) { return Array.from(new Uint8Array(buf)).map(function (x) { return x.toString(16).padStart(2, '0'); }).join(''); }
  async function hashPw(pw, salt) {
    var enc = new TextEncoder();
    var key = await crypto.subtle.importKey('raw', enc.encode(pw), 'PBKDF2', false, ['deriveBits']);
    var bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode(salt), iterations: 150000 }, key, 256);
    return hex(bits);
  }
  function pwIssues(pw) {
    var out = [];
    if (String(pw || '').length < 10) out.push('at least 10 characters');
    if (!/[A-Za-z]/.test(pw) || !/[0-9]/.test(pw)) out.push('letters and numbers');
    return out;
  }

  /* TOTP (RFC 6238, SHA-1, 30s, 6 digits) — works with Google Authenticator, Microsoft Authenticator, 1Password.
     Production: Supabase Auth MFA (auth.mfa.enroll / challenge / verify). */
  var B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  function b32secret() { var a = new Uint8Array(20); crypto.getRandomValues(a); var bits = '', out = ''; a.forEach(function (b) { bits += b.toString(2).padStart(8, '0'); }); for (var i = 0; i + 5 <= bits.length; i += 5) out += B32[parseInt(bits.slice(i, i + 5), 2)]; return out; }
  function b32bytes(s) { var bits = ''; String(s).replace(/=+$/, '').toUpperCase().split('').forEach(function (c) { var v = B32.indexOf(c); if (v >= 0) bits += v.toString(2).padStart(5, '0'); }); var out = new Uint8Array(Math.floor(bits.length / 8)); for (var i = 0; i < out.length; i++) out[i] = parseInt(bits.slice(i * 8, i * 8 + 8), 2); return out; }
  async function totp(secret, t) {
    var counter = Math.floor((t || now()) / 30000);
    var msg = new Uint8Array(8); var c = counter;
    for (var i = 7; i >= 0; i--) { msg[i] = c & 0xff; c = Math.floor(c / 256); }
    var key = await crypto.subtle.importKey('raw', b32bytes(secret), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
    var h = new Uint8Array(await crypto.subtle.sign('HMAC', key, msg));
    var o = h[h.length - 1] & 0xf;
    var n = ((h[o] & 0x7f) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3];
    return String(n % 1000000).padStart(6, '0');
  }
  async function totpOk(secret, codeIn) {
    var c = String(codeIn || '').replace(/\D/g, '');
    if (c.length !== 6) return false;
    for (var d = -1; d <= 1; d++) { if ((await totp(secret, now() + d * 30000)) === c) return true; }
    return false;
  }
  function otpauth(secret, email) { return 'otpauth://totp/NEXTime:' + encodeURIComponent(email) + '?secret=' + secret + '&issuer=NEXTime&digits=6&period=30'; }

  /* Session. Production: Supabase session (JWT) + tenant_id / role custom claims. */
  function session() { try { var s = JSON.parse(localStorage.getItem(SES) || 'null'); return s && s.exp > now() ? s : null; } catch (e) { return null; } }
  function startSession(userId, tenantId) {
    var r = read(); var m = r.members.filter(function (x) { return x.userId === userId && x.tenantId === tenantId && x.status === 'active'; })[0];
    if (!m) throw new Error('You are not a member of that workspace.');
    var s = { userId: userId, tenantId: tenantId, role: m.role, exp: now() + SESSION_HOURS * 3600000, at: now() };
    localStorage.setItem(SES, JSON.stringify(s));
    mutate(function (x) { if (x.users[userId]) x.users[userId].lastLogin = new Date().toISOString(); log(x, tenantId, 'auth.login', (x.users[userId] || {}).email + ' signed in'); });
    return s;
  }
  function endSession() { localStorage.removeItem(SES); }

  function tenantStatus(t) {
    if (!t) return 'missing';
    if (t.status === 'suspended' || t.status === 'cancelled' || t.status === 'past_due') return t.status;
    if (t.status === 'trialing' && t.trialEnds < now()) return t.mandate && t.mandate.status === 'active' ? 'active' : 'expired';
    return t.status;
  }
  function trialDaysLeft(t) { return t ? Math.max(0, Math.ceil((t.trialEnds - now()) / 86400000)) : 0; }
  function plan(id) { return PLANS.filter(function (p) { return p.id === id; })[0] || PLANS[0]; }
  function planForStaff(n) { return PLANS.filter(function (p) { return p.limit == null || n <= p.limit; })[0]; }
  function price(p, cycle) { return p.monthly == null ? null : cycle === 'annual' ? p.annual : p.monthly; }

  function context() {
    var s = session(); if (!s) return null;
    var r = read(); var t = r.tenants[s.tenantId]; var u = r.users[s.userId];
    var m = r.members.filter(function (x) { return x.userId === s.userId && x.tenantId === s.tenantId && x.status === 'active'; })[0];
    if (!t || !u || !m) return null;
    return { session: s, tenant: t, user: u, member: m, role: m.role, status: tenantStatus(t), trialDays: trialDaysLeft(t), plan: plan(t.plan), tabs: TABS[m.role] || [] };
  }
  function dataKey(tenantId) { return 'nextime.tenant.' + tenantId + '.data'; }
  function legacyData() { try { var d = JSON.parse(localStorage.getItem(LEGACY) || 'null'); return d && Array.isArray(d.employees) ? d : null; } catch (e) { return null; } }

  /* Sign-up. Production: supabase.auth.signUp + rpc('create_workspace'). */
  async function signup(o) {
    var email = norm(o.email);
    if (!String(o.company || '').trim()) throw new Error('Enter your company name.');
    if (!String(o.name || '').trim()) throw new Error('Enter your full name.');
    if (!emailOk(email)) throw new Error('Enter a valid work email address.');
    var iss = pwIssues(o.password); if (iss.length) throw new Error('Password needs ' + iss.join(' and ') + '.');
    var r = read();
    if (Object.keys(r.users).some(function (k) { return r.users[k].email === email; })) throw new Error('An account already exists for ' + email + '. Sign in instead.');
    var salt = uid('s'); var h = await hashPw(o.password, salt);
    var code = code6();
    return mutate(function (x) {
      var userId = uid('U'); var tenantId = uid('T');
      x.users[userId] = { id: userId, email: email, name: String(o.name).trim(), salt: salt, pw: h, emailVerified: false, verifyCode: code, totpSecret: '', totpOn: false, createdAt: new Date().toISOString(), lastLogin: '' };
      x.tenants[tenantId] = { id: tenantId, name: String(o.company).trim(), slug: slug(o.company), region: o.region || 'Global', timezone: o.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone, currency: 'GBP', plan: o.plan || 'starter', cycle: 'monthly', status: 'trialing', trialEnds: now() + TRIAL_DAYS * 86400000, mandate: null, invoices: [], require2fa: false, ownerId: userId, createdAt: new Date().toISOString(), sizeBand: o.size || '' };
      x.members.push({ tenantId: tenantId, userId: userId, role: 'Owner', empId: '', status: 'active', at: new Date().toISOString() });
      log(x, tenantId, 'tenant.created', String(o.company).trim() + ' created by ' + email + ' (' + plan(o.plan).name + ' trial)');
      mail(x, email, 'Verify your NEXTime email', 'Welcome to NEXTime, ' + String(o.name).trim().split(' ')[0] + '. Enter this code to verify your email address. It expires in 30 minutes.', '', code);
      if (o.importLegacy) { var d = legacyData(); if (d) { d.settings = Object.assign({}, d.settings, { orgName: String(o.company).trim() }); localStorage.setItem(dataKey(tenantId), JSON.stringify(d)); log(x, tenantId, 'tenant.import', 'Existing browser data imported (' + d.employees.length + ' staff)'); } }
      return { userId: userId, tenantId: tenantId };
    });
  }
  function resendVerify(userId) { return mutate(function (x) { var u = x.users[userId]; if (!u) throw new Error('Account not found.'); u.verifyCode = code6(); mail(x, u.email, 'Your new NEXTime verification code', 'Enter this code to verify your email address.', '', u.verifyCode); return true; }); }
  function verifyEmail(userId, c) { return mutate(function (x) { var u = x.users[userId]; if (!u) throw new Error('Account not found.'); if (String(c || '').trim() !== u.verifyCode) throw new Error('That code does not match. Check the latest email.'); u.emailVerified = true; u.verifyCode = ''; return true; }); }

  /* Sign-in. Production: supabase.auth.signInWithPassword, then mfa.challengeAndVerify when aal2 is required. */
  async function login(email, pw) {
    var r = read(); var e = norm(email);
    var u = Object.keys(r.users).map(function (k) { return r.users[k]; }).filter(function (x) { return x.email === e; })[0];
    var lock = (r.locks || {})[e];
    if (lock && lock.until > now()) throw new Error('Too many attempts. Try again in ' + Math.ceil((lock.until - now()) / 60000) + ' minutes.');
    var ok = u && (await hashPw(pw, u.salt)) === u.pw;
    if (!ok) {
      mutate(function (x) { x.locks = x.locks || {}; var l = x.locks[e] || { n: 0, until: 0 }; l.n = (l.until && l.until < now() ? 0 : l.n) + 1; l.until = l.n >= 5 ? now() + 15 * 60000 : 0; if (l.n >= 5) l.n = 0; x.locks[e] = l; log(x, '', 'auth.failed', 'Failed sign-in for ' + e); });
      throw new Error('Email or password is incorrect.');
    }
    mutate(function (x) { if (x.locks) delete x.locks[e]; });
    var ms = r.members.filter(function (m) { return m.userId === u.id && m.status === 'active'; }).map(function (m) { var t = r.tenants[m.tenantId]; return { tenantId: m.tenantId, role: m.role, name: t ? t.name : '—', require2fa: !!(t && t.require2fa) }; });
    return { user: u, memberships: ms };
  }
  function setTotp(userId, secret, on) { return mutate(function (x) { var u = x.users[userId]; u.totpSecret = on ? secret : ''; u.totpOn = !!on; log(x, '', on ? 'auth.2fa_on' : 'auth.2fa_off', u.email + (on ? ' turned on' : ' turned off') + ' two-factor'); return true; }); }

  function requestReset(email) {
    var e = norm(email);
    return mutate(function (x) {
      var u = Object.keys(x.users).map(function (k) { return x.users[k]; }).filter(function (y) { return y.email === e; })[0];
      if (!u) return true;
      var token = uid('R'); x.resets.push({ token: token, userId: u.id, exp: now() + 3600000 });
      mail(x, e, 'Reset your NEXTime password', 'Someone asked to reset the password for this account. The link works once and expires in 1 hour. If it was not you, ignore this email.', url('account', { reset: token }));
      return true;
    });
  }
  async function resetPassword(token, pw) {
    var iss = pwIssues(pw); if (iss.length) throw new Error('Password needs ' + iss.join(' and ') + '.');
    var r = read(); var rs = r.resets.filter(function (x) { return x.token === token && x.exp > now(); })[0];
    if (!rs) throw new Error('This reset link has expired or was already used. Request a new one.');
    var salt = uid('s'); var h = await hashPw(pw, salt);
    return mutate(function (x) { var u = x.users[rs.userId]; u.salt = salt; u.pw = h; x.resets = x.resets.filter(function (y) { return y.token !== token; }); log(x, '', 'auth.reset', u.email + ' reset their password'); return u.email; });
  }

  /* Team. Production: edge function invite-member (service role) + auth.admin.inviteUserByEmail. */
  function invite(tenantId, email, role, empId, byUserId) {
    var e = norm(email);
    if (!emailOk(e)) throw new Error('Enter a valid email address.');
    if (ROLES.indexOf(role) < 0 || role === 'Owner') throw new Error('Choose Admin, Manager or Employee.');
    return mutate(function (x) {
      var t = x.tenants[tenantId];
      var exists = x.members.some(function (m) { var u = x.users[m.userId]; return m.tenantId === tenantId && u && u.email === e && m.status === 'active'; });
      if (exists) throw new Error(e + ' is already in this workspace.');
      x.invites = x.invites.filter(function (i) { return !(i.tenantId === tenantId && i.email === e && !i.accepted); });
      var token = uid('I');
      x.invites.push({ token: token, tenantId: tenantId, email: e, role: role, empId: empId || '', by: byUserId, at: new Date().toISOString(), exp: now() + 7 * 86400000, accepted: false });
      var by = x.users[byUserId];
      mail(x, e, (by ? by.name : 'Your manager') + ' invited you to ' + t.name + ' on NEXTime', 'You have been invited to join ' + t.name + ' as ' + role + '. The link expires in 7 days.', url('account', { invite: token }));
      log(x, tenantId, 'member.invited', e + ' invited as ' + role);
      return token;
    });
  }
  function inviteInfo(token) { var r = read(); var i = r.invites.filter(function (x) { return x.token === token; })[0]; if (!i) return null; var t = r.tenants[i.tenantId]; var u = Object.keys(r.users).map(function (k) { return r.users[k]; }).filter(function (y) { return y.email === i.email; })[0]; return { invite: i, tenant: t, existingUser: u || null, expired: i.exp < now() || i.accepted }; }
  async function acceptInvite(token, name, pw) {
    var info = inviteInfo(token);
    if (!info || info.expired) throw new Error('This invitation has expired or was already used. Ask for a new one.');
    var i = info.invite; var userId;
    if (info.existingUser) {
      if ((await hashPw(pw, info.existingUser.salt)) !== info.existingUser.pw) throw new Error('Password is incorrect for ' + i.email + '.');
      userId = info.existingUser.id;
    } else {
      if (!String(name || '').trim()) throw new Error('Enter your full name.');
      var iss = pwIssues(pw); if (iss.length) throw new Error('Password needs ' + iss.join(' and ') + '.');
      var salt = uid('s'); var h = await hashPw(pw, salt);
      userId = uid('U');
      mutate(function (x) { x.users[userId] = { id: userId, email: i.email, name: String(name).trim(), salt: salt, pw: h, emailVerified: true, verifyCode: '', totpSecret: '', totpOn: false, createdAt: new Date().toISOString(), lastLogin: '' }; });
    }
    mutate(function (x) {
      x.members = x.members.filter(function (m) { return !(m.tenantId === i.tenantId && m.userId === userId); });
      x.members.push({ tenantId: i.tenantId, userId: userId, role: i.role, empId: i.empId, status: 'active', at: new Date().toISOString() });
      x.invites.forEach(function (y) { if (y.token === token) y.accepted = true; });
      log(x, i.tenantId, 'member.joined', i.email + ' joined as ' + i.role);
    });
    return { userId: userId, tenantId: i.tenantId, require2fa: !!info.tenant.require2fa };
  }
  function members(tenantId) {
    var r = read();
    var list = r.members.filter(function (m) { return m.tenantId === tenantId; }).map(function (m) { var u = r.users[m.userId] || {}; return { userId: m.userId, name: u.name || '—', email: u.email || '—', role: m.role, empId: m.empId || '', status: m.status, twofa: !!u.totpOn, lastLogin: u.lastLogin || '' }; });
    var inv = r.invites.filter(function (i) { return i.tenantId === tenantId && !i.accepted; }).map(function (i) { return { token: i.token, email: i.email, role: i.role, empId: i.empId, at: i.at, expired: i.exp < now() }; });
    return { members: list, invites: inv };
  }
  function setMember(tenantId, userId, patch, byUserId) {
    return mutate(function (x) {
      var m = x.members.filter(function (y) { return y.tenantId === tenantId && y.userId === userId; })[0];
      if (!m) throw new Error('Member not found.');
      if (m.role === 'Owner' && patch.role && patch.role !== 'Owner') throw new Error('Transfer ownership before changing the Owner role.');
      if (patch.role === 'Owner') throw new Error('Use Transfer ownership to make someone Owner.');
      Object.assign(m, patch);
      log(x, tenantId, 'member.updated', ((x.users[userId] || {}).email || userId) + ': ' + Object.keys(patch).map(function (k) { return k + ' → ' + (patch[k] || '—'); }).join(', '));
      return true;
    });
  }
  function removeMember(tenantId, userId) { return mutate(function (x) { var m = x.members.filter(function (y) { return y.tenantId === tenantId && y.userId === userId; })[0]; if (!m) return false; if (m.role === 'Owner') throw new Error('The Owner cannot be removed.'); x.members = x.members.filter(function (y) { return y !== m; }); log(x, tenantId, 'member.removed', (x.users[userId] || {}).email + ' removed'); return true; }); }
  function revokeInvite(token) { return mutate(function (x) { var i = x.invites.filter(function (y) { return y.token === token; })[0]; x.invites = x.invites.filter(function (y) { return y.token !== token; }); if (i) log(x, i.tenantId, 'member.invite_revoked', i.email + ' invitation revoked'); return true; }); }
  function transferOwner(tenantId, toUserId, fromUserId) { return mutate(function (x) { x.members.forEach(function (m) { if (m.tenantId !== tenantId) return; if (m.userId === toUserId) m.role = 'Owner'; else if (m.userId === fromUserId) m.role = 'Admin'; }); x.tenants[tenantId].ownerId = toUserId; log(x, tenantId, 'tenant.owner', 'Ownership transferred to ' + (x.users[toUserId] || {}).email); return true; }); }

  /* Workspace + billing. Production: tenants table + GoCardless Billing Request Flow + webhooks (edge functions). */
  function updateTenant(tenantId, patch, summary) { return mutate(function (x) { Object.assign(x.tenants[tenantId], patch); log(x, tenantId, 'tenant.updated', summary || Object.keys(patch).join(', ') + ' updated'); return clone(x.tenants[tenantId]); }); }
  function setPlan(tenantId, planId, cycle) { var p = plan(planId); return updateTenant(tenantId, { plan: p.id, cycle: cycle || 'monthly' }, 'Plan changed to ' + p.name + ' (' + (cycle || 'monthly') + ')'); }
  /* Payment methods. Card, Apple Pay and Google Pay: Stripe (SetupIntent + Payment Element).
     Direct Debit: GoCardless (Billing Request Flow). Invoice + bank transfer: Stripe Invoicing, annual plans only. */
  var METHODS = {
    card: { label: 'Card', provider: 'Stripe' },
    direct_debit: { label: 'Direct Debit', provider: 'GoCardless' },
    invoice: { label: 'Invoice and bank transfer', provider: 'Stripe Invoicing' }
  };
  function digits(x) { return String(x || '').replace(/[\s-]/g, ''); }
  function cardBrand(n) { n = digits(n); return /^4/.test(n) ? 'Visa' : /^(5[1-5]|2[2-7])/.test(n) ? 'Mastercard' : /^3[47]/.test(n) ? 'American Express' : ''; }
  function luhn(n) { n = digits(n); if (!/^\d{12,19}$/.test(n)) return false; var s = 0; for (var i = 0; i < n.length; i++) { var d = +n[n.length - 1 - i]; if (i % 2) { d *= 2; if (d > 9) d -= 9; } s += d; } return s % 10 === 0; }
  function paymentIssue(o) {
    if (o.type === 'card' && !o.wallet) {
      if (!String(o.holder || '').trim()) return 'Enter the name on the card.';
      if (!cardBrand(o.number)) return 'We accept Visa, Mastercard and American Express.';
      if (!luhn(o.number)) return 'Check the card number.';
      var m = /^(\d{2})\s*\/\s*(\d{2})$/.exec(String(o.exp || '').trim());
      if (!m || +m[1] < 1 || +m[1] > 12) return 'Enter the expiry as MM/YY.';
      if (new Date(2000 + +m[2], +m[1], 1) <= new Date()) return 'This card has expired.';
      if (!/^\d{3,4}$/.test(digits(o.cvc))) return 'Enter the 3 or 4 digit security code.';
      if (!String(o.postcode || '').trim()) return 'Enter the billing postcode.';
    }
    if (o.type === 'direct_debit') {
      if (!String(o.holder || '').trim()) return 'Enter the account holder name.';
      if (!emailOk(o.email)) return 'Enter a billing email.';
      if (o.scheme === 'bacs' && !/^\d{6}$/.test(digits(o.code))) return 'Sort code is 6 digits.';
      if (o.scheme === 'bacs' && !/^\d{8}$/.test(digits(o.account))) return 'Account number is 8 digits.';
      if (o.scheme === 'sepa' && !/^[A-Za-z]{2}\d{2}[A-Za-z0-9]{11,30}$/.test(digits(o.account))) return 'Enter a valid IBAN.';
      if (o.scheme !== 'bacs' && o.scheme !== 'sepa' && digits(o.account).length < 4) return 'Enter the account number.';
      if (!o.auth) return 'Confirm you can authorise debits from this account.';
    }
    if (o.type === 'invoice') {
      if (!String(o.holder || '').trim()) return 'Enter the company name for invoices.';
      if (!emailOk(o.email)) return 'Enter the email invoices should go to.';
      if (!String(o.address || '').trim()) return 'Enter the billing address.';
    }
    return '';
  }
  function methodSummary(pm) {
    if (!pm) return '';
    if (pm.type === 'card') return (pm.wallet ? pm.wallet + ' · ' : '') + pm.brand + ' ending ' + pm.last4;
    if (pm.type === 'invoice') return 'Invoice · 30 days · ' + pm.email;
    return 'Direct Debit · account ending ' + pm.last4;
  }
  function setupPayment(tenantId, o) {
    var issue = paymentIssue(o); if (issue) throw new Error(issue);
    return mutate(function (x) {
      var t = x.tenants[tenantId]; var at = new Date().toISOString(); var ref = uid('').slice(0, 10).toUpperCase();
      if (o.type === 'card') {
        var wallet = o.wallet || '';
        t.mandate = { type: 'card', provider: 'stripe', status: 'active', ref: 'pm_' + ref.toLowerCase(), customer: 'cus_' + ref.toLowerCase(), wallet: wallet, brand: wallet ? 'Visa' : cardBrand(o.number), last4: wallet ? '4242' : digits(o.number).slice(-4), exp: wallet ? '12/29' : String(o.exp).replace(/\s/g, ''), holder: o.holder || '', email: o.email || '', createdAt: at };
      } else if (o.type === 'invoice') {
        t.mandate = { type: 'invoice', provider: 'stripe', status: 'active', ref: 'TERMS-' + ref.slice(0, 6), holder: String(o.holder).trim(), email: o.email, address: o.address, po: o.po || '', terms: 30, createdAt: at };
        t.cycle = 'annual';
      } else {
        t.mandate = { type: 'direct_debit', provider: 'gocardless', status: 'active', ref: 'MD' + ref, customer: 'CU' + ref, holder: o.holder, bank: o.bank || 'Bank account', last4: digits(o.account).slice(-2).padStart(2, '•'), email: o.email, createdAt: at, scheme: o.scheme || 'bacs' };
      }
      if (tenantStatus(t) === 'expired' || t.status === 'past_due') t.status = 'active';
      if (t.status === 'trialing' && t.trialEnds < now()) t.status = 'active';
      var p = plan(t.plan); var amt = price(p, t.cycle);
      t.nextCharge = (t.status === 'trialing' ? new Date(t.trialEnds) : new Date()).toISOString();
      if (t.status === 'active' && amt != null) t.invoices.unshift({ id: 'INV-' + String(t.invoices.length + 1).padStart(4, '0'), at: at, amount: amt, vat: Math.round(amt * 20) / 100, plan: p.name, cycle: t.cycle, status: o.type === 'invoice' ? 'open' : 'pending_submission' });
      var label = METHODS[t.mandate.type].label;
      log(x, tenantId, 'billing.method', label + ' added (' + METHODS[t.mandate.type].provider + ') · ' + methodSummary(t.mandate));
      mail(x, o.email || (x.users[t.ownerId] || {}).email, 'Payment method saved for ' + t.name, methodSummary(t.mandate) + ' will be used for NEXTime. ' + (t.mandate.type === 'direct_debit' ? 'You are notified 3 working days before each payment, protected by the Direct Debit Guarantee.' : t.mandate.type === 'invoice' ? 'Invoices are emailed when due and payable by bank transfer within 30 days.' : 'You get a receipt by email after each payment.'));
      return clone(t);
    });
  }
  function setupMandate(tenantId, o) { return setupPayment(tenantId, Object.assign({ type: 'direct_debit', auth: true, code: '000000' }, o)); }
  function cancelMandate(tenantId) { return mutate(function (x) { var t = x.tenants[tenantId]; var l = t.mandate ? METHODS[t.mandate.type || 'direct_debit'].label : 'Payment method'; if (t.mandate) t.mandate.status = 'cancelled'; log(x, tenantId, 'billing.method_removed', l + ' removed'); return clone(t); }); }
  function cancelSubscription(tenantId) { return updateTenant(tenantId, { status: 'cancelled', cancelledAt: new Date().toISOString() }, 'Subscription cancelled'); }
  function reactivate(tenantId) { return updateTenant(tenantId, { status: 'active' }, 'Subscription reactivated'); }
  function deleteTenant(tenantId) { mutate(function (x) { var n = (x.tenants[tenantId] || {}).name; delete x.tenants[tenantId]; x.members = x.members.filter(function (m) { return m.tenantId !== tenantId; }); x.invites = x.invites.filter(function (i) { return i.tenantId !== tenantId; }); log(x, '', 'tenant.deleted', (n || tenantId) + ' deleted'); }); localStorage.removeItem(dataKey(tenantId)); endSession(); }
  function events(tenantId) { var r = read(); return r.events.filter(function (e) { return !tenantId || e.tenantId === tenantId; }); }
  function outbox(email) { var r = read(); return email ? r.outbox.filter(function (m) { return m.to === norm(email); }) : r.outbox; }
  function staffCount(tenantId) { try { var d = JSON.parse(localStorage.getItem(dataKey(tenantId)) || 'null'); return d && d.employees ? d.employees.filter(function (e) { return e.status !== 'Left'; }).length : 0; } catch (e) { return 0; } }

  /* Platform owner. Production: separate Supabase project role `platform_admin` checked by RLS + edge functions. */
  async function platformSetup(email, pw) { var iss = pwIssues(pw); if (iss.length) throw new Error('Password needs ' + iss.join(' and ') + '.'); if (!emailOk(email)) throw new Error('Enter a valid email.'); var salt = uid('s'); var h = await hashPw(pw, salt); return mutate(function (x) { if (x.platform) throw new Error('Platform admin already exists.'); x.platform = { email: norm(email), salt: salt, pw: h }; return true; }); }
  async function platformLogin(email, pw) { var r = read(); if (!r.platform || r.platform.email !== norm(email) || (await hashPw(pw, r.platform.salt)) !== r.platform.pw) throw new Error('Email or password is incorrect.'); sessionStorage.setItem('nextime.platform.session', String(now() + 4 * 3600000)); return true; }
  function platformSession() { return Number(sessionStorage.getItem('nextime.platform.session') || 0) > now(); }
  function platformLogout() { sessionStorage.removeItem('nextime.platform.session'); }
  function simulatePayment(tenantId, ok) {
    return mutate(function (x) {
      var t = x.tenants[tenantId]; var p = plan(t.plan); var amt = price(p, t.cycle) || 0;
      t.invoices.unshift({ id: 'INV-' + String(t.invoices.length + 1).padStart(4, '0'), at: new Date().toISOString(), amount: amt, vat: Math.round(amt * 20) / 100, plan: p.name, cycle: t.cycle, status: ok ? 'paid_out' : 'failed' });
      if (!ok) t.status = 'past_due'; else if (t.status === 'past_due' || t.status === 'trialing') t.status = 'active';
      log(x, tenantId, ok ? 'billing.payment_paid' : 'billing.payment_failed', (t.mandate && t.mandate.type === 'card' ? 'Stripe card payment ' : t.mandate && t.mandate.type === 'invoice' ? 'Invoice ' : 'GoCardless payment ') + (ok ? 'paid' : 'failed') + ' · £' + amt);
      return clone(t);
    });
  }

  window.NXSaaS = {
    config: config, demo: demo,
    REG: REG, SES: SES, LEGACY: LEGACY, PLANS: PLANS, ROLES: ROLES, ROLE_INFO: ROLE_INFO, TABS: TABS, TRIAL_DAYS: TRIAL_DAYS,
    read: read, write: write, url: url, go: go, emailOk: emailOk, pwIssues: pwIssues,
    b32secret: b32secret, totp: totp, totpOk: totpOk, otpauth: otpauth,
    session: session, startSession: startSession, endSession: endSession, context: context,
    tenantStatus: tenantStatus, trialDaysLeft: trialDaysLeft, plan: plan, planForStaff: planForStaff, price: price,
    dataKey: dataKey, legacyData: legacyData, staffCount: staffCount,
    signup: signup, resendVerify: resendVerify, verifyEmail: verifyEmail, login: login, setTotp: setTotp,
    requestReset: requestReset, resetPassword: resetPassword,
    invite: invite, inviteInfo: inviteInfo, acceptInvite: acceptInvite, members: members, setMember: setMember, removeMember: removeMember, revokeInvite: revokeInvite, transferOwner: transferOwner,
    updateTenant: updateTenant, setPlan: setPlan, setupMandate: setupMandate, setupPayment: setupPayment, paymentIssue: paymentIssue, cardBrand: cardBrand, methodSummary: methodSummary, METHODS: METHODS, cancelMandate: cancelMandate, cancelSubscription: cancelSubscription, reactivate: reactivate, deleteTenant: deleteTenant,
    events: events, outbox: outbox,
    platformSetup: platformSetup, platformLogin: platformLogin, platformSession: platformSession, platformLogout: platformLogout, simulatePayment: simulatePayment
  };
})();
