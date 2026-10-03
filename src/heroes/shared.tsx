import { m, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { profile } from "../content";
import { Icon } from "../components/Icon";
import { OrTodo } from "../components/Todo";

/** Parent/child variants for hero intro sequences. */
export function useIntro(stagger = 0.12) {
  const reduce = useReducedMotion();
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: reduce ? 0 : 0.1 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] } },
  };
  return { container, item, reduce };
}

export function Headline({ className = "" }: { className?: string }) {
  return (
    <p className={className}>
      <OrTodo value={profile.headline} label="headline" />
    </p>
  );
}

export function Subhead({ className = "" }: { className?: string }) {
  return <p className={className}>{profile.subhead}</p>;
}

export function Eyebrow({ className = "" }: { className?: string }) {
  return (
    <p className={className}>
      {profile.role} · {profile.company} · {profile.location}
    </p>
  );
}

export function HeroActions({ item }: { item: Variants }) {
  return (
    <m.div variants={item} className="mt-9 flex flex-wrap gap-3">
      <a
        href="#work"
        className="inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-6 font-semibold text-on-accent transition-transform duration-200 hover:-translate-y-0.5"
      >
        See the work <Icon name="arrowDown" size={16} />
      </a>
      <a
        href={`mailto:${profile.email}`}
        className="inline-flex min-h-12 items-center gap-2 rounded-full border border-line px-5 font-medium text-fg transition-colors duration-200 hover:border-accent hover:text-accent"
      >
        <Icon name="mail" /> Email me
      </a>
      {__HAS_RESUME__ && (
        <a
          href={profile.resume}
          target="_blank"
          rel="noopener"
          className="inline-flex min-h-12 items-center gap-2 rounded-full px-3 font-medium text-muted underline-offset-4 transition-colors duration-200 hover:text-fg hover:underline"
        >
          <Icon name="file" /> Résumé<span className="sr-only"> (PDF, opens in a new tab)</span>
        </a>
      )}
    </m.div>
  );
}

export function HeroSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section aria-labelledby="hero-title" className={`relative ${className}`}>
      {children}
    </section>
  );
}
