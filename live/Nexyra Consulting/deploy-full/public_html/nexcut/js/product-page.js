/* NEXCut product pages: FAQ, live trial dates, plan cards from js/nexcut-plans.js, app-store buttons and live demos from js/config.js. Site navigation and search come from /assets/nav/nexyra-nav.js. */
(function () {
  "use strict";
  var NX = "https://nexyraconsulting.co.uk";
  var IMG = "../assets/images/";
  var CFG = window.NEXCUT_CONFIG || {}, PL = window.NEXCUT_PLANS;

  /* ---------- Live demos + app-store buttons (placeholders until URLs are configured) ---------- */
  document.querySelectorAll("iframe[data-demo]").forEach(function (f) {
    var url = CFG[f.getAttribute("data-demo") + "DemoUrl"];
    if (url) f.src = url; else (f.closest(".demo-sec") || f.closest(".demo")).hidden = true;
  });
  document.querySelectorAll("[data-store]").forEach(function (a) {
    var url = CFG[a.getAttribute("data-store")];
    if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; return; }
    a.removeAttribute("href"); a.setAttribute("aria-disabled", "true"); a.classList.add("is-soon");
    var n = a.querySelector(".store-note"); if (n) n.textContent = "Coming soon · link to be added";
  });

  /* ---------- Plan cards + billing table from the shared plan config ---------- */
  var ARW = '<svg class="arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>';
  function e2(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  if (PL) {
    document.querySelectorAll("[data-plans]").forEach(function (box) {
      box.innerHTML = PL.terms.map(function (t) {
        var d = PL.describe(t), rec = PL.recommended === t.code;
        return '<div class="plan' + (rec ? " plan-rec" : "") + '"><div class="plan-top"><span class="plan-name">' + e2(d.name) + "</span>" + (d.save ? '<span class="save">' + e2(d.save) + "</span>" : rec ? '<span class="save">Recommended</span>' : "") + "</div>" +
          (d.priced ? '<p class="price"><b>' + e2(d.price) + "</b><span>" + d.per + "</span></p>" : '<p class="price price-tbc"><b>£ —</b><span>Price to be confirmed</span></p>') +
          '<p class="billed">' + e2(d.billed) + '</p><p class="term">' + e2(d.commitment) + "</p>" +
          '<a class="plan-cta" href="checkout.html?plan=' + t.code + '" aria-label="Start 14-day free trial on ' + e2(d.name) + '">Start free trial' + ARW + "</a></div>";
      }).join("");
    });
    document.querySelectorAll("[data-plan-table]").forEach(function (tb) {
      tb.innerHTML = PL.terms.map(function (t) {
        var d = PL.describe(t);
        return '<tr><th scope="row">' + e2(d.name) + "</th><td>" + e2(d.priced ? d.firstCharge : "To be confirmed") + "</td><td>" + e2(d.billed) + "</td><td>" + e2(d.commitment) + "</td><td>" + e2(d.renews) + "</td></tr>";
      }).join("");
    });
    document.querySelectorAll("[data-if-unpriced]").forEach(function (el) { el.hidden = PL.allPriced(); });
    document.querySelectorAll("[data-vat]").forEach(function (el) { if (PL.vatNote) el.textContent = PL.vatNote; });
    document.querySelectorAll("[data-trial-days]").forEach(function (el) { el.textContent = String(PL.trialDays); });
  }

  /* ---------- Live dates (device clock; refreshed every minute) ---------- */
  var MO = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var DW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  function fd(d) { return d.getDate() + " " + MO[d.getMonth()]; }
  function addD(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function addM(d, n) { var x = new Date(d); x.setMonth(x.getMonth() + n); return x; }
  function paintDates() {
    var now = new Date(); now.setHours(12, 0, 0, 0);
    var days = PL ? PL.trialDays : 14, rem = PL ? PL.reminderDaysBeforeTrialEnd : 3;
    var trialEnd = addD(now, days);
    var v = {
      today: DW[now.getDay()] + " " + fd(now) + " " + now.getFullYear(),
      reminder: fd(addD(trialEnd, -rem)),
      trialEnd: fd(trialEnd) + " " + trialEnd.getFullYear(),
      year: String(now.getFullYear())
    };
    document.querySelectorAll("[data-date]").forEach(function (el) {
      var k = el.getAttribute("data-date"); if (v[k]) el.textContent = v[k];
    });
  }
  paintDates();
  setInterval(paintDates, 60000);
  document.addEventListener("visibilitychange", function () { if (!document.hidden) paintDates(); });

  /* ---------- FAQ (one open at a time) ---------- */
  var faqBtns = Array.prototype.slice.call(document.querySelectorAll(".faq-q"));
  faqBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      var open = b.getAttribute("aria-expanded") === "true";
      faqBtns.forEach(function (o) { o.setAttribute("aria-expanded", "false"); document.getElementById(o.getAttribute("aria-controls")).hidden = true; });
      if (!open) { b.setAttribute("aria-expanded", "true"); document.getElementById(b.getAttribute("aria-controls")).hidden = false; }
    });
  });
})();
