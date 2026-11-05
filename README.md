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
| Quick facts next to the ID card (shown as a table schema) | `quickFacts` (label, column, type, value) |
| Periodic table tiles | `skills` (symbol, name, family, note, `years` sets the heatmap shade, optional `icon`) |
| Work panels | `projects` (illustration: `queue`, `catalog`, `rag`, `gem`, `dashboard`, `dag`) |
| More work · side projects | `moreWork`, `sideProjects` |
| Certifications | `certifications` |
| Timeline | `timeline` (status and runtime come from `dates`; "Present" shows as running) |
| Count-up cards | `achievements` (`value` counts up; `display` for text like "1st") |

### Files you can drop in

- **Résumé:** the site has no résumé download right now. Adding `public/resume.pdf` brings the Resume buttons back on the next build.
- **Photo for the ID card:** add e.g. `public/photo/me.jpg` and set `profile.photo = "/photo/me.jpg"`.
- **Avatar video for the hero:** add `public/avatar/hero.webm` / `hero.mp4` / `poster.webp` and
  set `profile.avatar`. It replaces the data-flow animation.

### Skill logos

Logos come from [Simple Icons](https://simpleicons.org). To add one, put its slug in the
`slugs` list in `scripts/gen-skill-icons.mjs`, run `npm run icons`, and set `icon` on the
skill in `site.ts`. Skills without a logo show their symbol instead.

## Résumé

The Word file `resume/Kharva_Hitensh_Resume.docx` is the master copy. The site doesn't serve a résumé; the About and Contact "Resume" buttons stay hidden unless `public/resume.pdf` exists.

`npm run resume` builds a PDF of the master copy into `resume/out/`, and `npm run resume -- path/to/other.docx` does the same for a tailored copy. `resume/out/` is git-ignored, so tailored versions are never committed or published. The script uses LibreOffice with the Carlito font, a metric-compatible stand-in for Calibri (`apt-get install libreoffice-writer-nogui fonts-crosextra-carlito fonts-crosextra-caladea`).

## Design

Tokens are in `src/index.css`. The design-system notes are in
[`design-system/portfolio/`](design-system/portfolio/) (`MASTER.md` from the UI UX Pro Max
skill, `pages/home.md` for this page).

Color encodes state, as in a pipeline UI: ledger green for success, amber for running, brick red
for a failure or a drop. The footer's "last refreshed" stamp is filled in at build time.

### Design history and rollback

Each design is saved on its own branch, so you can always go back:

| Branch | What it is |
|---|---|
| [`design/v1-ledger`](../../tree/design/v1-ledger) | Green-bar ledger palette before the pipeline touches (commit `6d0b089`) |

To go back, open the PR that introduced the newer design and press **Revert**, then merge
the revert PR. Or, from a checkout: `git revert -m 1 <merge commit>` (or `git revert <squash
commit>`) and push to `main`. The deploy workflow republishes the site either way.

## Deploy

`.github/workflows/deploy.yml` builds every pull request and deploys `dist/` to GitHub
Pages on every push to `main` (Pages source: **GitHub Actions**).
