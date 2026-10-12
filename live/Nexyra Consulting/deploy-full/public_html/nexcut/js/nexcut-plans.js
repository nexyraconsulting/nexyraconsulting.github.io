/* NEXCut Business — single source of truth for subscription terms.
   Read by: the website (pricing, business, checkout), the NEXCut Business app, and
   supabase/migrations/*_billing.sql (seed must match; see docs/PAYMENTS.md §Plans).

   Prices match NEXDrive: £25 monthly, or £240 / £420 / £540 for 12 / 24 / 36 months (£20 / £17.50 / £15 a month).
   If a pricePence is set back to null: pages show "Price to be confirmed", no savings, and live checkout refuses to start.
   pricePence meaning: monthly → charged each month; fixed terms → depends on `billing`
   ('upfront' = whole term charged at trial end; 'monthly' = charged monthly for the term). */
(function (root) {
  "use strict";
  var P = {
    version: 1,
    currency: "GBP",
    trialDays: 14,
    reminderDaysBeforeTrialEnd: 3,
    paymentDetailsUpfront: true,      // card / Direct Debit mandate saved at checkout, nothing charged during the trial
    vatNote: null,                    // e.g. "Prices exclude VAT at 20%" — to be confirmed
    renewal: "same_term",             // fixed terms renew for the same term unless cancelled — to be confirmed
    recommended: null,                // only set if there is a genuine, supported reason
    terms: [
      { code: "monthly", name: "Monthly",   months: 1,  commitmentMonths: 0,  billing: "monthly", pricePence: 2500 , stripePriceId: null, appleProductId: null, googleProductId: null },
      { code: "m12",     name: "12 months", months: 12, commitmentMonths: 12, billing: "upfront", pricePence: 24000, stripePriceId: null, appleProductId: null, googleProductId: null },
      { code: "m24",     name: "24 months", months: 24, commitmentMonths: 24, billing: "upfront", pricePence: 42000, stripePriceId: null, appleProductId: null, googleProductId: null },
      { code: "m36",     name: "36 months", months: 36, commitmentMonths: 36, billing: "upfront", pricePence: 54000, stripePriceId: null, appleProductId: null, googleProductId: null }
    ],
    features: [
      "Calendar: day, week, month and list", "Online booking page", "Client records and notes", "Services, prices and durations",
      "Staff, schedules and hours", "Offers", "Reports", "Team roles and access", "Subscription and billing in the app"
    ]
  };

  var MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  P.byCode = function (c) { return P.terms.filter(function (t) { return t.code === c; })[0] || null; };
  P.money = function (p) { if (p == null) return null; var v = p / 100; return "£" + (v % 1 ? v.toFixed(2) : String(v)); };
  P.allPriced = function () { return P.terms.every(function (t) { return t.pricePence != null; }); };
  P.addDays = function (d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; };
  P.addMonths = function (d, n) { var x = new Date(d); x.setMonth(x.getMonth() + n); return x; };
  P.fmtDate = function (d) { d = new Date(d); return d.getDate() + " " + MO[d.getMonth()] + " " + d.getFullYear(); };

  // Monthly-equivalent and savings: only when BOTH this term and the monthly price are confirmed.
  P.describe = function (t) {
    if (typeof t === "string") t = P.byCode(t);
    var m = P.byCode("monthly"), priced = t.pricePence != null;
    var perMonth = !priced ? null : t.billing === "upfront" ? Math.round(t.pricePence / t.months) : t.pricePence;
    var total = !priced ? null : t.billing === "upfront" ? t.pricePence : t.pricePence * t.months;
    var save = null;
    if (priced && m.pricePence != null && t.code !== "monthly") { var s = m.pricePence * t.months - total; if (s > 0) save = s; }
    return {
      code: t.code, name: t.name, priced: priced,
      price: priced ? P.money(perMonth) : null,
      per: "/month",
      billed: t.code === "monthly" ? (priced ? "Billed " + P.money(t.pricePence) + " every month" : "Billed every month")
        : t.billing === "upfront" ? (priced ? P.money(total) + " billed once for " + t.months + " months" : "Billed once for the full " + t.months + " months")
        : (priced ? "Billed " + P.money(t.pricePence) + " monthly for " + t.months + " months" : "Billed monthly for " + t.months + " months"),
      commitment: t.commitmentMonths ? t.commitmentMonths + "-month commitment" : "No commitment · cancel any time",
      renews: t.code === "monthly" ? "Renews every month" : "Renews for another " + t.months + " months unless cancelled",
      firstCharge: priced ? P.money(t.billing === "upfront" ? total : t.pricePence) : null,
      save: save ? "Save " + P.money(save) : null,
      saveNote: save ? "vs " + t.months + " months on Monthly" : null
    };
  };

  // Trial timeline from the activation moment (checkout completion on the web, store confirmation in the apps).
  P.trialDates = function (start) {
    var s = start ? new Date(start) : new Date();
    var end = P.addDays(s, P.trialDays);
    return { start: s, end: end, reminder: P.addDays(end, -P.reminderDaysBeforeTrialEnd), firstPayment: end };
  };

  root.NEXCUT_PLANS = P;
  if (typeof module !== "undefined") module.exports = P;
})(typeof window !== "undefined" ? window : globalThis);
