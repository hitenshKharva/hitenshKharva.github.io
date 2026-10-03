// Single source of truth for all copy on the site.
//
// Sources:
// - "Resume Source Doc (Product-Neutral)", supplied by Hitensh in October 2026. This covers
//   identity, Amazon work, roles, skills and education.
// - The previous hitenshkharva.github.io (commit 6de1d7b) for the earlier side projects.
//
// `null` renders as a visible TODO badge. Nothing here is invented; add real values.

export type Category = "ai" | "data" | "backend";

export const CATEGORY_LABEL: Record<Category, string> = {
  ai: "AI/ML",
  data: "Data",
  backend: "Backend",
};

export interface Project {
  id: string;
  name: string;
  /** Short label for the pipeline diagram. */
  short: string;
  /** Terminal `open <name>` alias. */
  slug: string;
  kind: "work" | "side" | "earlier";
  /** e.g. "Amazon · 2025–present". */
  context: string;
  categories: Category[];
  problem?: string | null;
  summary: string | null;
  /** Headline outcomes, shown as chips. */
  impact?: string[];
  /** "How it works" steps. */
  steps: string[] | null;
  /** Trade-offs and judgment calls, shown with the steps. */
  decisions?: string[];
  stack: string[];
  /** `null` = link still to add (TODO). Omitted = no public link (internal work). */
  link?: string | null;
}

export interface Role {
  role: string;
  company: string;
  dates: string;
  impact: string;
  highlights?: string[];
}

export interface Degree {
  degree: string;
  university: string;
  dates: string;
}

export const profile = {
  name: "Hitensh Kharva",
  firstName: "Hitensh",
  lastName: "Kharva",
  role: "Senior Data Engineer",
  company: "Amazon",
  /** Draft positioning line written from the résumé doc. Edit freely. */
  headline: "I build data platforms, and the AI tools that run on them." as string | null,
  subhead:
    "Senior Data Engineer at Amazon Global Logistics, working across data engineering, LLM tooling and the software around them.",
  email: "hkharva3283@gmail.com",
  github: "https://github.com/hitenshKharva",
  githubHandle: "hitenshKharva",
  linkedin: "https://www.linkedin.com/in/hitensh-kharva",
  location: "Seattle, WA",
  /** Upload the PDF to public/resume.pdf. */
  resume: "/resume.pdf",
};

/** Hero proof strip. Every number is from the résumé doc. */
export const proof = [
  { value: "80%", label: "less ticket-analysis time with a RAG tool I built (15 → 3 min)" },
  { value: "13+", label: "teams onboarded self-service to the ingestion platform I own" },
  { value: "5,000+", label: "data-access requests automated in a 500+ table migration" },
  { value: "5–10 min", label: "weekly business review prep, down from 2–4 hours" },
];

/** Bold hero: "I build ..." rotation. */
export const buildPhrases = ["data platforms", "RAG-powered tools", "ETL pipelines", "AI agents for ops"];

/** The three stages: data → AI → engineering. */
export const pillars: { category: Category; title: string; line: string; evidence: string[] }[] = [
  {
    category: "data",
    title: "Data engineering",
    line: "Platforms, models and pipelines that teams trust.",
    evidence: [
      "Own a self-service ingestion platform used by 13+ teams",
      "Sole owner of a 189-column cross-regional inventory model",
      "Migrated 500+ tables with 5,000+ automated access requests",
    ],
  },
  {
    category: "ai",
    title: "AI & agents",
    line: "LLM tools that do real operational work.",
    evidence: [
      "Built the team's first AI operational tool: RAG ticket triage, 80% faster",
      "LLM scraping agents that replaced manual carrier data collection",
      'Internal talk: "Building AI Agents for ETL Automation" (2026)',
    ],
  },
  {
    category: "backend",
    title: "Software engineering",
    line: "Services, automation and the infrastructure under them.",
    evidence: [
      "SDE at AWS: package-manager protocol client and adapter service in Java",
      "Infrastructure as code, serverless and event-driven orchestration",
      "Banking web and mobile products shipped across 9 countries",
    ],
  },
];

