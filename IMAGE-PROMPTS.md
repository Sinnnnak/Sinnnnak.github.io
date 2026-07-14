# AI Image Prompts — Professional Visions IT

Every service card and photo band currently ships with a bespoke **generated
SVG background** (`assets/img/gen/`) so the site is complete and on-brand right
now. To replace any one with a real AI-generated image, generate it, export to
**WebP/JPEG**, and point that slot's `src` in `js/assets-manifest.js` at the
new file — nothing else to change.

**Shared style suffix — append to every prompt:**

> dark cyber-tech aesthetic, deep near-black navy background (#070B14),
> electric blue (#2B8FE0) and cyan (#22D3EE) glow, subtle teal accents, thin
> luminous network/grid lines, high contrast, enterprise-premium (not
> gamer-RGB), no text, no logos, no watermark, cinematic lighting, 4:3

Card slots are 4:3 (≈1000×750); bands are wide (≈1600×520 → generate 3:1).

## Service cards (slot → prompt)

| Slot (manifest) | Service | Prompt subject |
|---|---|---|
| `svc-cyber` | Cybersecurity | a glowing shield hologram over a padlock and streaming encrypted data |
| `svc-network` | Networks & IT | fibre-optic cables converging into a switch, blue light trails |
| `svc-access` | Access Control & Attendance | a fingerprint / biometric reader glowing on a secure door panel |
| `svc-cctv` | CCTV & Security Gates | a sleek wall-mounted security camera, city at dusk bokeh behind |
| `svc-dev` | App / Web / Digital Dev | abstract floating UI panels and code brackets, depth of field |
| `svc-ai` | AI & Automation | a neural-network brain of glowing nodes, robotic automation motif |
| `svc-consult` | Consulting & Digital Transformation | an abstract upward growth graph over a strategy dashboard |
| `svc-iot` | IoT for Smart Facilities | a smart building with connected sensor points linked by light |
| `svc-cloud` | Cloud Services | a luminous cloud icon made of particles over a server grid |
| `svc-edtech` | Education Technology | a glowing graduation cap / digital classroom of light nodes |
| `svc-business` | Business Solutions & ERP | interlocking gears and dashboard charts, holographic ERP flow |

## Photo bands

| Slot | Where | Prompt subject |
|---|---|---|
| `about-photo` | About band (wide) | a vast abstract network constellation stretching across dark space |
| `statement-bg` | Statement band (wide) | a calm cinematic operations-centre glow, very dark, low detail (text sits on top) |

### After generating

1. Convert: `python3 -c "from PIL import Image; Image.open('in.png').save('assets/img/gen/svc-cyber.webp','WEBP',quality=82)"`
2. Point the slot at it in `js/assets-manifest.js` (e.g. `svc-cyber: { src: "assets/img/gen/svc-cyber.webp", ... }`).
3. Add the file + "AI-generated, no third-party rights" to `IMAGE-CREDITS.md`.
