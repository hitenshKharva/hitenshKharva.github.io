import { LazyMotion, MotionConfig } from "motion/react";
import { lazy, Suspense } from "react";
import { Header } from "./components/Header";
import { Projects } from "./components/Projects";
import { Contact, Experience, Footer } from "./components/Sections";
import PipelineHero from "./heroes/PipelineHero";
import { SiteProvider, useSite, type Look } from "./state";

const loadMotionFeatures = () => import("./motion-features").then((mod) => mod.default);

// Pipeline is the default and ships in the main bundle; the rest load on demand.
const heroes: Record<Exclude<Look, "pipeline">, ReturnType<typeof lazy>> = {
  terminal: lazy(() => import("./heroes/TerminalHero")),
  bold: lazy(() => import("./heroes/BoldHero")),
  horizon: lazy(() => import("./heroes/HorizonHero")),
};

function Hero() {
  const { look } = useSite();
  if (look === "pipeline") return <PipelineHero />;
  const LazyHero = heroes[look];
  return (
    <Suspense fallback={<div className="min-h-[36rem]" aria-hidden="true" />}>
      <LazyHero key={look} />
    </Suspense>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadMotionFeatures} strict>
        <SiteProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            <div id="top" />
            <Hero />
            <Projects />
            <Experience />
            <Contact />
          </main>
          <Footer />
        </SiteProvider>
      </LazyMotion>
    </MotionConfig>
  );
}
