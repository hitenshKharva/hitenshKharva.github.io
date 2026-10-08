// All personal content for the site. Components only read from here.
//
// Sources: Hitensh's résumé (Kharva_Hitensh_Resume.pdf), his public-safe project case studies
// (Portfolio-Projects.md) and the previous site's project pages. Nothing is invented; anything not yet provided is marked TODO or left out.

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
  "Amazon · Data Engineer I",
  "Data Engineer II",
  // Highlights
  "Banking apps · 9 countries",
  "13+ teams onboarded",
  "Access automation",
  "Triage: 15 → 3 min",
  "Attribution: 14% → 98%",
  "0 failures, no human",
  "Reports: hours → minutes",
  "Talk · AI agents for ETL",
  "Mentor × 3",
  // Moves
  "Pune → San Diego",
  "San Diego → Seattle",
  // Projects
  "Congestion agent",
  "AI planning data platform",
  "Ruby on CodeArtifact",
  "RAG triage assistant",
  "Ingestion platform",
  "Multi-agent platform",
  "Carrier EDI pattern",
  "Reddit ELT",
  "F1 on Databricks",
  "E-commerce on AWS",
  // Life
  "Ping pong",
  "Gaming",
  "Chess",
  "Football",
  "Reading",
  "Devil's Circuit finisher",
];

/** First full-time role (LTI, July 2018). The hero output "engineer vN.0" counts whole years from here. */
export const careerStart = new Date(2018, 6, 1);

export function yearsShipping(now = new Date()) {
  let years = now.getFullYear() - careerStart.getFullYear();
  if (now < new Date(now.getFullYear(), careerStart.getMonth(), careerStart.getDate())) years -= 1;
  return years;
}

export const heroOutput = { tags: "Data · AI · Software" };

export const links = {
  github: "https://github.com/hitenshKharva",
  githubHandle: "hitenshKharva",
  linkedin: "https://www.linkedin.com/in/hitensh-kharva",
};

export const about = {
  /** Draft bio written from the résumé doc; edit freely. */
  bio: [
    "I'm a Data Engineer II at Amazon. I build the data platforms that planning and operations run on, and the AI agents that act on that data safely in production.",
    "Recently I shipped an LLM agent that clears data-warehouse congestion with no human in the loop, built the curated data foundation behind an AI planning agent, co-built a multi-agent support platform, and created my team's first AI operational tool, a RAG triage assistant that cut on-call analysis time by 80%. The self-service ingestion platform I built and own is used by 13+ teams.",
    "In eight years across the stack, I've shipped banking software at LTI, backend Python services at Bloomstack, data pipelines at Wind River, and Ruby support for AWS CodeArtifact as an SDE at AWS. I do my best work on problems where the hard part is finding the real cause, and the fix has to be safe enough to run unattended.",
  ],
  quote: "From raw events to real decisions.",
};

