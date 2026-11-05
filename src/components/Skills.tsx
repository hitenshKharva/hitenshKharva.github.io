import { AnimatePresence, m, type Variants } from "motion/react";
import { useReducedMotion } from "../lib/useReducedMotion";
import { useEffect, useState } from "react";
import { families, skills, type Family, type Skill } from "../content/site";
import { Section } from "./Section";

/** Heatmap ramp by years of use, pale band → ledger green → ink. Dark steps take paper text. */
const RAMP = ["var(--tint-6)", "var(--tint-5)", "var(--tint-4)", "var(--tint-3)", "var(--tint-2)", "var(--tint-7)", "var(--tint-1)"];
const MAX_YEARS = Math.max(...skills.map((s) => s.years));
function shade(years: number) {
  const step = Math.min(RAMP.length - 1, Math.round(((years - 1) / Math.max(MAX_YEARS - 1, 1)) * (RAMP.length - 1)));
  return { background: RAMP[step], fg: step >= 3 ? "text-on-ink" : "text-ink" };
}
const yearsLabel = (y: number) => `${y} yr${y === 1 ? "" : "s"} hands-on`;

const familyLabel = (f: Family) => families.find((x) => x.id === f)!.label;

type IconMap = Record<string, { title: string; path: string }>;

function Logo({ skill, icons, className }: { skill: Skill; icons: IconMap | null; className?: string }) {
  const icon = skill.icon ? icons?.[skill.icon] : undefined;
  if (!icon) return <span className={`font-extrabold tracking-tight ${className}`}>{skill.symbol}</span>;
  return (
    <svg viewBox="0 0 24 24" role="img" aria-label={`${icon.title} logo`} className={className}>
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}

function DetailPanel({ skill, icons }: { skill: Skill; icons: IconMap | null }) {
  const reduce = useReducedMotion();
  return (
    <div
      className="rounded-md border border-line bg-surface/95 p-4 shadow-[0_18px_40px_-20px_rgb(28_36_32/0.45)] backdrop-blur-md  lg:p-8 lg:shadow-none"
      aria-live="polite"
    >
      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={skill.number}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-4 lg:block"
        >
          <div className="hidden items-center justify-between lg:flex">
            <span className="font-mono text-xs text-muted">{String(skill.number).padStart(2, "0")}</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{familyLabel(skill.family)}</span>
          </div>
          <div className="flex size-14 shrink-0 items-center justify-center text-ink lg:mt-6 lg:h-28 lg:w-auto">
            <Logo skill={skill} icons={icons} className="size-11 text-3xl lg:size-24 lg:text-6xl" />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted lg:hidden">{familyLabel(skill.family)}</p>
            <p className="text-lg font-extrabold tracking-tight text-ink lg:mt-6 lg:text-2xl">{skill.name}</p>
            <p className="font-mono text-xs font-semibold text-accent lg:mt-1">{yearsLabel(skill.years)}</p>
            <p className="mt-0.5 text-sm text-muted lg:mt-2 lg:text-base">{skill.note}</p>
          </div>
        </m.div>
      </AnimatePresence>
    </div>
  );
}

const grid: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.025 } } };

export function Skills() {
  const reduce = useReducedMotion();
  const [family, setFamily] = useState<Family | null>(null);
  const [active, setActive] = useState<Skill>(skills[0]);
  // Logo paths (~10 KB gzip) load as their own chunk, after first render.
  const [icons, setIcons] = useState<IconMap | null>(null);
  useEffect(() => {
    import("./skillIcons").then((mod) => setIcons(mod.skillIcons));
  }, []);

  const tile: Variants = {
    hidden: { opacity: 0, scale: reduce ? 1 : 0.9 },
    show: { opacity: 1, scale: 1, transition: { duration: reduce ? 0 : 0.35 } },
  };

  return (
    <Section
      id="skills"
      number="02"
      eyebrow="Skills"
      lead="The periodic table"
      accent="of my stack."
      intro="A heatmap: the darker the tile, the more years I've used it. Hover or tap a tile to see how, or pick a family to light it up."
    >
      <div role="group" aria-label="Highlight a family" className="flex flex-wrap gap-2">
        {[{ id: null, label: "All" } as { id: Family | null; label: string }, ...families].map((f) => {
          const on = family === f.id;
          return (
            <button
              key={f.label}
              type="button"
              aria-pressed={on}
              onClick={() => setFamily(f.id)}
              className={`inline-flex min-h-10 items-center gap-2 rounded-md border px-3.5 text-sm transition-colors duration-200 ${
                on ? "border-ink bg-ink text-on-ink" : "border-line bg-surface/70 text-ink hover:border-ink"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
        {/* Tiles and their legend share the first column, so the detail panel stays beside them. */}
        <div className="min-w-0">
          <m.ul
            variants={grid}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            aria-label="Skills"
            className="grid grid-cols-4 gap-2 sm:grid-cols-6 sm:gap-2.5 xl:grid-cols-7"
          >
            {skills.map((s) => {
              const tone = shade(s.years);
              const dim = family !== null && family !== s.family;
              const selected = active.number === s.number;
              return (
                <m.li key={s.number} variants={tile}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    aria-label={`${s.name}, ${familyLabel(s.family)}, ${yearsLabel(s.years)}`}
                    onMouseEnter={() => setActive(s)}
                    onFocus={() => setActive(s)}
                    onClick={() => setActive(s)}
                    className={`relative flex aspect-square w-full flex-col justify-between rounded-md p-2 text-left transition-[opacity,transform,box-shadow] duration-300 hover:-translate-y-0.5  sm:p-2.5 ${tone.fg} ${
                      dim ? "opacity-25" : "opacity-100"
                    } ${selected ? "ring-2 ring-ink ring-offset-2 ring-offset-[var(--bg)]" : ""}`}
                    style={{ background: tone.background }}
                  >
                    <span className="flex justify-between font-mono text-[10px]" aria-hidden="true">
                      <span>{String(s.number).padStart(2, "0")}</span>
                      <span>{s.years}y</span>
                    </span>
                    <span className="text-2xl font-extrabold leading-none tracking-tight sm:text-3xl" aria-hidden="true">
                      {s.symbol}
                    </span>
                    <span className="truncate text-[10px] leading-tight sm:text-[11px]" aria-hidden="true">
                      {s.name}
                    </span>
                  </button>
                </m.li>
              );
            })}
          </m.ul>
          <div className="mt-4 flex items-center gap-3 font-mono text-xs text-muted" aria-hidden="true">
            <span>1 yr</span>
            <span className="flex h-2.5 w-48 overflow-hidden rounded-sm">
              {RAMP.map((c) => (
                <span key={c} className="flex-1" style={{ background: c }} />
              ))}
            </span>
            <span>{MAX_YEARS} yrs</span>
          </div>
        </div>
        <div className="sticky bottom-3 z-10 lg:bottom-auto lg:top-28">
          <DetailPanel skill={active} icons={icons} />
        </div>
      </div>
    </Section>
  );
}
