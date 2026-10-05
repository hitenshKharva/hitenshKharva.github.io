import { useReducedMotion } from "../lib/useReducedMotion";
import { useEffect, useRef, useState } from "react";
import { profile } from "../content/site";
import { Icon } from "./Icon";

const INK = "28, 31, 46";

interface Particle {
  lane: number;
  t: number; // 0..1 along the whole path (0..0.5 source→core, 0.5..1 core→sink)
  speed: number;
  size: number;
}

/**
 * "Raw events → real decisions": scattered points stream from many sources into a
 * pipeline core and leave as one orderly line. Canvas 2D, ink on cream.
 * Pauses off-screen and when the tab is hidden; a still frame under reduced motion.
 */
function DataFlowCanvas({ playing }: { playing: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let lanes: number[] = [];
    let particles: Particle[] = [];
    let raf = 0;
    let visible = true;
    let last = performance.now();

    function setup() {
      const rect = canvas!.getBoundingClientRect();
      const phone = rect.width < 640;
      const dpr = Math.min(window.devicePixelRatio || 1, phone ? 1.5 : 2);
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const laneCount = phone ? 6 : 9;
      lanes = Array.from({ length: laneCount }, (_, i) => 0.12 + (0.76 * i) / (laneCount - 1));
      const count = phone ? 70 : 150;
      // Deterministic spread so the still frame looks the same every time.
      particles = Array.from({ length: count }, (_, i) => ({
        lane: i % laneCount,
        t: (i * 0.6180339) % 1,
        speed: 0.05 + ((i * 7) % 10) / 160,
        size: 1.4 + ((i * 3) % 5) * 0.35,
      }));
    }

    const core = () => ({ x: w * 0.56, y: h * 0.5 });
    const sourceX = () => w * 0.04;
    const sinkX = () => w * 0.97;

    // Cubic bezier from a source lane into the core.
    function inPoint(lane: number, u: number) {
      const c = core();
      const x0 = sourceX();
      const y0 = h * lanes[lane];
      const cx1 = x0 + (c.x - x0) * 0.45;
      const cx2 = x0 + (c.x - x0) * 0.6;
      const mt = 1 - u;
      const x = mt ** 3 * x0 + 3 * mt * mt * u * cx1 + 3 * mt * u * u * cx2 + u ** 3 * c.x;
      const y = mt ** 3 * y0 + 3 * mt * mt * u * y0 + 3 * mt * u * u * c.y + u ** 3 * c.y;
      return { x, y };
    }

    function draw(time: number) {
      ctx!.clearRect(0, 0, w, h);
      const c = core();

      // Lanes.
      ctx!.lineWidth = 1;
      ctx!.strokeStyle = `rgba(${INK}, 0.10)`;
      lanes.forEach((_, lane) => {
        ctx!.beginPath();
        for (let s = 0; s <= 24; s++) {
          const p = inPoint(lane, s / 24);
          if (s === 0) ctx!.moveTo(p.x, p.y);
          else ctx!.lineTo(p.x, p.y);
        }
        ctx!.stroke();
      });
      ctx!.strokeStyle = `rgba(${INK}, 0.22)`;
      ctx!.beginPath();
      ctx!.moveTo(c.x, c.y);
      ctx!.lineTo(sinkX(), c.y);
      ctx!.stroke();

      // Particles: round and scattered on the way in, square and in step on the way out.
      particles.forEach((p) => {
        if (p.t < 0.5) {
          const u = p.t / 0.5;
          const pt = inPoint(p.lane, u);
          ctx!.fillStyle = `rgba(${INK}, ${0.25 + u * 0.5})`;
          ctx!.beginPath();
          ctx!.arc(pt.x, pt.y, p.size, 0, Math.PI * 2);
          ctx!.fill();
        } else {
          const u = (p.t - 0.5) / 0.5;
          const x = c.x + (sinkX() - c.x) * u;
          const s = 3.2;
          ctx!.fillStyle = `rgba(${INK}, ${0.85 - u * 0.45})`;
          ctx!.fillRect(x - s / 2, c.y - s / 2, s, s);
        }
      });

      // Core: a ring that breathes slowly.
      const pulse = 1 + Math.sin(time / 700) * 0.06;
      const r = Math.min(w, h) * 0.075 * pulse;
      ctx!.fillStyle = "rgba(251, 248, 241, 0.95)";
      ctx!.beginPath();
      ctx!.arc(c.x, c.y, r, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.lineWidth = 1.5;
      ctx!.strokeStyle = `rgba(${INK}, 0.9)`;
      ctx!.stroke();
      ctx!.beginPath();
      ctx!.arc(c.x, c.y, r * 1.6, 0, Math.PI * 2);
      ctx!.strokeStyle = `rgba(${INK}, 0.12)`;
      ctx!.stroke();
      ctx!.fillStyle = `rgba(${INK}, 1)`;
      ctx!.beginPath();
      ctx!.arc(c.x, c.y, r * 0.28, 0, Math.PI * 2);
      ctx!.fill();
    }

    function step(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      particles.forEach((p) => {
        // Things move a little faster once they're structured.
        p.t += p.speed * dt * (p.t < 0.5 ? 1 : 1.4);
        if (p.t >= 1) p.t -= 1;
      });
      draw(now);
      raf = requestAnimationFrame(step);
    }

    const animate = playing && !reduce;
    const start = () => {
      if (!animate || raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    setup();
    draw(0);

    const ro = new ResizeObserver(() => {
      setup();
      draw(performance.now());
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [playing, reduce]);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}

/** Hero centrepiece: the avatar video when one is configured, otherwise the data-flow illustration. */
export function HeroVisual() {
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { avatar } = profile;
  const hasVideo = !!(avatar.webm || avatar.mp4);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing && !reduce) void v.play().catch(() => {});
    else v.pause();
  }, [playing, reduce]);

  return (
    <figure className="absolute inset-0">
      {hasVideo ? (
        <video
          ref={videoRef}
          className="mx-auto h-full w-auto object-contain"
          muted
          loop
          playsInline
          autoPlay={!reduce}
          poster={avatar.poster ?? undefined}
          aria-hidden="true"
        >
          {avatar.webm && <source src={avatar.webm} type="video/webm" />}
          {avatar.mp4 && <source src={avatar.mp4} type="video/mp4" />}
        </video>
      ) : (
        <>
          <DataFlowCanvas playing={playing} />
          <span aria-hidden="true" className="absolute left-[4%] top-[6%] font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Raw events
          </span>
          <span aria-hidden="true" className="absolute bottom-[6%] right-[3%] font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Real decisions
          </span>
        </>
      )}
      <figcaption className="sr-only">
        {hasVideo ? `Animated avatar of ${profile.name}.` : "Illustration: raw events flowing into a pipeline and out as real decisions."}
      </figcaption>
      {!reduce && (
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause animation" : "Play animation"}
          className="absolute right-0 top-0 inline-flex size-11 items-center justify-center rounded-full bg-ink text-on-ink shadow-lg transition-transform duration-200 hover:scale-105"
        >
          <Icon name={playing ? "pause" : "play"} size={16} />
        </button>
      )}
    </figure>
  );
}
