// All personal content for the site. Components only read from here.
//
// Sources: Hitensh's résumé source doc (product-neutral) and the previous site's project
// pages. Nothing is invented; anything not yet provided is marked TODO or left out.

export type Family = "languages" | "data" | "backend" | "databases" | "cloud" | "ai";

export const families: { id: Family; label: string }[] = [
  { id: "languages", label: "Languages" },
  { id: "data", label: "Data & Streaming" },
  { id: "backend", label: "Backend" },
  { id: "databases", label: "Databases" },
  { id: "cloud", label: "Cloud & DevOps" },
  { id: "ai", label: "AI / ML" },
];

export const profile = {
  name: "Hitensh Kharva",
  firstName: "Hitensh",
  lastName: "Kharva",
  role: "Data Engineer II",
  company: "Amazon",
  team: "Global Logistics",
  location: "Seattle, WA",
  /** Hero: a role line for recruiters' keyword scan, then the hook (accent in italic serif). */
  roleLine: "Software · Data · AI engineer",
  headline: { lead: "Data in.", accent: "Decisions out." },
  tagline: "I build the platforms data flows through, and the AI that puts it to work.",
  email: "hkharva3283@gmail.com",
  resume: "/resume.pdf",
  /** Avatar video / photo: drop files in public/avatar and public/photo, then set these. */
  avatar: { webm: null as string | null, mp4: null as string | null, poster: null as string | null },
  photo: "/photo/hitensh.webp" as string | null,
};

/**
 * Hero animation: short labels for the "raw events" stream (one to four words each, so they
 * read at a glance). Skills and certifications are added automatically from their lists
 * further down (see `rawEvents` at the end of the file). Facts only.
 */
const milestoneEvents: string[] = [
  // Education
  "BE · SPIT Mumbai",
  "MS CS · SDSU",
  // Career
  "LTI · Software Engineer",
  "Bloomstack · Backend",
  "Wind River · Data Intern",
  "Wind River · Data Dev",
  "AWS · SDE",
  "Amazon · Data Engineer",
  "Data Engineer II",
  // Highlights
  "Banking apps · 9 countries",
  "13+ teams onboarded",
  "5,000+ requests automated",
  "Triage: 15 → 3 min",
  "Talk · AI agents for ETL",
  "Mentor × 3",
  // Moves
  "Pune → San Diego",
  "San Diego → Seattle",
  // Projects
  "RAG ticket analyzer",
  "Ingestion platform",
  "Reddit ELT",
  "F1 on Databricks",
  "Stack Overflow experts",
  "MotoGP analytics",
  // Life: add personal moments here (cities, hobbies, milestones). Keep them short.
];

/** First full-time role (LTI, July 2018). The hero output "engineer vN.0" counts whole years from here. */
export const careerStart = new Date(2018, 6, 1);

export function yearsShipping(now = new Date()) {
  let years = now.getFullYear() - careerStart.getFullYear();
  if (now < new Date(now.getFullYear(), careerStart.getMonth(), careerStart.getDate())) years -= 1;
  return years;
}

export const heroOutput = { tags: "data · AI · software" };

export const links = {
  github: "https://github.com/hitenshKharva",
  githubHandle: "hitenshKharva",
  linkedin: "https://www.linkedin.com/in/hitensh-kharva",
};

export const about = {
  /** Draft bio written from the résumé doc; edit freely. */
  bio: [
    "I'm a Data Engineer II at Amazon Global Logistics. I own a self-service ingestion platform used by 13+ teams and the cross-regional inventory model that weekly business reviews run on.",
    "I started out shipping banking software, moved through backend Python and data at Wind River, and spent time as an SDE at AWS. These days I also build the AI tools that put the data to work, like the team's first RAG-powered ticket analyzer.",
  ],
  quote: "From raw events to real decisions.",
};

export const quickFacts: { label: string; value: string }[] = [
  { label: "Based in", value: "Seattle, WA" },
  { label: "Role", value: "Data Engineer II · Amazon" },
  { label: "Studied", value: "MS CS · San Diego State" },
  { label: "Previously", value: "AWS · Wind River" },
  { label: "Focus", value: "Data platforms · AI tools" },
];

export interface Skill {
  number: number;
  symbol: string;
  name: string;
  family: Family;
  /** Simple Icons slug for the logo, when one exists. */
  icon?: string;
  /** One line on how I've used it. */
  note: string;
}

