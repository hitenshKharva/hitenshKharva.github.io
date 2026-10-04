import { LazyMotion, MotionConfig, m, useReducedMotion } from "motion/react";
import type { MouseEvent } from "react";
import { HeroVisual } from "./components/HeroVisual";
import { Icon } from "./components/Icon";
import { Nav } from "./components/Nav";
import { Placeholder, Section } from "./components/Section";
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
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{profile.name}</p>
          <h1 id="hero-title" className="mt-3 text-6xl font-extrabold leading-[0.9] tracking-[-0.045em] text-ink sm:text-8xl">
            <span className="sr-only">{profile.name}, </span>
            {profile.title.text}
            <em className="font-serif font-normal">{profile.title.accent}</em>
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
        <Section id="about" number="01" eyebrow="About" lead="Hi, I'm" accent={`${profile.firstName}.`}>
          <Placeholder phase={3} what="Bio, swinging developer ID card and quick facts" />
        </Section>
        <Section
          id="skills"
          number="02"
          eyebrow="Skills"
          lead="The periodic table"
          accent="of my stack."
          intro="Elements in six families. Hover a tile to see how I've used it, or pick a family to light it up."
          className="glow"
        >
          <Placeholder phase={4} what="Periodic table of skills with family filters and hover detail" />
        </Section>
        <Section id="work" number="03" eyebrow="Work" lead="Things I've" accent="built." intro="Production systems at Amazon and side projects. Hover a panel to open it.">
          <Placeholder phase={5} what="Horizontal project accordion with illustrative mini UIs" />
        </Section>
        <Section id="certifications" number="04" eyebrow="Certifications" lead="Always" accent="learning.">
          <Placeholder phase={6} what="Numbered certifications list" />
        </Section>
        <Section
          id="experience"
          number="05"
          eyebrow="Experience"
          lead="Education &"
          accent="experience."
          intro="Banking software, backend, data, then AWS and Amazon, in order."
          className="glow"
        >
          <Placeholder phase={7} what="Scroll-filled timeline ending in “Next: your team?”" />
        </Section>
        <Section id="achievements" number="06" eyebrow="Achievements" lead="Proud" accent="moments.">
          <Placeholder phase={8} what="Impact stat cards with count-up" />
        </Section>
        <Section id="contact" number="07" eyebrow="Contact" lead="Let's" accent="build" tail="something.">
          <Placeholder phase={8} what="Email (copy), GitHub, LinkedIn, résumé" />
        </Section>
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-2 px-4 py-6 font-mono text-xs text-muted sm:px-6">
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
          <p>{profile.location}</p>
        </div>
      </footer>
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
