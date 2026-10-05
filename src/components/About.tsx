import { m, useInView, useMotionValue, type MotionValue, type PanInfo } from "motion/react";
import { useReducedMotion } from "../lib/useReducedMotion";
import { useEffect, useMemo, useRef } from "react";
import { about, links, profile, quickFacts } from "../content/site";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";
import { Eyebrow, Heading } from "./Section";

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Tiny damped-spring pendulum. Motion's standalone animate() would pull the whole
 * animation engine into the main bundle, so the swing is integrated by hand.
 */
function useSwing(angle: MotionValue<number>) {
  const raf = useRef(0);
  const stop = () => {
    cancelAnimationFrame(raf.current);
    raf.current = 0;
  };
  const release = (velocity = 0) => {
    stop();
    let v = velocity;
    let last = performance.now();
    const k = 70; // stiffness
    const c = 5; // damping
    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const x = angle.get();
      v += (-k * x - c * v) * dt;
      const next = x + v * dt;
      if (Math.abs(next) < 0.05 && Math.abs(v) < 0.05) {
        angle.set(0);
        raf.current = 0;
        return;
      }
      angle.set(next);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };
  useEffect(() => stop, []);
  return { release, stop };
}

/** Deterministic barcode bars from a string, so it's stable between renders. */
function Barcode({ seed }: { seed: string }) {
  const bars = useMemo(() => {
    let h = 7;
    return Array.from({ length: 34 }, (_, i) => {
      h = (h * 31 + seed.charCodeAt(i % seed.length)) % 997;
      return 1 + (h % 3);
    });
  }, [seed]);
  let x = 0;
  return (
    <svg viewBox="0 0 120 28" className="h-7 w-full" aria-hidden="true">
      {bars.map((w, i) => {
        const rect = i % 2 === 0 ? <rect key={i} x={x} y={0} width={w} height={28} fill="currentColor" /> : null;
        x += w + 1;
        return rect;
      })}
    </svg>
  );
}

/**
 * Lanyard ID card that hangs from the top of the section. It swings in once on first view,
 * nudges on hover and can be pulled sideways (spring physics). Static under reduced motion.
 */