export const skills: Skill[] = [
  { number: 1, symbol: "Py", name: "Python", family: "languages", icon: "python", note: "My main language for pipelines and automation, for 7+ years." },
  { number: 2, symbol: "Sq", name: "SQL", family: "languages", note: "Daily driver, including a ~2,200-line transform behind a 189-column model." },
  { number: 3, symbol: "Ts", name: "TypeScript", family: "languages", icon: "typescript", note: "Part of my core stack at Amazon; 3+ years with JS/TS." },
  { number: 4, symbol: "Jv", name: "Java", family: "languages", icon: "openjdk", note: "Package-manager protocol client and adapter service at AWS." },
  { number: 5, symbol: "Sp", name: "PySpark", family: "data", icon: "apachespark", note: "Big-data ETL at work, and Databricks for the F1 project." },
  { number: 6, symbol: "Db", name: "dbt", family: "data", note: "Staging-to-marts models and CI checks at Wind River." },
  { number: 7, symbol: "Af", name: "Airflow", family: "data", icon: "apacheairflow", note: "Orchestrated the Reddit batch ELT pipeline." },
  { number: 8, symbol: "Kf", name: "Kafka", family: "data", icon: "apachekafka", note: "Part of the MotoGP race analytics project." },
  { number: 9, symbol: "Ft", name: "Fivetran", family: "data", note: "Connectors moving survey and social data into the warehouse." },
  { number: 10, symbol: "Lk", name: "Looker", family: "data", icon: "looker", note: "Dashboards and automated LookML validation at Wind River." },
  { number: 11, symbol: "Ra", name: "REST APIs", family: "backend", note: "Pipelines from external APIs, 200+ data points a day at Bloomstack." },
  { number: 12, symbol: "Dj", name: "Django", family: "backend", icon: "django", note: "Backend systems at Bloomstack and LTI." },
  { number: 13, symbol: "Ev", name: "Event-driven", family: "backend", note: "Event-driven orchestration behind my platforms at Amazon." },
  { number: 14, symbol: "Sf", name: "Snowflake", family: "databases", icon: "snowflake", note: "Warehouse for dbt models and PII masking at Wind River." },
  { number: 15, symbol: "Pg", name: "PostgreSQL", family: "databases", icon: "postgresql", note: "Relational store in backend work at Bloomstack." },
  { number: 16, symbol: "My", name: "MySQL", family: "databases", icon: "mysql", note: "Backend and ETL work at LTI and Bloomstack." },
  { number: 17, symbol: "Cs", name: "Cassandra", family: "databases", icon: "apachecassandra", note: "NoSQL databases are part of my stack at Amazon." },
  { number: 18, symbol: "Mg", name: "MongoDB", family: "databases", icon: "mongodb", note: "NoSQL work at LTI." },
  { number: 19, symbol: "Rs", name: "Redshift", family: "databases", note: "Warehouse for the Reddit, MotoGP and e-commerce projects." },
  { number: 20, symbol: "Ic", name: "IaC", family: "cloud", note: "The ingestion platform I own is built and run as code." },
  { number: 21, symbol: "Sv", name: "Serverless", family: "cloud", note: "The orchestrator behind the RAG ticket analyzer." },
  { number: 22, symbol: "Dk", name: "Docker", family: "cloud", icon: "docker", note: "Packaged the Reddit ELT pipeline with Airflow." },
  { number: 23, symbol: "Gh", name: "GitHub CI", family: "cloud", icon: "githubactions", note: "CI pipelines and pre-commit checks for data models." },
  { number: 24, symbol: "Ll", name: "LLMs", family: "ai", note: "Ticket analysis and web-scraping agents in production." },
  { number: 25, symbol: "Rg", name: "RAG", family: "ai", note: "Runbook retrieval that cut ticket triage from 15 to 3 minutes." },
  { number: 26, symbol: "Vs", name: "Vector search", family: "ai", note: "The knowledge base behind the ticket analyzer." },
  { number: 27, symbol: "Ag", name: "Agents", family: "ai", note: "Carrier-schedule agents at work and my own agent stack." },
  { number: 28, symbol: "Km", name: "K-means", family: "ai", note: "Expert clustering in the Stack Overflow project." },
];

export type Illustration = "rag" | "dag" | "heatmap" | "dashboard" | "stream" | "lakehouse";

export interface Project {
  id: string;
  title: string;
  /** Mono eyebrow: domain · technique. */
  eyebrow: string;
  context: string;
  description: string;
  bullets: string[];
  tech: string[];
  github?: string;
  illustration: Illustration;
}

