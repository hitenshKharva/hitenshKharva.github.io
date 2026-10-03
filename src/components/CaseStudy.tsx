import { m, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { CATEGORY_LABEL, projects, type Project } from "../content";
import { openCaseStudy } from "../state";
import { FlowViz } from "./FlowViz";
import { Icon } from "./Icon";
import { TriageDemo } from "./TriageDemo";

const work = projects.filter((p) => p.kind === "work");

function readRoute(): string | null {
  const match = window.location.hash.match(/^#\/work\/([\w-]+)(\/demo)?$/);
  return match && work.some((p) => p.id === match[1]) ? match[1] : null;
}

const wantsDemo = () => window.location.hash.endsWith("/demo");

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-accent">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Body({ project }: { project: Project }) {
  const i = work.indexOf(project);
  const prev = work[(i - 1 + work.length) % work.length];
  const next = work[(i + 1) % work.length];
  return (
    <>
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
        Case study {String(i + 1).padStart(2, "0")} · {project.context}
      </p>
      <h2 id="case-title" className="mt-3 pr-12 font-display text-4xl leading-[1.05] text-fg sm:text-6xl">
        {project.name}
      </h2>
      <p className="mt-4 max-w-2xl text-xl text-fg">{project.oneLiner}</p>

      <div className="mt-8 overflow-hidden rounded-[var(--radius)] border border-line bg-bg">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line px-6 py-5">
          <p className="font-display text-6xl leading-none text-accent sm:text-7xl">{project.metric?.value}</p>
          <p className="max-w-xs text-muted sm:text-right">{project.metric?.label}</p>
        </div>
        {project.flow && <FlowViz steps={project.flow} size="lg" />}
      </div>

      {project.demo && (
        <div className="mt-10">
          <TriageDemo />
        </div>
      )}

      <div className="mt-12 grid gap-10 md:grid-cols-[1.6fr_1fr]">
        <div className="space-y-10">
          <Block title="Overview">
            <p className="text-lg text-fg">{project.summary}</p>
          </Block>
          {project.problem && (
            <Block title="The challenge">
              <p className="text-muted">{project.problem}</p>
            </Block>
          )}
          {project.role && (
            <Block title="My role">
              <p className="text-muted">{project.role}</p>
            </Block>
          )}
          {project.steps?.length ? (
            <Block title="How it works">
              <ol className="space-y-4">
                {project.steps.map((s, n) => (
                  <li key={n} className="grid grid-cols-[2.5rem_1fr] gap-2">
                    <span className="font-display text-3xl leading-none text-accent">{n + 1}</span>
                    <span className="text-fg">{s}</span>
                  </li>
                ))}
              </ol>
            </Block>
          ) : null}
          {project.decisions?.length ? (
            <Block title="Key decisions">
              <ul className="space-y-3">
                {project.decisions.map((d, n) => (
                  <li key={n} className="rounded-lg border border-line bg-bg p-4 text-fg">
                    {d}
                  </li>
                ))}
              </ul>
            </Block>
          ) : null}
        </div>

        <aside className="space-y-8 md:sticky md:top-6 md:self-start">
          {project.impact?.length ? (
            <Block title="Results">
              <ul className="space-y-2">
                {project.impact.map((r) => (
                  <li key={r} className="border-l-2 border-accent pl-3 font-medium text-fg">
                    {r}
                  </li>
                ))}
              </ul>
            </Block>
          ) : null}
          <Block title="Stack">
            <ul className="flex flex-wrap gap-1.5">
              {project.stack.map((s) => (
                <li key={s} className="rounded bg-surface-2 px-2 py-1 font-mono text-xs text-fg">
                  {s}
                </li>
              ))}
            </ul>
          </Block>
          <Block title="Area">
            <p className="font-mono text-sm text-muted">{project.categories.map((c) => CATEGORY_LABEL[c]).join(" · ")}</p>
          </Block>
          <p className="text-sm text-muted">Internal Amazon system, so there's no public code or demo.</p>
        </aside>
      </div>

      <nav aria-label="More case studies" className="mt-14 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => openCaseStudy(prev.id)}
          className="min-h-12 rounded-lg border border-line p-4 text-left transition-colors duration-200 hover:border-accent"
        >
          <span className="block font-mono text-xs text-muted">← Previous</span>
          <span className="font-display text-xl text-fg">{prev.name}</span>
        </button>
        <button
          type="button"
          onClick={() => openCaseStudy(next.id)}
          className="min-h-12 rounded-lg border border-line p-4 text-left transition-colors duration-200 hover:border-accent sm:text-right"
        >
          <span className="block font-mono text-xs text-muted">Next →</span>
          <span className="font-display text-xl text-fg">{next.name}</span>
        </button>
      </nav>
    </>
  );
}

/** Full-screen, deep-linkable case study at #/work/<id>. Native <dialog> gives focus trapping and Esc. */
export function CaseStudy() {
  const [id, setId] = useState<string | null>(readRoute);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastOpened = useRef<string | null>(null);
  const reduce = useReducedMotion();
  const project = work.find((p) => p.id === id);

  useEffect(() => {
    const onHash = () => {
      setId(readRoute());
      if (wantsDemo()) requestAnimationFrame(() => document.getElementById("triage-demo")?.scrollIntoView({ block: "start" }));
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (project) {
      lastOpened.current = project.id;
      if (!dialog.open) dialog.showModal();
      dialog.querySelector<HTMLElement>("[data-close]")?.focus();
      if (wantsDemo()) {
        requestAnimationFrame(() => document.getElementById("triage-demo")?.scrollIntoView({ block: "start" }));
      } else {
        scrollRef.current?.scrollTo({ top: 0 });
      }
      document.documentElement.style.overflow = "hidden";
    } else if (dialog.open) {
      dialog.close();
    }
  }, [project]);

  function close() {
    history.replaceState(null, "", window.location.pathname + window.location.search);
    setId(null);
  }

  function onClosed() {
    document.documentElement.style.overflow = "";
    if (readRoute()) close();
    // Return focus to the card that opened it.
    const from = lastOpened.current;
    if (from) {
      const el = document.getElementById(`project-${from}`);
      el?.scrollIntoView({ block: "center" });
      el?.querySelector<HTMLElement>("[data-project-toggle]")?.focus({ preventScroll: true });
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="case-title"
      onClose={onClosed}
      onClick={(e) => {
        if (e.target === dialogRef.current) close();
      }}
      className="case-study m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 text-fg sm:m-auto sm:h-[calc(100%-3rem)] sm:max-w-5xl"
    >
      {project && (
        <m.div
          key={project.id}
          ref={scrollRef}
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-full overflow-y-auto border-line bg-surface px-5 pb-12 pt-6 sm:rounded-[var(--radius)] sm:border sm:px-10 sm:pt-10"
        >
          <button
            type="button"
            data-close
            onClick={close}
            aria-label="Close case study"
            className="sticky top-0 float-right z-10 -mr-1 inline-flex size-11 items-center justify-center rounded-full border border-line bg-surface text-fg transition-colors duration-200 hover:border-accent hover:text-accent"
          >
            <Icon name="close" />
          </button>
          <Body project={project} />
        </m.div>
      )}
    </dialog>
  );
}
