/* NEXCut Business — web registration and checkout (5 steps).
   Live mode (NEXCUT_CONFIG.supabaseUrl set): step 4 calls the `create-checkout` Edge Function, which creates the
   account + business + Stripe Checkout Session (subscription, 14-day trial, card/wallets/Bacs) and returns its URL.
   Stripe redirects back here with ?session_id=… and step 5 polls `checkout-status` until the webhook has recorded
   the trial. DEMO mode (no supabaseUrl): the journey is walkable, clearly labelled, nothing is created or charged.
   Raw card/bank details never touch this page or our servers: they are entered on Stripe-hosted Checkout. */
(function () {
  "use strict";
  var CFG = window.NEXCUT_CONFIG || {}, PL = window.NEXCUT_PLANS;
  var LIVE = !!CFG.supabaseUrl;
  var FN = LIVE ? CFG.supabaseUrl.replace(/\/$/, "") + "/functions/v1/" : null;
  var KEY = "nexcut.checkout.v1";
  var $main = document.getElementById("co-main"), $sum = document.getElementById("co-sum"), $steps = document.getElementById("co-steps");
  if (!$main || !PL) return;
  if (!LIVE) document.getElementById("co-demo").hidden = false;

  var STEPS = ["Billing option", "Your account", "Trial terms", "Payment method", "Confirmation"];
  var TYPES = ["Hair salon", "Barbershop", "Nail studio", "Beauty salon", "Spa", "Aesthetics clinic", "Brows and lashes", "Massage and wellbeing", "Other"];
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var qs = new URLSearchParams(location.search);
  var saved = {};
  try { saved = JSON.parse(sessionStorage.getItem(KEY) || "{}"); } catch (e) {}
  var S = Object.assign({ step: 1, plan: "monthly", acct: { bizName: "", bizType: "", owner: "", email: "", mobile: "", password: "" }, agree: { terms: false, trial: false, updates: false }, pm: "card", errors: {}, busy: false, result: null }, saved);
  S.acct.password = ""; // never persisted
  if (qs.get("plan") && PL.byCode(qs.get("plan"))) { S.plan = qs.get("plan"); if (!saved.step) S.step = 1; }
  if (qs.get("session_id")) { S.step = 5; S.result = { pending: true, sessionId: qs.get("session_id") }; }
  if (qs.get("cancelled")) { S.step = 4; S.errors = { _top: "Payment setup was not completed. Nothing has been charged. You can try again." }; }

  function persist() { var c = JSON.parse(JSON.stringify(S)); c.acct.password = ""; delete c.errors; delete c.busy; try { sessionStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var ARW = '<svg class="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>';
  var term = function () { return PL.byCode(S.plan) || PL.terms[0]; };
  var D = function () { return PL.describe(term()); };
  var dates = function () { return PL.trialDates(S.result && S.result.trialStart ? S.result.trialStart : null); };
  var fd = PL.fmtDate;
  function normMobile(v) { var d = String(v || "").replace(/[\s()-]/g, ""); if (/^\+447\d{9}$/.test(d)) return d; if (/^07\d{9}$/.test(d)) return "+44" + d.slice(1); if (/^447\d{9}$/.test(d)) return "+" + d; return null; }

  /* ---------- Rendering ---------- */
  function renderSteps() {
    $steps.innerHTML = STEPS.map(function (t, i) {
      var n = i + 1, st = n === S.step ? "current" : n < S.step ? "done" : "todo";
      return '<li data-state="' + st + '"' + (st === "current" ? ' aria-current="step"' : "") + '><span class="n">0' + n + '</span><span class="t">' + t + "</span></li>";
    }).join("");
  }
  function renderSummary() {
    var d = D(), t = dates();
    $sum.innerHTML = '<h3>Your selection</h3><p class="s-plan">NEXCut Business · ' + esc(d.name) + "</p>" +
      '<dl class="kv"><div><dt>Price</dt><dd>' + (d.priced ? esc(d.price) + d.per : "To be confirmed") + "</dd></div>" +
      "<div><dt>Billing</dt><dd>" + esc(d.billed) + "</dd></div>" +
      "<div><dt>Commitment</dt><dd>" + esc(d.commitment) + "</dd></div>" +
      "<div><dt>Free trial</dt><dd>" + PL.trialDays + " days</dd></div>" +
      "<div><dt>Trial ends</dt><dd>" + fd(t.end) + "</dd></div>" +
      "<div><dt>First payment</dt><dd>" + (d.priced ? esc(d.firstCharge) + " on " : "") + fd(t.firstPayment) + "</dd></div></dl>" +
      '<div class="today"><span>Due today</span><b>£0.00</b></div>' +
      '<p class="s-note">Dates assume you finish today. Your trial starts the moment you complete step 4; the confirmation shows the exact dates.</p>';
  }
  function errSummary() {
    var keys = Object.keys(S.errors).filter(function (k) { return k !== "_top" && S.errors[k]; });
    var top = S.errors._top ? '<div class="err-sum" role="alert" tabindex="-1"><b>' + esc(S.errors._top) + "</b></div>" : "";
    if (!keys.length) return top;
    return top + '<div class="err-sum" role="alert" tabindex="-1"><b>Check ' + (keys.length === 1 ? "this field" : "these " + keys.length + " fields") + "</b><ul>" +
      keys.map(function (k) { return '<li><a href="#f-' + k + '">' + esc(S.errors[k]) + "</a></li>"; }).join("") + "</ul></div>";
  }
  function field(k, label, type, extra, hint) {
    var e = S.errors[k], v = S.acct[k] || "";
    var desc = (hint ? "h-" + k + " " : "") + (e ? "e-" + k : "");
    var ctrl = type === "select"
      ? '<select id="f-' + k + '" name="' + k + '"' + (desc ? ' aria-describedby="' + desc.trim() + '"' : "") + (e ? ' aria-invalid="true"' : "") + ' required><option value="">Choose…</option>' + TYPES.map(function (o) { return "<option" + (o === v ? " selected" : "") + ">" + o + "</option>"; }).join("") + "</select>"
      : '<input id="f-' + k + '" name="' + k + '" type="' + type + '" value="' + esc(v) + '" ' + (extra || "") + (desc ? ' aria-describedby="' + desc.trim() + '"' : "") + (e ? ' aria-invalid="true"' : "") + " required>";
    return '<div class="fld' + (k === "email" || k === "password" ? "" : "") + '" data-invalid="' + !!e + '"><label for="f-' + k + '">' + label + "</label>" + (hint ? '<span class="hint" id="h-' + k + '">' + hint + "</span>" : "") + ctrl + (e ? '<span class="err" id="e-' + k + '">' + esc(e) + "</span>" : "") + "</div>";
  }
  function actions(nextLabel, opts) {
    opts = opts || {};
    return '<div class="co-actions"><button type="' + (opts.submit ? "submit" : "button") + '" class="btn btn-primary btn-wide" data-act="next"' + (S.busy || opts.disabled ? " disabled" : "") + ">" + (S.busy ? "Please wait…" : nextLabel) + ARW + "</button>" +
      (S.step > 1 && S.step < 5 ? '<button type="button" class="btn-link" data-act="back">Back</button>' : "") + "</div>";
  }

  function renderMain() {
    var d = D(), t = dates(), h = "";
    if (S.step === 1) {
      h = '<h2 tabindex="-1">Choose a billing option</h2><p class="body">Every option includes the whole product and starts with a ' + PL.trialDays + "-day free trial. You can switch during the trial.</p>" + errSummary() +
        '<fieldset style="border:0;margin:0;padding:0"><legend class="eyebrow" style="padding:0 0 10px">Billing option</legend><div class="choice-list">' +
        PL.terms.map(function (tm) {
          var x = PL.describe(tm);
          return '<label class="choice"><input type="radio" name="plan" value="' + tm.code + '"' + (tm.code === S.plan ? " checked" : "") + '><span><span class="c-t">' + esc(x.name) + '</span><span class="c-d">' + esc(x.billed) + " · " + esc(x.commitment) + "</span></span>" +
            '<span class="c-p">' + (x.priced ? esc(x.price) + "<small>per month" + (x.save ? " · " + esc(x.save) : "") + "</small>" : "£ —<small>Price to be confirmed</small>") + "</span></label>";
        }).join("") + "</div></fieldset>" + actions("Continue");
    }
    if (S.step === 2) {
      h = '<h2 tabindex="-1">Create your business account</h2><p class="body">You will use the same email or mobile to sign in to the NEXCut Business app. Address, services and team come later, in the app.</p>' + errSummary() +
        '<form id="co-form" novalidate><div class="fgrid">' +
        field("bizName", "Business name", "text", 'autocomplete="organization" maxlength="120"') +
        field("bizType", "Type of business", "select") +
        '<div class="full">' + field("owner", "Your full name", "text", 'autocomplete="name" maxlength="120"', "You will be the account owner.") + "</div>" +
        field("email", "Email", "email", 'autocomplete="email" inputmode="email" maxlength="254"', "For your receipts and trial reminders.") +
        field("mobile", "UK mobile number", "tel", 'autocomplete="tel" inputmode="tel" maxlength="16"', "We text a code to verify it when you first sign in.") +
        '<div class="full">' + field("password", "Create a password", "password", 'autocomplete="new-password" minlength="10" maxlength="128"', "At least 10 characters.") + "</div>" +
        '</div>' + actions("Continue", { submit: true }) + "</form>" +
        '<p class="body" style="font-size:14px">Already registered in the app? <a href="business.html#faq-heading">Sign in to the NEXCut Business app</a> to manage your subscription instead.</p>';
    }
    if (S.step === 3) {
      var price = d.priced ? d.firstCharge : null;
      h = '<h2 tabindex="-1">Review your trial and subscription</h2>' + errSummary() +
        '<dl class="kv">' +
        "<div><dt>Billing option</dt><dd>" + esc(d.name) + "</dd></div>" +
        "<div><dt>How you are billed</dt><dd>" + esc(d.billed) + "</dd></div>" +
        "<div><dt>Commitment</dt><dd>" + esc(d.commitment) + "</dd></div>" +
        "<div><dt>Free trial starts</dt><dd>When you complete step 4 (today, " + fd(t.start) + ")</dd></div>" +
        "<div><dt>Free trial ends</dt><dd>" + fd(t.end) + "</dd></div>" +
        "<div><dt>Reminder email</dt><dd>" + fd(t.reminder) + "</dd></div>" +
        "<div><dt>First payment</dt><dd>" + (price ? esc(price) + " on " : "") + fd(t.firstPayment) + (price ? "" : " · price to be confirmed") + "</dd></div>" +
        "<div><dt>After that</dt><dd>" + esc(d.renews) + "</dd></div>" +
        "<div><dt>Charged today</dt><dd>£0.00</dd></div></dl>" +
        '<div class="note"><span><b>Cancelling during your trial.</b> Cancel any time before ' + fd(t.end) + " in the NEXCut Business app (Menu → Subscription &amp; billing → Cancel free trial) or from the billing link in your confirmation email. You will not be charged and the subscription will not start. You keep access until the trial ends.</span></div>" +
        '<div class="chk-list">' +
        '<label class="chk" id="f-terms" data-invalid="' + !!S.errors.terms + '"><input type="checkbox" data-agree="terms"' + (S.agree.terms ? " checked" : "") + (S.errors.terms ? ' aria-invalid="true" aria-describedby="e-terms"' : "") + "><span>I agree to the " + (CFG.termsUrl ? '<a href="' + esc(CFG.termsUrl) + '" target="_blank" rel="noopener">NEXCut Business Terms of Service</a>' : "NEXCut Business Terms of Service <em>(to be published)</em>") + ' and have read the <a href="' + esc(CFG.privacyUrl || "#") + '" target="_blank" rel="noopener">Privacy Policy</a>.' + (S.errors.terms ? '<br><span class="err" id="e-terms">' + esc(S.errors.terms) + "</span>" : "") + "</span></label>" +
        '<label class="chk" id="f-trial" data-invalid="' + !!S.errors.trial + '"><input type="checkbox" data-agree="trial"' + (S.agree.trial ? " checked" : "") + (S.errors.trial ? ' aria-invalid="true" aria-describedby="e-trial"' : "") + "><span>I understand my free trial ends on " + fd(t.end) + " and that " + (price ? esc(price) : "the confirmed price for " + esc(d.name)) + " will then be charged" + (term().code === "monthly" ? " every month" : "") + " unless I cancel before then." + (S.errors.trial ? '<br><span class="err" id="e-trial">' + esc(S.errors.trial) + "</span>" : "") + "</span></label>" +
        '<label class="chk"><input type="checkbox" data-agree="updates"' + (S.agree.updates ? " checked" : "") + "><span>Email me product updates and tips (optional).</span></label></div>" + actions("Continue");
    }
    if (S.step === 4) {
      var noPrice = LIVE && !d.priced;
      h = '<h2 tabindex="-1">Choose a payment method</h2><p class="body">Nothing is charged today. Your payment method is used for the first payment on ' + fd(t.firstPayment) + ", unless you cancel before then.</p>" + errSummary() +
        '<fieldset style="border:0;margin:0;padding:0"><legend class="eyebrow" style="padding:0 0 10px">Payment method</legend><div class="choice-list">' +
        '<label class="choice"><input type="radio" name="pm" value="card"' + (S.pm === "card" ? " checked" : "") + '><span><span class="c-t">Card, Apple Pay or Google Pay</span><span class="c-d">Visa, Mastercard and American Express. Apple Pay and Google Pay appear on supported devices and browsers.</span></span><span></span></label>' +
        '<label class="choice"><input type="radio" name="pm" value="bacs_debit"' + (S.pm === "bacs_debit" ? " checked" : "") + '><span><span class="c-t">Bacs Direct Debit</span><span class="c-d">From a UK bank account. You set up a Direct Debit mandate and are notified before each collection. Protected by the Direct Debit Guarantee.</span></span><span></span></label>' +
        "</div></fieldset>" +
        '<div class="note"><span><b>Secure payment by Stripe.</b> You enter your details on Stripe’s secure page, then return here. NEXCut never sees or stores your full card or bank details.</span></div>' +
        (noPrice ? '<p class="note note-warn"><span><b>Online checkout opens once prices are confirmed.</b> You can start your trial in the NEXCut Business app in the meantime.</span></p>' : "") +
        (LIVE ? "" : '<div class="demo-banner"><span class="tag-demo">DEMO</span><span>Stripe is not connected on this site. The next button simulates a completed setup: no account is created and nothing is saved or charged.</span></div>') +
        actions(LIVE ? "Continue to secure payment" : "Simulate completed setup", { disabled: noPrice });
    }
    if (S.step === 5) {
      var R = S.result || {};
      if (R.pending) {
        h = '<h2 tabindex="-1">Activating your trial…</h2><p class="body">We are confirming your payment method with Stripe. This usually takes a few seconds. Please keep this page open.</p>' + errSummary();
      } else {
        var rd = PL.trialDates(R.trialStart), rt = PL.describe(R.plan || S.plan);
        h = '<div class="done-mark" aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></div>' +
          '<h2 tabindex="-1">Your free trial is active' + (R.demo ? " (demo)" : "") + "</h2>" +
          (R.demo ? '<div class="demo-banner"><span class="tag-demo">DEMO</span><span>Nothing was created. In the live site this page shows your real account and trial, and a confirmation email is sent.</span></div>' : "") +
          '<dl class="kv">' +
          "<div><dt>Business</dt><dd>" + esc(R.businessName || S.acct.bizName) + (R.businessId ? " · " + esc(R.businessId) : "") + "</dd></div>" +
          "<div><dt>Billing option</dt><dd>" + esc(rt.name) + "</dd></div>" +
          "<div><dt>Trial started</dt><dd>" + fd(rd.start) + "</dd></div>" +
          "<div><dt>Trial ends</dt><dd>" + fd(rd.end) + "</dd></div>" +
          "<div><dt>First payment</dt><dd>" + (rt.priced ? esc(rt.firstCharge) + " on " : "") + fd(rd.firstPayment) + "</dd></div>" +
          "<div><dt>Payment method</dt><dd>" + esc(R.pmLabel || (S.pm === "bacs_debit" ? "Bacs Direct Debit" : "Card or wallet")) + "</dd></div>" +
          "<div><dt>Confirmation email</dt><dd>" + (R.demo ? "Not sent (demo)" : "Sent to " + esc(R.email || S.acct.email)) + "</dd></div></dl>" +
          '<p class="eyebrow">What happens next</p><div class="next-list">' +
          '<div><span class="n">01</span><span><span class="t">Get the NEXCut Business app</span><span class="d"><span class="store-row" style="margin-top:10px">' +
          '<a class="store store-primary" data-store="appStoreBusiness" href="#"><b>App Store</b><span class="store-note">Download</span></a><a class="store" data-store="playStoreBusiness" href="#"><b>Google Play</b><span class="store-note">Download</span></a></span></span></span></div>' +
          '<div><span class="n">02</span><span><span class="t">Sign in with the same account</span><span class="d">Use ' + esc(R.email || S.acct.email || "your email") + " or your mobile number. The app shows the same trial and billing option you chose here.</span></span></div>" +
          '<div><span class="n">03</span><span><span class="t">Set up and publish</span><span class="d">Add your address, services, team and hours, then submit for verification. Customers can find you once NEXCut approves your business and you publish.</span></span></div>' +
          '<div><span class="n">04</span><span><span class="t">Manage or cancel</span><span class="d">In the app: Menu → Subscription &amp; billing. On the web: the billing link in your confirmation email. Cancel before ' + fd(rd.end) + " and you are not charged.</span></span></div></div>";
      }
    }
    $main.innerHTML = h;
    if (S.step === 5) paintStores();
  }
  function paintStores() {
    $main.querySelectorAll("[data-store]").forEach(function (a) {
      var url = CFG[a.getAttribute("data-store")];
      if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; return; }
      a.removeAttribute("href"); a.setAttribute("aria-disabled", "true"); a.classList.add("is-soon");
      a.querySelector(".store-note").textContent = "Coming soon · link to be added";
    });
  }
  function render(focus) {
    renderSteps(); renderMain(); renderSummary(); persist();
    if (focus) {
      var target = $main.querySelector(".err-sum") || $main.querySelector("h2");
      if (target) target.focus({ preventScroll: true });
      var top = $main.getBoundingClientRect().top + window.scrollY - 140;
      if (window.scrollY > top) window.scrollTo({ top: top, behavior: "smooth" });
    }
  }

  /* ---------- Validation ---------- */
  function validateAccount() {
    var a = S.acct, e = {};
    if (a.bizName.trim().length < 2) e.bizName = "Enter your business name.";
    if (!a.bizType) e.bizType = "Choose the type of business.";
    if (a.owner.trim().length < 2 || a.owner.trim().indexOf(" ") < 0) e.owner = "Enter your first and last name.";
    if (!EMAIL.test(a.email.trim())) e.email = "Enter an email address like name@example.co.uk.";
    if (!normMobile(a.mobile)) e.mobile = "Enter a UK mobile number, like 07700 900123.";
    if (a.password.length < 10) e.password = "Use at least 10 characters for your password.";
    else if (a.email && a.password.toLowerCase().indexOf(a.email.split("@")[0].toLowerCase()) >= 0) e.password = "Choose a password that does not contain your email name.";
    return e;
  }

  /* ---------- Live calls ---------- */
  function call(name, body, method) {
    return fetch(FN + name + (method === "GET" ? "?" + new URLSearchParams(body).toString() : ""), {
      method: method || "POST",
      headers: { "Content-Type": "application/json", apikey: CFG.supabaseAnonKey, Authorization: "Bearer " + CFG.supabaseAnonKey },
      body: method === "GET" ? undefined : JSON.stringify(body)
    }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { j._status = r.status; return j; }); });
  }
  function startCheckout() {
    S.busy = true; S.errors = {}; render();
    var a = S.acct;
    call("create-checkout", {
      plan: S.plan, paymentMethod: S.pm,
      account: { businessName: a.bizName.trim(), businessType: a.bizType, ownerName: a.owner.trim(), email: a.email.trim().toLowerCase(), mobile: normMobile(a.mobile), password: a.password },
      consents: { terms: S.agree.terms, trialTerms: S.agree.trial, marketing: S.agree.updates, termsVersion: (CFG.termsVersion || "unpublished") },
      returnUrl: location.href.split("?")[0]
    }).then(function (j) {
      S.busy = false;
      if (j._status === 409) { S.step = 2; S.errors = { email: "An account already exists for this email. Sign in to the NEXCut Business app instead." }; return render(true); }
      if (j._status === 422 && j.field) { S.step = 2; S.errors = {}; S.errors[j.field] = j.message; return render(true); }
      if (!j.url) { S.errors = { _top: j.message || "We could not start secure payment. Nothing has been charged. Please try again." }; return render(true); }
      a.password = ""; persist();
      location.assign(j.url);
    }).catch(function () { S.busy = false; S.errors = { _top: "Connection problem. Nothing has been charged. Please try again." }; render(true); });
  }
  function pollStatus(n) {
    call("checkout-status", { session_id: S.result.sessionId }, "GET").then(function (j) {
      if (j.status === "trialing" || j.status === "active") {
        S.result = { trialStart: j.trialStart, plan: j.plan, businessName: j.businessName, businessId: j.businessPublicId, email: j.email, pmLabel: j.paymentMethodLabel };
        try { sessionStorage.removeItem(KEY); } catch (e) {}
        history.replaceState(null, "", location.pathname);
        return render(true);
      }
      if (n > 15) { S.errors = { _top: "This is taking longer than usual. Your trial will still activate: check your email, or sign in to the app in a few minutes." }; return render(); }
      setTimeout(function () { pollStatus(n + 1); }, 2000);
    }).catch(function () { setTimeout(function () { pollStatus(n + 1); }, 3000); });
  }

  /* ---------- Events ---------- */
  function next() {
    S.errors = {};
    if (S.step === 2) { S.errors = validateAccount(); if (Object.keys(S.errors).length) return render(true); }
    if (S.step === 3) {
      if (!S.agree.terms) S.errors.terms = "Agree to the Terms of Service and Privacy Policy to continue.";
      if (!S.agree.trial) S.errors.trial = "Confirm you understand when your trial ends and the first payment is taken.";
      if (Object.keys(S.errors).length) return render(true);
    }
    if (S.step === 4) {
      if (LIVE) return startCheckout();
      S.result = { demo: true, trialStart: new Date().toISOString(), plan: S.plan, businessId: "NC-DEMO" };
      S.step = 5; render(true);
      try { sessionStorage.removeItem(KEY); } catch (e) {}
      return;
    }
    S.step = Math.min(5, S.step + 1); render(true);
  }
  $main.addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]");
    if (!b) return;
    if (b.getAttribute("data-act") === "back") { S.errors = {}; S.step = Math.max(1, S.step - 1); return render(true); }
    if (b.type !== "submit") next();
  });
  $main.addEventListener("submit", function (e) { e.preventDefault(); next(); });
  $main.addEventListener("change", function (e) {
    var t = e.target;
    if (t.name === "plan") { S.plan = t.value; renderSummary(); persist(); }
    if (t.name === "pm") { S.pm = t.value; persist(); }
    if (t.hasAttribute("data-agree")) { S.agree[t.getAttribute("data-agree")] = t.checked; persist(); }
  });
  $main.addEventListener("input", function (e) {
    var t = e.target;
    if (t.form && t.form.id === "co-form" && t.name in S.acct) { S.acct[t.name] = t.value; if (t.name !== "password") persist(); }
  });
  $main.addEventListener("change", function (e) {
    var t = e.target;
    if (t.form && t.form.id === "co-form" && t.name === "bizType") { S.acct.bizType = t.value; persist(); }
  });

  render(false);
  if (S.step === 5 && S.result && S.result.pending && LIVE) pollStatus(0);
  if (S.step === 5 && S.result && S.result.pending && !LIVE) { S.errors = { _top: "Returned from payment, but this site is in demo mode and cannot confirm a trial." }; render(); }
})();
