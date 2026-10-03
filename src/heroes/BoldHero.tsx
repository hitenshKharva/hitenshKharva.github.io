import { AnimatePresence, m } from "motion/react";
import { useEffect, useState } from "react";
import { buildPhrases, profile } from "../content";
import { Headline, HeroActions, HeroSection, useIntro } from "./shared";

function RotatingLine() {
  const { reduce } = useIntro();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % buildPhrases.length), 2400);
    return () => window.clearInterval(t);
  }, [reduce, paused]);

  // Reduced motion: no rotation, show every phrase at once.
  if (reduce) {
    return (
      <p className="font-display text-2xl font-semibold text-fg sm:text-3xl">
        I build <span className="text-accent">{buildPhrases.join(", ")}</span>.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <p className="font-display text-2xl font-semibold text-fg sm:text-4xl">
        <span className="sr-only">I build {buildPhrases.join(", ")}.</span>
        <span aria-hidden="true" className="inline-flex flex-wrap items-baseline gap-x-[0.3em]">
          I build
          <span className="relative inline-grid overflow-hidden align-bottom">
            <AnimatePresence mode="wait" initial={false}>
              <m.span
                key={buildPhrases[i]}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="whitespace-nowrap text-accent underline decoration-4 underline-offset-8"
              >
                {buildPhrases[i]}
              </m.span>
            </AnimatePresence>
          </span>
        </span>
      </p>
      {/* WCAG 2.2.2: anything that moves for >5s needs a pause control. */}
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        className="min-h-11 rounded-none border-2 border-fg px-3 font-mono text-xs font-semibold uppercase tracking-wider text-fg hover:bg-fg hover:text-bg"
      >
        {paused ? "Play" : "Pause"}
        <span className="sr-only"> rotating text</span>
      </button>
    </div>
  );
}

export default function BoldHero() {
  const { container, item, reduce } = useIntro(0.14);
  const letters = (word: string, offset: number) =>
    word.split("").map((ch, i) => (
      <m.span
        key={i}
        className="inline-block"
        variants={{
          hidden: { y: reduce ? 0 : "0.6em", opacity: 0 },
          show: { y: 0, opacity: 1, transition: { delay: reduce ? 0 : (offset + i) * 0.03, duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] } },
        }}
      >
        {ch}
      </m.span>
    ));

  return (
    <HeroSection className="mx-auto max-w-6xl overflow-hidden px-4 pb-16 pt-10 sm:px-6 md:pt-16">
      <m.div variants={container} initial="hidden" animate="show">
        <m.h1
          id="hero-title"
          aria-label={profile.name}
          variants={{ hidden: {}, show: {} }}
          className="font-display font-bold uppercase leading-[0.85] tracking-tighter text-fg"
          style={{ fontSize: "clamp(3.5rem, 17vw, 13rem)" }}
        >
          <span aria-hidden="true" className="block">
            {letters(profile.firstName, 0)}
          </span>
          <span aria-hidden="true" className="block text-accent">
            {letters(profile.lastName, profile.firstName.length)}
          </span>
        </m.h1>
        <m.div variants={item} className="mt-8 border-t-4 border-fg pt-6">
          <RotatingLine />
        </m.div>
        <m.div variants={item}>
          <Headline className="mt-4 max-w-2xl text-lg text-muted" />
        </m.div>
        <HeroActions item={item} />
      </m.div>
    </HeroSection>
  );
}