export const quickFacts: { label: string; value: string }[] = [
  { label: "Based in", value: "Seattle, WA" },
  { label: "Role", value: "Data Engineer II · Amazon" },
  { label: "Studied", value: "MS CS · San Diego State" },
  { label: "Previously", value: "AWS CodeArtifact · Wind River" },
  { label: "Focus", value: "Data platforms · AI agents" },
  { label: "Off the clock", value: "Ping pong · chess · football" },
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
  { number: 2, symbol: "Sq", name: "SQL", family: "languages", note: "Daily driver, including untangling and modularizing 2,000+ line transforms." },
  { number: 3, symbol: "Ts", name: "TypeScript", family: "languages", icon: "typescript", note: "Part of my core stack at Amazon; 3+ years with JS/TS." },
  { number: 4, symbol: "Jv", name: "Java", family: "languages", icon: "openjdk", note: "RubyGems adapter service and client library for AWS CodeArtifact." },
  { number: 5, symbol: "Sp", name: "PySpark", family: "data", icon: "apachespark", note: "Big-data ETL at work, and Databricks for the F1 project." },
  { number: 6, symbol: "Db", name: "dbt", family: "data", note: "Staging-to-marts models and CI checks at Wind River." },
  { number: 7, symbol: "Af", name: "Airflow", family: "data", icon: "apacheairflow", note: "MWAA DAGs of modular Spark jobs at work; the Reddit ELT pipeline at home." },
  { number: 8, symbol: "Ib", name: "Iceberg", family: "data", note: "Idempotent merges and a stage-by-stage checkpoint tool for large transforms." },
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
  { number: 19, symbol: "Rs", name: "Redshift", family: "databases", note: "Shared warehouse I keep healthy at work; Reddit and e-commerce pipelines." },
  { number: 20, symbol: "Ic", name: "IaC", family: "cloud", note: "The ingestion platform I own is built and run as code." },
  { number: 21, symbol: "Sv", name: "Serverless", family: "cloud", note: "The orchestrator behind the RAG ticket analyzer." },
  { number: 22, symbol: "Dk", name: "Docker", family: "cloud", icon: "docker", note: "Packaged the Reddit ELT pipeline with Airflow." },
  { number: 23, symbol: "Gh", name: "GitHub CI", family: "cloud", icon: "githubactions", note: "CI pipelines and pre-commit checks for data models." },
  { number: 24, symbol: "Ll", name: "LLMs", family: "ai", note: "Ticket triage and data-support agents in production." },
  { number: 25, symbol: "Rg", name: "RAG", family: "ai", note: "Runbook retrieval that cut ticket triage from 15 to 3 minutes." },
  { number: 26, symbol: "Vs", name: "Vector search", family: "ai", note: "The knowledge base behind the ticket analyzer." },
  { number: 27, symbol: "Ag", name: "Agents", family: "ai", note: "An LLM agent that clears warehouse congestion on its own, and a multi-agent support platform." },
  { number: 28, symbol: "Mc", name: "MCP", family: "ai", icon: "modelcontextprotocol", note: "Serves curated datasets to an AI planning agent." },
];

export type Illustration = "queue" | "agents" | "catalog" | "rag" | "gem" | "dashboard" | "dag";

export interface Project {
  id: string;
  title: string;
  /** Shorter title for the collapsed accordion panel. */
  short: string;
  /** Mono eyebrow: domain · technique. */
  eyebrow: string;
  context: string;
  description: string;
  bullets: string[];
  tech: string[];
  github?: string;
  illustration: Illustration;
}

/**
 * Featured work (the accordion). Public-safe versions of the case studies: the problem, the
 * hard part, the decision and the result, with the employer's internals kept general.
 */
