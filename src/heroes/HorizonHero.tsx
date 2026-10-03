import { m } from "motion/react";
import { profile } from "../content";
import { BlackHole } from "./BlackHole";
import { Headline, HeroActions, HeroSection, useIntro } from "./shared";

export default function HorizonHero() {
  const { container, item, reduce } = useIntro(0.16);
  return (
    <HeroSection className="relative isolate flex min-h-[calc(100svh-4.5rem)] items-end overflow-hidden">
      <BlackHole reduceMotion={!!reduce} />
      {/* Scrim keeps text at 4.5:1 over the brightest parts of the disk. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,var(--bg)_0%,rgb(6_6_10/.85)_30%,transparent_65%)] md:bg-[linear-gradient(to_right,var(--bg)_0%,rgb(6_6_10/.8)_35%,transparent_60%)]"
      />
      <m.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-40 sm:px-6 md:pb-24"
      >
        <m.p variants={item} className="font-mono text-sm uppercase tracking-[0.3em] text-accent">
          {profile.location}
        </m.p>
        <m.h1 variants={item} id="hero-title" className="mt-4 max-w-xl font-display text-5xl font-semibold leading-[1.05] text-fg sm:text-6xl lg:text-7xl">
          {profile.name}
        </m.h1>
        <m.div variants={item}>
          <Headline className="mt-5 max-w-lg text-lg text-muted" />
        </m.div>
        <HeroActions item={item} />
      </m.div>
    </HeroSection>
  );
}
