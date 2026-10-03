import { AnimatePresence, m, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useRef, useState } from "react";
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

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { openProject, setOpenProject } = useSite();
  const reduce = useReducedMotion();
  const open = openProject === project.id;
  const panelId = `project-${project.id}-steps`;

  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <m.li
      id={`project-${project.id}`}
      variants={item}
      className="scroll-mt-24 rounded-[var(--radius)] border border-line bg-surface p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-muted">{String(index + 1).padStart(2, "0")}</p>
          <h3 className="font-display text-xl font-semibold text-fg sm:text-2xl">{project.name}</h3>
        </div>
        <ul className="flex flex-wrap gap-2" aria-label="Categories">
          {project.categories.map((c) => (
            <li key={c} className="rounded-full border border-line px-2.5 py-0.5 font-mono text-xs text-muted">
              {CATEGORY_LABEL[c]}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-3 max-w-prose text-muted">
        <OrTodo value={project.summary} label="one-paragraph summary" />
      </p>

      {project.stack.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Stack">
          {project.stack.map((s) => (
            <li key={s} className="rounded bg-surface-2 px-2 py-1 font-mono text-xs text-fg">
              {s}
            </li>
          ))}
        </ul>
      )}

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
        {project.link ? (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 font-medium text-accent underline-offset-4 hover:underline"
          >
            View project <Icon name="external" size={16} />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ) : (
          <Todo>project link</Todo>
        )}
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <m.div
            id={panelId}
            key="steps"
            role="region"
            aria-label={`How ${project.name} works`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            {project.steps?.length ? (
              <ol className="mt-5 space-y-3 border-l-2 border-accent pl-5">
                {project.steps.map((step, i) => (
                  <li key={i} className="text-fg">
                    <span className="mr-2 font-mono text-sm text-accent">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            ) : (
              <div className="mt-5 border-l-2 border-accent pl-5">
                <Todo>"How it works" steps</Todo>
              </div>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </m.li>
  );
}

export function Projects() {
  const { jumpTarget } = useSite();
  const [filter, setFilter] = useState<Filter>("all");
  const handled = useRef(0);

  // A jump from a hero must never land on a filtered-out card: reset the
  // filter first, then scroll and focus once the card is rendered.
  useEffect(() => {
    if (!jumpTarget || handled.current === jumpTarget.tick) return;
    if (filter !== "all") {
      setFilter("all");
      return;
    }
    handled.current = jumpTarget.tick;
    const el = document.getElementById(`project-${jumpTarget.id}`);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    el.querySelector<HTMLElement>("[data-project-toggle]")?.focus({ preventScroll: true });
  }, [jumpTarget, filter]);

  const shown = filter === "all" ? projects : projects.filter((p) => p.categories.includes(filter));

  return (
    <section id="projects" aria-labelledby="projects-title" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
      <h2 id="projects-title" className="font-display text-3xl font-bold text-fg sm:text-4xl">
        Projects
      </h2>
      <div role="group" aria-label="Filter projects by category" className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = f === filter;
          return (
            <button
              key={f}
              type="button"
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
      <p className="sr-only" aria-live="polite">
        {shown.length} {shown.length === 1 ? "project" : "projects"} shown
      </p>

      <m.ul
        key={filter}
        variants={list}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="mt-8 grid gap-5 lg:grid-cols-2"
      >
        {shown.map((p) => (
          <ProjectCard key={p.id} project={p} index={projects.indexOf(p)} />
        ))}
      </m.ul>
    </section>
  );
}