export const projects: Project[] = [
  {
    id: "ticket-analyzer",
    title: "RAG-Powered Ticket Analyzer",
    eyebrow: "AI ops · RAG",
    context: "Amazon · 2025–present",
    description:
      "Engineers spent about 15 minutes per ticket searching runbooks. I spotted the problem and built the whole tool without being asked; it's now part of the team's triage SOP.",
    bullets: [
      "80% less analysis time (15 → 3 min)",
      "Under 15 s latency, ~78% average confidence",
      "Labels, routes, ranks and comments automatically",
      "The team's first AI-powered operational tool",
    ],
    tech: ["Serverless", "LLM", "RAG", "Vector search"],
    illustration: "rag",
  },
  {
    id: "ingestion-platform",
    title: "Self-Service Ingestion Platform",
    eyebrow: "Data platform · IaC",
    context: "Amazon · 2024–present · owner",
    description:
      "A platform any team can use to bring its own data in. I designed, built and operate it end to end in infrastructure as code, with multiple ingestion paths.",
    bullets: [
      "13+ teams onboarded self-service",
      "Documented 9-step onboarding SOP",
      "Platform-wide changes rolled out to every team",
      "Same-day feature turnaround for consumers",
    ],
    tech: ["IaC", "Serverless", "Event-driven"],
    illustration: "dag",
  },
  {
    id: "warehouse-monitoring",
    title: "Warehouse Performance & Ownership Audit",
    eyebrow: "Observability · Monitoring",
    context: "Amazon · 2025–2026",
    description:
      "Recurring disk and CPU spikes were degrading a critical production warehouse. I root-caused the incident, then built monitoring that moved the team from firefighting to continuous visibility.",
    bullets: [
      "Ownership accuracy from ~14% to 98/100",
      "Proactive alarms at a 90% threshold",
      "Hourly job extracts offending queries and tables",
      "Years of usage history kept in cheap storage",
    ],
    tech: ["Cloud warehouse", "Object storage", "Alarms", "Python"],
    illustration: "heatmap",
  },
  {
    id: "inventory-model",
    title: "Cross-Regional Inventory Visibility Model",
    eyebrow: "Data modeling · SQL",
    context: "Amazon · Nov 2024–present",
    description:
      "The single source of truth for inventory moving between North America and Europe. As the sole data engineer, I own it from requirements across 4 organizations to ongoing data quality.",
    bullets: [
      "189 columns, mapped across 8+ source systems",
      "Weekly review data from hours to minutes",
      "3–6 weeks of capacity visibility that didn't exist",
      "Redesigned granularity to win back trust",
    ],
    tech: ["SQL", "Data modeling", "Cloud warehouse"],
    illustration: "dashboard",
  },
  {
    id: "reddit-elt",
    title: "Reddit Cloud Batch ELT",
    eyebrow: "Batch ELT · Airflow",
    context: "Side project",
    description:
      "An end-to-end pipeline that extracts posts from the Reddit API, transforms them with dbt and loads them into S3 and Redshift.",
    bullets: [
      "10,000+ posts processed per 24 hours",
      "~500 posts a minute on average",
      "Airflow + Docker orchestration",
      "dbt models ready for analysis",
    ],
    tech: ["Python", "Airflow", "Docker", "S3", "Redshift", "dbt"],
    github: "https://github.com/hitenshKharva/Reddit-Cloud-Batch-ELT",
    illustration: "stream",
  },
  {
    id: "f1-azure",
    title: "F1 Data Analysis on Azure",
    eyebrow: "Lakehouse · Spark",
    context: "Side project",
    description:
      "Formula 1 data from 1950 onward, processed in Azure Databricks with PySpark and Spark SQL, then moved to a Delta Lakehouse for GDPR compliance and time travel.",
    bullets: [
      "Raw → processed → presentation layers",
      "Columnar Parquet storage in ADLS",
      "Scheduled and monitored with Data Factory",
      "Delta Lake for time travel",
    ],
    tech: ["Databricks", "PySpark", "Delta Lake", "Data Factory"],
    github: "https://github.com/hitenshKharva/F1-Data-Analysis-with-Azure",
    illustration: "lakehouse",
  },
];

export const certifications: { name: string; issuer: string; link?: string; /** Hero label */ short: string }[] = [
  {
    name: "Azure Data Engineer Associate",
    issuer: "Microsoft",
    short: "Azure Data Engineer",
    link: "https://learn.microsoft.com/en-us/users/hitenshkharva-6801/credentials/19f41e24f75c4415",
  },
  {
    name: "Algorithms Specialization",
    short: "Stanford Algorithms",
    issuer: "Stanford · Coursera",
    link: "https://www.coursera.org/account/accomplishments/specialization/788VTXK6GBAQ",
  },
  {
    name: "Data Engineering Professional Certificate",
    short: "Data Eng. Pro cert",
    issuer: "Coursera",
    link: "https://www.coursera.org/account/accomplishments/professional-cert/6578B2HCR8FD",
  },
];

export interface TimelineEntry {
  year: string;
  kind: "education" | "experience";
  dates: string;
  title: string;
  org: string;
  bullets: string[];
  tags: string[];
}

