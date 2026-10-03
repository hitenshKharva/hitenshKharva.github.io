import { m, type Variants } from "motion/react";
import { profile } from "../content";
import { Eyebrow, HeroActions, HeroSection, useIntro } from "./shared";
import { QueryConsole } from "./QueryConsole";

export default function DefaultHero() {
  const { container, item, reduce } = useIntro(0.08);
  // Text slides in but is never transparent, so it paints immediately (keeps LCP fast).
  const text: Variants = {
    hidden: { y: reduce ? 0 : 14 },
    show: { y: 0, transition: { duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] } },
  };
  return (
    <HeroSection className="relative overflow-hidden">
      {/* Faint grid: a nod to tables and schemas. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(var(--fg)_1px,transparent_1px),linear-gradient(90deg,var(--fg)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_30%_20%,black,transparent_70%)]"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-12 sm:px-6 md:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <m.div variants={container} initial="hidden" animate="show" className="min-w-0">
          <m.div variants={text}>
            <Eyebrow className="font-mono text-xs uppercase tracking-[0.18em] text-muted sm:text-sm" />
          </m.div>
          <m.h1
            variants={text}
            id="hero-title"
            className="mt-5 font-display text-6xl leading-[0.95] text-fg sm:text-7xl lg:text-8xl"
          >
            {profile.firstName}
            <br />
            <em className="text-accent">{profile.lastName}</em>
          </m.h1>
          <m.p variants={text} className="mt-6 max-w-xl text-2xl leading-snug text-fg sm:text-[1.7rem]">
            {profile.headline}
          </m.p>
          <m.p variants={text} className="mt-4 max-w-xl text-muted">
            {profile.differentiator}
          </m.p>
          <HeroActions item={item} />
        </m.div>
        <m.div variants={item} initial="hidden" animate="show" transition={{ delay: 0.35 }} className="min-w-0">
          <QueryConsole />
        </m.div>
      </div>
    </HeroSection>
  );
}
