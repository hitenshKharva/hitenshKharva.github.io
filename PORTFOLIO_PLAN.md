# Portfolio Website — Build Plan for Claude Code

> Put this file in the repo root (or rename to `CLAUDE.md`) together with the `refs/` folder of reference screenshots. Then give Claude Code the kickoff prompt at the bottom.

## 1. Goal

A single-page, scroll-driven personal portfolio for a **Data Engineer / AI-ML / Software Engineer** job search. Inspired by a reference site (see `refs/`), but with my own content, name, and projects. The signature pieces are: an animated 3D avatar in the hero, a swinging developer ID card, a "periodic table" skills grid, and hover-expanding project panels.

All personal content must live in one data file so I can edit text without touching components.

## 2. Visual language (from the reference)

**Palette** — warm editorial, low saturation:

| Token | Value (approx.) | Use |
|---|---|---|
| `--bg` | `#F3EEE2` | page background (warm cream) |
| `--bg-glow` | `#F6EBC4` | soft yellow radial glow behind sections |
| `--surface` | `#FBF8F1` | cards |
| `--ink` | `#1C1F2E` | headings, active pill, dark tiles |
| `--muted` | `#7A7468` | body copy, captions |
| `--line` | `#D9D1C1` | hairlines, timeline |
| family tints | ink → taupe → sand → pale sand | skills tile families |

**Typography** — three voices:
- Heavy grotesk sans for headlines (e.g. *Inter Tight* 700–800, tight tracking).
- Italic display serif for one accent word per heading (e.g. *Instrument Serif Italic*): "Hi, I'm **_Name._**", "Things I've **_built._**", "Always **_learning._**", "Education & **_experience._**", "Proud **_moments._**", "The periodic table **_of my stack._**"
- Small monospace uppercase eyebrows with section numbers (e.g. *JetBrains Mono*): `— 04 — CERTIFICATIONS`, `ML OPERATIONS · RANDOM FOREST`.

**Layout feel** — generous whitespace, large headings bleeding toward the left edge, rounded cards (16–24px radius), subtle shadows, faded oversized watermark text in the hero.

## 3. Global components

- **Name mark** top-left (small text).
- **Floating pill nav** top-right: About · Skills · Work · Experience · Achievements · Contact. Translucent pill container; the active item becomes a filled `--ink` pill with cream text. Active state driven by scroll-spy; clicking smooth-scrolls.
- **Smooth scrolling** (Lenis) and **reveal-on-scroll** for headings/cards (fade + slight rise, staggered).
- Respect `prefers-reduced-motion`: disable avatar autoplay, swinging card, count-ups and parallax.

## 4. Sections

### 4.1 Hero
- Giant faded first name as a watermark behind everything (very light tint, ~20vw).
- Centered **animated avatar video** (stylized 3D/Pixar-like version of me, standing, small gestures, loops). Background must blend with `--bg` (transparent WebM, or MP4 rendered on the same cream color).
- Small round dark **pause/play button** for the video (top right of hero).
- Bottom-left: small mono label with my name, big headline with my title (e.g. "Data Engineer." with italic-serif period/accent), one-line tagline.
- CTAs: **Explore work** (filled) and **Let's talk** (outline).

### 4.2 About
- Eyebrow `— ABOUT`, heading "Hi, I'm _Name._", 2 short bio paragraphs, buttons: Resume ↓, GitHub ↗, LinkedIn ↗.
- **Lanyard developer ID card** hanging from the top of the section: dark header strip "DEVELOPER ID · Portfolio 2026", photo, name, role, fields (ID no., Dept., Valid till), barcode. It swings gently on load and on hover/drag (spring physics via Framer Motion; optional upgrade: react-three-fiber + rapier lanyard).
- **Quick facts** column: Based in · Studying/Role · Batch · Interned at · Focus — label left, value right, hairline separators.
- Italic serif pull quote (e.g. "From the database to the last pixel." → make it my own, e.g. "From raw events to real decisions.").

### 4.3 Skills — "The periodic table of my stack."
- Grid of square tiles like chemical elements: small atomic number (top-left), 2-letter symbol (big), full name (small). E.g. `03 Py Python`, `05 Sq SQL`, `Sp Spark`, `Kf Kafka`, `Af Airflow`.
- Tiles shaded by **family**: Languages, Data/Streaming, Backend, Databases, Cloud/DevOps, AI/ML.
- **Filter chips** above the grid: clicking a family "lights it up" and fades the rest (opacity ~0.25).
- **Hover a tile** → side panel shows the tech's logo large + name + one line on how I've used it.
- Mobile: horizontally scrollable grid or 4-column wrap.

### 4.4 Work — "Things I've built."
- Horizontal **accordion of project panels**. Collapsed panels show a vertical title + number; hovering/tapping expands one panel.
- Expanded panel: number, mono eyebrow (domain · technique), title, description, 3–4 bullets, tech chips, **View on GitHub** button, and on the right an **illustrative mini UI** (pure CSS/SVG, labeled "ILLUSTRATIVE UI") — e.g. a heatmap, a pipeline DAG, a streaming chart, a dashboard card.
- Mobile: stacked cards, tap to expand.

### 4.5 Certifications — "Always learning."
- Numbered list (01, 02, 03…): cert name + issuer. Hover row inverts to an `--ink` bar with cream text.

