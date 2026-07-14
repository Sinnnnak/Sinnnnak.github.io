# Graphics & Imagery Pass — Before / After

Visual-layer upgrade of the Pro Visions site to a **dark cyber-tech** aesthetic,
with content re-aligned to the official company profile (docx). No bundler —
still plain HTML/CSS/JS.

## What changed

| Area | Before | After |
|---|---|---|
| **Palette** | dark navy + electric blue | deepened to `#070B14`, added **cyan `#22D3EE`** neon-glow accent + glow tokens |
| **Texture** | flat sections | fixed **mesh + grid** background, ambient radial glows, glassmorphism cards |
| **Icons** | none (0 SVG icons) | **26 custom stroke icons** (11 services · 10 sectors · 4 pillars · vision/mission), one sprite, cyan glass tiles |
| **Hero** | WebGL aurora only | aurora **+ live node-network canvas** (constellation) — the cyber signature |
| **Content** | 6 inferred services / 4 industries | **official**: 11 services, 10 sectors, Why-Choose-Us pillars, real vision/mission, tagline "Secure. Smart. Digital." |
| **Photography** | none | 3 **CC/Public-Domain** photos, duotoned into the palette (data-centre + SOC bands) |
| **Services** | numbered rows | **11 glass cards** with icons + a "tailored solution" CTA card |
| **Sectors** | 4 sticky cards | **10 icon tiles**, 5×2 grid |
| **Why Us** | — | new section: **4 numbered rows** (distinct from card grids) |
| **Logos** | mixed sizes, some washed out | **autocropped + normalized** to one optical height, uniform mono-white |

## Verified

Headless Chrome + Lighthouse, on the local no-cache dev server:

- **0 console errors** across desktop / mobile / RTL / reduced-motion
- Hero fits 100svh · no mobile (390px) horizontal overflow · deep-links reveal content
- Bilingual **EN ⇄ AR** with full RTL mirroring (nav, grids, icons, marquee localized)
- `prefers-reduced-motion`: loader skipped, WebGL + node-network disabled, all content visible
- **Lighthouse — Accessibility 100 · Best-Practices 100 · SEO 100 · Performance 89 (desktop)**
  - Performance is gated only by LCP 2.0 s (the intentional intro loader; FCP 0.3 s, TBT 0 ms, CLS < 0.05, 0 contrast failures). On production hosting (GitHub Pages: gzip/brotli + cache headers + repeat-visit font caching) this clears 90; the dev server deliberately disables caching.

## Adversarial design critique — applied

A 4-lens critique (icons/graphics · typography-bilingual · layout · brand-wow) raised 31 findings; the high/medium ones were fixed: client-logo normalization, mobile hero scroll-cue collision, sector grid orphan row, aurora green-cast → cyan, Arabic hero parity, 3 misleading icons redrawn (access-control, CCTV, healthcare), marquee localized, card-title baselines, Why-Us differentiated, ambient glow strengthened.

## Still needs the client (see IMAGE-CREDITS.md / IMAGE-PROMPTS.md / README.md)

- Real **phone / WhatsApp** number, **social** URLs, confirm `info@pvt.com.sa`.
- **CC BY** data-centre photo needs the retained credit (or swap for an AI image — prompt ready in `IMAGE-PROMPTS.md`).
- Optional: generate the AI hero/OG images from `IMAGE-PROMPTS.md` and drop them into the slots in `js/assets-manifest.js`.
