/* =========================================================================
   Pro Visions — trailer.js
   Tasteful cursor trailer: a soft glowing orb that lags behind the pointer
   plus a small precise dot. Desktop pointer only; disabled on touch and
   prefers-reduced-motion. Appears after the first move (no stray dot at 0,0).
   ========================================================================= */
(function () {
  "use strict";
  if (window.matchMedia("(hover: none)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var orb = document.createElement("div"); orb.className = "pv-trail"; orb.setAttribute("aria-hidden", "true");
  var dot = document.createElement("div"); dot.className = "pv-dot"; dot.setAttribute("aria-hidden", "true");
  document.body.appendChild(orb); document.body.appendChild(dot);

  var tx = 0, ty = 0, ox = 0, oy = 0, dx = 0, dy = 0, on = false, raf = null;
  function onMove(e) {
    tx = e.clientX; ty = e.clientY;
    if (!on) { on = true; ox = dx = tx; oy = dy = ty; document.body.classList.add("trail-on"); loop(); }
  }
  function loop() {
    ox += (tx - ox) * 0.12; oy += (ty - oy) * 0.12;   // slow trailing orb
    dx += (tx - dx) * 0.4;  dy += (ty - dy) * 0.4;      // snappier dot
    orb.style.transform = "translate3d(" + ox + "px," + oy + "px,0)";
    dot.style.transform = "translate3d(" + dx + "px," + dy + "px,0)";
    raf = requestAnimationFrame(loop);
  }
  window.addEventListener("mousemove", onMove, { passive: true });
  // grow the orb over interactive elements
  function grow() { document.body.classList.add("trail-grow"); }
  function shrink() { document.body.classList.remove("trail-grow"); }
  document.addEventListener("mouseover", function (e) {
    if (e.target.closest("a, button, .svc-pcard, .dash-card, .bento-card, .chip, .sector-tile, .pillar-card")) grow(); else shrink();
  }, { passive: true });
  document.addEventListener("visibilitychange", function () { if (document.hidden && raf) { cancelAnimationFrame(raf); raf = null; } else if (on && !raf) loop(); });
})();
