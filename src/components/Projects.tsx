import { AnimatePresence, m, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { CATEGORY_LABEL, projects, type Category, type Project } from "../content";
import { useSite } from "../state";
import { Icon } from "./Icon";
import { OrTodo, Todo } from "./Todo";

type Filter = "all" | Category;
const FILTERS: Filter[] = ["all", "ai", "data", "backend"];

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

function useItemVariants(): Variants {
  const reduce = useReducedMotion();
  return {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] } },
  };
}

function CategoryChips({ categories }: { categories: Category[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Categories">
      {categories.map((c) => (
        <li key={c} className="rounded-full border border-line px-2.5 py-0.5 font-mono text-xs text-muted">
          {CATEGORY_LABEL[c]}
        </li>
      ))}
    </ul>
  );
}

function StackList({ stack }: { stack: string[] }) {
  if (!stack.length) return null;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Stack">
      {stack.map((s) => (
        <li key={s} className="rounded bg-surface-2 px-2 py-1 font-mono text-xs text-fg">
          {s}
        </li>
      ))}
    </ul>
  );
}

function ProjectLink({ project }: { project: Project }) {
  if (project.link === undefined) return null;
  if (project.link === null) return <Todo>project link</Todo>;
  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 font-medium text-accent underline-offset-4 hover:underline"
    >
      Code <Icon name="external" size={16} />
      <span className="sr-only">for {project.name} (opens in a new tab)</span>
    </a>
  );
}

