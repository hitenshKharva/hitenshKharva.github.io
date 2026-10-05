import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * prefers-reduced-motion, hydration-safe: reports `false` while hydrating the
 * prerendered HTML (matching the server), then the real value right after.
 * Motion's own hook reads matchMedia on the first client render, which mismatches.
 */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
}