export const projects: Project[] = [
  // ---- Selected work (Amazon) ----
  {
    id: "ticket-analyzer",
    name: "RAG-Powered Ticket Analyzer",
    short: "RAG Ticket Analyzer",
    slug: "ticket-analyzer",
    kind: "work",
    context: "Amazon · 2025–present",
    categories: ["ai", "backend"],
    problem: "Engineers spent about 15 minutes per ticket searching runbooks before they could start on a fix.",
    summary:
      "I spotted the problem and built the whole tool without being asked. It was the team's first AI-powered operational tool and is now part of its triage SOP.",
    impact: ["80% less analysis time (15 → 3 min)", "Under 15 s latency", "~78% avg. confidence"],
    steps: [
      "A serverless orchestrator picks up tickets through the ticketing-system API.",
      "Ticket text is matched against a vector knowledge base built from the runbooks.",
      "A large language model drafts an analysis grounded in the retrieved runbooks.",
      "The tool labels, routes and ranks the ticket, then posts the analysis as a comment.",
    ],
    stack: ["Serverless", "LLM", "RAG", "Vector search", "Ticketing API"],
  },
  {
    id: "planning-platform",
    name: "AI Network Planning Data Platform",
    short: "AI Planning Platform",
    slug: "planning-platform",
    kind: "work",
    context: "Amazon · 2026, ongoing",
    categories: ["data", "ai"],
    problem:
      "AI-generated capacity-planning scenarios needed curated, permissioned data across supply-chain domains, and none of it existed in one place.",
    summary:
      "Designed and built the data-platform layer from scratch. Senior engineers reviewed and approved the architecture, which is aligned with the team's future orchestration design.",
    impact: ["20 of 25 curated datasets in production", "Goal: ~3-month planning cycle → ~1 day", "200+ scenarios"],
    steps: [
      "An infrastructure-as-code package provisions the compute accounts and a private network.",
      "An ETL pipeline builds curated datasets across multiple supply-chain domains.",
      "Data-catalog providers publish each dataset with its permissions.",
      "Applications onboard to the catalog and generate planning scenarios from it.",
    ],
    decisions: [
      "Unblocked datasets one at a time through spec, permissioning and provisioning reviews.",
      "Worked across data engineering, applied science, product and partner engineering.",
    ],
    stack: ["Infrastructure as code", "ETL", "Data catalog", "Private networking"],
  },
  {
    id: "inventory-model",
    name: "Cross-Regional Inventory Visibility Model",
    short: "Inventory Visibility",
    slug: "inventory",
    kind: "work",
    context: "Amazon · Nov 2024–present",
    categories: ["data"],
    problem:
      "There was no trusted single view of inventory moving between North America and Europe, so weekly business reviews were assembled by hand.",
    summary:
      "As the sole data engineer, I own the single source of truth: 189 columns from a ~2,200-line SQL transform, mapped across 8+ source systems and 4 organizations.",
    impact: ["Weekly review data: hours → minutes", "3–6 weeks of capacity visibility, new", "8+ data-quality fixes in 2026"],
    steps: [
      "Gathered requirements from 4 organizations.",
      "Mapped every field from source to destination across 8+ systems.",
      "Built and maintain the transform that produces the 189-column model.",
      "Run ongoing data-quality improvements.",
    ],
    decisions: [
      "Redesigned the data granularity mid-project after operations said they didn't trust the numbers. The result earned senior sign-off.",
      "Fixed N×N quantity inflation caused by a join without deduplication.",
      "Proved a milestone issue that had been blocked for 2 months was an internal key-matching gap, not a partner problem, and shipped the fix in 2 days.",
    ],
    stack: ["SQL", "Data modeling", "Cloud data warehouse"],
  },
  {
    id: "ingestion-platform",
    name: "Self-Service Data Ingestion Platform",
    short: "Self-Service Ingestion",
    slug: "ingestion",
    kind: "work",
    context: "Amazon · 2024–present · platform owner",
    categories: ["data", "backend"],
    problem: "Teams needed a self-service way to bring their data onto the platform.",
    summary: "I designed, built and operate it end to end in infrastructure as code, with multiple ingestion paths.",
    impact: ["13+ teams onboarded self-service", "Documented 9-step SOP", "Same-day feature turnaround"],
    steps: [
      "Infrastructure as code defines the platform and each ingestion path.",
      "Teams onboard themselves by following a documented 9-step SOP.",
      "Platform-wide changes, such as publisher attribution, roll out to every onboarded team.",
    ],
    stack: ["Infrastructure as code", "Serverless", "Event-driven orchestration"],
  },
  {
    id: "carrier-agents",
    name: "Automated Carrier Schedule Collection",
    short: "Carrier Schedule Agents",
    slug: "carrier",
    kind: "work",
    context: "Amazon · 2026–present",
    categories: ["ai", "data"],
    problem: "Carrier schedule data was collected entirely by hand.",
    summary:
      "I built an end-to-end pipeline that replaced the manual process. After a live demo to senior leadership, it led to a direct-API integration pilot with an external partner.",
    impact: ["Replaced fully manual collection", "Opened a direct-API partner pilot", "Interest from an adjacent integrations team"],
    steps: [
      "LLM-based web-scraping agents collect carrier schedules.",
      "Raw results land in object storage.",
      "The ingestion platform loads them.",
      "Datasets are published to the data catalog.",
    ],
    decisions: ["Treated scraping as a bridge: the demo drove partner outreach toward structured API access."],
    stack: ["LLM agents", "Object storage", "Ingestion platform", "Data catalog"],
  },
  {
    id: "warehouse-monitoring",
    name: "Warehouse Performance & Ownership Audit",
    short: "Warehouse Monitoring",
    slug: "warehouse",
    kind: "work",
    context: "Amazon · 2025–2026",
    categories: ["data", "backend"],
    problem:
      "Recurring disk and CPU spikes degraded a critical production warehouse, and the team couldn't reliably tell who owned the offending queries.",
    summary:
      "I resolved the incident under time pressure, then built monitoring that moved the team from firefighting to continuous visibility.",
    impact: ["Ownership accuracy ~14% → 98/100", "Proactive 90%-threshold alarms", "Years of usage history kept cheaply"],
    steps: [
      "Root-caused the disk and CPU spikes and added alarms at a 90% threshold.",
      "Moved historical logs to object storage with an external-query layer, replacing expensive cluster storage.",
      "An hourly job detects clients and extracts the offending queries and tables.",
      "Ownership is resolved from query text → resource ID → audit-log identity.",
    ],
    decisions: [
      "Proved the existing pattern-matching approach was ~86% wrong, then re-audited every offender with the ground-truth method.",
    ],
    stack: ["Cloud data warehouse", "Object storage", "Metrics & alarms", "Python"],
  },

  // ---- Side projects ----
  {
    id: "agent-stack",
    name: "Personal AI-Agent Ops Stack",
    short: "AI Agent Stack",
    slug: "agent-stack",
    kind: "side",
    context: "Side project · 2025–2026",
    categories: ["ai", "backend"],
    summary:
      "An always-on agent stack I built and run myself, with a chat-bot interface, scheduled jobs, vector memory, 19+ tool integrations and two-way sync with a notes vault. 2+ teammates now use it.",
    steps: [
      "A chat-bot interface fronts an always-on gateway.",
      "Scheduled jobs and 19+ tool integrations do the work.",
      "Vector memory and two-way note-vault sync keep context between sessions.",
    ],
    decisions: [
      "Fixed a crash loop (an O(N²) session-restore bug) for good by moving the gateway to dedicated infrastructure instead of patching symptoms.",
    ],
    stack: ["LLM agents", "Vector memory", "Cron orchestration", "Tool integrations"],
    link: null,
  },
  // Named in the brief, not yet described anywhere. Categories are guesses from the names.
  {
    id: "agent-desk",
    name: "Agent Desk",
    short: "Agent Desk",
    slug: "agent-desk",
    kind: "side",
    context: "Side project",
    categories: ["ai"],
    summary: null,
    steps: null,
    stack: [],
    link: null,
  },
  {
    id: "oss-pr-pipeline",
    name: "OSS PR pipeline",
    short: "OSS PR pipeline",
    slug: "oss-pr",
    kind: "side",
    context: "Side project",
    categories: ["backend"],
    summary: null,
    steps: null,
    stack: [],
    link: null,
  },
  {
    id: "nutri",
    name: "nutri",
    short: "nutri",
    slug: "nutri",
    kind: "side",
    context: "Side project",
    categories: ["ai"],
    summary: null,
    steps: null,
    stack: [],
    link: null,
  },
  {
    id: "conviction-ledger",
    name: "Conviction Ledger",
    short: "Conviction Ledger",
    slug: "conviction-ledger",
    kind: "side",
    context: "Side project",
    categories: ["data"],
    summary: null,
    steps: null,
    stack: [],
    link: null,
  },

  // ---- Earlier projects (from the previous site's project pages) ----
  {
    id: "reddit-elt",
    name: "Reddit Cloud Batch ELT",
    short: "Reddit ELT",
    slug: "reddit",
    kind: "earlier",
    context: "Earlier project",
    categories: ["data"],
    summary:
      "An end-to-end pipeline that pulls 10,000+ posts a day from the Reddit API, models them with dbt and loads them into S3 and Redshift, orchestrated by Airflow in Docker.",
    steps: null,
    stack: ["Python", "Airflow", "Docker", "S3", "Redshift", "dbt"],
    link: "https://github.com/hitenshKharva/Reddit-Cloud-Batch-ELT",
  },
  {
    id: "f1-azure",
    name: "F1 Data Analysis with Azure",
    short: "F1 on Azure",
    slug: "f1",
    kind: "earlier",
    context: "Earlier project",
    categories: ["data"],
    summary:
      "Formula 1 data from 1950 onward, processed in Azure Databricks with PySpark and Spark SQL, scheduled with Data Factory and later moved to a Delta Lakehouse for GDPR compliance and time travel.",
    steps: null,
    stack: ["Databricks", "PySpark", "Delta Lake", "ADLS", "Data Factory"],
    link: "https://github.com/hitenshKharva/F1-Data-Analysis-with-Azure",
  },
  {
    id: "motogp",
    name: "MotoGP Race Analytics",
    short: "MotoGP Analytics",
    slug: "motogp",
    kind: "earlier",
    context: "Earlier project",
    categories: ["data"],
    summary:
      "Scraped MotoGP race results into S3 and Redshift, modeled them with dbt and built a Looker dashboard of top riders, teams and manufacturers by country and circuit.",
    steps: null,
    stack: ["Python", "S3", "Redshift", "dbt", "Looker"],
  },
  {
    id: "stackoverflow",
    name: "Stack Overflow Expert Recommendation",
    short: "Stack Overflow",
    slug: "stackoverflow",
    kind: "earlier",
    context: "Earlier project",
    categories: ["ai", "data"],
    summary:
      "K-means clustering over 260,000+ Stack Exchange users to find the top 5% of experts per domain and route questions to them.",
    steps: null,
    stack: ["Python", "PySpark", "scikit-learn", "Pandas"],
  },
  {
    id: "ecommerce",
    name: "E-Commerce Data Engineering",
    short: "E-Commerce ETL",
    slug: "ecommerce",
    kind: "earlier",
    context: "Earlier project",
    categories: ["data"],
    summary:
      "A Glue (PySpark) ETL job staging 400K rows through S3 and Athena into Redshift, with Tableau reports on top.",
    steps: null,
    stack: ["PySpark", "Glue", "Athena", "Redshift", "Tableau"],
  },
];

