import { m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CATEGORY_LABEL, profile, projects } from "../content";
import { useSite } from "../state";
import { Headline, HeroActions, HeroSection, useIntro } from "./shared";

// Node positions as fractions of the diagram box.
const SOURCE = { x: 0.09, y: 0.5 };
const SINK = { x: 0.91, y: 0.5 };
const MID_X = 0.5;
const rowY = (i: number) => (i + 0.5) / projects.length;

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
  const { jumpToProject } = useSite();
  const { reduce } = useIntro();
  const [ref, { w, h }] = useBoxSize<HTMLDivElement>();
  const [drawn, setDrawn] = useState(false);

  const edges = projects.flatMap((p, i) => {
    const y = rowY(i) * h;
    return [
      { key: `${p.id}-in`, d: curve(SOURCE.x * w, SOURCE.y * h, MID_X * w, y), order: 0 },
      { key: `${p.id}-out`, d: curve(MID_X * w, y, SINK.x * w, SINK.y * h), order: 1 },
    ];
  });

  const drawDuration = reduce ? 0 : 0.9;
  const nodeDelay = (order: number) => (reduce ? 0 : 0.35 + order * 0.8);

  return (
    <figure className="relative mx-auto w-full max-w-xl">
      <figcaption className="mb-3 font-mono text-xs text-muted">
        <span className="text-accent">$</span> data flow · select a node to open the project
      </figcaption>
      <div
        ref={ref}
        className="relative h-[22rem] rounded-[var(--radius)] border border-line bg-surface/60 sm:h-[26rem]"
      >
        {w > 0 && (
          <svg className="absolute inset-0" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
            {edges.map((e) => (
              <m.path
                key={e.key}
                d={e.d}
                fill="none"
                stroke="var(--line)"
                strokeWidth={2}
                initial={{ pathLength: reduce ? 1 : 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: drawDuration, delay: reduce ? 0 : 0.3 + e.order * 0.8, ease: "easeInOut" }}
                onAnimationComplete={() => setDrawn(true)}
              />
            ))}
            {drawn &&
              !reduce &&
              edges.map((e) => (
                <path key={`${e.key}-flow`} d={e.d} fill="none" stroke="var(--accent)" strokeWidth={2} className="flow-dash" opacity={0.85} />
              ))}
          </svg>
        )}

        <m.div
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
          style={{ left: `${SOURCE.x * 100}%`, top: `${SOURCE.y * 100}%` }}
          initial={{ opacity: 0, scale: reduce ? 1 : 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: reduce ? 0 : 0.1, duration: reduce ? 0 : 0.3 }}
        >
          <span className="size-4 rounded-full border-2 border-accent bg-bg" aria-hidden="true" />
          <span className="font-mono text-[11px] text-muted">ingest</span>
        </m.div>
        <m.div
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
          style={{ left: `${SINK.x * 100}%`, top: `${SINK.y * 100}%` }}
          initial={{ opacity: 0, scale: reduce ? 1 : 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: nodeDelay(2), duration: reduce ? 0 : 0.3 }}
        >
          <span className="size-4 rounded-full bg-accent" aria-hidden="true" />
          <span className="font-mono text-[11px] text-muted">ship</span>
        </m.div>

        <ul aria-label="Projects in the pipeline">
          {projects.map((p, i) => (
            <m.li
              key={p.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${MID_X * 100}%`, top: `${rowY(i) * 100}%` }}
              initial={{ opacity: 0, y: reduce ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: nodeDelay(1) - 0.3 + i * (reduce ? 0 : 0.08), duration: reduce ? 0 : 0.35 }}
            >
              <button
                type="button"
                onClick={() => jumpToProject(p.id)}
                className="group flex min-h-11 min-w-36 flex-col items-center justify-center rounded-lg border border-line bg-bg px-3 py-1 text-center shadow-lg transition-colors duration-200 hover:border-accent focus-visible:border-accent sm:min-w-44"
              >
                <span className="whitespace-nowrap font-mono text-sm font-semibold text-fg group-hover:text-accent">{p.name}</span>
                <span className="font-mono text-[11px] text-muted">{p.categories.map((c) => CATEGORY_LABEL[c]).join(" · ")}</span>
                <span className="sr-only">, open project details</span>
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
        <m.p variants={item} className="font-mono text-sm text-accent">
          {profile.location}
        </m.p>
        <m.h1 variants={item} id="hero-title" className="mt-3 font-display text-4xl font-bold leading-tight text-fg sm:text-5xl lg:text-6xl">
          {profile.name}
        </m.h1>
        <m.div variants={item}>
          <Headline className="mt-4 max-w-xl text-lg text-muted sm:text-xl" />
        </m.div>
        <HeroActions item={item} />
      </m.div>
      <Diagram />
    </HeroSection>
  );
}
