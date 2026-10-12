/* Scales the 402x874 phone frame down so the whole device always fits the
   screen (phones, tablets, short laptop screens). Never scales up. */
(function () {
  var W = 402, H = 874, MIN_GAP = 16;

  function findDevice() {
    var screen = document.querySelector('[data-screen-label]');
    for (var el = screen; el; el = el.parentElement) {
      if (el.style && el.style.width === W + 'px' && el.style.height === H + 'px') return el;
    }
    return null;
  }

  function fit() {
    var device = findDevice();
    if (!device) return;
    var wrap = device.parentElement && device.parentElement.parentElement;
    var top = wrap ? parseFloat(getComputedStyle(wrap).paddingTop) || MIN_GAP : MIN_GAP;
    var vw = document.documentElement.clientWidth;
    var vh = window.innerHeight;
    var scale = Math.min(1, (vw - 2 * MIN_GAP) / W, (vh - top - MIN_GAP) / H);
    var value = scale < 1 ? String(Math.round(scale * 1000) / 1000) : '';
    if (device.style.zoom !== value) device.style.zoom = value;
  }

  var queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; fit(); });
  }

  window.addEventListener('resize', schedule);
  window.addEventListener('orientationchange', schedule);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  schedule();
})();
