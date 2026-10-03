import { m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CATEGORY_LABEL, profile, projects, type Category } from "../content";
import { useSite } from "../state";
import { Eyebrow, Headline, HeroActions, HeroSection, Subhead, useIntro } from "./shared";

// Skill stages on the left feed the production systems they power; every system ships.
const work = projects.filter((p) => p.kind === "work");
const STAGES: Category[] = ["data", "ai", "backend"];
const STAGE_X = 0.13;
const PROJECT_X = 0.54;
const SINK = { x: 0.935, y: 0.5 };
const projectY = (i: number) => (i + 0.5) / work.length;
const stageY = (i: number) => (i + 0.5) / STAGES.length;

function useBoxSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

function curve(x1: number, y1: number, x2: number, y2: number) {
  const dx = (x2 - x1) * 0.55;
  return `M${x1} ${y1} C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`;
}

function Diagram() {
  const { jumpToProject, jumpToCategory } = useSite();
  const { reduce } = useIntro();
  const [ref, { w, h }] = useBoxSize<HTMLDivElement>();
  const [drawn, setDrawn] = useState(false);

  const edges = work.flatMap((p, i) => {
    const y = projectY(i) * h;
    return [
      ...p.categories.map((c) => ({
        key: `${c}-${p.id}`,
        d: curve(STAGE_X * w, stageY(STAGES.indexOf(c)) * h, PROJECT_X * w, y),
        order: 0,
      })),
      { key: `${p.id}-ship`, d: curve(PROJECT_X * w, y, SINK.x * w, SINK.y * h), order: 1 },
    ];
  });

  const delay = (order: number) => (reduce ? 0 : 0.3 + order * 0.8);
  const nodeIn = (d: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 6 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: reduce ? 0 : d, duration: reduce ? 0 : 0.35 },
  });

  return (
    <figure className="relative mx-auto w-full max-w-xl">
      <figcaption className="mb-3 font-mono text-xs text-muted">
        <span className="text-accent">$</span> skills → systems · select a node
      </figcaption>
      <div ref={ref} className="relative h-[27rem] rounded-[var(--radius)] border border-line bg-surface/60 sm:h-[28rem]">
        {w > 0 && (
          <svg className="absolute inset-0" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
            {edges.map((e) => (
              <m.path
                key={e.key}
                d={e.d}
                fill="none"
                stroke="var(--line)"
                strokeWidth={1.5}
                initial={{ pathLength: reduce ? 1 : 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: reduce ? 0 : 0.9, delay: delay(e.order), ease: "easeInOut" }}
                onAnimationComplete={() => setDrawn(true)}
              />
            ))}
            {drawn &&
              !reduce &&
              edges.map((e) => (
                <path key={`${e.key}-flow`} d={e.d} fill="none" stroke="var(--accent)" strokeWidth={1.5} className="flow-dash" opacity={0.8} />
              ))}
          </svg>
        )}

        <ul aria-label="Skill stages">
          {STAGES.map((c, i) => (
            <m.li
              key={c}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${STAGE_X * 100}%`, top: `${stageY(i) * 100}%` }}
              {...nodeIn(0.1 + i * 0.08)}
            >
              <button
                type="button"
                onClick={() => jumpToCategory(c)}
                className="min-h-11 rounded-full border-2 border-accent bg-bg px-3 font-mono text-xs font-semibold text-accent transition-colors duration-200 hover:bg-accent hover:text-on-accent sm:px-4 sm:text-sm"
              >
                {CATEGORY_LABEL[c]}
                <span className="sr-only">: show {CATEGORY_LABEL[c]} work</span>
              </button>
            </m.li>
          ))}
        </ul>

        <m.div
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
          style={{ left: `${SINK.x * 100}%`, top: `${SINK.y * 100}%` }}
          {...nodeIn(delay(1) + 0.6)}
        >
          <span className="size-4 rounded-full bg-accent" aria-hidden="true" />
          <span className="font-mono text-[11px] text-muted">prod</span>
        </m.div>

        <ul aria-label="Production systems">
          {work.map((p, i) => (
            <m.li
              key={p.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${PROJECT_X * 100}%`, top: `${projectY(i) * 100}%` }}
              {...nodeIn(delay(1) - 0.3 + i * (reduce ? 0 : 0.06))}
            >
              <button
                type="button"
                onClick={() => jumpToProject(p.id)}
                className="group flex min-h-11 items-center justify-center whitespace-nowrap rounded-lg border border-line bg-bg px-3 text-center shadow-lg transition-colors duration-200 hover:border-accent focus-visible:border-accent sm:min-w-52"
              >
                <span className="font-mono text-xs font-semibold text-fg group-hover:text-accent sm:text-sm">{p.short}</span>
                <span className="sr-only">: open case study</span>
              </button>
            </m.li>
          ))}
        </ul>
      </div>
    </figure>
  );
}

export default function PipelineHero() {
  const { container, item } = useIntro();
  return (
    <HeroSection className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 md:pt-20 lg:grid-cols-[1fr_1.1fr]">
      <m.div variants={container} initial="hidden" animate="show">
        <m.div variants={item}>
          <Eyebrow className="font-mono text-sm text-accent" />
        </m.div>
        <m.h1 variants={item} id="hero-title" className="mt-3 font-display text-4xl font-bold leading-tight text-fg sm:text-5xl lg:text-6xl">
          {profile.name}
        </m.h1>
        <m.div variants={item}>
          <Headline className="mt-4 max-w-xl text-xl font-medium text-fg sm:text-2xl" />
          <Subhead className="mt-3 max-w-xl text-muted" />
        </m.div>
        <HeroActions item={item} />
      </m.div>
      <Diagram />
    </HeroSection>
  );
}
