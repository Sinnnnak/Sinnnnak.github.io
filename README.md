# Pro Visions (رؤى الاحتراف) — Website Redesign

A modern, award-level static redesign of **pvt.com.sa** — Pro Visions Technology,
a Saudi enterprise-IT / ICT / security & surveillance systems integrator.

Dark navy + electric-blue editorial design, bilingual **English / Arabic (RTL)**,
GSAP scroll animations, and a WebGL "aurora" hero. **No build step** — plain
HTML/CSS/JS you can open or host anywhere.

---

## Preview locally

```bash
cd pro-visions-redesign
python3 serve.py            # → http://127.0.0.1:8741
```

Use `serve.py` (not `python -m http.server`) — it disables caching so edits
always show. An internet connection is required the first time (fonts + GSAP +
Three.js load from CDN).

---

## What's on the page

A single long-scroll page:

| # | Section | Content |
|---|---------|---------|
| — | Hero | WebGL aurora + stacked title "Enterprise / Technology, / Integrated." + stat strip |
| 01 | About ("Why Pro Visions") | Editorial lead + company profile card |
| 02 | Services ("What we do") | 6 numbered rows: Cloud, Infrastructure, Cybersecurity & Surveillance, Networking, Collaboration & AV, Managed IT |
| 03 | Approach ("How we deliver") | Assess → Architect → Deploy → Operate timeline |
| 04 | Industries ("Who we serve") | Sticky stacking cards: Government, Banking, Energy, Enterprise |
| 05 | Partners | Cisco, Huawei, Nutanix, Hikvision, Logitech, Polycom |
| 06 | Clients ("Trusted by") | Aramco, Ministries of Education & Justice, Riyad Bank, Banque Saudi Fransi, Zamil, Zakher Marine |
| — | Statement | Brand philosophy quote (word-by-word scroll reveal) |
| — | Contact | "LET'S TALK" mega-link + contact rows |
| — | Footer | Logo, tagline, Vision 2030 mark, socials |

---

## Features

- **Bilingual EN / AR** with a nav toggle. Arabic flips the whole layout to
  RTL and swaps the type to Tajawal. Choice is remembered (localStorage).
- **Responsive** — desktop, tablet, mobile (390px verified, no overflow).
- **Progressive enhancement** — the page renders fully with JavaScript off or a
  CDN down; all hidden/animated states are applied by JS only.
- **Accessible** — respects `prefers-reduced-motion` (skips the loader count,
  disables the WebGL hero, shows everything immediately) and Data-Saver
  (skips WebGL). Split-text headings carry `aria-label`s.
- **Performance** — deferred scripts, DPR-clamped WebGL that pauses when the
  tab is hidden, single-draw-call shader.

Verified in headless Chrome: 0 console errors, hero fits one screen, no mobile
horizontal overflow, deep-links reveal content, RTL + reduced-motion pass.

---

## ⚠️ Placeholders to replace with real data

I wrote fresh professional copy and used the brand's real logos, but a few
values are **placeholders** — search & replace before going live:

| Placeholder | Where | Replace with |
|---|---|---|
| `info@pvt.com.sa` | contact rows, mobile menu | real address (inferred from the domain — confirm) |
| `+966000000000` | phone + WhatsApp `href`s | real phone / WhatsApp number |
| Social links (`href="#"`) | footer | real LinkedIn / X / Instagram URLs |
| Stat strip `6` / `3` | hero | confirm "practice areas" / "regulated sectors" counts |
| Client & partner logos | Partners / Clients | confirm you have consent to display each mark |

The copy makes no invented metrics or claims — it describes the business only
in terms grounded in the real services, partners and clients.

---

## Editing

- **Text / bilingual copy** — each translatable element carries a `data-ar`
  attribute holding its Arabic; the English is the element's normal content.
- **Colors** — all in `css/style.css` under `:root` (brand tokens `--blue`,
  `--navy`, `--teal`, `--grad`). The WebGL hero colors are in
  `js/hero-three.js` (the `uBase/uGold/uGold2/uHi` uniforms).
- **Logo** — `assets/img/brand/provisions-lockup.svg` (rendered white on the
  dark theme via a CSS filter). Swap the file to update the mark everywhere.

---

## Files

```
index.html               complete page (+ inline SVG icon sprite: 26 icons)
css/style.css            all styles + cyber tokens + RTL + responsive
js/main.js               loader, i18n, GSAP reveals, scrollspy, cursor, clock, slot hydration
js/hero-three.js         WebGL "blue aurora" shader (Three.js r158, injected after load)
js/hero-network.js       canvas node-network constellation overlay
js/assets-manifest.js    swappable image slots (src + bilingual alt)
assets/img/brand|partners|clients   logos (autocropped, normalized)
assets/img/photos/       CC/PD stock, duotoned to palette (WebP + 720w)
assets/img/ai/           AI-image-slot placeholders (swap per IMAGE-PROMPTS.md)
assets/img/og-cover.jpg  1200×630 social-share image
serve.py                 no-cache dev server
IMAGE-CREDITS.md         photo licenses + attribution
IMAGE-PROMPTS.md         ready text-to-image prompts for the AI slots
BEFORE-AFTER.md          summary of the graphics/imagery pass
```

## Design system (dark cyber-tech)

Tokens live in `css/style.css :root` — `--bg #070B14`, `--blue #2B8FE0`,
`--cyan #22D3EE` (glow), `--teal`, `--grad`, `--glow`. Reusable utilities:
`.glass` (glassmorphism card), `.ic` / `.ic-tile` (icon + glowing tile),
`.mesh` (fixed grid+glow background), `.divider`. Icons are one inline `<svg>`
sprite of `<symbol>`s referenced via `<use href="#ic-…">`; recolor by changing
`currentColor` on `.ic`.

---

## Notes from the source site

The original `httpdocs` was a WordPress site (custom "vision" theme). Its media
folder contained assets for **several unrelated brands** on the same hosting
(a "Sitaf — the finest foods" food logo, and "SRACO" HR). The active site —
confirmed by the domain `pvt.com.sa` and all IT content/partners/clients —
is **Pro Visions**. This redesign reflects Pro Visions only.
