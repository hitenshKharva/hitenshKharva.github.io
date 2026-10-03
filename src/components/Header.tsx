import { m, useReducedMotion, useScroll, useSpring } from "motion/react";
import type { KeyboardEvent } from "react";
import { LOOKS, LOOK_LABEL, useSite } from "../state";
import { profile } from "../content";
import { Icon } from "./Icon";

function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  return (
    <m.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-accent"
      style={{ scaleX: reduce ? scrollYProgress : smooth }}
    />
  );
}

export function LookSwitcher() {
  const { look, setLook } = useSite();
  const reduce = useReducedMotion();

  // Radio-group keyboard pattern: arrows move between looks.
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = LOOKS[(LOOKS.indexOf(look) + dir + LOOKS.length) % LOOKS.length];
    setLook(next);
    e.currentTarget.querySelector<HTMLButtonElement>(`[data-look-option="${next}"]`)?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-labelledby="look-label"
      onKeyDown={onKeyDown}
      className="flex rounded-full border border-line bg-surface p-1"
    >
      {LOOKS.map((l) => {
        const active = l === look;
        return (
          <button
            key={l}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            data-look-option={l}
            onClick={() => setLook(l)}
            className={`relative min-h-10 rounded-full px-2.5 font-mono text-xs font-medium transition-colors duration-200 sm:px-3.5 sm:text-sm ${
              active ? "text-on-accent" : "text-muted hover:text-fg"
            }`}
          >
            {active && (
              <m.span
                layoutId="look-indicator"
                className="absolute inset-0 rounded-full bg-accent"
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{LOOK_LABEL[l]}</span>
          </button>
        );
      })}
    </div>
  );
}

const NAV = [
  { href: "#work", label: "Work" },
  { href: "#story", label: "Story" },
  { href: "#skills", label: "Toolbox" },
];

export function Header() {
  return (
    <>
      <ScrollProgress />
      <header className="sticky top-0 z-40 border-b border-line/60 bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <a href="#top" className="font-mono text-base font-bold tracking-tight text-fg">
            {profile.firstName.slice(0, 1)}
            {profile.lastName.slice(0, 1)}
            <span className="text-accent" aria-hidden="true">_</span>
            <span className="sr-only">, {profile.name}, back to top</span>
          </a>
          <nav aria-label="Sections" className="hidden md:block">
            <ul className="flex gap-6 text-sm">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-muted transition-colors duration-200 hover:text-fg">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-4 text-sm font-semibold text-on-accent transition-transform duration-200 hover:-translate-y-0.5"
          >
            <Icon name="mail" size={16} /> Email me
          </a>
        </div>
      </header>
    </>
  );
}
