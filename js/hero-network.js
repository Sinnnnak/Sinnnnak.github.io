/* =========================================================================
   Pro Visions hero — node-network overlay (canvas 2D)
   Drifting nodes + proximity lines + gentle mouse attraction.
   Sits between the WebGL aurora and the hero copy. One rAF loop,
   DPR-clamped, paused when the tab is hidden or the hero scrolls away.
   Skipped entirely on prefers-reduced-motion / Data Saver.
   ========================================================================= */
(function () {
  "use strict";

  function start() {
    var canvas = document.getElementById("netgrid");
    if (!canvas) return;

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var conn = navigator.connection || {};
    if (reduce || conn.saveData) return;

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var W = 0, H = 0, nodes = [];
    var mouse = { x: -9999, y: -9999 };
    var running = true, inView = true, faded = false;
    var LINK = 130;

    function resize() {
      var hero = canvas.parentElement;
      W = hero.clientWidth; H = hero.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // node count scales with area; capped for perf
      var count = Math.min(80, Math.round((W * H) / 22000));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
          r: 1 + Math.random() * 1.6
        });
      }
    }
    resize();
    window.addEventListener("resize", resize);

    window.addEventListener("mousemove", function (e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
    }, { passive: true });

    document.addEventListener("visibilitychange", function () {
      running = !document.hidden;
      if (running && inView) loop();
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        var was = inView;
        inView = entries[0].isIntersecting;
        if (inView && !was && running) loop();
      }).observe(canvas);
    }

    var raf = null;
    function loop() {
      if (!running || !inView) { raf = null; return; }
      raf = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, W, H);

      var i, j, n, m, dx, dy, d2;
      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        // gentle mouse attraction
        dx = mouse.x - n.x; dy = mouse.y - n.y; d2 = dx * dx + dy * dy;
        if (d2 < 32400 && d2 > 1) { // <180px
          var f = 0.012 / Math.sqrt(d2);
          n.vx += dx * f; n.vy += dy * f;
        }
        // clamp speed, drift, wrap
        var sp = Math.hypot(n.vx, n.vy);
        if (sp > 0.6) { n.vx *= 0.6 / sp; n.vy *= 0.6 / sp; }
        n.x += n.vx; n.y += n.vy;
        if (n.x < -10) n.x = W + 10; if (n.x > W + 10) n.x = -10;
        if (n.y < -10) n.y = H + 10; if (n.y > H + 10) n.y = -10;
      }
      // links
      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        for (j = i + 1; j < nodes.length; j++) {
          m = nodes[j];
          dx = n.x - m.x; dy = n.y - m.y; d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            var a = (1 - Math.sqrt(d2) / LINK) * 0.35;
            ctx.strokeStyle = "rgba(92,178,245," + a.toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
          }
        }
      }
      // nodes
      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        ctx.fillStyle = "rgba(34,211,238,0.75)";
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 6.2832); ctx.fill();
      }
      if (!faded) { faded = true; canvas.classList.add("on"); }
    }
    loop();
  }

  if (document.readyState === "complete") start();
  else window.addEventListener("load", start);
})();
