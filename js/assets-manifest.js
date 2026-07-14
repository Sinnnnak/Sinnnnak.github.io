/* =========================================================================
   Asset manifest — single source of truth for every swappable image slot.
   Each service card and photo band ships with a bespoke generated SVG
   background. To drop in a real AI-generated image (see IMAGE-PROMPTS.md),
   just point that slot's `src` at your file — no HTML edits. `alt` is
   bilingual; the language toggle applies the right one automatically.
   Slots bind to <img data-slot="..."> at boot (main.js → hydrateSlots).
   ========================================================================= */
window.PV_ASSETS = {
  // ---- Service cards (swap src → your AI image; prompts in IMAGE-PROMPTS.md) ----
  "svc-cyber":    { src: "assets/img/gen/cyber.svg",    alt: { en: "Cybersecurity and digital protection — Pro Visions service",       ar: "الأمن السيبراني والحماية الرقمية" } },
  "svc-network":  { src: "assets/img/gen/network.svg",  alt: { en: "Networks and IT solutions — Pro Visions service",                   ar: "حلول الشبكات وتقنية المعلومات" } },
  "svc-access":   { src: "assets/img/gen/access.svg",   alt: { en: "Access control and attendance — Pro Visions service",               ar: "أنظمة التحكم بالدخول والحضور والانصراف" } },
  "svc-cctv":     { src: "assets/img/gen/cctv.svg",     alt: { en: "CCTV and security gates — Pro Visions service",                     ar: "أنظمة كاميرات المراقبة والبوابات الأمنية" } },
  "svc-dev":      { src: "assets/img/gen/dev.svg",      alt: { en: "App, web and digital development — Pro Visions service",            ar: "تطوير التطبيقات والمواقع والخدمات الرقمية" } },
  "svc-ai":       { src: "assets/img/gen/ai.svg",       alt: { en: "AI and automation — Pro Visions service",                          ar: "حلول الذكاء الاصطناعي والأتمتة" } },
  "svc-consult":  { src: "assets/img/gen/consult.svg",  alt: { en: "Consulting and digital transformation — Pro Visions service",       ar: "الاستشارات والتحول الرقمي" } },
  "svc-iot":      { src: "assets/img/gen/iot.svg",      alt: { en: "IoT for smart facilities — Pro Visions service",                    ar: "حلول إنترنت الأشياء للمنشآت الذكية" } },
  "svc-cloud":    { src: "assets/img/gen/cloud.svg",    alt: { en: "Cloud services and computing — Pro Visions service",                ar: "الخدمات السحابية والحوسبة السحابية" } },
  "svc-edtech":   { src: "assets/img/gen/edtech.svg",   alt: { en: "Education technology (EdTech) — Pro Visions service",                ar: "حلول التقنية التعليمية" } },
  "svc-business": { src: "assets/img/gen/business.svg", alt: { en: "Business solutions and ERP — Pro Visions service",                  ar: "حلول الأعمال والتحول المؤسسي" } },

  // ---- Photo bands ----
  "about-photo":  { src: "assets/img/gen/band-about.svg",     alt: { en: "", ar: "" } },
  "statement-bg": { src: "assets/img/gen/band-statement.svg", alt: { en: "", ar: "" } }
};
