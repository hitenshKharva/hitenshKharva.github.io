# Home page override

Overrides MASTER.md for the portfolio home page. The direction comes from
`PORTFOLIO_PLAN.md` (warm editorial, single scroll page), adapted to pass the
UI UX Pro Max checklist.

## Palette
| Token | Value | Notes |
|---|---|---|
| `--bg` | `#F3EEE2` | warm cream page |
| `--bg-glow` | `#F6EBC4` | soft radial glow behind some sections |
| `--surface` | `#FBF8F1` | cards |
| `--ink` | `#1C1F2E` | headings, active pill, dark tiles (14:1 on bg) |
| `--muted` | `#625C51` | body copy; plan's `#7A7468` was 4.0:1, this is 5.7:1 |
| `--line` | `#D9D1C1` | hairlines (decorative only) |
| tints 1–6 | `#1C1F2E → #E8E0CF` | skills families; tint-3 is `#A0968A` so ink text passes |

## Type
Three voices: Inter Tight 700–800 for headlines (tight tracking), Instrument
Serif italic for one accent word per heading, JetBrains Mono uppercase for
numbered eyebrows ("04 — CERTIFICATIONS").

## Sections
Hero (watermark name, data-flow canvas, title, CTAs) → About (lanyard ID card,
quick facts) → Skills (periodic table) → Work (accordion with illustrative UIs) →
Certifications → Experience (scroll-filled timeline) → Achievements (count-ups) →
Contact.

## Rules
- Every animation respects `prefers-reduced-motion` (hydration-safe hook in
  `src/lib/useReducedMotion.ts`); Lenis smooth scroll is off for those visitors.
- Anything that moves for more than 5 s has a pause control (hero canvas).
- Interactive targets are at least 40–44 px; focus rings are always visible.
- The page is prerendered at build time, so content paints before JavaScript.