export const projects: Project[] = [
  {
    id: "congestion-agent",
    title: "Autonomous Congestion Agent",
    short: "Congestion Agent",
    eyebrow: "AI agents · Guardrails",
    context: "Amazon · 2026",
    description:
      "A shared data warehouse kept seizing up, with waits past 10 minutes. I traced it to BI dashboard refreshes and built an LLM agent that clears congestion on its own, behind a database guardrail that can never touch production ETL.",
    bullets: [
      "First live incident: 3 cancels, 0 failures, no human",
      "Query-owner attribution from ~14% to 98%",
      "Guardrail in the database, not the prompt",
      "Shadow mode to fully autonomous in ~6 weeks",
    ],
    tech: ["Python", "Bedrock AgentCore", "Step Functions", "Lambda", "Redshift"],
    illustration: "queue",
  },
  {
    id: "multi-agent-platform",
    title: "Multi-Agent Support Platform",
    short: "Multi-Agent Platform",
    eyebrow: "AI agents · Multi-agent",
    context: "Amazon · 2026 · co-built",
    description:
      "A data team was answering the same questions by hand, most of them about freshness, schemas or deprecated tables. We built a production multi-agent assistant that answers them and automates routine tickets behind deterministic safety gates.",
    bullets: [
      "In production since May 2026",
      "Router + data-quality, support, analysis agents",
      "First ticket workflow fully automated",
      "Mine: deploy pipeline, congestion workflow",
    ],
    tech: ["Bedrock AgentCore", "Strands Agents", "Step Functions", "EventBridge", "MCP"],
    illustration: "agents",
  },
  {
    id: "planning-data-platform",
    title: "Data Platform for an AI Planning Agent",
    short: "AI Planning Data",
    eyebrow: "Data platform · MCP",
    context: "Amazon · 2026",
    description:
      "An AI planning agent was running on hand-refreshed spreadsheets. I built its data foundation from scratch and moved the agent onto it, which surfaced jobs that reported success while their data had been frozen for months.",
    bullets: [
      "Governed datasets built from scratch, refreshed weekly",
      "Served to the agent over MCP",
      "Silently stale transforms found and fixed",
      "Freshness checks, not just job status",
    ],
    tech: ["Spark SQL", "CDK", "Glue", "Lake Formation", "S3", "MCP"],
    illustration: "catalog",
  },
  {
    id: "rag-triage",
    title: "RAG Ticket-Triage Assistant",
    short: "RAG Triage",
    eyebrow: "AI ops · RAG",
    context: "Amazon · 2025–present",
    description:
      "On-call engineers spent about 15 minutes per ticket digging through runbooks. Nobody asked me to, but I built an assistant that reads each new ticket and posts ranked fixes from runbooks and past tickets. It became the team's standard triage step.",
    bullets: [
      "80% less analysis time (15 → 3 min)",
      "Ranked fixes in under 15 seconds",
      "Posts in the ticket itself, where engineers work",
      "The team's first AI operational tool",
    ],
    tech: ["Python", "Lambda", "Bedrock (Claude)", "OpenSearch Serverless"],
    illustration: "rag",
  },
  {
    id: "codeartifact-ruby",
    title: "Ruby Support for AWS CodeArtifact",
    short: "Ruby on CodeArtifact",
    eyebrow: "AWS service · Java",
    context: "AWS · Dec 2023 – Jul 2024",
    description:
      "AWS CodeArtifact had no Ruby support. On the team that built and launched it, I implemented the gem upload and download paths of the service that speaks the RubyGems protocol, built its client library from scratch, and wrote the tests that gated every deployment.",
    bullets: [
      "Launched to AWS customers in April 2024",
      "Supports gem push, install and Bundler",
      "Client library with 7 typed error classes",
      "Billing, audit and canary tests gating deploys",
    ],
    tech: ["Java", "Guice", "ECS", "DynamoDB", "TestNG"],
    illustration: "gem",
  },
  {
    id: "cross-border-pipelines",
    title: "Cross-Border Logistics Data Pipelines",
    short: "Cross-Border Pipelines",
    eyebrow: "Data modeling · Airflow",
    context: "Amazon · Nov 2024 – present · lead",
    description:
      "A new cross-border logistics business needed one trusted view of inventory moving between North America and Europe. I led its data engineering end to end, from EU and US requirements to the model and the pipelines.",
    bullets: [
      "189-column model across 8+ source systems",
      "Monolithic SQL rebuilt as Airflow DAGs of Spark jobs",
      "Checkpoint tool found 4 defects, incl. 46% inflation",
      "3–6 weeks of forward capacity visibility",
    ],
    tech: ["Spark SQL", "Airflow (MWAA)", "Iceberg", "Glue", "Redshift"],
    illustration: "dashboard",
  },
  {
    id: "ingestion-platform",
    title: "Self-Service Ingestion Platform",
    short: "Ingestion Platform",
    eyebrow: "Data platform · IaC",
    context: "Amazon · 2024–present · owner",
    description:
      "Every team that needed data in the governed lake was building one-off pipelines or waiting on someone else. I built a multi-tenant platform in infrastructure as code and run it as a product.",
    bullets: [
      "13+ teams onboarded themselves",
      "Two processing back ends: Spark and SQL-ETL",
      "9-step self-service onboarding SOP",
      "Changes roll out to every tenant at once",
    ],
    tech: ["CDK", "Lambda", "S3", "Spark"],
    illustration: "dag",
  },
];