/** "How it works" toggle and the animated panel it controls. */
function Details({ project, children }: { project: Project; children?: ReactNode }) {
  const { openProject, setOpenProject } = useSite();
  const reduce = useReducedMotion();
  const open = openProject === project.id;
  const panelId = `project-${project.id}-details`;

  return (
    <>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          data-project-toggle
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpenProject(open ? null : project.id)}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line px-4 font-medium text-fg transition-colors duration-200 hover:border-accent hover:text-accent"
        >
          How it works
          <m.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: reduce ? 0 : 0.2 }} className="inline-flex">
            <Icon name="chevron" />
          </m.span>
        </button>
        {children}
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <m.div
            id={panelId}
            key="details"
            role="region"
            aria-label={`How ${project.name} works`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-5 border-l-2 border-accent pl-5">
              {project.steps?.length ? (
                <ol className="space-y-2.5">
                  {project.steps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-fg">
                      <span className="font-mono text-sm leading-relaxed text-accent">{String(i + 1).padStart(2, "0")}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <Todo>"How it works" steps</Todo>
              )}
              {project.decisions?.length ? (
                <>
                  <h4 className="mt-5 font-mono text-xs uppercase tracking-wider text-muted">Key decisions</h4>
                  <ul className="mt-2 space-y-2">
                    {project.decisions.map((d, i) => (
                      <li key={i} className="text-muted">
                        <span aria-hidden="true" className="mr-2 text-accent">
                          ›
                        </span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}

function WorkCard({ project }: { project: Project }) {
  const item = useItemVariants();
  return (
    <m.li
      id={`project-${project.id}`}
      variants={item}
      className="flex scroll-mt-24 flex-col rounded-[var(--radius)] border border-line bg-surface p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="font-mono text-xs text-muted">{project.context}</p>
        <CategoryChips categories={project.categories} />
      </div>
      <h3 className="mt-2 font-display text-xl font-semibold text-fg sm:text-2xl">{project.name}</h3>
      {project.problem && (
        <p className="mt-3 text-fg">
          <span className="font-mono text-xs uppercase tracking-wider text-accent">Problem · </span>
          {project.problem}
        </p>
      )}
      <p className="mt-2 text-muted">
        <OrTodo value={project.summary} label="summary" />
      </p>
      {project.impact?.length ? (
        <ul className="mt-4 grid gap-2 sm:grid-cols-3" aria-label="Impact">
          {project.impact.map((i) => (
            <li key={i} className="rounded-lg border border-accent/40 bg-bg/40 px-3 py-2 text-sm font-medium leading-snug text-fg">
              {i}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-4">
        <StackList stack={project.stack} />
      </div>
      <div className="mt-auto">
        <Details project={project}>
          <span className="font-mono text-xs text-muted">Internal system · no public code</span>
        </Details>
      </div>
    </m.li>
  );
}

function SideCard({ project }: { project: Project }) {
  const item = useItemVariants();
  return (
    <m.li
      id={`project-${project.id}`}
      variants={item}
      className="flex scroll-mt-24 flex-col rounded-[var(--radius)] border border-line bg-surface p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h4 className="font-display text-lg font-semibold text-fg">{project.name}</h4>
        <CategoryChips categories={project.categories} />
      </div>
      <p className="mt-2 text-sm text-muted">
        <OrTodo value={project.summary} label="one-paragraph summary" />
      </p>
      <div className="mt-3">
        <StackList stack={project.stack} />
      </div>
      <div className="mt-auto">
        <Details project={project}>
          <ProjectLink project={project} />
        </Details>
      </div>
    </m.li>
  );
}

function EarlierRow({ project }: { project: Project }) {
  const item = useItemVariants();
  return (
    <m.li id={`project-${project.id}`} variants={item} className="scroll-mt-24 py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h4 className="font-semibold text-fg">{project.name}</h4>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted">{project.categories.map((c) => CATEGORY_LABEL[c]).join(" · ")}</span>
          <ProjectLink project={project} />
        </div>
      </div>
      <p className="mt-1 max-w-3xl text-sm text-muted">{project.summary}</p>
    </m.li>
  );
}

export function Projects() {
  const { jumpTarget } = useSite();
  const [filter, setFilter] = useState<Filter>("all");
  const handled = useRef(0);

  // Hero jumps: a category sets the filter; a project resets any filter that
  // would hide it. Scroll and focus run once the right cards are rendered.
  useEffect(() => {
    if (!jumpTarget || handled.current === jumpTarget.tick) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = reduce ? "auto" : "smooth";

    if (jumpTarget.category) {
      if (filter !== jumpTarget.category) {
        setFilter(jumpTarget.category);
        return;
      }
      handled.current = jumpTarget.tick;
      document.getElementById("work")?.scrollIntoView({ behavior, block: "start" });
      document.querySelector<HTMLElement>(`[data-filter="${jumpTarget.category}"]`)?.focus({ preventScroll: true });
      return;
    }

    const target = projects.find((p) => p.id === jumpTarget.id);
    if (!target) return;
    if (filter !== "all" && !target.categories.includes(filter)) {
      setFilter("all");
      return;
    }
    handled.current = jumpTarget.tick;
    const el = document.getElementById(`project-${target.id}`);
    el?.scrollIntoView({ behavior, block: "start" });
    el?.querySelector<HTMLElement>("[data-project-toggle]")?.focus({ preventScroll: true });
  }, [jumpTarget, filter]);

  const matches = (p: Project) => filter === "all" || p.categories.includes(filter);
  const work = projects.filter((p) => p.kind === "work" && matches(p));
  const side = projects.filter((p) => p.kind === "side" && matches(p));
  const earlier = projects.filter((p) => p.kind === "earlier" && matches(p));
  const total = work.length + side.length + earlier.length;

  return (
    <section id="work" aria-labelledby="work-title" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 id="work-title" className="font-display text-3xl font-bold text-fg sm:text-4xl">
            Selected work
          </h2>
          <p className="mt-2 max-w-2xl text-muted">
            Production systems I built at Amazon, plus side projects. Each card covers the problem, how it works and what
            changed.
          </p>
        </div>
        <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = f === filter;
            return (
              <button
                key={f}
                type="button"
                data-filter={f}
                aria-pressed={active}
                onClick={() => setFilter(f)}
                className={`min-h-11 rounded-full border px-4 font-mono text-sm transition-colors duration-200 ${
                  active ? "border-accent bg-accent text-on-accent" : "border-line text-muted hover:border-fg hover:text-fg"
                }`}
              >
                {f === "all" ? "All" : CATEGORY_LABEL[f]}
              </button>
            );
          })}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {total} {total === 1 ? "project" : "projects"} shown
      </p>

      {work.length > 0 && (
        <m.ul
          key={`work-${filter}`}
          variants={list}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.05 }}
          className="mt-8 grid items-start gap-5 lg:grid-cols-2"
        >
          {work.map((p) => (
            <WorkCard key={p.id} project={p} />
          ))}
        </m.ul>
      )}

      {side.length > 0 && (
        <>
          <h3 className="mt-16 font-display text-2xl font-bold text-fg">Side projects</h3>
          <m.ul
            key={`side-${filter}`}
            variants={list}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.05 }}
            className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {side.map((p) => (
              <SideCard key={p.id} project={p} />
            ))}
          </m.ul>
        </>
      )}

      {earlier.length > 0 && (
        <>
          <h3 className="mt-16 font-display text-xl font-bold text-fg">Earlier data projects</h3>
          <m.ul
            key={`earlier-${filter}`}
            variants={list}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.05 }}
            className="mt-4 divide-y divide-line border-y border-line"
          >
            {earlier.map((p) => (
              <EarlierRow key={p.id} project={p} />
            ))}
          </m.ul>
        </>
      )}
    </section>
  );
}
