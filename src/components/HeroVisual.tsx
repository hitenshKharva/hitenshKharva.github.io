import { useReducedMotion } from "../lib/useReducedMotion";
import { useEffect, useRef, useState } from "react";
import { heroOutput, profile, rawEvents, yearsShipping } from "../content/site";
import { Icon } from "./Icon";

const INK = "28, 31, 46";
const MUTED = "98, 92, 81";
const SURFACE = "251, 248, 241";
const MONO = '"JetBrains Mono", ui-monospace, monospace';
const SANS = '"Inter Tight", system-ui, sans-serif';

const CAPTION_EVERY = 2200; // ms between "entering the core" captions
const CAPTION_LIFE = 2600; // ms a caption stays (incl. fades)
const TAP_LIFE = 3200; // ms a tapped dot keeps its tooltip

interface Particle {
  lane: number;
  t: number; // 0..1 along the whole path (0..0.5 source→core, 0.5..1 core→sink)
  speed: number;
  size: number;
  event: number; // index into rawEvents
}

/**
 * "Data in. Decisions out.": dots stream in from the left, each carrying one raw event from
 * Hitensh's life and career. Hover (or tap) a dot to read it; every couple of seconds the dot
 * entering the HK core shows its event beside the core. Out comes one orderly line: the
 * engineer. Canvas 2D, ink on cream. Pauses off-screen and when the tab is hidden; a still
 * frame under reduced motion (hover still works).
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
    let phone = false;
    let lanes: number[] = [];
    let particles: Particle[] = [];
    let raf = 0;
    let visible = true;
    let last = performance.now();
    // Interaction state.
    let hovered: Particle | null = null;
    let tapped: { p: Particle; until: number } | null = null;
    let caption: { text: string; start: number } | null = null;
    let lastCaption = -Infinity;
    let pulseAt = -Infinity;

    function setup() {
      const rect = canvas!.getBoundingClientRect();
      phone = rect.width < 640;
      const dpr = Math.min(window.devicePixelRatio || 1, phone ? 1.5 : 2);
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const laneCount = phone ? 7 : 10;
      lanes = Array.from({ length: laneCount }, (_, i) => 0.12 + (0.76 * i) / (laneCount - 1));
      const count = phone ? 70 : 150;
      // Deterministic spread so the still frame looks the same every time.
      particles = Array.from({ length: count }, (_, i) => ({
        lane: i % laneCount,
        t: (i * 0.6180339) % 1,
        speed: 0.05 + ((i * 7) % 10) / 160,
        size: 1.6 + ((i * 3) % 5) * 0.4,
        event: (i * 7) % rawEvents.length,
      }));
      hovered = null;
      tapped = null;
    }

    const core = () => ({ x: phone ? w * 0.6 : w * 0.52, y: h * 0.5 });
    const coreR = () => Math.min(w, h) * 0.075;
    const sourceX = () => (phone ? 4 : w * 0.02);
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

    const isFrozen = (p: Particle) => p === hovered || p === tapped?.p;

    // Wrap text into lines that fit maxWidth.
    function wrap(text: string, maxWidth: number) {
      const words = text.split(" ");
      const lines: string[] = [];
      let line = "";
      words.forEach((word) => {
        const next = line ? `${line} ${word}` : word;
        if (ctx!.measureText(next).width > maxWidth && line) {
          lines.push(line);
          line = word;
        } else line = next;
      });
      if (line) lines.push(line);
      return lines;
    }

    function roundRect(x: number, y: number, rw: number, rh: number, r: number) {
      ctx!.beginPath();
      ctx!.moveTo(x + r, y);
      ctx!.arcTo(x + rw, y, x + rw, y + rh, r);
      ctx!.arcTo(x + rw, y + rh, x, y + rh, r);
      ctx!.arcTo(x, y + rh, x, y, r);
      ctx!.arcTo(x, y, x + rw, y, r);
      ctx!.closePath();
    }

    function drawTooltip(p: Particle) {
      const pt = inPoint(p.lane, p.t / 0.5);
      // Ring around the chosen dot.
      ctx!.strokeStyle = `rgba(${INK}, 0.9)`;
      ctx!.lineWidth = 1.5;
      ctx!.beginPath();
      ctx!.arc(pt.x, pt.y, p.size + 5, 0, Math.PI * 2);
      ctx!.stroke();

      ctx!.font = `500 ${phone ? 11 : 12}px ${SANS}`;
      const lines = wrap(rawEvents[p.event], phone ? 170 : 230);
      const lh = phone ? 15 : 16;
      const tw = Math.max(...lines.map((l) => ctx!.measureText(l).width)) + 20;
      const th = lines.length * lh + 14;
      let x = pt.x + 12;
      let y = pt.y - th - 10;
      if (x + tw > w - 4) x = pt.x - tw - 12;
      if (x < 4) x = 4;
      if (y < 4) y = pt.y + 12;
      ctx!.shadowColor = `rgba(${INK}, 0.18)`;
      ctx!.shadowBlur = 16;
      ctx!.shadowOffsetY = 6;
      ctx!.fillStyle = `rgba(${SURFACE}, 0.98)`;
      roundRect(x, y, tw, th, 10);
      ctx!.fill();
      ctx!.shadowColor = "transparent";
      ctx!.strokeStyle = `rgba(${INK}, 0.15)`;
      ctx!.lineWidth = 1;
      ctx!.stroke();
      ctx!.fillStyle = `rgba(${INK}, 1)`;
      ctx!.textAlign = "left";
      ctx!.textBaseline = "top";
      lines.forEach((l, i) => ctx!.fillText(l, x + 10, y + 8 + i * lh));
    }

    function drawCaption(time: number) {
      if (!caption) return;
      const age = time - caption.start;
      if (age > CAPTION_LIFE) {
        caption = null;
        return;
      }
      const alpha = Math.min(1, age / 220, (CAPTION_LIFE - age) / 500);
      const c = core();
      const r = coreR();
      ctx!.textAlign = "center";
      ctx!.textBaseline = "top";
      ctx!.font = `${phone ? 9 : 10}px ${MONO}`;
      ctx!.fillStyle = `rgba(${MUTED}, ${alpha})`;
      const y0 = c.y + r * 1.75 + 6;
      ctx!.fillText("↳ PROCESSING", c.x, y0);
      ctx!.font = `500 ${phone ? 11 : 13}px ${SANS}`;
      ctx!.fillStyle = `rgba(${INK}, ${alpha})`;
      const maxW = Math.min(phone ? 200 : 300, 2 * Math.min(c.x, w - c.x) - 12);
      wrap(caption.text, maxW)
        .slice(0, 2)
        .forEach((l, i) => ctx!.fillText(l, c.x, y0 + 15 + i * (phone ? 14 : 17)));
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
          const focus = isFrozen(p);
          ctx!.fillStyle = `rgba(${INK}, ${focus ? 1 : 0.3 + u * 0.5})`;
          ctx!.beginPath();
          ctx!.arc(pt.x, pt.y, focus ? p.size + 1.5 : p.size, 0, Math.PI * 2);
          ctx!.fill();
        } else {
          const u = (p.t - 0.5) / 0.5;
          const x = c.x + (sinkX() - c.x) * u;
          const s = 3.2;
          ctx!.fillStyle = `rgba(${INK}, ${0.85 - u * 0.45})`;
          ctx!.fillRect(x - s / 2, c.y - s / 2, s, s);
        }
      });

      // Core: a ring that breathes, with a brief flash when an event is processed.
      const breathe = 1 + Math.sin(time / 700) * 0.06;
      const flash = Math.max(0, 1 - (time - pulseAt) / 600);
      const r = coreR() * breathe;
      ctx!.fillStyle = `rgba(${SURFACE}, 0.95)`;
      ctx!.beginPath();
      ctx!.arc(c.x, c.y, r, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.lineWidth = 1.5;
      ctx!.strokeStyle = `rgba(${INK}, 0.9)`;
      ctx!.stroke();
      ctx!.beginPath();
      ctx!.arc(c.x, c.y, r * (1.6 + flash * 0.25), 0, Math.PI * 2);
      ctx!.strokeStyle = `rgba(${INK}, ${0.12 + flash * 0.35})`;
      ctx!.stroke();
      ctx!.fillStyle = `rgba(${INK}, 1)`;
      ctx!.font = `800 ${Math.round(r * 0.62)}px ${SANS}`;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      ctx!.fillText("HK", c.x, c.y + 1);

      ctx!.textAlign = "right";
      ctx!.textBaseline = "middle";
      ctx!.font = `600 ${phone ? 10 : 12}px ${MONO}`;
      ctx!.fillStyle = `rgba(${INK}, 1)`;
      // Output: the current release. vN.0 = N years since the first role; spelled out below.
      const years = yearsShipping();
      ctx!.fillText(`ENGINEER v${years}.0`, sinkX(), c.y - (phone ? 14 : 18));
      ctx!.font = `${phone ? 10 : 11}px ${MONO}`;
      ctx!.fillStyle = `rgba(${MUTED}, 1)`;
      ctx!.fillText(phone ? `${years} yrs shipping` : `${years} yrs · ${heroOutput.tags}`, sinkX(), c.y + (phone ? 14 : 18));

      drawCaption(time);
      const tip = hovered ?? (tapped && tapped.until > time ? tapped.p : null);
      if (tip && tip.t < 0.5) drawTooltip(tip);
    }

    function step(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (tapped && tapped.until <= now) tapped = null;
      particles.forEach((p) => {
        if (isFrozen(p)) return;
        const before = p.t;
        // Things move a little faster once they're structured.
        p.t += p.speed * dt * (p.t < 0.5 ? 1 : 1.4);
        if (before < 0.5 && p.t >= 0.5 && now - lastCaption > CAPTION_EVERY) {
          caption = { text: rawEvents[p.event], start: now };
          lastCaption = now;
          pulseAt = now;
        }
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
    // When not animating, interactions still need a repaint.
    const repaint = () => {
      if (!raf) draw(performance.now());
    };

    // Nearest incoming dot to a point, within `radius` px.
    function pick(clientX: number, clientY: number, radius: number) {
      const rect = canvas!.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      let best: Particle | null = null;
      let bestD = radius * radius;
      particles.forEach((p) => {
        if (p.t >= 0.5) return;
        const pt = inPoint(p.lane, p.t / 0.5);
        const d = (pt.x - x) ** 2 + (pt.y - y) ** 2;
        if (d < bestD) {
          bestD = d;
          best = p;
        }
      });
      return best as Particle | null;
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      // Keep the current dot while the pointer is still near it, so it doesn't flicker.
      const near = hovered && pick(e.clientX, e.clientY, 22) === hovered ? hovered : pick(e.clientX, e.clientY, 12);
      if (near !== hovered) {
        hovered = near;
        canvas!.style.cursor = hovered ? "pointer" : "";
        repaint();
      }
    };
    const onLeave = () => {
      if (!hovered) return;
      hovered = null;
      canvas!.style.cursor = "";
      repaint();
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      const p = pick(e.clientX, e.clientY, 22);
      tapped = p ? { p, until: performance.now() + TAP_LIFE } : null;
      repaint();
      if (p && !raf) window.setTimeout(repaint, TAP_LIFE + 50);
    };

    setup();
    draw(0);
    // Text is drawn in web fonts: repaint once they've loaded.
    document.fonts?.ready.then(() => draw(performance.now()));

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerdown", onDown);
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
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onDown);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [playing, reduce]);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full touch-pan-y" />;
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
          <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0 font-mono text-[11px] uppercase tracking-[0.2em] text-ink">
            Raw events{" "}
            <span className="normal-case tracking-normal text-muted">
              · <span className="sm:hidden">tap</span>
              <span className="hidden sm:inline">hover</span> a dot
            </span>
          </span>
        </>
      )}
      <figcaption className="sr-only">
        {hasVideo ? (
          `Animated avatar of ${profile.name}.`
        ) : (
          <>
            Illustration: raw events from my life and career flow in as dots, pass through me, and come out as
            the current release of one engineer, shipping across data, AI and software since 2018. The events:
            <ul>
              {rawEvents.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </>
        )}
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
