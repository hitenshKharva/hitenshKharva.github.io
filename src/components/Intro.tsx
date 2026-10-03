import { m, useReducedMotion, type Variants } from "motion/react";
import { CATEGORY_LABEL, pillars, proof } from "../content";
import { useSite } from "../state";
import { Icon } from "./Icon";

function useStagger() {
  const reduce = useReducedMotion();
  const container: Variants = { hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.08 } } };
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] } },
  };
  return { container, item };
}

/** Four verified numbers directly under the hero, whatever the look. */
export function ProofStrip() {
  const { container, item } = useStagger();
  return (
    <section aria-label="Impact highlights" className="border-y border-line bg-surface/50">
      <m.ul
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 px-4 sm:px-6 lg:grid-cols-4"
      >
        {proof.map((p) => (
          <m.li key={p.value} variants={item} className="py-5 sm:py-6 sm:pr-6">
            <p className="font-display text-2xl font-bold text-accent sm:text-4xl">{p.value}</p>
            <p className="mt-1 text-sm leading-snug text-muted">{p.label}</p>
          </m.li>
        ))}
      </m.ul>
    </section>
  );
}

/** Data → AI → engineering: the one story the three skill sets tell together. */
export function Pillars() {
  const { jumpToCategory } = useSite();
  const { container, item } = useStagger();
  return (
    <section id="about" aria-labelledby="about-title" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-20 sm:px-6">
      <h2 id="about-title" className="font-display text-3xl font-bold text-fg sm:text-4xl">
        Data → AI → production
      </h2>
      <p className="mt-2 max-w-2xl text-muted">
        One job in three stages: get the data right, put models to work on it, and ship the software around both.
      </p>
      <m.ol
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-8 grid gap-4 md:grid-cols-3"
      >
        {pillars.map((p, i) => (
          <m.li key={p.category} variants={item} className="flex flex-col rounded-[var(--radius)] border border-line bg-surface p-5 sm:p-6">
            <p className="font-mono text-xs text-muted">
              <span className="text-accent">{String(i + 1).padStart(2, "0")}</span> / {CATEGORY_LABEL[p.category]}
            </p>
            <h3 className="mt-2 font-display text-xl font-semibold text-fg">{p.title}</h3>
            <p className="mt-1 text-muted">{p.line}</p>
            <ul className="mt-4 space-y-2 text-sm text-fg">
              {p.evidence.map((e) => (
                <li key={e} className="flex gap-2">
                  <span aria-hidden="true" className="text-accent">
                    ›
                  </span>
                  <span>{e}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => jumpToCategory(p.category)}
              className="mt-auto inline-flex min-h-11 items-center gap-1.5 self-start pt-4 font-medium text-accent underline-offset-4 hover:underline"
            >
              See {CATEGORY_LABEL[p.category]} work <Icon name="arrowDown" size={16} />
            </button>
          </m.li>
        ))}
      </m.ol>
    </section>
  );
}
