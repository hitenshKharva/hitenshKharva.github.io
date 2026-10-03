import { m, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Animated architecture strip: a packet travels through each stage and lights it up.
 * Horizontal when there's room, vertical on narrow screens. Runs only while visible;
 * static under reduced motion.
 */
export function FlowViz({ steps, size = "md" }: { steps: string[]; size?: "md" | "lg" }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [vertical, setVertical] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setVertical(e.contentRect.width < steps.length * 92));
    ro.observe(el);
    return () => ro.disconnect();
  }, [steps.length]);

  const animate = inView && !reduce;
  const n = steps.length;
  const per = 0.9; // seconds per hop
  const duration = per * (n - 1) + 1.2;
  // Each node lights up as the packet reaches it.
  const hit = (i: number) => (per * i) / duration;

  return (
    <div ref={ref} aria-hidden="true" className={`relative ${size === "lg" ? "p-6 sm:p-8" : "p-5"}`}>
      <ol className={`relative flex ${vertical ? "flex-col gap-3" : "items-center justify-between gap-2"}`}>
        {/* rail */}
        <span
          className={`absolute bg-line ${vertical ? "bottom-4 left-[0.6rem] top-4 w-px" : "left-6 right-6 top-1/2 h-px -translate-y-1/2"}`}
        />
        {animate && (
          <m.span
            className="absolute z-0 size-2.5 rounded-full bg-accent shadow-[0_0_14px_var(--accent)]"
            style={vertical ? { left: "0.32rem" } : { top: "calc(50% - 0.3125rem)" }}
            initial={vertical ? { top: "1rem" } : { left: "1.5rem" }}
            animate={vertical ? { top: ["1rem", "calc(100% - 1.6rem)"] } : { left: ["1.5rem", "calc(100% - 2.1rem)"] }}
            transition={{ duration: per * (n - 1), ease: "linear", repeat: Infinity, repeatDelay: 1.2 }}
          />
        )}
        {steps.map((s, i) => (
          <li key={s} className={`relative z-[1] flex ${vertical ? "items-center gap-3 pl-0" : "flex-col items-center"}`}>
            <m.span
              className={`whitespace-nowrap rounded-md border bg-surface font-mono ${
                size === "lg" ? "px-3 py-2 text-xs sm:text-sm" : "px-2 py-1.5 text-[11px] sm:text-xs"
              } ${vertical ? "ml-6" : ""}`}
              initial={false}
              animate={
                animate
                  ? {
                      borderColor: ["var(--line)", "var(--line)", "var(--accent)", "var(--line)"],
                      color: ["var(--muted)", "var(--muted)", "var(--fg)", "var(--muted)"],
                    }
                  : { borderColor: i === n - 1 ? "var(--accent)" : "var(--line)", color: "var(--fg)" }
              }
              transition={
                animate
                  ? {
                      duration,
                      times: [0, Math.max(0, hit(i) - 0.02), hit(i) + 0.02, Math.min(1, hit(i) + 0.25)],
                      repeat: Infinity,
                      ease: "linear",
                    }
                  : { duration: 0 }
              }
            >
              {s}
            </m.span>
          </li>
        ))}
      </ol>
    </div>
  );
}
