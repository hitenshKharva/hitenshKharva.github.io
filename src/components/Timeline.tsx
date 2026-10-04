import { m, useReducedMotion, useScroll } from "motion/react";
import { useRef, type MouseEvent } from "react";
import { timeline, type TimelineEntry } from "../content/site";
import { useScrollTo } from "../lib/smoothScroll";
import { Icon } from "./Icon";
import { Section } from "./Section";

function Card({ entry, side }: { entry: TimelineEntry; side: "left" | "right" }) {
  const reduce = useReducedMotion();
  const edu = entry.kind === "education";
  return (
    <m.article
      initial={reduce ? false : { opacity: 0, x: side === "left" ? -28 : 28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-3xl border border-line bg-surface/90 p-5 shadow-[0_20px_50px_-30px_rgb(28_31_46/0.35)] sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span
          className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${
            edu ? "border border-ink/30 text-ink" : "bg-ink text-on-ink"
          }`}
        >
          {edu ? "Education" : "Experience"}
        </span>
        <span className="font-mono text-xs text-muted">{entry.dates}</span>
      </div>
      <h3 className="mt-3 text-xl font-extrabold leading-tight tracking-tight text-ink sm:text-2xl">{entry.title}</h3>
      <p className="mt-0.5 text-sm text-muted">{entry.org}</p>
      {entry.bullets.length > 0 && (
        <ul className="mt-3 space-y-1.5 text-sm text-ink">
          {entry.bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-ink" />
              {b}
            </li>
          ))}
        </ul>
      )}
      {entry.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Topics">
          {entry.tags.map((t) => (
            <li key={t} className="rounded-full bg-[var(--bg)] px-2.5 py-1 font-mono text-[11px] text-ink">
              {t}
            </li>
          ))}
        </ul>
      )}
    </m.article>
  );
}

export function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const scrollTo = useScrollTo();
  // The ink line fills from the top as the timeline scrolls past the middle of the screen.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 65%", "end 65%"] });

  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollTo("#contact");
  };

  return (
    <Section
      id="experience"
      number="05"
      eyebrow="Experience"
      lead="Education &"
      accent="experience."
      intro="Banking software, backend, data, then AWS and Amazon, in order."
      className="glow"
    >
      <ol ref={ref} className="relative">
        {/* Track + scroll-driven fill. Left edge on mobile, centre on desktop. */}
        <span aria-hidden="true" className="absolute bottom-0 left-[7px] top-2 w-px bg-line md:left-1/2" />
        <m.span
          aria-hidden="true"
          className="absolute bottom-0 left-[7px] top-2 w-px origin-top bg-ink md:left-1/2"
          style={{ scaleY: reduce ? 1 : scrollYProgress }}
        />

        {timeline.map((entry, i) => {
          const side = i % 2 === 0 ? "left" : "right";
          const showYear = i === 0 || timeline[i - 1].year !== entry.year;
          return (
            <li key={`${entry.year}-${entry.title}`} className="relative pb-12 pl-10 md:grid md:grid-cols-2 md:gap-16 md:pl-0 md:pb-16">
              {/* Dot on the line */}
              <span
                aria-hidden="true"
                className="absolute left-0 top-2 size-[15px] rounded-full border-[3px] border-[var(--bg)] bg-ink md:left-1/2 md:-translate-x-1/2"
              />
              {/* Year marker: opposite the card on desktop, above it on mobile */}
              <div className={`mb-3 md:mb-0 ${side === "left" ? "md:order-2" : ""}`}>
                {showYear && (
                  <p
                    className={`text-4xl font-extrabold leading-none tracking-[-0.04em] text-ink md:text-7xl ${
                      side === "left" ? "md:text-left" : "md:text-right"
                    }`}
                  >
                    {entry.year}
                  </p>
                )}
              </div>
              <div className={side === "left" ? "md:order-1" : ""}>
                <Card entry={entry} side={side} />
              </div>
            </li>
          );
        })}

        {/* What's next */}
        <li className="relative pl-10 md:grid md:grid-cols-2 md:gap-16 md:pl-0">
          <span
            aria-hidden="true"
            className="absolute left-0 top-3 size-[15px] rounded-full border-2 border-ink bg-[var(--bg)] md:left-1/2 md:-translate-x-1/2"
          />
          <p className="mb-3 font-serif text-5xl italic leading-none text-ink/70 md:order-2 md:mb-0 md:text-7xl">Next</p>
          <div className="md:order-1">
            <div className="rounded-3xl border border-dashed border-ink/30 bg-surface/70 p-6">
              <p className="text-2xl font-extrabold tracking-tight text-ink">Your team?</p>
              <p className="mt-1 text-muted">Building data platforms or applied AI? I'd like to hear about it.</p>
              <a
                href="#contact"
                onClick={go}
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-on-ink transition-transform duration-200 hover:-translate-y-0.5"
              >
                Let's talk <Icon name="arrowDown" size={15} />
              </a>
            </div>
          </div>
        </li>
      </ol>
    </Section>
  );
}
