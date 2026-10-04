import { AnimatePresence, m, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useState } from "react";
import { families, skills, type Family, type Skill } from "../content/site";
import { Section } from "./Section";

/** Family shade, ink → pale sand. Dark shades take cream text; light ones take ink (all ≥ 5.6:1). */
const SHADE: Record<Family, { bg: string; fg: string; swatch: string }> = {
  languages: { bg: "bg-[var(--tint-1)]", fg: "text-on-ink", swatch: "var(--tint-1)" },
  data: { bg: "bg-[var(--tint-2)]", fg: "text-on-ink", swatch: "var(--tint-2)" },
  backend: { bg: "bg-[var(--tint-3)]", fg: "text-ink", swatch: "var(--tint-3)" },
  databases: { bg: "bg-[var(--tint-4)]", fg: "text-ink", swatch: "var(--tint-4)" },
  cloud: { bg: "bg-[var(--tint-5)]", fg: "text-ink", swatch: "var(--tint-5)" },
  ai: { bg: "bg-[var(--tint-6)]", fg: "text-ink", swatch: "var(--tint-6)" },
};

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
      className="rounded-2xl border border-line bg-surface/95 p-4 shadow-[0_18px_40px_-20px_rgb(28_31_46/0.45)] backdrop-blur-md lg:rounded-3xl lg:p-8 lg:shadow-none"
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
      intro="Elements in six families. Hover or tap a tile to see how I've used it, or pick a family to light it up."
      className="glow"
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
              className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-sm transition-colors duration-200 ${
                on ? "border-ink bg-ink text-on-ink" : "border-line bg-surface/70 text-ink hover:border-ink"
              }`}
            >
              {f.id && (
                <span
                  aria-hidden="true"
                  className="size-3 rounded-[3px] border border-ink/20"
                  style={{ background: SHADE[f.id].swatch }}
                />
              )}
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
        <m.ul
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          aria-label="Skills"
          className="grid grid-cols-4 gap-2 sm:grid-cols-6 sm:gap-2.5 xl:grid-cols-7"
        >
          {skills.map((s) => {
            const shade = SHADE[s.family];
            const dim = family !== null && family !== s.family;
            const selected = active.number === s.number;
            return (
              <m.li key={s.number} variants={tile}>
                <button
                  type="button"
                  aria-pressed={selected}
                  aria-label={`${s.name}, ${familyLabel(s.family)}`}
                  onMouseEnter={() => setActive(s)}
                  onFocus={() => setActive(s)}
                  onClick={() => setActive(s)}
                  className={`relative flex aspect-square w-full flex-col justify-between rounded-xl p-2 text-left transition-[opacity,transform,box-shadow] duration-300 hover:-translate-y-0.5 sm:rounded-2xl sm:p-2.5 ${shade.bg} ${shade.fg} ${
                    dim ? "opacity-25" : "opacity-100"
                  } ${selected ? "ring-2 ring-ink ring-offset-2 ring-offset-[var(--bg)]" : ""}`}
                >
                  <span className="font-mono text-[10px]">{String(s.number).padStart(2, "0")}</span>
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
        <div className="sticky bottom-3 z-10 lg:bottom-auto lg:top-28">
          <DetailPanel skill={active} icons={icons} />
        </div>
      </div>
    </Section>
  );
}
