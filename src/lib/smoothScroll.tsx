import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";

type ScrollTo = (target: string) => void;
const ScrollContext = createContext<ScrollTo>(() => {});

/** Header height, so section headings don't land under the floating nav. */
export const NAV_OFFSET = 88;

/** Lenis smooth scrolling, off entirely under prefers-reduced-motion. */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reduce) return;
    const instance = new Lenis({ lerp: 0.12 });
    lenis.current = instance;
    let raf = requestAnimationFrame(function loop(t) {
      instance.raf(t);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      instance.destroy();
      lenis.current = null;
    };
  }, [reduce]);

  const scrollTo = useCallback<ScrollTo>((target) => {
    const el = document.querySelector<HTMLElement>(target);
    if (!el) return;
    if (lenis.current) lenis.current.scrollTo(el, { offset: -NAV_OFFSET });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET });
    // Move focus for keyboard and screen-reader users without a second jump.
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
    history.replaceState(null, "", target);
  }, []);

  return <ScrollContext.Provider value={scrollTo}>{children}</ScrollContext.Provider>;
}

export const useScrollTo = () => useContext(ScrollContext);
