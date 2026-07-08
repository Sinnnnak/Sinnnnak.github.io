/* =========================================================================
   Pro Visions hero — WebGL "blue aurora"
   One fullscreen plane + fbm-noise shader (single draw call). r158 UMD.
   Skips on reduced-motion / Data Saver. Pauses when tab hidden.
   ========================================================================= */
(function () {
  "use strict";

  function start() {
    var canvas = document.getElementById("aurora");
    if (!canvas || typeof window.THREE === "undefined") return;

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var conn = navigator.connection || {};
    if (reduce || conn.saveData) return; // leave canvas hidden; CSS fade never triggers

    var THREE = window.THREE;
    var renderer, scene, camera, mesh, clock;
    var mouse = { x: 0.5, y: 0.5 };
    var mouseT = { x: 0.5, y: 0.5 };
    var scroll = 0;
    var running = true;
    var dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    if (window.innerWidth < 768) dpr = Math.min(dpr, 1.5);

    var uniforms = {
      uTime:   { value: 0 },
      uRes:    { value: new THREE.Vector2(1, 1) },
      uMouse:  { value: new THREE.Vector2(0.5, 0.5) },
      uScroll: { value: 0 },
      // Pro Visions blue / teal palette
      uBase:   { value: new THREE.Color(0x0a1628) },
      uGold:   { value: new THREE.Color(0x2b8fe0) },
      uGold2:  { value: new THREE.Color(0x1076bc) },
      uHi:     { value: new THREE.Color(0x52b78e) }
    };

    var frag = [
      "precision highp float;",
      "varying vec2 vUv;",
      "uniform float uTime; uniform vec2 uRes; uniform vec2 uMouse; uniform float uScroll;",
      "uniform vec3 uBase; uniform vec3 uGold; uniform vec3 uGold2; uniform vec3 uHi;",
      "float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }",
      "float noise(vec2 p){",
      "  vec2 i=floor(p); vec2 f=fract(p);",
      "  float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));",
      "  vec2 u=f*f*(3.-2.*f);",
      "  return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;",
      "}",
      "float fbm(vec2 p){",
      "  float v=0.0, amp=0.55;",
      "  for(int i=0;i<5;i++){ v+=amp*noise(p); p*=2.02; amp*=0.5; }",
      "  return v;",
      "}",
      "float blob(vec2 uv, vec2 c, float r){ float d=length(uv-c); return smoothstep(r, 0.0, d); }",
      "void main(){",
      "  vec2 uv=vUv;",
      "  float agf = uRes.x/uRes.y;",
      "  vec2 auv=vec2(uv.x*agf, uv.y);",
      "  float t=uTime*0.045;",
      // warp field
      "  vec2 q=vec2(fbm(auv*2.0+t), fbm(auv*2.0-t+5.2));",
      "  float f=fbm(auv*2.4 + q*1.6 + vec2(0.0,-uScroll*0.4));",
      // drifting gold blobs, nudged by mouse
      "  vec2 m=(uMouse-0.5)*0.35;",
      "  float b1=blob(auv+q*0.25, vec2(0.42*agf+m.x, 0.62+m.y+sin(t*1.4)*0.06), 0.55);",
      "  float b2=blob(auv+q*0.3,  vec2(0.78*agf-m.x*0.6, 0.34-m.y*0.5+cos(t*1.1)*0.05), 0.5);",
      "  float b3=blob(auv+q*0.2,  vec2(0.15*agf, 0.2+sin(t*0.9)*0.04), 0.42);",
      "  vec3 col=uBase;",
      "  col=mix(col, uGold2, b3*0.5*(0.6+0.4*f));",
      "  col=mix(col, uGold,  b1*0.55*(0.5+0.5*f));",
      "  col=mix(col, uHi,    b2*0.32*f);",
      // fine grid twinkle specks
      "  vec2 g=floor(auv*70.0);",
      "  float sp=step(0.986, hash(g))*(0.4+0.6*sin(uTime*2.0+hash(g)*40.0));",
      "  col+=uHi*sp*0.10;",
      // subtle overall noise sheen
      "  col+=uGold2*fbm(auv*5.0+t*2.0)*0.03;",
      // vignette
      "  float vig=smoothstep(1.25,0.35,length(uv-0.5));",
      "  col*=vig;",
      "  col=mix(uBase, col, 0.94);",
      "  gl_FragColor=vec4(col,1.0);",
      "}"
    ].join("\n");

    var vert = "varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,1.0); }";

    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
    } catch (e) { return; }

    renderer.setPixelRatio(dpr);
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({ uniforms: uniforms, vertexShader: vert, fragmentShader: frag })
    );
    scene.add(mesh);
    clock = new THREE.Clock();

    function resize() {
      var hero = canvas.parentElement;
      var w = hero.clientWidth, h = hero.clientHeight;
      renderer.setSize(w, h, false);
      uniforms.uRes.value.set(w, h);
    }
    resize();
    window.addEventListener("resize", resize);

    window.addEventListener("mousemove", function (e) {
      mouseT.x = e.clientX / window.innerWidth;
      mouseT.y = 1.0 - e.clientY / window.innerHeight;
    }, { passive: true });

    window.addEventListener("scroll", function () {
      var hero = canvas.parentElement;
      var vh = window.innerHeight || 1;
      scroll = Math.min(1, (window.scrollY || 0) / vh);
    }, { passive: true });

    document.addEventListener("visibilitychange", function () {
      running = !document.hidden;
      if (running) { clock.start(); loop(); }
    });

    var faded = false;
    function loop() {
      if (!running) return;
      requestAnimationFrame(loop);
      uniforms.uTime.value += clock.getDelta();
      mouse.x += (mouseT.x - mouse.x) * 0.05;
      mouse.y += (mouseT.y - mouse.y) * 0.05;
      uniforms.uMouse.value.set(mouse.x, mouse.y);
      uniforms.uScroll.value += (scroll - uniforms.uScroll.value) * 0.06;
      renderer.render(scene, camera);
      if (!faded) { faded = true; canvas.classList.add("on"); }
    }
    loop();
  }

  if (document.readyState === "complete") start();
  else window.addEventListener("load", start);
})();
