import { LazyMotion, MotionConfig, m } from "motion/react";
import { useReducedMotion } from "./lib/useReducedMotion";
import type { MouseEvent } from "react";
import { About } from "./components/About";
import { Achievements } from "./components/Achievements";
import { Contact, Footer } from "./components/Contact";
import { Certifications } from "./components/Certifications";
import { HeroVisual } from "./components/HeroVisual";
import { Icon } from "./components/Icon";
import { Nav } from "./components/Nav";
import { Skills } from "./components/Skills";
import { Timeline } from "./components/Timeline";
import { Work } from "./components/Work";
import { profile } from "./content/site";
import { SmoothScrollProvider, useScrollTo } from "./lib/smoothScroll";

const loadMotionFeatures = () => import("./motion-features").then((mod) => mod.default);

function Hero() {
  const reduce = useReducedMotion();
  const scrollTo = useScrollTo();
  const go = (e: MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    scrollTo(target);
  };
  return (
    <section id="top" aria-labelledby="hero-title" className="glow relative flex min-h-[100svh] flex-col overflow-hidden outline-none">
      {/* Oversized watermark name. */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[14%] select-none text-center text-[22vw] font-extrabold uppercase leading-none tracking-[-0.06em] text-ink/[0.05]"
      >
        {profile.firstName}
      </p>

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-14 pt-28 sm:px-6">
        <div className="relative my-6 min-h-[260px] flex-1 sm:min-h-[320px]">
          <HeroVisual />
        </div>

        <m.div
          initial={reduce ? false : { y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1" aria-hidden="true">
            <span className="text-2xl font-bold tracking-[-0.02em] text-ink sm:text-3xl">{profile.name}</span>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{profile.roleLine}</span>
          </p>
          <h1 id="hero-title" className="mt-4 text-5xl font-extrabold leading-[0.92] tracking-[-0.045em] text-ink sm:text-7xl lg:text-8xl">
            <span className="sr-only">
              {profile.name}, {profile.roleLine}.{" "}
            </span>
            {profile.headline.lead}
            <br />
            <em className="font-serif font-normal tracking-normal">{profile.headline.accent}</em>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted sm:text-xl">{profile.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#work"
              onClick={(e) => go(e, "#work")}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 font-medium text-on-ink transition-transform duration-200 hover:-translate-y-0.5"
            >
              Explore work <Icon name="arrowDown" size={16} />
            </a>
            <a
              href="#contact"
              onClick={(e) => go(e, "#contact")}
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-ink/25 px-6 font-medium text-ink transition-colors duration-200 hover:border-ink"
            >
              Let&apos;s talk
            </a>
          </div>
        </m.div>
      </div>
    </section>
  );
}

function Page() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <Skills />
        <Work />
        <Certifications />
        <Timeline />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadMotionFeatures} strict>
        <SmoothScrollProvider>
          <Page />
        </SmoothScrollProvider>
      </LazyMotion>
    </MotionConfig>
  );
}
