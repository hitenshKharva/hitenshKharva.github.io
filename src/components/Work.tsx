import { AnimatePresence, m } from "motion/react";
import { useReducedMotion } from "../lib/useReducedMotion";
import { useState } from "react";
import { moreWork, projects, sideProjects, type Project } from "../content/site";
import { Icon } from "./Icon";
import { MiniUI } from "./illustrations";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

const num = (i: number) => String(i + 1).padStart(2, "0");

function Details({ project, index }: { project: Project; index: number }) {
  return (
    <div className="flex h-full flex-col">
      <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-muted">
        <span>{num(index)}</span>
        <span aria-hidden="true" className="h-px w-6 bg-muted/60" />
        <span>{project.eyebrow}</span>
      </p>
      <h3 className="mt-4 text-3xl font-extrabold leading-[1.02] tracking-[-0.03em] text-ink xl:text-4xl">{project.title}</h3>
      <p className="mt-1 font-mono text-xs text-muted">{project.context}</p>
      <p className="mt-4 text-[15px] leading-relaxed text-muted">{project.description}</p>
      <ul className="mt-4 grid gap-y-1.5 text-sm text-ink">
        {project.bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-ink" />
            {b}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
        {project.tech.map((t) => (
          <span key={t} className="rounded-full border border-line bg-[var(--bg)] px-2.5 py-1 font-mono text-[11px] text-ink">
            {t}
          </span>
        ))}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex min-h-10 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-on-ink transition-transform duration-200 hover:-translate-y-0.5"
          >
            <Icon name="github" size={16} /> View on GitHub
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </div>
    </div>
  );
}

/** Desktop: horizontal accordion; collapsed panels show a number and a vertical title. */
function Accordion({ open, setOpen }: { open: number; setOpen: (i: number) => void }) {
  return (
    <div className="hidden h-[40rem] gap-3 xl:flex">
      {projects.map((p, i) => {
        const isOpen = i === open;
        return (
          <div
            key={p.id}
            // Pointer *movement*, not mouseenter: when panels resize under a still cursor,
            // mouseenter would open whatever slid underneath and could flicker.
            onPointerMove={(e) => {
              if (e.pointerType === "mouse" && !isOpen) setOpen(i);
            }}
            className={`relative min-w-0 overflow-hidden rounded-[28px] border border-line bg-surface transition-[flex-grow,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isOpen ? "grow-[7] shadow-[0_30px_60px_-30px_rgb(28_31_46/0.35)]" : "grow"
            }`}
            style={{ flexBasis: 0 }}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`work-panel-${p.id}`}
              tabIndex={isOpen ? -1 : 0}
              onClick={() => setOpen(i)}
              onFocus={() => setOpen(i)}
              className={`absolute inset-0 z-10 flex flex-col items-center justify-between py-6 text-ink ${isOpen ? "pointer-events-none opacity-0" : ""}`}
            >
              <span className="font-mono text-xs text-muted">{num(i)}</span>
              <span className="whitespace-nowrap text-lg font-bold tracking-tight [writing-mode:vertical-rl] rotate-180">{p.short}</span>
              <span className="sr-only">: {p.title}, show project</span>
            </button>
            <div
              id={`work-panel-${p.id}`}
              role="region"
              aria-label={p.title}
              hidden={!isOpen}
              className="absolute inset-0 grid grid-cols-[1.1fr_1fr] items-center gap-8 p-9"
            >
              <div className="h-full min-h-0">
                <Details project={p} index={i} />
              </div>
              <div className="aspect-[4/3.3] w-full">
                <MiniUI kind={p.illustration} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Mobile and tablet: stacked cards, tap to expand. */
function Stack({ open, setOpen }: { open: number; setOpen: (i: number) => void }) {
  const reduce = useReducedMotion();
  return (
    <ul className="space-y-3 xl:hidden">
      {projects.map((p, i) => {
        const isOpen = i === open;
        return (
          <li key={p.id} className="overflow-hidden rounded-3xl border border-line bg-surface">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`work-card-${p.id}`}
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="flex min-h-16 w-full items-center gap-4 px-5 py-4 text-left"
            >
              <span className="font-mono text-xs text-muted">{num(i)}</span>
              <span className="flex-1 text-lg font-bold leading-tight tracking-tight text-ink">{p.title}</span>
              <span className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                <Icon name="chevron" />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <m.div
                  id={`work-card-${p.id}`}
                  role="region"
                  aria-label={p.title}
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-5 px-5 pb-5 sm:grid-cols-[1.1fr_1fr]">
                    <Details project={p} index={i} />
                    <div className="aspect-[4/3.3] w-full self-center">
                      <MiniUI kind={p.illustration} />
                    </div>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}

function SubHeading({ id, label, note }: { id: string; label: string; note: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line pb-3">
      <h3 id={id} className="text-2xl font-extrabold tracking-[-0.02em] text-ink">
        {label}
      </h3>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">{note}</p>
    </div>
  );
}

function MoreWork() {
  return (
    <Reveal className="mt-20">
      <section aria-labelledby="more-work-title">
        <SubHeading id="more-work-title" label="More from Amazon" note="Professional work" />
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {moreWork.map((w) => (
            <li key={w.title} className="rounded-3xl border border-line bg-surface p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{w.context}</p>
              <p className="mt-3 text-lg font-bold leading-tight tracking-tight text-ink">{w.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{w.line}</p>
            </li>
          ))}
        </ul>
      </section>
    </Reveal>
  );
}

function SideProjects() {
  return (
    <Reveal className="mt-20">
      <section aria-labelledby="side-projects-title">
        <SubHeading id="side-projects-title" label="Side projects" note="Public code" />
        <ul className="mt-6 grid gap-3 md:grid-cols-3">
          {sideProjects.map((sp) => (
            <li key={sp.title}>
              <a
                href={sp.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-3xl border border-line bg-surface p-6 transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-on-ink"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="text-lg font-bold leading-tight tracking-tight">{sp.title}</span>
                  <span className="shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                    <Icon name="github" size={18} />
                  </span>
                </span>
                <span className="mt-2 text-sm leading-relaxed text-muted transition-colors duration-300 group-hover:text-on-ink/75">
                  {sp.line}
                </span>
                <span className="mt-auto flex flex-wrap gap-1.5 pt-5">
                  {sp.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] transition-colors duration-300 group-hover:border-on-ink/30"
                    >
                      {t}
                    </span>
                  ))}
                </span>
                <span className="sr-only">(view on GitHub, opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </Reveal>
  );
}

export function Work() {
  const [open, setOpen] = useState(0);
  return (
    <Section
      id="work"
      number="03"
      eyebrow="Work"
      lead="Things I've"
      accent="built."
      intro="Featured systems from Amazon and AWS, then more professional work and side projects. Hover or tap a panel to open it."
    >
      <Accordion open={Math.max(0, open)} setOpen={setOpen} />
      <Stack open={open} setOpen={setOpen} />
      <MoreWork />
      <SideProjects />
    </Section>
  );
}