/** Newest first. */
export const timeline: TimelineEntry[] = [
  {
    year: "2026",
    kind: "experience",
    dates: "Jul 2026 – Present",
    title: "Data Engineer II",
    org: "Amazon · Global Logistics · Seattle",
    bullets: [
      "Promoted from Data Engineer in July 2026.",
      "Mentor 3 engineers; gave the talk “Building AI Agents for ETL Automation”.",
    ],
    tags: ["LLMs", "Agents", "PySpark"],
  },
  {
    year: "2024",
    kind: "experience",
    dates: "Jul 2024 – Jul 2026",
    title: "Data Engineer",
    org: "Amazon · Global Logistics · Seattle",
    bullets: [
      "Own the self-service ingestion platform (13+ teams) and the cross-regional inventory model.",
      "Built the team's first AI operational tool, a RAG ticket analyzer, in 2025.",
    ],
    tags: ["PySpark", "SQL", "IaC"],
  },
  {
    year: "2023",
    kind: "experience",
    dates: "Dec 2023 – Jul 2024",
    title: "Software Development Engineer",
    org: "Amazon Web Services · Seattle",
    bullets: ["Java client for a package-manager protocol, with integration and load tests.", "Adapter service translating package-manager requests into backend calls."],
    tags: ["Java", "React", "IaC"],
  },
  {
    year: "2023",
    kind: "experience",
    dates: "Jun 2023 – Dec 2023",
    title: "Data Developer",
    org: "Wind River Systems · San Diego",
    bullets: ["Validation hooks in CI/CD cut data-model review time by 25%.", "CI that re-runs only the BI tiles a model change affects."],
    tags: ["dbt", "Fivetran", "CI/CD"],
  },
  {
    year: "2022",
    kind: "experience",
    dates: "May 2022 – Mar 2023",
    title: "Data Developer Intern",
    org: "Wind River Systems · San Diego",
    bullets: ["Models to scan, tag and mask PII in warehouse schemas.", "CI/CD autoscaling and config linting cut development time by 40%."],
    tags: ["dbt", "Snowflake", "Looker"],
  },
  {
    year: "2021",
    kind: "education",
    dates: "2021 – 2023",
    title: "MS, Computer Science",
    org: "San Diego State University",
    bullets: [],
    tags: ["Big data", "Algorithms", "Machine learning"],
  },
  {
    year: "2020",
    kind: "experience",
    dates: "Nov 2020 – May 2021",
    title: "Backend Python Engineer",
    org: "Bloomstack Technology · Mumbai",
    bullets: ["Built a pipeline for 200+ data points a day from an external REST API.", "Auto-refreshing dashboards saved 2 hours a day."],
    tags: ["Python", "PostgreSQL", "REST"],
  },
  {
    year: "2018",
    kind: "experience",
    dates: "Jul 2018 – Oct 2020",
    title: "Software Engineer",
    org: "Larsen & Toubro Infotech · Pune",
    bullets: ["Delivered banking web and mobile products across 9 countries.", "Python test automation raised team efficiency by 20%."],
    tags: ["Python", "JavaScript", "MySQL"],
  },
  {
    year: "2014",
    kind: "education",
    dates: "2014 – 2018",
    title: "BE, Electronics & Telecommunication",
    org: "University of Mumbai (SPIT)",
    bullets: [],
    tags: ["Data structures", "OOP", "Operating systems"],
  },
];

export interface Achievement {
  /** Counted up when visible. Omit and use `display` for rank-style cards. */
  value?: number;
  display?: string;
  prefix?: string;
  suffix?: string;
  label: string;
  line: string;
}

/** Impact numbers from the résumé doc. Add coding-platform stats here if you want them. */
export const achievements: Achievement[] = [
  { value: 80, suffix: "%", label: "Faster ticket triage", line: "15 → 3 minutes with the RAG analyzer I built." },
  { value: 13, suffix: "+", label: "Teams self-onboarded", line: "On the ingestion platform I own." },
  { value: 5000, suffix: "+", label: "Access requests automated", line: "During a 500+ table migration." },
  { value: 135, label: "Slides automated", line: "Weekly review prep from 2–4 hours to 5–10 minutes." },
  { display: "1st", label: "AI ops tool on the team", line: "The RAG ticket analyzer, now part of the triage SOP." },
];

/**
 * Everything the hero's dots can carry: milestones, every skill and every certification. Each dot shows one of these on hover/tap and when it enters the core.
 */
export const rawEvents: string[] = [
  ...milestoneEvents,
  ...skills.map((s) => s.name),
  ...certifications.map((c) => c.short),
];
