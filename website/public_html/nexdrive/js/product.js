/* NexDrive product page: the Nexyra Consulting site navigation (menu overlay, product drill-down, search,
   light/dark tone), FAQ, live trial dates, app links. Mirrors the main site's Nav v2 component 1:1.
   No dependencies. */
(function () {
  "use strict";
  var NX = "https://nexyraconsulting.co.uk";
  var IMG = "../assets/images/";
  var body = document.body;
  var APP = body.getAttribute("data-app-url") || "../index.html";

  /* ---------- App links + live demo ---------- */
  document.querySelectorAll("[data-app]").forEach(function (el) {
    if (el.tagName === "IFRAME") el.src = APP; else el.href = APP;
  });

  /* ---------- Live dates (device clock; refreshed every minute) ---------- */
  var MO = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var DW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  function fd(d) { return d.getDate() + " " + MO[d.getMonth()]; }
  function addD(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function addM(d, n) { var x = new Date(d); x.setMonth(x.getMonth() + n); return x; }
  function paintDates() {
    var now = new Date(); now.setHours(12, 0, 0, 0);
    var trialEnd = addD(now, 14), freeEnd = addM(trialEnd, 1);
    var v = {
      today: DW[now.getDay()] + " " + fd(now) + " " + now.getFullYear(),
      reminder: fd(addD(trialEnd, -3)),
      trialEnd: fd(trialEnd),
      refFirstPay: fd(freeEnd) + " " + freeEnd.getFullYear(),
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

  /* ---------- Menu data: identical to the main site's Nav v2 (paths made absolute) ---------- */
  var u = function (p) { return NX + "/" + p; };
  var svc = function (key, group, label, file, img, alt, desc) { return { key: key, group: group, label: label, to: u(file), img: IMG + img, alt: alt, desc: desc, cta: "Visit page" }; };
  var SERVICES = [
    svc("user-research", "Core service", "User Research & Insights", "services-user-research.html", "insights-journey-mapping.jpg", "Researchers mapping a customer journey on a wall", "Evidence before opinion. Qualitative and quantitative research across your customers, market and competitors, turned into decisions your teams can act on."),
    svc("brand-building", "Core service", "Brand Building", "services-brand-building.html", "services-brand.jpg", "Branded packaging and collateral on a studio table", "Positioning, identity and the system that holds them together, documented so every team ships on-brand without asking permission."),
    svc("marketing-strategy", "Core service", "Marketing Strategy & Execution", "services-marketing-strategy.html", "work-gtm-launch.jpg", "Campaign planning session in progress", "Go-to-market planning, messaging architecture and the campaigns behind it, measured against pipeline and revenue rather than impressions."),
    svc("digital-transformation", "Core service", "Digital Transformation", "services-digital-transformation.html", "services-digital-transformation-hero.jpg", "Abstract grid of a modern building facade", "Modernisation with a business case attached: target operating model, platforms and data, sequenced into deliverable phases that stick."),
    svc("managed-services", "Core service", "Managed Services", "services-managed-services.html", "home-partnership.jpg", "Embedded team working alongside a client", "Embedded Nexyra teams running design, brand and digital operations alongside yours, under clear service levels, month after month."),
    svc("accounts-business-services", "Core service", "Accounts & Business Services", "services-accounts-and-business-services.html", "services-accounts-hero.jpg", "Glass-partitioned office corridor", "Accounts, audit and assurance under one roof, with management reporting and forecasting leaders can actually read."),
    svc("experience-design", "Extended capability", "Experience Design (UX/UI)", "services-experience-design.html", "services-product.jpg", "Interface wireframes being drawn on a tablet", "Information architecture, high-fidelity screens, prototypes and accessible, developer-ready specifications."),
    svc("product-service-design", "Extended capability", "Product and Service Design", "services-product-and-service-design.html", "services-creative.jpg", "Concept sketches and prototypes on a work surface", "Service blueprints, MVP definition, concept testing and the roadmap that takes an idea to launch."),
    svc("enterprise-software-design", "Extended capability", "Enterprise Software Design", "services-enterprise-software-design.html", "services-enterprise-software-hero.jpg", "A tall glass building against the sky", "Design discipline for ERP, CRM, internal platforms and admin tooling, making complex workflows navigable every day."),
    svc("automation-intelligent-systems", "Extended capability", "Automation & Intelligent Systems", "services-automation-and-intelligent-systems.html", "services-automation-hero.jpg", "Shelving units filled with stacked boxes in an automated warehouse aisle", "Workflow automation, AI-assisted decision support and system integration, designed around measurable time saved."),
    svc("no-code-development", "Extended capability", "No-Code Development", "services-no-code-development.html", "services-no-code-hero.jpg", "Blurred city street at night", "Fast, low-risk builds for internal tools, pilots and validation work, integrated with your stack and handed over with training.")
  ];
  var ind = function (key, label, img, alt, desc, feature) { return { key: key, group: "Industry", label: label, to: u("work.html"), img: IMG + img, alt: alt, desc: desc, feature: feature, cta: "Explore our work" }; };
  var INDUSTRIES = [
    ind("ind-financial", "Financial Services", "work-ai-service.jpg", "Customer service operations supported by AI tooling", "Banks, insurers and fintechs modernising how they serve customers, from AI-assisted service platforms to the data and compliance layers underneath.", "AI-Powered Customer Service Transformation"),
    ind("ind-healthcare", "Healthcare", "work-data-platform.jpg", "Data platform dashboards", "Healthcare technology and care providers turning clinical and operational data into predictive, patient-centred decisions.", "Data Platform Modernisation & Analytics Strategy"),
    ind("ind-technology", "Technology", "work-gtm-launch.jpg", "Campaign planning session in progress", "Software and platform companies taking new products to market with a clear proposition, sharp positioning and launch plans tied to revenue.", "Go-to-Market Strategy & Product Launch"),
    ind("ind-retail", "Retail & E-commerce", "work-brand-repositioning.jpg", "Brand repositioning work on screen", "Retailers and marketplaces repositioning the brand and rebuilding the digital experience end to end, measured in conversion and revenue.", "Brand Repositioning & Digital Experience Redesign"),
    ind("ind-manufacturing", "Manufacturing", "work-automation.jpg", "Automated production environment", "Manufacturers removing manual effort and error from operations with enterprise-wide automation and connected systems.", "Intelligent Automation & Process Optimisation"),
    ind("ind-fmcg", "Consumer Products", "work-journey-mapping.jpg", "Customer journey map on a wall", "Consumer brands building retention and lifetime value through mapped journeys, personalisation and research-led product decisions.", "Customer Journey Optimisation & Personalisation")
  ];
  var BY_KEY = {};
  SERVICES.concat(INDUSTRIES).forEach(function (s) { BY_KEY[s.key] = s; });

  // This page IS the NEXDrive product page, so its links stay on-page; NEXHR and NEXTime point at the main site.
  var PRODUCTS = [
    { key: "nexdrive", label: "NEXDrive", tagline: "For driving instructors", to: "./", overview: "NEXDrive overview", groups: [
      { heading: "Explore", items: [
        { label: "The complete toolkit", to: "#toolkit-heading" }, { label: "Refer & earn", to: "#referral-heading" },
        { label: "Pricing", to: "#pricing-heading" }, { label: "14-day free trial", to: "#trial-heading" }, { label: "Common questions", to: "#faq-heading" }] },
      { heading: "Get started", items: [{ label: "Open the NEXDrive app", to: APP }] }] },
    { key: "nexhr", label: "NEXHR", tagline: "All-in-one HR workspace", to: u("nexhr/index.html"), overview: "NEXHR overview", groups: [
      { heading: "Explore", items: [
        { label: "Product", to: u("nexhr/index.html#product") }, { label: "Roles", to: u("nexhr/index.html#roles") },
        { label: "How it works", to: u("nexhr/index.html#how") }, { label: "Security", to: u("nexhr/index.html#security") }, { label: "Pricing", to: u("nexhr/pricing.html") }] },
      { heading: "Get started", items: [{ label: "Start free trial", to: u("nexhr/signup.html") }, { label: "Sign in", to: u("nexhr/login.html") }] }] },
    { key: "nextime", label: "NEXTime", tagline: "For rotas & timesheets", to: u("nextime/index.html"), overview: "NEXTime overview", groups: [
      { heading: "Explore", items: [
        { label: "Features", to: u("nextime/index.html#/features") }, { label: "How it works", to: u("nextime/index.html#/how-it-works") },
        { label: "Security", to: u("nextime/index.html#/security") }, { label: "Pricing", to: u("nextime/index.html#/pricing") }, { label: "FAQ", to: u("nextime/index.html#/faq") }] },
      { heading: "Get started", items: [{ label: "Start free trial", to: u("nextime/account.html?view=signup") }, { label: "Sign in", to: u("nextime/account.html") }] }] }
  ];
  var PRODUCT_BY_KEY = {};
  PRODUCTS.forEach(function (p) { PRODUCT_BY_KEY[p.key] = p; });

  var MENU = [
    { key: "about", label: "About", to: u("about.html"), overview: "About Nexyra", groups: [{ heading: null, items: [
      { label: "Our story", to: u("about.html#about-heading") }, { label: "What we stand for", to: u("about.html#values-heading") }, { label: "What we bring", to: u("about.html#expertise-heading") }] }] },
    { key: "services", label: "Services", to: u("services.html"), overview: "All services", preview: true, groups: [
      { heading: "Core services", items: SERVICES.slice(0, 6) }, { heading: "Extended capabilities", items: SERVICES.slice(6) }] },
    { key: "products", label: "Products", to: "./", overview: null, preview: true, products: true, groups: [{ heading: null, items: PRODUCTS }] },
    { key: "work", label: "Work", to: u("work.html"), overview: "All work", preview: true, groups: [{ heading: "Industries", items: INDUSTRIES }] },
    { key: "pricing", label: "Pricing", to: u("pricing.html"), overview: "Pricing overview", groups: [{ heading: null, items: [
      { label: "Architecture", to: u("pricing.html#arch-heading") }, { label: "Fixed price, fixed scope", to: u("pricing.html#fixed-heading") },
      { label: "Partnership Ladder", to: u("pricing.html#ladder-heading") }, { label: "Common questions", to: u("pricing.html#faq-heading") }] }] },
    { key: "insight", label: "Insight", to: u("insight.html") },
    { key: "careers", label: "Careers", to: u("careers.html") },
    { key: "contact", label: "Contact", to: u("contact.html") }
  ];
  var ACTIVE = "products";

  /* ---------- Helpers ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var ICON_MENU = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.8 7h18.4"></path><path d="M2.8 12h18.4"></path><path d="M2.8 17h18.4"></path></svg>';
  var ICON_X = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';
  var CHEV = function (s) { return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>'; };
  var BACK = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"></path><path d="m12 19-7-7 7-7"></path></svg>';
  var ARROW = function (s) { return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>'; };
  function directNav() { return window.matchMedia("(min-width: 1200px) and (hover: hover)").matches; }

  /* ---------- Menu overlay ---------- */
  var pill = document.querySelector(".nx-pill");
  var toggleBtn = pill.querySelector(".nx-toggle");
  var logo = pill.querySelector(".nx-logo");
  var overlay = document.getElementById("nx-menu-overlay");
  var M = { open: false, section: null, drilled: false, preview: null };
  var hoverT = null;

  function renderMenu() {
    var sec = MENU.filter(function (m) { return m.key === M.section; })[0] || null;
    var level = sec ? (M.drilled ? "2" : "1") : "0";
    var backLabel = sec ? (M.drilled ? "Back to " + sec.label : "Back to menu") : "Back";
    var main = MENU.map(function (m) {
      var act = M.section === m.key, dim = M.section && !act ? "true" : "false", cur = m.key === ACTIVE ? ' data-current="page"' : "";
      if (m.groups) return '<li><button type="button" class="nx-main-link" data-sec="' + m.key + '" data-active="' + act + '" data-dim="' + dim + '"' + cur + ' aria-expanded="' + act + '"><span class="nx-label">' + esc(m.label) + "</span>" + CHEV(20) + "</button></li>";
      return '<li><a class="nx-main-link" href="' + esc(m.to) + '" data-close data-dim="' + dim + '"' + (cur ? cur + ' aria-current="page"' : "") + '><span class="nx-label">' + esc(m.label) + "</span></a></li>";
    }).join("");
    var sub = "";
    if (sec) {
      sub += '<button type="button" class="nx-back" data-back aria-label="' + esc(backLabel) + '">' + BACK + "<span>" + esc(sec.label) + "</span></button>";
      if (sec.overview) sub += '<a class="nx-sub-overview" href="' + esc(sec.to) + '" data-close>' + esc(sec.overview) + ARROW(14) + "</a>";
      sec.groups.forEach(function (g) {
        sub += '<div class="nx-sub-group">' + (g.heading ? '<p class="nx-sub-heading">' + esc(g.heading) + "</p>" : "");
        g.items.forEach(function (it) {
          if (sec.products) sub += '<button type="button" class="nx-sub-link nx-sub-btn" data-prod="' + it.key + '" data-selected="' + (M.preview === it.key) + '" aria-expanded="' + (M.preview === it.key) + '" aria-controls="nx-product-nav" aria-label="' + esc(it.label + ", " + it.tagline + ": show pages") + '"><span><span style="display:block">' + esc(it.label) + '</span><span class="nx-sub-tag">' + esc(it.tagline) + "</span></span>" + CHEV(18) + "</button>";
          else if (sec.preview) sub += '<a class="nx-sub-link" href="' + esc(it.to) + '" data-pv="' + it.key + '" data-selected="' + (M.preview === it.key) + '">' + esc(it.label) + "</a>";
          else sub += '<a class="nx-sub-link" href="' + esc(it.to) + '" data-close data-selected="false">' + esc(it.label) + "</a>";
        });
        sub += "</div>";
      });
    }
    var pv = sec && sec.preview && !sec.products && M.preview ? BY_KEY[M.preview] : null;
    var prod = sec && sec.products && M.preview ? PRODUCT_BY_KEY[M.preview] : null;
    var prev = '<button type="button" class="nx-back nx-back-mobile" data-back aria-label="' + esc(backLabel) + '">' + BACK + "<span>" + esc(sec ? sec.label : "") + "</span></button>";
    if (prod) {
      prev += '<nav id="nx-product-nav" class="nx-pv" aria-label="' + esc(prod.label + " pages") + '">' +
        '<p class="nx-preview-eyebrow" style="margin-top:14px">' + esc(prod.tagline) + "</p>" +
        '<h3 style="margin:0;font-size:clamp(24px,2.2vw,32px);font-weight:600;line-height:1.12;letter-spacing:-0.02em">' + esc(prod.label) + "</h3>" +
        '<a class="nx-sub-overview" data-prod-first href="' + esc(prod.to) + '" data-close style="margin-top:10px">' + esc(prod.overview) + ARROW(14) + "</a>" +
        prod.groups.map(function (pg) {
          return '<div class="nx-sub-group"><p class="nx-sub-heading">' + esc(pg.heading) + "</p>" +
            pg.items.map(function (pl) { return '<a class="nx-sub-link" href="' + esc(pl.to) + '" data-close>' + esc(pl.label) + "</a>"; }).join("") + "</div>";
        }).join("") + "</nav>";
    } else if (pv) {
      prev += '<div class="nx-pv"><img src="' + esc(pv.img) + '" alt="' + esc(pv.alt) + '" style="display:block;width:100%;aspect-ratio:16/10;object-fit:cover;filter:grayscale(1);background:#F7F7F9">' +
        '<p class="nx-preview-eyebrow">' + esc(pv.group) + "</p>" +
        '<h3 style="margin:0;font-size:clamp(24px,2.2vw,32px);font-weight:600;line-height:1.12;letter-spacing:-0.02em;text-wrap:pretty">' + esc(pv.label) + "</h3>" +
        '<p style="margin:14px 0 0;font-size:15px;line-height:1.65;color:#4A4A5A;max-width:52ch;text-wrap:pretty">' + esc(pv.desc) + "</p>" +
        (pv.feature ? '<p style="margin:20px 0 0;padding-top:16px;border-top:1px solid #E7E7EC;font-size:13px;line-height:1.5;color:#6B6B7B;max-width:52ch"><span style="font-weight:600;color:#0A0A0F">Featured work:</span> ' + esc(pv.feature) + "</p>" : "") +
        '<a class="nx-preview-cta" href="' + esc(pv.to) + '" data-close>' + esc(pv.cta) + ARROW(16) + "</a></div>";
    }
    overlay.innerHTML = '<div style="max-width:1440px;margin:0 auto;padding:112px 7vw 56px"><div class="nx-stage"><div class="nx-track" data-level="' + level + '" data-preview="' + !!(sec && sec.preview) + '">' +
      '<nav class="nx-col nx-col-main" aria-label="Main navigation"><ul class="nx-main-list">' + main + "</ul></nav>" +
      '<div class="nx-col nx-col-sub">' + sub + "</div>" +
      '<div class="nx-col nx-col-preview" aria-live="polite">' + prev + "</div></div></div>" +
      '<div style="display:flex;flex-wrap:wrap;gap:24px;margin-top:56px;padding-top:28px;border-top:1px solid #E7E7EC">' +
      '<a href="mailto:hello@nexyraconsulting.co.uk" style="font-size:14px;color:#4A4A5A">hello@nexyraconsulting.co.uk</a>' +
      '<a href="tel:+447415171157" style="font-size:14px;color:#4A4A5A">+44 74151 71157</a></div></div>';
  }
  // Re-rendering replaces the overlay's DOM; keep keyboard focus on the equivalent element.
  function focusSel(sel) { var el = overlay.querySelector(sel); if (el) el.focus({ preventScroll: true }); }
  function setMenu(patch, focus) {
    var prevKey = M.preview;
    var active = document.activeElement;
    var keep = focus || (active && overlay.contains(active) ? (active.getAttribute("data-sec") ? '[data-sec="' + active.getAttribute("data-sec") + '"]' : active.getAttribute("data-prod") ? '[data-prod="' + active.getAttribute("data-prod") + '"]' : active.getAttribute("data-pv") ? '[data-pv="' + active.getAttribute("data-pv") + '"]' : null) : null);
    for (var k in patch) M[k] = patch[k];
    overlay.hidden = !M.open;
    document.body.style.overflow = M.open ? "hidden" : "";
    toggleBtn.innerHTML = M.open ? ICON_X : ICON_MENU;
    toggleBtn.setAttribute("aria-expanded", String(M.open));
    toggleBtn.setAttribute("aria-label", M.open ? "Close menu" : "Open menu");
    logo.setAttribute("data-open", String(M.open));
    if (M.open) {
      renderMenu();
      var p = overlay.querySelector(".nx-pv");
      if (p && prevKey && prevKey !== M.preview && p.animate) p.animate([{ opacity: 0.3, transform: "translateY(4px)" }, { opacity: 1, transform: "none" }], { duration: 280, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" });
      if (keep) focusSel(keep);
    }
    queueTone();
  }
  function closeMenu() { clearTimeout(hoverT); setMenu({ open: false, section: null, drilled: false, preview: null }); }
  function back(escape) {
    if (M.drilled) setMenu({ drilled: false });
    else if (M.section) setMenu({ section: null, preview: null });
    else if (escape) closeMenu();
  }
  toggleBtn.addEventListener("click", function () { setMenu({ open: !M.open, section: null, drilled: false, preview: null }); });
  overlay.addEventListener("click", function (e) {
    var t = e.target.closest("[data-sec],[data-back],[data-prod],[data-pv],[data-close]");
    if (!t) return;
    if (t.hasAttribute("data-sec")) {
      var key = t.getAttribute("data-sec");
      if (M.section === key) return setMenu({ section: null, drilled: false, preview: null });
      var m = MENU.filter(function (x) { return x.key === key; })[0];
      return setMenu({ section: key, drilled: false, preview: m.preview ? m.groups[0].items[0].key : null });
    }
    if (t.hasAttribute("data-back")) return back(false);
    if (t.hasAttribute("data-prod")) {
      clearTimeout(hoverT);
      var pk = t.getAttribute("data-prod"), keyboard = e.detail === 0, dn = directNav();
      return setMenu(dn ? { preview: pk } : { preview: pk, drilled: true }, keyboard || !dn ? "[data-prod-first]" : null);
    }
    if (t.hasAttribute("data-pv")) {
      if (directNav()) return closeMenu();
      e.preventDefault();
      return setMenu({ preview: t.getAttribute("data-pv"), drilled: true });
    }
    closeMenu();
  });
  overlay.addEventListener("mouseover", function (e) {
    var pr = e.target.closest("[data-prod]");
    if (pr) {
      var k = pr.getAttribute("data-prod");
      clearTimeout(hoverT);
      hoverT = setTimeout(function () { if (M.preview !== k) setMenu({ preview: k }); }, 90);
      return;
    }
    var t = e.target.closest("[data-pv]");
    if (t && M.preview !== t.getAttribute("data-pv")) setMenu({ preview: t.getAttribute("data-pv") });
  });
  overlay.addEventListener("mouseout", function (e) { if (e.target.closest("[data-prod]")) clearTimeout(hoverT); });
  overlay.addEventListener("focusin", function (e) {
    var t = e.target.closest("[data-pv],[data-prod]");
    if (!t) return;
    var k = t.getAttribute("data-pv") || t.getAttribute("data-prod");
    if (M.preview !== k) setMenu({ preview: k });
  });

  /* ---------- Search ---------- */
  var S = { open: false, q: "", active: 0, results: [], label: "" };
  var sWrap = document.querySelector(".nx-search");
  var sForm = sWrap.querySelector(".nx-search-bar");
  var sInput = sWrap.querySelector(".nx-search-input");
  var sBtn = sWrap.querySelector(".nx-search-btn");
  var sList = document.getElementById("nx-search-results");
  function runSearch() {
    var q = S.q.trim();
    if (q.length < 2 || !window.NX_SEARCH) { S.results = []; S.label = ""; return; }
    var r = window.NX_SEARCH(q, window.NX_SEARCH_INDEX || []);
    S.results = r.results; S.label = r.label;
  }
  function renderSearch() {
    sWrap.setAttribute("data-open", String(S.open));
    sBtn.setAttribute("aria-expanded", String(S.open));
    sBtn.setAttribute("aria-label", S.open ? "Close search" : "Open search");
    sInput.tabIndex = S.open ? 0 : -1;
    var show = S.open && S.q.trim().length >= 2;
    sList.hidden = !show;
    if (!show) { sList.innerHTML = ""; return; }
    if (!S.results.length) { sList.innerHTML = '<p class="nx-sr-empty">No results for “' + esc(S.q) + '”. Try a service, industry or topic.</p>'; return; }
    sList.innerHTML = '<p class="nx-sr-count">' + esc(S.label || S.results.length + (S.results.length === 1 ? " result" : " results")) + "</p>" + S.results.map(function (r, i) {
      return '<a class="nx-sr-item" href="' + esc(r.url) + '" role="option" data-i="' + i + '" aria-selected="' + (i === S.active) + '" data-active="' + (i === S.active) + '">' +
        '<span class="nx-sr-meta">' + esc(r.meta) + '</span><span class="nx-sr-title">' + esc(r.title) + '</span><span class="nx-sr-snip">' +
        r.parts.map(function (p) { return '<span data-hit="' + p.hit + '">' + esc(p.t) + "</span>"; }).join("") + "</span></a>";
    }).join("");
  }
  function openSearch() { S.open = true; renderSearch(); setTimeout(function () { sInput.focus(); }, 60); queueTone(); }
  function closeSearch() { S.open = false; S.q = ""; S.active = 0; sInput.value = ""; runSearch(); renderSearch(); queueTone(); }
  function goResult(r) { if (!r) return; closeSearch(); closeMenu(); window.location.href = r.url; }
  sBtn.addEventListener("click", function () { S.open ? closeSearch() : openSearch(); });
  sInput.addEventListener("input", function () { S.q = sInput.value; S.active = 0; runSearch(); renderSearch(); });
  sForm.addEventListener("submit", function (e) { e.preventDefault(); goResult(S.results[S.active]); });
  sInput.addEventListener("keydown", function (e) {
    var n = S.results.length;
    if (e.key === "Escape") { e.stopPropagation(); closeSearch(); }
    else if (e.key === "ArrowDown" && n) { e.preventDefault(); S.active = (S.active + 1) % n; renderSearch(); }
    else if (e.key === "ArrowUp" && n) { e.preventDefault(); S.active = (S.active - 1 + n) % n; renderSearch(); }
  });
  sList.addEventListener("mouseover", function (e) {
    var t = e.target.closest("[data-i]"); if (!t) return;
    var i = +t.getAttribute("data-i"); if (i !== S.active) { S.active = i; sList.querySelectorAll("[data-i]").forEach(function (a, j) { a.setAttribute("data-active", String(j === i)); a.setAttribute("aria-selected", String(j === i)); }); }
  });
  sList.addEventListener("click", function (e) { var t = e.target.closest("[data-i]"); if (!t) return; e.preventDefault(); goResult(S.results[+t.getAttribute("data-i")]); });

  window.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (S.open) return closeSearch();
    if (M.open) back(true);
  });

  /* ---------- Nav tone: same detection as the main site (explicit data-nav-tone, images, gradients, background colour) ---------- */
  var imgCache = {}, lumCanvas = null;
  function loadImg(src) {
    var c = imgCache[src];
    if (c) return c.ok ? c.img : null;
    var img = new Image();
    imgCache[src] = { ok: false, img: img };
    img.crossOrigin = "anonymous";
    img.onload = function () { imgCache[src].ok = true; queueTone(); };
    img.src = src;
    return null;
  }
  function regionLum(img, rect, box, fit) {
    var iw = img.naturalWidth, ih = img.naturalHeight;
    if (!iw || !ih || !rect.width || !rect.height) return null;
    var sc = fit === "contain" ? Math.min(rect.width / iw, rect.height / ih) : Math.max(rect.width / iw, rect.height / ih);
    var ox = rect.left + (rect.width - iw * sc) / 2, oy = rect.top + (rect.height - ih * sc) / 2;
    var sx = (box.left - ox) / sc, sy = (box.top - oy) / sc, sw = box.width / sc, sh = box.height / sc;
    sx = Math.max(0, Math.min(iw - 1, sx)); sy = Math.max(0, Math.min(ih - 1, sy));
    sw = Math.max(1, Math.min(iw - sx, sw)); sh = Math.max(1, Math.min(ih - sy, sh));
    try {
      var cv = lumCanvas || (lumCanvas = document.createElement("canvas"));
      cv.width = 16; cv.height = 16;
      var x = cv.getContext("2d", { willReadFrequently: true });
      x.clearRect(0, 0, 16, 16); x.drawImage(img, sx, sy, sw, sh, 0, 0, 16, 16);
      var d = x.getImageData(0, 0, 16, 16).data, t = 0;
      for (var i = 0; i < d.length; i += 4) t += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      return t / (d.length / 4) / 255;
    } catch (err) { return null; }
  }
  function isNav(e) { return e.closest(".nx-pill") || e.closest(".nx-search") || e.closest("#nx-menu-overlay"); }
  function toneAt(box) {
    var r = box.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var el = document.elementsFromPoint(cx, cy).filter(function (e) { return !isNav(e); })[0];
    var layers = Array.prototype.slice.call(document.querySelectorAll('[data-parallax-layer], img, [style*="background-image"]')).filter(function (c) {
      if (isNav(c)) return false;
      var b = c.getBoundingClientRect();
      if (cx < b.left || cx > b.right || cy < b.top || cy > b.bottom) return false;
      var st = getComputedStyle(c);
      return st.visibility !== "hidden" && st.display !== "none" && +st.opacity > 0.2;
    }).reverse();
    var layer = el && layers.filter(function (c) { return el === c || el.contains(c) || (c.parentElement && c.parentElement.contains(el)); })[0];
    if (layer) el = layer;
    while (el && el !== document.documentElement) {
      var ex = el.getAttribute && el.getAttribute("data-nav-tone");
      if (ex) return ex;
      var cs = getComputedStyle(el);
      var bgUrl = (cs.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/) || [])[1];
      var isImg = el.tagName === "IMG", src = isImg ? el.currentSrc || el.src : bgUrl;
      if (src) {
        var im = loadImg(src), fit = isImg ? cs.objectFit : cs.backgroundSize;
        var lum = im ? regionLum(im, el.getBoundingClientRect(), r, fit === "contain" ? "contain" : "cover") : null;
        if (lum !== null) return lum < 0.5 ? "dark" : "light";
      }
      if (/gradient/.test(cs.backgroundImage)) {
        var gm = cs.backgroundImage.match(/rgba?\(([^)]+)\)/);
        if (gm) { var v = gm[1].split(",").map(Number); if (v[3] === undefined || v[3] > 0.5) return (0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]) / 255 < 0.4 ? "dark" : "light"; }
      }
      var m = cs.backgroundColor.match(/[\d.]+/g);
      if (m && (m[3] === undefined || +m[3] > 0.5)) return (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255 < 0.4 ? "dark" : "light";
      el = el.parentElement;
    }
    return "light";
  }
  var raf = null;
  function detectTone() {
    raf = null;
    pill.setAttribute("data-tone", M.open ? "light" : toneAt(pill));
    sWrap.setAttribute("data-tone", M.open || S.open ? "light" : toneAt(sForm));
  }
  function queueTone() { if (!raf) raf = requestAnimationFrame(detectTone); }
  window.addEventListener("scroll", queueTone, { passive: true });
  window.addEventListener("resize", queueTone);
  setTimeout(detectTone, 60);
  setTimeout(detectTone, 600);
  setInterval(queueTone, 700);

  /* ---------- Content clears the fixed nav by 30px (same as the main site) ---------- */
  function measureClear() {
    var b = 0;
    document.querySelectorAll(".nx-pill, .nx-search-bar").forEach(function (el) { b = Math.max(b, el.getBoundingClientRect().bottom); });
    if (b) document.documentElement.style.setProperty("--nx-clear", Math.ceil(b + 30) + "px");
  }
  measureClear();
  requestAnimationFrame(measureClear);
  window.addEventListener("resize", measureClear);

  /* Preload menu preview images */
  Object.keys(BY_KEY).forEach(function (k) { var i = new Image(); i.src = BY_KEY[k].img; });
})();
