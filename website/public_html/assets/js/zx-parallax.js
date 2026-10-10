/* Nexyra parallax — subtle depth on background imagery and poster bands.
   Foreground text/controls never move. Disabled under prefers-reduced-motion. */
(function () {
  if (window.__nexyraParallax) return;
  window.__nexyraParallax = true;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var layers = [];
  var ticking = false;

  function depthFor(el) {
    var d = el.getAttribute('data-parallax');
    if (d) return Math.max(0.02, Math.min(0.18, parseFloat(d) || 0.08));
    return el.classList && el.classList.contains('poster') ? 0.05 : 0.09;
  }

  function isPhoto(el) {
    if (el.hasAttribute('data-parallax-layer')) return false;
    if (el.hasAttribute('data-parallax')) return true;
    if (el.hasAttribute('data-parallax-skip')) return false;
    var cs = getComputedStyle(el);
    if (!cs.backgroundImage || cs.backgroundImage === 'none') return false;
    if (cs.backgroundImage.indexOf('url(') !== 0) return false;
    if (el.children.length) return false;
    return el.getBoundingClientRect().height >= 220;
  }

  function build(el) {
    if (el.__pxLayer) return;
    var cs = getComputedStyle(el);
    var depth = depthFor(el);
    var inner = document.createElement('div');
    var over = Math.round(depth * 100) + 6; // % of height bled top and bottom
    inner.setAttribute('aria-hidden', 'true');
    inner.setAttribute('data-parallax-layer', '');
    inner.style.cssText =
      'position:absolute;left:0;right:0;top:-' + over + '%;bottom:-' + over + '%;' +
      'background-image:' + cs.backgroundImage + ';' +
      'background-size:' + (cs.backgroundSize === 'auto' ? 'cover' : cs.backgroundSize) + ';' +
      'background-position:' + cs.backgroundPosition + ';background-repeat:no-repeat;' +
      'will-change:transform;transform:translate3d(0,0,0);pointer-events:none';
    if (cs.position === 'static') el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.style.backgroundImage = 'none';
    el.insertBefore(inner, el.firstChild);
    el.__pxLayer = inner;
    layers.push({ el: el, inner: inner, depth: depth, on: false });
  }

  function teardown() {
    layers.forEach(function (l) {
      l.inner.style.transform = 'translate3d(0,0,0)';
    });
  }

  function update() {
    ticking = false;
    var vh = window.innerHeight;
    for (var i = 0; i < layers.length; i++) {
      var l = layers[i];
      if (!l.on) continue;
      var r = l.el.getBoundingClientRect();
      // -1 above viewport centre, +1 below
      var p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
      if (p < -1.4 || p > 1.4) continue;
      var shift = p * l.depth * r.height;
      l.inner.style.transform = 'translate3d(0,' + shift.toFixed(2) + 'px,0)';
    }
  }

  function onScroll() {
    if (ticking || reduce.matches) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  function observe() {
    if (!('IntersectionObserver' in window)) {
      layers.forEach(function (l) { l.on = true; });
      onScroll();
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].el === e.target) layers[i].on = e.isIntersecting;
        }
      });
      onScroll();
    }, { rootMargin: '20% 0px 20% 0px' });
    layers.forEach(function (l) { io.observe(l.el); });
  }

  function scan() {
    var nodes = document.querySelectorAll('[data-parallax], .photo, .poster, div[style*="background-image"]');
    Array.prototype.forEach.call(nodes, function (el) {
      if (el.__pxLayer) return;
      if (el.hasAttribute('data-parallax-layer')) return;
      if (el.closest('[data-parallax-layer],[data-parallax-skip]')) return;
      if (el.classList.contains('poster')) {
        if (!el.hasAttribute('data-parallax')) return; // posters opt in only
      } else if (!isPhoto(el)) return;
      build(el);
    });
    observe();
    onScroll();
  }

  function init() {
    if (reduce.matches) return;
    scan();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    // Late-rendered content (DC hydration, modals)
    var tries = 0;
    var poll = setInterval(function () {
      scan();
      if (++tries > 8) clearInterval(poll);
    }, 400);
  }

  if (reduce.addEventListener) {
    reduce.addEventListener('change', function () {
      if (reduce.matches) teardown(); else onScroll();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
