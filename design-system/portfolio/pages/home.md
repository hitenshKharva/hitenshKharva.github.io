# Home page override

Overrides MASTER.md for the portfolio home page (the "Default" look). Built against the
`interactive-portfolio` guidance: pass the 30-second test, avoid the template look,
show work as stories rather than lists.

## Direction: data editorial
- **Palette:** near-black `#0A0A0B`, surface `#141416`, text `#F2F0EA`, muted `#A3A3AB`,
  acid-lime accent `#D4FF3A` with `#0A0A0B` on it. Every text pair is at least 7.3:1.
- **Type:** Instrument Serif (display, italic for emphasis), IBM Plex Sans (body),
  JetBrains Mono (labels, data, code).
- **Signature elements:**
  - Hero query console: tabs of SQL whose result rows are the proof, and link to case studies.
  - Animated architecture strip per case study, standing in for screenshots of internal systems.
  - Case studies as deep-linkable full-screen views at `#/work/<id>`.
- **Structure:** hero (name / what / differentiator / CTA) → selected work → story → toolbox → contact.
- **Rules:**
  - No "coming soon": unwritten projects and missing links render only in dev.
  - The résumé link appears only once `public/resume.pdf` exists.
