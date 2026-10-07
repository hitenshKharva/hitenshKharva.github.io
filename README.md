# hitenshkharva.github.io

Personal portfolio of Hitensh Kharva. Live at https://hitenshkharva.github.io/.

Built with Vite, React, TypeScript, Tailwind CSS v4, Motion for React and Lenis, following
[`PORTFOLIO_PLAN.md`](PORTFOLIO_PLAN.md)'s design. The page is prerendered to static HTML
at build time and hydrated in the browser.

## Run it

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck, build, prerender into dist/
npm run preview    # serve dist/ at http://localhost:4173
```

## Editing content

All text lives in **[`src/content/site.ts`](src/content/site.ts)**. Components only read
from it, so you never need to touch them to change copy.

| What | Where in `site.ts` |
|---|---|
| Name, title, tagline, email, location | `profile` |
| GitHub / LinkedIn | `links` |
| About bio and pull quote | `about` |
| Quick facts next to the ID card | `quickFacts` |
| Periodic table tiles | `skills` (symbol, name, family, note, optional `icon`) |
| Work panels | `projects` (illustration: `queue`, `catalog`, `rag`, `gem`, `dashboard`, `dag`) |
| More work · side projects | `moreWork`, `sideProjects` |
| Certifications | `certifications` |
| Timeline | `timeline` |
| Count-up cards | `achievements` (`value` counts up; `display` for text like "1st") |

### Files you can drop in

- **Résumé:** add `public/resume.pdf`. The Resume buttons appear automatically on the next build.
- **Photo for the ID card:** add e.g. `public/photo/me.jpg` and set `profile.photo = "/photo/me.jpg"`.
- **Avatar video for the hero:** add `public/avatar/hero.webm` / `hero.mp4` / `poster.webp` and
  set `profile.avatar`. It replaces the data-flow animation.

### Skill logos

Logos come from [Simple Icons](https://simpleicons.org). To add one, put its slug in the
`slugs` list in `scripts/gen-skill-icons.mjs`, run `npm run icons`, and set `icon` on the
skill in `site.ts`. Skills without a logo show their symbol instead.

## Résumé

The Word file `resume/Kharva_Hitensh_Resume.docx` is the source. The site serves `public/resume.pdf`, and the About and Contact "Resume" buttons appear only when that file exists.

To update it, edit the .docx, then run `npm run resume` to rebuild the PDF and commit both files. The script uses LibreOffice with the Carlito font, a metric-compatible stand-in for Calibri (`apt-get install libreoffice-writer-nogui fonts-crosextra-carlito fonts-crosextra-caladea`). A PDF exported from Word also works: save it over `public/resume.pdf`.

## Design

Tokens are in `src/index.css`. The design-system notes are in
[`design-system/portfolio/`](design-system/portfolio/) (`MASTER.md` from the UI UX Pro Max
skill, `pages/home.md` for this page).

## Deploy

`.github/workflows/deploy.yml` builds every pull request and deploys `dist/` to GitHub
Pages on every push to `main` (Pages source: **GitHub Actions**).
