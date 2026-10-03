# hitenshkharva.github.io

Personal portfolio. Vite + React + TypeScript + Tailwind CSS v4 + Motion for React.
Live at https://hitenshkharva.github.io/.

## Develop

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve dist/ locally
```

## Editing content

All copy lives in [`src/content.ts`](src/content.ts). A `null` value renders as a visible
**TODO** badge on the site, so missing facts are obvious instead of invented.

- Résumé: add the PDF at `public/resume.pdf`.
- Projects: fill in `summary`, `steps` ("How it works"), `stack` and `link`, and check `categories`.

## Design

The default look is a "data editorial" design: a hero query console, animated
architecture strips, and deep-linkable case studies at `#/work/<id>`. The direction is
documented in [`design-system/portfolio/pages/home.md`](design-system/portfolio/pages/home.md),
on top of the generated [`MASTER.md`](design-system/portfolio/MASTER.md).

Three alternate looks (Terminal, Bold, Horizon) are available from the footer switcher
and the terminal's `theme` command. The choice is saved in `localStorage` (`portfolio-look`).

Projects without a write-up, and missing links, show as TODO badges in `npm run dev` only.
The résumé link appears once `public/resume.pdf` exists.

## Deploy

`.github/workflows/deploy.yml` builds on every PR and deploys `dist/` to GitHub Pages on
push to `main`. One-time setup: **Settings → Pages → Build and deployment → Source:
GitHub Actions**.