function IdCard() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const angle = useMotionValue(0);
  const { release: swing, stop } = useSwing(angle);

  useEffect(() => {
    if (!inView || reduce) return;
    angle.set(14);
    swing();
  }, [inView, reduce]);

  const onPan = (_: PointerEvent, info: PanInfo) => {
    if (reduce) return;
    stop();
    angle.set(clamp(-info.offset.x / 5, -32, 32));
  };
  const onPanEnd = (_: PointerEvent, info: PanInfo) => {
    if (reduce) return;
    swing(-info.velocity.x / 5);
  };
  const onHover = () => {
    if (reduce || Math.abs(angle.get()) > 1) return;
    angle.set(-5);
    swing();
  };

  const initials = `${profile.firstName[0]}${profile.lastName[0]}`;
  return (
    <div ref={ref} className="relative flex justify-center">
      <m.div
        style={{ rotate: angle, transformOrigin: "50% 0%", touchAction: "pan-y" }}
        onPan={onPan}
        onPanEnd={onPanEnd}
        onHoverStart={onHover}
        className="relative flex cursor-grab flex-col items-center active:cursor-grabbing"
      >
        {/* Strap */}
        <div aria-hidden="true" className="flex h-36 w-6 items-center justify-center overflow-hidden bg-ink sm:h-44">
          <span className="whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.3em] text-on-ink/80 [writing-mode:vertical-rl]">
            {profile.lastName} · {profile.firstName} · {profile.lastName}
          </span>
        </div>
        {/* Clip */}
        <div aria-hidden="true" className="-mt-1 h-5 w-10 rounded-b-md rounded-t-sm border border-[#8c8275] bg-[#d6ccb9]" />
        <div aria-hidden="true" className="-mt-1 size-4 rounded-full border-2 border-[#8c8275]" />

        {/* Card */}
        <div
          role="img"
          aria-label={`Developer ID card: ${profile.name}, ${profile.role}`}
          className="-mt-1 w-64 select-none overflow-hidden rounded-[22px] border border-line bg-surface shadow-[0_30px_60px_-25px_rgb(28_31_46/0.45)] sm:w-72"
        >
          <div className="flex items-center gap-3 bg-ink px-5 py-4 text-on-ink">
            <span className="flex size-9 items-center justify-center rounded-full border border-on-ink/40 font-mono text-xs">{initials}</span>
            <div className="leading-tight">
              <p className="text-sm font-bold tracking-wide">DEVELOPER ID</p>
              <p className="font-mono text-[10px] text-on-ink/70">Portfolio · 2026</p>
            </div>
          </div>
          <div className="px-5 pb-5 pt-5 text-center">
            <div className="mx-auto flex aspect-[4/5] w-32 items-center justify-center overflow-hidden rounded-2xl border border-line bg-[linear-gradient(160deg,#e8e0cf,#d6ccb9)]">
              {profile.photo ? (
                <img src={profile.photo} alt="" width={384} height={480} loading="lazy" decoding="async" className="h-full w-full object-cover" draggable={false} />
              ) : (
                <span className="font-serif text-6xl italic text-ink/80">{initials}</span>
              )}
            </div>
            <p className="mt-4 text-lg font-extrabold uppercase tracking-tight text-ink">{profile.name}</p>
            <p className="text-sm text-muted">{profile.role}</p>
            <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-3 text-left">
              {[
                ["ID No.", "HK-0001"],
                ["Dept.", "Data Eng."],
                ["Valid till", "∞"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-[9px] uppercase tracking-wider text-muted">{k}</dt>
                  <dd className="text-xs font-semibold text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 text-ink">
              <Barcode seed={profile.name} />
            </div>
          </div>
        </div>
      </m.div>
    </div>
  );
}

const pillCls =
  "inline-flex min-h-11 items-center gap-1.5 rounded-full border border-ink/20 px-4 text-sm font-medium text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-on-ink";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative outline-none">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 pb-24 sm:px-6 sm:pb-32 lg:grid-cols-[1.15fr_auto_1fr] lg:gap-12">
        <Reveal className="pt-24 sm:pt-32 lg:pt-40">
          <Eyebrow number="01" label="About" />
          <div className="mt-6">
            <Heading id="about-title" lead="Hi, I'm" accent={`${profile.firstName}.`} />
          </div>
          {about.bio.map((p, i) => (
            <p key={i} className={`mt-6 max-w-xl ${i === 0 ? "text-lg text-ink" : "text-muted"}`}>
              {p}
            </p>
          ))}
          <div className="mt-8 flex flex-wrap gap-2.5">
            {__HAS_RESUME__ && (
              <a href={profile.resume} download className={pillCls}>
                Resume <Icon name="arrowDown" size={15} />
              </a>
            )}
            <a href={links.github} target="_blank" rel="noopener noreferrer" className={pillCls}>
              GitHub <Icon name="external" size={15} />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className={pillCls}>
              LinkedIn <Icon name="external" size={15} />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </Reveal>

        {/* Hangs from the top edge of the section. */}
        <div className="order-first -mb-6 lg:order-none lg:mb-0">
          <IdCard />
        </div>

        <Reveal delay={0.1} className="lg:pt-40">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Quick facts</p>
          <dl className="mt-4 divide-y divide-line border-y border-line">
            {quickFacts.map((f) => (
              <div key={f.label} className="flex items-baseline justify-between gap-4 py-3.5">
                <dt className="text-sm text-muted">{f.label}</dt>
                <dd className="text-right text-sm font-semibold text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
          <blockquote className="mt-10 font-serif text-3xl italic leading-snug text-ink/80 sm:text-4xl">
            &ldquo;{about.quote}&rdquo;
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
