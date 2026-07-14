/* =========================================================================
   Pro Visions — charts.js  (no libraries)
   Framework-free animated data-viz. Each chart is a data-attribute on an
   element; charts self-init, animate once on scroll-in, and respect
   prefers-reduced-motion (render final state instantly).

   Types:
     data-chart="ring"    data-value data-max [data-suffix]        -> gauge + count-up
     data-chart="risk"    data-value                               -> segmented risk donut
     data-chart="area"    data-points="1,3,2,5,4,7,6,9"            -> area sparkline
     data-chart="bars"    data-points="4,7,5,9,6,8"                -> mini bars
     data-chart="nodes"                                            -> threat node-graph (canvas)
   Optional per element: data-c1 / data-c2 hex accents.
   ========================================================================= */
(function () {
  "use strict";
  var REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var C1 = "#22d3ee", C2 = "#2b8fe0", C3 = "#52b78e", INK = "#93a7c0";
  var NS = "http://www.w3.org/2000/svg";

  function el(tag, attrs) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }
  function ease(t) { return 1 - Math.pow(1 - t, 3); }
  function animate(dur, cb, done) {
    if (REDUCE) { cb(1); if (done) done(); return; }
    var start = null;
    function step(ts) { if (start === null) start = ts; var p = Math.min(1, (ts - start) / dur); cb(ease(p)); if (p < 1) requestAnimationFrame(step); else if (done) done(); }
    requestAnimationFrame(step);
  }

  /* ---- Ring gauge with count-up ---- */
  function ring(node) {
    var val = parseFloat(node.dataset.value) || 0, max = parseFloat(node.dataset.max) || 100;
    var suffix = node.dataset.suffix || "", c1 = node.dataset.c1 || C1, c2 = node.dataset.c2 || C2;
    var R = 52, C = 2 * Math.PI * R, frac = Math.max(0, Math.min(1, val / max));
    var svg = el("svg", { viewBox: "0 0 120 120", class: "chart-ring" });
    var gid = "rg" + Math.round(R + val * 97 + node.dataset.value.length);
    var defs = el("defs", {}); var lg = el("linearGradient", { id: gid, x1: "0", y1: "0", x2: "1", y2: "1" });
    lg.appendChild(el("stop", { offset: "0%", "stop-color": c1 })); lg.appendChild(el("stop", { offset: "100%", "stop-color": c2 }));
    defs.appendChild(lg); svg.appendChild(defs);
    svg.appendChild(el("circle", { cx: 60, cy: 60, r: R, fill: "none", stroke: "rgba(255,255,255,0.08)", "stroke-width": 9 }));
    var arc = el("circle", { cx: 60, cy: 60, r: R, fill: "none", stroke: "url(#" + gid + ")", "stroke-width": 9, "stroke-linecap": "round", transform: "rotate(-90 60 60)", "stroke-dasharray": C, "stroke-dashoffset": C });
    svg.appendChild(arc);
    var txt = el("text", { x: 60, y: 66, "text-anchor": "middle", class: "chart-ring-num" }); txt.textContent = "0";
    svg.appendChild(txt);
    node.appendChild(svg);
    animate(1400, function (p) {
      arc.setAttribute("stroke-dashoffset", C * (1 - frac * p));
      var v = val * p; txt.textContent = (val % 1 ? v.toFixed(1) : Math.round(v)) + suffix;
    });
  }

  /* ---- Segmented risk donut (cyber-risk-index) ---- */
  function risk(node) {
    var score = parseFloat(node.dataset.value) || 68.5;
    var segs = [ ["#ff5a6a", 0.30], ["#ffa23a", 0.24], ["#ffd23f", 0.20], ["#22d3ee", 0.16], ["#52b78e", 0.10] ];
    var R = 52, C = 2 * Math.PI * R;
    var svg = el("svg", { viewBox: "0 0 120 120", class: "chart-risk" });
    svg.appendChild(el("circle", { cx: 60, cy: 60, r: R, fill: "none", stroke: "rgba(255,255,255,0.06)", "stroke-width": 12 }));
    var offset = 0, arcs = [];
    segs.forEach(function (s) {
      var len = s[1] * C;
      var a = el("circle", { cx: 60, cy: 60, r: R, fill: "none", stroke: s[0], "stroke-width": 12, transform: "rotate(-90 60 60)", "stroke-dasharray": "0 " + C, "stroke-dashoffset": -offset, opacity: 0.9 });
      svg.appendChild(a); arcs.push([a, len]); offset += len;
    });
    var num = el("text", { x: 60, y: 58, "text-anchor": "middle", class: "chart-risk-num" }); num.textContent = "0";
    var lab = el("text", { x: 60, y: 74, "text-anchor": "middle", class: "chart-risk-lab" }); lab.textContent = node.dataset.label || "Medium risk";
    svg.appendChild(num); svg.appendChild(lab); node.appendChild(svg);
    animate(1500, function (p) {
      arcs.forEach(function (pair) { pair[0].setAttribute("stroke-dasharray", (pair[1] * p) + " " + C); });
      num.textContent = (score * p).toFixed(1);
    });
  }

  /* ---- Area sparkline ---- */
  function area(node) {
    var pts = (node.dataset.points || "3,5,4,7,6,9,8,11,10,13").split(",").map(Number);
    var c1 = node.dataset.c1 || C1, W = 100, H = 40, gid = "ag" + Math.round(pts.reduce(function(a,b){return a+b;},0));
    var mx = Math.max.apply(null, pts), mn = Math.min.apply(null, pts), rng = (mx - mn) || 1;
    var step = W / (pts.length - 1);
    var coords = pts.map(function (v, i) { return [i * step, H - 4 - ((v - mn) / rng) * (H - 8)]; });
    var line = coords.map(function (c, i) { return (i ? "L" : "M") + c[0].toFixed(1) + " " + c[1].toFixed(1); }).join(" ");
    var fill = "M0 " + H + " " + coords.map(function (c) { return "L" + c[0].toFixed(1) + " " + c[1].toFixed(1); }).join(" ") + " L" + W + " " + H + " Z";
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, class: "chart-area", preserveAspectRatio: "none" });
    var defs = el("defs", {}); var lg = el("linearGradient", { id: gid, x1: "0", y1: "0", x2: "0", y2: "1" });
    lg.appendChild(el("stop", { offset: "0%", "stop-color": c1, "stop-opacity": "0.45" })); lg.appendChild(el("stop", { offset: "100%", "stop-color": c1, "stop-opacity": "0" }));
    defs.appendChild(lg); svg.appendChild(defs);
    var fp = el("path", { d: fill, fill: "url(#" + gid + ")", opacity: 0 });
    var lp = el("path", { d: line, fill: "none", stroke: c1, "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round", "vector-effect": "non-scaling-stroke" });
    svg.appendChild(fp); svg.appendChild(lp); node.appendChild(svg);
    var total = lp.getTotalLength ? lp.getTotalLength() : 100;
    lp.setAttribute("stroke-dasharray", total); lp.setAttribute("stroke-dashoffset", total);
    animate(1300, function (p) { lp.setAttribute("stroke-dashoffset", total * (1 - p)); fp.setAttribute("opacity", p); });
  }

  /* ---- Mini bars ---- */
  function bars(node) {
    var pts = (node.dataset.points || "5,8,6,10,7,9,11,8").split(",").map(Number);
    var c1 = node.dataset.c1 || C2, W = 100, H = 40, n = pts.length, gap = 3, bw = (W - gap * (n - 1)) / n;
    var mx = Math.max.apply(null, pts) || 1;
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, class: "chart-bars", preserveAspectRatio: "none" });
    var rects = [];
    pts.forEach(function (v, i) {
      var h = (v / mx) * (H - 4), x = i * (bw + gap);
      var r = el("rect", { x: x.toFixed(1), y: H, width: bw.toFixed(1), height: 0, rx: 1, fill: c1, opacity: 0.55 + 0.45 * (v / mx) });
      svg.appendChild(r); rects.push([r, h]);
    });
    node.appendChild(svg);
    animate(1100, function (p) { rects.forEach(function (pair) { var h = pair[1] * p; pair[0].setAttribute("height", h.toFixed(1)); pair[0].setAttribute("y", (H - h).toFixed(1)); }); });
  }

  /* ---- Threat node-graph (canvas, contained) ---- */
  function nodes(node) {
    var canvas = document.createElement("canvas"); canvas.className = "chart-nodes-canvas";
    node.appendChild(canvas);
    var ctx = canvas.getContext("2d"); if (!ctx) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0, pts = [], links = [], running = true, t0 = null;
    function size() {
      W = node.clientWidth; H = node.clientHeight || 220;
      canvas.width = W * dpr; canvas.height = H * dpr; canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = []; var n = Math.min(26, Math.round(W / 34));
      // central hub + ring of nodes
      pts.push({ x: W * 0.5, y: H * 0.5, r: 4, hub: true });
      for (var i = 1; i < n; i++) pts.push({ x: (0.08 + 0.84 * ((i * 61 % 100) / 100)) * W, y: (0.12 + 0.76 * ((i * 37 % 100) / 100)) * H, r: 1.6 + (i % 3), hub: false, ph: (i * 0.7) });
      links = [];
      for (var a = 1; a < pts.length; a++) { if (a % 3 === 1) links.push([0, a]); for (var b = a + 1; b < pts.length; b++) { var d = Math.hypot(pts[a].x - pts[b].x, pts[a].y - pts[b].y); if (d < W * 0.17) links.push([a, b]); } }
    }
    size(); window.addEventListener("resize", size);
    function frame(ts) {
      if (!running) return;
      if (t0 === null) t0 = ts; var el2 = (ts - t0) / 1000;
      requestAnimationFrame(frame);
      ctx.clearRect(0, 0, W, H);
      // links (draw-in over first 1.2s)
      var prog = REDUCE ? 1 : Math.min(1, el2 / 1.3);
      for (var i = 0; i < links.length; i++) {
        if (i / links.length > prog) break;
        var p = pts[links[i][0]], q = pts[links[i][1]];
        ctx.strokeStyle = "rgba(92,178,245,0.22)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
      }
      // travelling pulse along a few links
      if (!REDUCE) for (var k = 0; k < links.length; k += 5) {
        var pp = pts[links[k][0]], qq = pts[links[k][1]], f = (el2 * 0.5 + k * 0.13) % 1;
        ctx.fillStyle = "rgba(34,211,238,0.9)"; ctx.beginPath(); ctx.arc(pp.x + (qq.x - pp.x) * f, pp.y + (qq.y - pp.y) * f, 1.6, 0, 6.28); ctx.fill();
      }
      // nodes
      for (var j = 0; j < pts.length; j++) {
        var nd = pts[j], pulse = nd.hub ? (REDUCE ? 1 : 1 + 0.25 * Math.sin(el2 * 2)) : 1;
        if (nd.hub) { ctx.fillStyle = "rgba(34,211,238,0.18)"; ctx.beginPath(); ctx.arc(nd.x, nd.y, 16 * pulse, 0, 6.28); ctx.fill(); }
        ctx.fillStyle = nd.hub ? "#22d3ee" : (j % 2 ? "#5cb2f5" : "#2b8fe0");
        ctx.beginPath(); ctx.arc(nd.x, nd.y, nd.r * pulse, 0, 6.28); ctx.fill();
      }
      if (REDUCE) running = false;
    }
    // pause when off-screen
    if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { running = e[0].isIntersecting; if (running) { requestAnimationFrame(frame); } }).observe(node);
    else requestAnimationFrame(frame);
    requestAnimationFrame(frame);
  }

  var RENDER = { ring: ring, risk: risk, area: area, bars: bars, nodes: nodes };
  function draw(node) { if (node.dataset.drawn) return; node.dataset.drawn = "1"; var fn = RENDER[node.dataset.chart]; if (fn) try { fn(node); } catch (e) {} }

  function init() {
    var all = [].slice.call(document.querySelectorAll("[data-chart]"));
    if (REDUCE || !("IntersectionObserver" in window)) { all.forEach(draw); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { draw(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.25 });
    all.forEach(function (n) { io.observe(n); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  window.PVCharts = { init: init, draw: draw };
})();
