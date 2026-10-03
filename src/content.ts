// Single source of truth for all copy on the site.
//
// Rules:
// - `null` means "not provided yet". It renders as a visible TODO badge.
// - Facts marked "old site" were copied from the previous hitenshkharva.github.io
//   (commit 6de1d7b). Please verify them.
// - Nothing here is invented. Add real values; don't guess.

export type Category = "ai" | "data" | "backend";

export const CATEGORY_LABEL: Record<Category, string> = {
  ai: "AI/ML",
  data: "Data",
  backend: "Backend",
};

export interface Project {
  id: string;
  name: string;
  /** Terminal `open <name>` alias. */
  slug: string;
  /** TODO(verify): categories were guessed from the project names. */
  categories: Category[];
  summary: string | null;
  stack: string[];
  /** "How it works" steps. */
  steps: string[] | null;
  link: string | null;
}

export interface Role {
  role: string;
  company: string;
  dates: string;
  impact: string | null;
}

export interface Degree {
  degree: string;
  university: string | null;
  year: string;
}

export const profile = {
  name: "Hitensh Kharva", // old site
  firstName: "Hitensh",
  lastName: "Kharva",
  headline: null as string | null,
  email: "kharva.hitensh11@gmail.com", // old site (mailto link)
  github: "https://github.com/hitenshKharva", // old site
  githubHandle: "hitenshKharva",
  linkedin: "https://www.linkedin.com/in/hitensh-kharva", // old site
  location: "San Diego, CA", // old site
  /** Upload the PDF to public/resume.pdf. */
  resume: "/resume.pdf",
};

/** Bold hero: "I build ..." rotation. Taken from work described on the old site. */
export const buildPhrases = [
  "ELT pipelines",
  "dbt models",
  "CI/CD for data",
  "data quality checks",
];

/** Union of the "Tech Stack" lines on the old site. */
export const stack = [
  "Python",
  "SQL",
  "JavaScript",
  "dbt",
  "Snowflake",
  "Looker",
  "Fivetran",
  "AWS",
  "GitHub",
  "CI/CD",
  "PostgreSQL",
  "MySQL",
  "Django",
];

export const projects: Project[] = [
  {
    id: "agent-desk",
    name: "Agent Desk",
    slug: "agent-desk",
    categories: ["ai"],
    summary: null,
    stack: [],
    steps: null,
    link: null,
  },
  {
    id: "oss-pr-pipeline",
    name: "OSS PR pipeline",
    slug: "oss-pr",
    categories: ["backend"],
    summary: null,
    stack: [],
    steps: null,
    link: null,
  },
  {
    id: "nutri",
    name: "nutri",
    slug: "nutri",
    categories: ["ai"],
    summary: null,
    stack: [],
    steps: null,
    link: null,
  },
  {
    id: "conviction-ledger",
    name: "Conviction Ledger",
    slug: "conviction-ledger",
    categories: ["data"],
    summary: null,
    stack: [],
    steps: null,
    link: null,
  },
];

// Old site. Each impact line is condensed from that role's bullets. Metrics are the old site's own.
export const experience: Role[] = [
  {
    role: "Data Developer",
    company: "Wind River Systems",
    dates: "June 2023 – Present",
    impact:
      "Integrated dbt-checkpoint pre-commit hooks into CI/CD, cutting data model review time by 25%.",
  },
  {
    role: "Data Developer Intern",
    company: "Wind River Systems",
    dates: "May 2022 – March 2023",
    impact:
      "Built Python models that scan, tag and mask PII fields in Snowflake for data governance.",
  },
  {
    role: "Backend Python Engineer",
    company: "Bloomstack Technology",
    dates: "November 2020 – May 2021",
    impact:
      "Built a Python and SQL pipeline processing 200+ data points a day from an external REST API.",
  },
  {
    role: "Software Engineer",
    company: "Larsen and Toubro Infotech (LTIMindtree)",
    dates: "July 2018 – October 2020",
    impact: "Delivered web and mobile banking products and services for 9 countries.",
  },
];

// Old site lists degrees and dates but not the university names.
export const education: Degree[] = [
  { degree: "MS in Computer Science", university: null, year: "2023" },
  { degree: "B.E. in Electronics and Telecommunications", university: null, year: "2018" },
];