### 4.6 Education & experience
- Vertical **timeline** with a center line that fills as you scroll; huge year markers (e.g. "2021", "2026") beside cards alternating left/right.
- Cards: tag pill (EDUCATION / EXPERIENCE), date range, title, org · place, score or bullets, tech chips.
- Timeline ends with an italic "**Next**" node and a small card: "Your team?" + **Let's talk** button.

### 4.7 Achievements — "Proud moments."
- Row of stat cards: platform logo, big number with count-up animation (e.g. `450+` problems solved), label, one-liner. Mixed with rank cards ("No. 1", "Top 100").
- For me: LeetCode/HackerRank counts, hackathons, OSS PRs merged, etc.

### 4.8 Contact
- Big heading (e.g. "Let's _build_ something."), email (copy-to-clipboard), GitHub, LinkedIn, resume download. Simple footer.

## 5. The animated avatar (made outside the code)

The reference's avatar is AI-generated, not hand-coded:
1. **Image step** — give an image generator two images: a reference for pose/framing/style (full-body, stylized 3D character, plain light background) and a clear photo of me. Ask it to keep my face, hair, outfit and proportions consistent.
2. **Video step** — feed that image to an image-to-video tool. Ask for a few seconds of subtle, natural motion (small hand gestures, slight smile, blink), fixed camera, identical character, **no audio**, plain background.
3. **Export for web** — 4–6 s seamless loop, ~1080px tall, trimmed so first/last frames match. Provide:
   - `public/avatar/hero.webm` (VP9, with alpha if possible) and `hero.mp4` (H.264 fallback, background color = `--bg`)
   - `public/avatar/poster.webp` (first frame) for loading and reduced-motion.
4. Until I have the video, the code should show a placeholder silhouette/poster.

## 6. Tech stack

- **Next.js (App Router) + TypeScript**, static export (works on Vercel or GitHub Pages).
- **Tailwind CSS** with the tokens above as CSS variables.
- **Framer Motion** (`motion`) for reveals, accordion, card swing, count-ups.
- **Lenis** for smooth scroll.
- `next/font` for Inter Tight, Instrument Serif, JetBrains Mono.
- Icons/logos: `simple-icons` (SVG) for tech logos.
- No backend needed. Optional later: contact form via Formspree/Resend.

**Content model** — `src/content/site.ts` exports typed objects: `profile`, `quickFacts`, `skills[]` (symbol, name, number, family, logo, note), `projects[]`, `certifications[]`, `timeline[]`, `achievements[]`, `links`. Components only read from here.

Suggested structure:
```
src/
  app/ (layout.tsx, page.tsx, globals.css)
  components/ (Nav, Hero, About, IdCard, SkillsTable, Work, ProjectPanel,
               illustrations/*, Certifications, Timeline, Achievements, Contact)
  content/site.ts
  lib/ (useScrollSpy, useReducedMotion)
public/avatar/  public/photo/  public/resume.pdf
refs/           (reference screenshots — do not ship)
```

## 7. Build phases (one at a time, review between each)

| # | Phase | Done when |
|---|---|---|
| 0 | Scaffold Next.js + TS + Tailwind + fonts + tokens; `site.ts` with placeholder content | `npm run dev` shows a cream page with fonts loaded |
| 1 | Nav (pill, scroll-spy, smooth scroll) + section shells + reveal animation | Active pill follows scroll; links jump smoothly |
| 2 | Hero with watermark, video slot + poster fallback, pause button, CTAs | Video loops muted; pause works; reduced-motion shows poster |
| 3 | About + swinging ID card + quick facts | Card swings on load and reacts to hover/drag |
| 4 | Skills periodic table + family filters + hover detail panel | Filters dim other families; hover panel updates |
| 5 | Work accordion + 3 illustrative mini UIs | One panel expanded at a time; mobile stacks |
| 6 | Certifications list | Hover row inverts |
| 7 | Timeline with scroll-filled line + "Next / Your team?" | Line fills with scroll; alternating cards |
| 8 | Achievements count-up + Contact + footer | Numbers count up once when visible |
| 9 | Polish: responsive (375 / 768 / 1280 / 1536), a11y (keyboard, focus rings, alt text, contrast), Lighthouse ≥ 90, SEO/OG image, favicon | Checks pass |
| 10 | Deploy (Vercel or GitHub Pages) + README on editing content | Live URL works |

## 8. Ground rules for Claude Code

- Use `refs/*.png` only as visual reference (they're phone recordings of a laptop, slightly angled — match the *style*, not exact pixels). Don't copy the reference person's name, text, or content.
- Keep every piece of personal text in `site.ts`.
- Mobile-first; nothing should break below 400px.
- Ask me before adding dependencies beyond the stack above.
- After each phase: summarize what changed and what I should check.

---

## Kickoff prompt (paste into Claude Code)

```
Read PORTFOLIO_PLAN.md and look at every image in refs/. This is the spec
for my portfolio site. Start with Phase 0 and Phase 1 only, then stop and
summarize. Use placeholder content in src/content/site.ts that fits a
Data Engineer / AI-ML / SDE profile — I'll replace it with my real details.
If my existing portfolio code is in this repo, tell me what you'd keep vs.
replace before changing anything.
```
