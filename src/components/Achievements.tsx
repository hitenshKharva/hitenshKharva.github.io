import { useInView } from "motion/react";
import { useReducedMotion } from "../lib/useReducedMotion";
import { useEffect, useRef, useState } from "react";
import { achievements, type Achievement } from "../content/site";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

/** Counts up once when scrolled into view; shows the final value straight away under reduced motion. */
function CountUp({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(value);
      return;
    }
    const duration = 1400;
    const start = performance.now();
    let raf = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      setN(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value]);

  const final = `${prefix}${value.toLocaleString("en-US")}${suffix}`;
  return (
    <span ref={ref}>
      <span className="sr-only">{final}</span>
      <span aria-hidden="true" className="tabular-nums">
        {prefix}
        {n.toLocaleString("en-US")}
        {suffix}
      </span>
    </span>
  );
}

function Card({ a, index }: { a: Achievement; index: number }) {
  const rank = a.value === undefined;
  return (
    <article
      className={`flex h-full flex-col rounded-3xl border p-6 ${
        rank ? "border-ink bg-ink text-on-ink" : "border-line bg-surface text-ink"
      }`}
    >
      <span
        aria-hidden="true"
        className={`flex size-11 items-center justify-center rounded-2xl font-mono text-xs ${
          rank ? "bg-on-ink/10 text-on-ink" : "bg-[var(--bg)] text-ink"
        }`}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <p className="mt-8 text-5xl font-extrabold leading-none tracking-[-0.04em] sm:text-6xl xl:text-5xl">
        {rank ? a.display : <CountUp value={a.value!} prefix={a.prefix} suffix={a.suffix} />}
      </p>
      <p className={`mt-4 font-mono text-[11px] uppercase tracking-[0.18em] ${rank ? "text-on-ink/75" : "text-muted"}`}>
        {a.label}
      </p>
      <p className={`mt-2 text-sm ${rank ? "text-on-ink/85" : "text-muted"}`}>{a.line}</p>
    </article>
  );
}

export function Achievements() {
  return (
    <Section id="achievements" number="06" eyebrow="Achievements" lead="Proud" accent="moments.">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {achievements.map((a, i) => (
          <li key={a.label}>
            <Reveal delay={i * 0.06} className="h-full">
              <Card a={a} index={i} />
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