/** More professional work, one card each. */
export const moreWork: { title: string; context: string; line: string }[] = [
  {
    title: "Warehouse performance recovery",
    context: "Amazon · 2025–2026",
    line: "Root-caused recurring disk and CPU saturation, then added alarms, an hourly workload monitor and cheap long-term query logs.",
  },
  {
    title: "Business-review automation",
    context: "Amazon · 2026",
    line: "Weekly business reports moved from manual decks to automated, data-driven reports; prep from 2–4 hours to 5–10 minutes.",
  },
  {
    title: "Config-driven carrier API service",
    context: "Amazon · 2026 · in progress",
    line: "Leading the rollout of DCSA-standard schedule ingestion, where a new carrier is one configuration entry.",
  },
  {
    title: "Carrier EDI ingestion pattern",
    context: "Amazon · 2026 · collaborated",
    line: "Turns carriers' EDI booking feeds into governed data-lake tables. Adding a carrier is one small processor, not a new pipeline; the first went live in June 2026.",
  },
  {
    title: "Access automation",
    context: "Amazon · 2024–2025",
    line: "5,000+ access requests generated for a large warehouse migration; other teams adopted the scripts on their own.",
  },
];

/** Side projects with public code. */
export const sideProjects: { title: string; line: string; tech: string[]; github: string }[] = [
  {
    title: "Reddit Cloud Batch ELT",
    line: "Reddit API → S3 → Redshift → dbt → Looker Studio, orchestrated by Airflow in Docker and provisioned with Terraform. 10K+ posts a day.",
    tech: ["Airflow", "dbt", "Redshift", "Terraform"],
    github: "https://github.com/hitenshKharva/Reddit-Cloud-Batch-ELT",
  },
  {
    title: "F1 Lakehouse on Azure",
    line: "70+ years of Formula 1 data in Databricks with raw → ingested → presentation layers, incremental loads and Delta Lake.",
    tech: ["Databricks", "PySpark", "Delta Lake", "Data Factory"],
    github: "https://github.com/hitenshKharva/F1-Data-Analysis-with-Azure",
  },
  {
    title: "E-Commerce Analytics on AWS",
    line: "About 540K transactions: S3 → Lambda → RDS MySQL → Glue (PySpark) → Redshift, with Athena checks and a Tableau dashboard.",
    tech: ["Lambda", "Glue", "Redshift", "Athena"],
    github: "https://github.com/hitenshKharva/Ecommerce-Data-Engineering",
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
    short: "IBM Data Engineering",
    issuer: "IBM · Coursera",
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
    dates: "Jun 2026 – Present",
    title: "Data Engineer II",
    org: "Amazon · Seattle",
    bullets: [
      "Built an LLM agent that clears warehouse congestion on its own, behind a guardrail that can't touch ETL.",
      "Architected the data platform for an AI planning agent, served to it over MCP.",
      "Co-built the team's multi-agent platform; mentor 3 engineers.",
    ],
    tags: ["Bedrock AgentCore", "Spark SQL", "MCP"],
  },
  {
    year: "2024",
    kind: "experience",
    dates: "Jul 2024 – Jun 2026",
    title: "Data Engineer I",
    org: "Amazon · Seattle",
    bullets: [
      "Launched a multi-tenant ingestion platform that 13+ teams onboarded themselves.",
      "Built the team's first AI operational tool, a RAG triage assistant that cut analysis time 80%.",
      "Recovered a production warehouse and rebuilt query-owner attribution (14% → 98%).",
    ],
    tags: ["CDK", "Spark", "RAG"],
  },
  {
    year: "2023",
    kind: "experience",
    dates: "Dec 2023 – Jul 2024",
    title: "Software Development Engineer",
    org: "AWS CodeArtifact · Seattle",
    bullets: [
      "Built gem upload and download for Ruby support in CodeArtifact, launched April 2024.",
      "Wrote the RubyGems client library and the integration tests that gated deployment.",
    ],
    tags: ["Java", "Guice", "TestNG"],
  },
  {
    year: "2023",
    kind: "experience",
    dates: "Jun 2023 – Dec 2023",
    title: "Data Developer",
    org: "Wind River Systems · San Diego",
    bullets: [
      "Added dbt-checkpoint hooks to CI/CD: data-model review time down 25%, docs accuracy up 30%.",
      "CI that re-runs only the Looker tiles a dbt change affects.",
    ],
    tags: ["dbt", "Fivetran", "Snowflake"],
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
    dates: "2021 – May 2023",
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
    dates: "2014 – May 2018",
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
  { value: 5000, suffix: "+", label: "Access requests automated", line: "For a large warehouse migration." },
  { value: 98, suffix: "%", label: "Owner-attribution accuracy", line: "Rebuilt from audit logs, up from about 14%." },
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