export const experience: Role[] = [
  {
    role: "Data Engineer → Senior Data Engineer (2026)",
    company: "Amazon · Global Logistics",
    dates: "2024 – Present",
    impact:
      "Own the team's self-service ingestion platform and cross-regional inventory model, and built its first AI-powered operational tool.",
    highlights: [
      "Weekly business review automation: 135 slides across 3 leadership decks, prep cut from 2–4 hours to 5–10 minutes.",
      "Data-access migration: 5,000+ access requests automated and 500+ tables migrated; other teams later adopted the scripts.",
      "BI usage analytics from vended logs, shipped in both phases in one week.",
      "Promoted to Senior Data Engineer in 2026. Mentor to 3 engineers.",
    ],
  },
  {
    role: "Software Development Engineer",
    company: "Amazon Web Services",
    dates: "Dec 2023 – Jul 2024",
    impact:
      "Built a Java client for a package-manager protocol, plus an adapter service that translates package-manager requests into backend service calls.",
  },
  {
    role: "Data Developer",
    company: "Wind River Systems",
    dates: "Jun 2023 – Dec 2023",
    impact:
      "Data-validation pre-commit hooks in CI/CD cut data-model review time by 25% and raised documentation accuracy by 30%.",
  },
  {
    role: "Data Developer Intern",
    company: "Wind River Systems",
    dates: "May 2022 – Mar 2023",
    impact: "Built models to scan, tag and mask PII in warehouse schemas; CI/CD autoscaling and config linting cut development time by 40%.",
  },
  {
    role: "Backend Python Engineer",
    company: "Bloomstack Technology",
    dates: "Nov 2020 – May 2021",
    impact: "Built a pipeline for 200+ data points a day from an external REST API, and auto-refreshing dashboards that saved 2 hours a day.",
  },
  {
    role: "Software Engineer",
    company: "Larsen & Toubro Infotech",
    dates: "Jul 2018 – Oct 2020",
    impact: "Delivered banking web and mobile products across 9 countries; Python test automation raised team efficiency by 20%.",
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "SQL", "TypeScript / JavaScript", "Java"] },
  {
    group: "Data engineering",
    items: ["ETL / ELT", "Data modeling", "dbt", "PySpark / Spark SQL", "Workflow orchestration", "Streaming", "CI/CD"],
  },
  { group: "AI / ML", items: ["LLMs", "RAG", "Vector search", "Agent frameworks", "Tool-integration protocols"] },
  {
    group: "Cloud & infra",
    items: ["Infrastructure as code", "Serverless", "Event-driven orchestration", "Object storage", "Message queues", "Containers"],
  },
  { group: "Databases", items: ["PostgreSQL", "MySQL", "Cassandra", "MongoDB", "Cloud data warehouses"] },
  { group: "BI", items: ["Looker", "Tableau", "BI dashboards"] },
];

/** Flat list for the terminal's `stack` command. */
export const stack = skills.flatMap((s) => s.items);

export const education: Degree[] = [
  { degree: "MS, Computer Science", university: "San Diego State University", dates: "2021 – 2023" },
  {
    degree: "BE, Electronics & Telecommunication Engineering",
    university: "University of Mumbai (SPIT)",
    dates: "2014 – 2018",
  },
];

export const certifications: { name: string; link?: string }[] = [
  { name: "Cloud Data Engineer Associate" },
  {
    name: "Algorithms Specialization (Stanford, Coursera)",
    link: "https://www.coursera.org/account/accomplishments/specialization/788VTXK6GBAQ",
  },
  {
    name: "Data Engineering Professional Certificate (Coursera)",
    link: "https://www.coursera.org/account/accomplishments/professional-cert/6578B2HCR8FD",
  },
];
