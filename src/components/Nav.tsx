import { m } from "motion/react";
import { useReducedMotion } from "../lib/useReducedMotion";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { profile } from "../content/site";
import { useScrollTo } from "../lib/smoothScroll";
import { useScrollSpy } from "../lib/useScrollSpy";

export const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
];
const IDS = NAV_ITEMS.map((n) => n.id);

export function Nav() {
  const active = useScrollSpy(IDS);
  const scrollTo = useScrollTo();
  const reduce = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);
  // Fade an edge only while there are more items hidden past it.
  const [fade, setFade] = useState({ left: false, right: false });
  const updateFade = () => {
    const n = navRef.current;
    if (!n) return;
    setFade({ left: n.scrollLeft > 4, right: n.scrollLeft + n.clientWidth < n.scrollWidth - 4 });
  };
  useEffect(() => {
    updateFade();
    window.addEventListener("resize", updateFade);
    return () => window.removeEventListener("resize", updateFade);
  }, []);

  // On narrow screens the pill row scrolls sideways: keep the active item in view.
  useEffect(() => {
    const nav = navRef.current;
    const el = nav?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!nav || !el || nav.scrollWidth <= nav.clientWidth) return;
    const left = el.offsetLeft - (nav.clientWidth - el.offsetWidth) / 2;
    nav.scrollTo({ left, behavior: reduce ? "auto" : "smooth" });
  }, [active, reduce]);

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    scrollTo(`#${id}`);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <a
          href="#top"
          onClick={(e) => go(e, "top")}
          className="pointer-events-auto hidden min-h-11 items-center rounded-full border border-line/80 bg-surface/70 px-4 text-sm font-medium text-ink shadow-[0_8px_30px_-12px_rgb(28_31_46/0.25)] backdrop-blur-md sm:inline-flex"
        >
          {profile.name}
        </a>
        <nav
          ref={navRef}
          onScroll={updateFade}
          aria-label="Sections"
          style={{
            maskImage: `linear-gradient(to right, ${fade.left ? "transparent, black 12%" : "black"}, ${fade.right ? "black 88%, transparent" : "black"})`,
          }}
          className="pointer-events-auto -mx-1 max-w-full overflow-x-auto rounded-full border border-line/80 bg-surface/70 p-1 shadow-[0_8px_30px_-12px_rgb(28_31_46/0.25)] backdrop-blur-md [scrollbar-width:none] sm:mx-0"
        >
          <ul className="flex">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id} className="shrink-0">
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => go(e, item.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative inline-flex min-h-10 items-center rounded-full px-3 text-[13px] transition-colors duration-200 sm:px-4 sm:text-sm ${
                      isActive ? "text-on-ink" : "text-ink/80 hover:text-ink"
                    }`}
                  >
                    {isActive && (
                      <m.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-ink"
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
