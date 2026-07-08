/* =========================================================================
   Pro Visions (رؤى الاحتراف) — main.js
   Loader, i18n (EN/AR + RTL), GSAP reveals, scrollspy, smooth anchors,
   counters, timeline, quote scrub, cursor, magnetic, nav, local time.
   Degrades gracefully with GSAP absent or reduced-motion on.
   ========================================================================= */
(function () {
  "use strict";

  var doc = document;
  var body = doc.body;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = typeof window.gsap !== "undefined";
  var hasST = hasGSAP && typeof window.ScrollTrigger !== "undefined";
  var isTouch = window.matchMedia("(hover: none)").matches;

  var AR_LABELS = {
    heroTitle: "تقنية المؤسسات متكاملة",
    langBtn: "EN",
    langBtnAlt: "العربية"
  };

  /* ---------------- i18n ---------------- */
  var i18nEls = [].slice.call(doc.querySelectorAll("[data-ar]"));
  var langBtn = doc.getElementById("langToggle");
  var heroTitle = doc.querySelector(".hero-title");
  var STORE = "pv-lang";

  function captureEN() {
    i18nEls.forEach(function (el) {
      if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
    });
  }

  function applyLang(lang) {
    var ar = lang === "ar";
    doc.documentElement.lang = ar ? "ar" : "en";
    doc.documentElement.dir = ar ? "rtl" : "ltr";
    i18nEls.forEach(function (el) {
      el.innerHTML = ar ? el.getAttribute("data-ar") : el.dataset.en;
    });
    if (langBtn) langBtn.textContent = ar ? AR_LABELS.langBtn : AR_LABELS.langBtnAlt;
    if (heroTitle) heroTitle.setAttribute("aria-label", ar ? AR_LABELS.heroTitle : "Enterprise technology, integrated");
    try { localStorage.setItem(STORE, lang); } catch (e) {}
  }

  function initI18n() {
    captureEN();
    var saved = "en";
    try { saved = localStorage.getItem(STORE) || "en"; } catch (e) {}
    applyLang(saved);
    if (langBtn) {
      langBtn.addEventListener("click", function () {
        var next = (doc.documentElement.lang === "ar") ? "en" : "ar";
        applyLang(next);
        setupQuote();
        if (hasST) window.ScrollTrigger.refresh();
      });
    }
  }

  /* ---------------- Local time (Riyadh) ---------------- */
  function initClock() {
    var el = doc.getElementById("navTime");
    if (!el) return;
    function tick() {
      try {
        var s = new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Riyadh"
        }).format(new Date());
        el.textContent = s + " RUH";
      } catch (e) { el.textContent = ""; }
    }
    tick();
    setInterval(tick, 15000);
  }

  /* ---------------- Nav: hide-on-scroll + glass + scrollspy ---------------- */
  function initNav() {
    var nav = doc.getElementById("nav");
    var last = 0;
    window.addEventListener("scroll", function () {
      var y = window.scrollY || 0;
      if (y > 30) nav.classList.add("scrolled"); else nav.classList.remove("scrolled");
      if (y > last && y > 300 && !body.classList.contains("menu-open")) nav.classList.add("hidden");
      else nav.classList.remove("hidden");
      last = y;
    }, { passive: true });
  }

  /* ---------------- Mobile menu ---------------- */
  function initMenu() {
    var burger = doc.getElementById("burger");
    var menu = doc.getElementById("mobileMenu");
    if (!burger) return;
    function close() {
      body.classList.remove("menu-open", "lock");
      burger.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-hidden", "true");
    }
    burger.addEventListener("click", function () {
      var open = body.classList.toggle("menu-open");
      body.classList.toggle("lock", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      menu.setAttribute("aria-hidden", open ? "false" : "true");
    });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", close); });
  }

  /* ---------------- Smooth anchors (ScrollToPlugin) ---------------- */
  function navHeight() { return (doc.getElementById("nav") || {}).offsetHeight || 76; }
  function initAnchors() {
    doc.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id === "#" || id.length < 2) { return; }
        var target = (id === "#top") ? null : doc.querySelector(id);
        if (id !== "#top" && !target) return;
        e.preventDefault();
        var y = target ? target.getBoundingClientRect().top + window.scrollY - navHeight() + 1 : 0;
        if (hasGSAP && window.ScrollToPlugin) {
          window.gsap.to(window, { duration: 1, scrollTo: y, ease: "power4.inOut" });
        } else {
          window.scrollTo(0, y);
        }
        if (history.replaceState) history.replaceState(null, "", id === "#top" ? location.pathname : id);
      });
    });
    var toTop = doc.getElementById("toTop");
    if (toTop) toTop.addEventListener("click", function () {
      if (hasGSAP && window.ScrollToPlugin) window.gsap.to(window, { duration: 1, scrollTo: 0, ease: "power4.inOut" });
      else window.scrollTo(0, 0);
    });
  }

  /* ---------------- Quote word scrub ---------------- */
  var quoteST = null;
  function setupQuote() {
    var q = doc.getElementById("quote");
    if (!q) return;
    if (quoteST) { quoteST.kill(); quoteST = null; }
    var text = q.textContent.trim().replace(/\s+/g, " ");
    q.innerHTML = text.split(" ").map(function (w) { return '<span class="w">' + w + "</span>"; }).join(" ");
    if (reduce || !hasST) {
      q.querySelectorAll(".w").forEach(function (w) { w.classList.add("on"); });
      return;
    }
    var words = q.querySelectorAll(".w");
    quoteST = window.ScrollTrigger.create({
      trigger: q, start: "top 80%", end: "bottom 55%", scrub: true,
      onUpdate: function (self) {
        var n = Math.floor(self.progress * words.length + 0.001);
        words.forEach(function (w, i) { w.classList.toggle("on", i < n); });
      }
    });
  }

  /* ---------------- Counters ---------------- */
  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (reduce || !hasGSAP) { el.textContent = target; return; }
    var obj = { v: 0 };
    window.gsap.to(obj, {
      v: target, duration: 1.4, ease: "power2.out",
      onUpdate: function () { el.textContent = Math.round(obj.v); }
    });
  }
  function initCounters() {
    var nums = doc.querySelectorAll("[data-count]");
    if (!hasST) { nums.forEach(runCounter); return; }
    nums.forEach(function (el) {
      window.ScrollTrigger.create({ trigger: el, start: "top 92%", once: true, onEnter: function () { runCounter(el); } });
    });
  }

  /* ---------------- Reveals + hero intro + timeline + scrollspy ---------------- */
  function initReveals() {
    if (!hasST) return; // content already visible (no CSS hidden states)
    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);
    if (window.ScrollToPlugin) gsap.registerPlugin(window.ScrollToPlugin);
    ScrollTrigger.config({ ignoreMobileResize: true });

    if (reduce) { initScrollspy(); return; }

    // Per-element reveals (never batch — gotcha #2). Hero elements are driven
    // by heroIntro() instead, so skip anything inside .hero here.
    gsap.utils.toArray("[data-reveal]").forEach(function (el, i) {
      if (el.closest(".hero")) return;
      gsap.fromTo(el, { autoAlpha: 0, y: 36 }, {
        autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out",
        delay: (i % 3) * 0.06,
        scrollTrigger: { trigger: el, start: "top 90%" }
      });
    });

    // Timeline: scrub the gold line, light dots as it passes
    var fill = doc.getElementById("timelineFill");
    if (fill) {
      gsap.to(fill, { width: "100%", ease: "none", scrollTrigger: { trigger: "#timeline", start: "top 70%", end: "bottom 75%", scrub: true } });
    }
    gsap.utils.toArray(".step").forEach(function (step) {
      ScrollTrigger.create({ trigger: step, start: "top 78%", onEnter: function () { step.classList.add("lit"); }, onLeaveBack: function () { step.classList.remove("lit"); } });
    });

    // Industries sticky cards: dim covered cards
    gsap.utils.toArray(".scard").forEach(function (card, i, arr) {
      if (i === arr.length - 1) return;
      gsap.fromTo(card, { filter: "brightness(1)", scale: 1 }, {
        filter: "brightness(0.45)", scale: 0.95, ease: "none",
        scrollTrigger: { trigger: arr[i + 1], start: "top 80%", end: "top 30%", scrub: true }
      });
    });

    initScrollspy();
  }

  // Set hero hidden states up-front (while the opaque loader still covers the
  // screen) so there is no flash before heroIntro animates them in.
  function prepHero() {
    if (reduce || !hasGSAP) return;
    var gsap = window.gsap;
    var lines = doc.querySelectorAll(".hero-title .line > span");
    gsap.set(lines, { yPercent: 115 });
    [".hero-meta", ".hero-desc", ".hero-cta", ".hero-stats"].forEach(function (s) {
      var el = doc.querySelector(s); if (el) gsap.set(el, { autoAlpha: 0, y: 24 });
    });
  }

  function initScrollspy() {
    var map = {};
    doc.querySelectorAll(".nav-links a").forEach(function (a) {
      var id = a.getAttribute("href");
      if (id && id.charAt(0) === "#") map[id.slice(1)] = a;
    });
    Object.keys(map).forEach(function (id) {
      var sec = doc.getElementById(id);
      if (!sec) return;
      window.ScrollTrigger.create({
        trigger: sec, start: "top 45%", end: "bottom 45%",
        onToggle: function (self) {
          if (self.isActive) {
            doc.querySelectorAll(".nav-links a").forEach(function (x) { x.classList.remove("active"); });
            map[id].classList.add("active");
          }
        }
      });
    });
  }

  function heroIntro() {
    if (reduce || !hasGSAP) return;
    var gsap = window.gsap;
    var lines = doc.querySelectorAll(".hero-title .line > span");
    var others = [".hero-meta", ".hero-desc", ".hero-cta", ".hero-stats"];
    var tl = gsap.timeline();
    tl.to(lines, { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.09 });
    others.forEach(function (s, i) {
      var el = doc.querySelector(s); if (!el) return;
      tl.to(el, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.4 + i * 0.08);
    });
  }

  /* ---------------- Custom cursor + magnetic ---------------- */
  function initCursor() {
    if (isTouch || !hasGSAP) return;
    var dot = doc.querySelector(".cursor-dot");
    var ring = doc.querySelector(".cursor-ring");
    if (!dot || !ring) return;
    var gsap = window.gsap;
    var xTo = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3" });
    var yTo = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3" });
    var dxTo = gsap.quickTo(dot, "x", { duration: 0.08 });
    var dyTo = gsap.quickTo(dot, "y", { duration: 0.08 });
    var shown = false;
    window.addEventListener("mousemove", function (e) {
      if (!shown) { shown = true; gsap.set([dot, ring], { x: e.clientX, y: e.clientY }); body.classList.add("cursor-active"); }
      xTo(e.clientX); yTo(e.clientY); dxTo(e.clientX); dyTo(e.clientY);
    }, { passive: true });
    doc.querySelectorAll("a, button, .svc-row, .chip").forEach(function (el) {
      el.addEventListener("mouseenter", function () { body.classList.add("cursor-grow"); });
      el.addEventListener("mouseleave", function () { body.classList.remove("cursor-grow"); });
    });

    // Magnetic buttons
    doc.querySelectorAll(".pill, .lang-toggle, .to-top, .hero-cta").forEach(function (el) {
      var mx = gsap.quickTo(el, "x", { duration: 0.3, ease: "power3" });
      var my = gsap.quickTo(el, "y", { duration: 0.3, ease: "power3" });
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        mx((e.clientX - (r.left + r.width / 2)) * 0.3);
        my((e.clientY - (r.top + r.height / 2)) * 0.3);
      });
      el.addEventListener("mouseleave", function () { mx(0); my(0); });
    });
  }

  /* ---------------- Loader ---------------- */
  function runLoader(done) {
    var loader = doc.getElementById("loader");
    var num = doc.getElementById("loaderNum");
    var bar = doc.getElementById("loaderBar");
    if (!loader) { done(); return; }

    if (reduce || !hasGSAP) {
      loader.style.display = "none";
      done();
      return;
    }
    var gsap = window.gsap;
    var obj = { v: 0 };
    var tl = gsap.timeline({ onComplete: function () {
      // Lift the curtain and animate the hero in together.
      heroIntro();
      gsap.to(loader, { yPercent: -100, duration: 0.9, ease: "power4.inOut", onComplete: function () { loader.style.display = "none"; done(); } });
    }});
    tl.to(obj, { v: 100, duration: 1.5, ease: "power2.inOut", onUpdate: function () {
      var v = Math.round(obj.v);
      if (num) num.textContent = v;
      if (bar) bar.style.width = v + "%";
    }});
  }

  /* ---------------- Boot ---------------- */
  function boot() {
    var y = doc.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();

    // Register GSAP plugins once, before anything creates a ScrollTrigger.
    if (hasST) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      if (window.ScrollToPlugin) window.gsap.registerPlugin(window.ScrollToPlugin);
    }

    prepHero();
    initI18n();
    initClock();
    initNav();
    initMenu();
    initAnchors();
    initCursor();
    setupQuote();
    initCounters();

    runLoader(function () {
      initReveals();
      if (hasST) window.ScrollTrigger.refresh();
    });
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
