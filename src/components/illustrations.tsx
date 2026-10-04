// Illustrative mini UIs for the work panels. Pure SVG, ink on cream. They sketch what
// each system does; every label and number in them is illustrative, not real data.
import type { ReactElement } from "react";
import type { Illustration } from "../content/site";

const INK = "var(--ink)";
const MUTED = "var(--muted)";
const LINE = "var(--line)";
const SURF = "var(--surface)";

// Deterministic pseudo-random so illustrations render the same every time.
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const mono = { fontFamily: "var(--font-mono)" } as const;

function Rag() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full">
      <rect x="16" y="16" width="288" height="34" rx="8" fill={SURF} stroke={LINE} />
      <text x="28" y="38" fontSize="10" fill={MUTED} style={mono}>ticket ›</text>
      <rect x="74" y="29" width="150" height="8" rx="4" fill={INK} opacity=".75" />
      {[0.92, 0.81, 0.63].map((s, i) => (
        <g key={i} transform={`translate(16 ${66 + i * 30})`}>
          <text x="0" y="12" fontSize="9" fill={MUTED} style={mono}>runbook {i + 1}</text>
          <rect x="70" y="4" width="180" height="10" rx="5" fill={LINE} />
          <rect x="70" y="4" width={180 * s} height="10" rx="5" fill={INK} opacity={1 - i * 0.25} />
          <text x="258" y="13" fontSize="9" fill={INK} style={mono}>{s.toFixed(2)}</text>
        </g>
      ))}
      <rect x="16" y="162" width="288" height="62" rx="10" fill={INK} />
      <text x="30" y="182" fontSize="9" fill="var(--on-ink)" opacity=".7" style={mono}>draft · routed</text>
      <rect x="30" y="192" width="200" height="6" rx="3" fill="var(--on-ink)" opacity=".85" />
      <rect x="30" y="204" width="150" height="6" rx="3" fill="var(--on-ink)" opacity=".55" />
      <circle cx="284" cy="186" r="6" fill="var(--on-ink)" />
    </svg>
  );
}

function Dag() {
  const nodes = [
    { x: 20, y: 40, l: "src a" },
    { x: 20, y: 105, l: "src b" },
    { x: 20, y: 170, l: "src c" },
    { x: 120, y: 105, l: "ingest" },
    { x: 210, y: 60, l: "validate" },
    { x: 210, y: 150, l: "catalog" },
  ];
  const edges = [
    [0, 3],
    [1, 3],
    [2, 3],
    [3, 4],
    [3, 5],
    [4, 5],
  ];
  const w = 78;
  const h = 30;
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full">
      {edges.map(([a, b], i) => {
        const A = nodes[a];
        const B = nodes[b];
        const x1 = A.x + w;
        const y1 = A.y + h / 2;
        const x2 = B.x;
        const y2 = B.y + h / 2;
        const sameCol = A.x === B.x;
        const d = sameCol
          ? `M${A.x + w / 2} ${A.y + h} L${B.x + w / 2} ${B.y}`
          : `M${x1} ${y1} C${x1 + 20} ${y1} ${x2 - 20} ${y2} ${x2} ${y2}`;
        return <path key={i} d={d} fill="none" stroke={INK} strokeOpacity=".35" strokeWidth="1.5" />;
      })}
      {nodes.map((n, i) => (
        <g key={i}>
          <rect x={n.x} y={n.y} width={w} height={h} rx="7" fill={i === 3 ? INK : SURF} stroke={i === 3 ? INK : LINE} />
          <text x={n.x + w / 2} y={n.y + 19} textAnchor="middle" fontSize="10" fill={i === 3 ? "var(--on-ink)" : INK} style={mono}>
            {n.l}
          </text>
        </g>
      ))}
      <text x="210" y="214" fontSize="9" fill={MUTED} style={mono}>teams</text>
      {Array.from({ length: 13 }, (_, i) => (
        <circle key={i} cx={212 + (i % 7) * 13} cy={224 + Math.floor(i / 7) * 10 - 4} r="3.5" fill={INK} opacity={0.35 + (i % 4) * 0.15} />
      ))}
    </svg>
  );
}

function Heatmap() {
  const r = seeded(7);
  const cols = 12;
  const rows = 7;
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full">
      <text x="16" y="22" fontSize="9" fill={MUTED} style={mono}>load · hour × day</text>
      {Array.from({ length: rows * cols }, (_, i) => {
        const c = i % cols;
        const row = Math.floor(i / cols);
        const hot = c > 6 && c < 10 && row > 1 && row < 5;
        const v = Math.min(1, r() * 0.55 + (hot ? 0.45 : 0.05));
        return (
          <rect key={i} x={16 + c * 24} y={34 + row * 24} width="20" height="20" rx="4" fill={INK} opacity={0.08 + v * 0.85} />
        );
      })}
      <line x1="16" y1="214" x2="304" y2="214" stroke={LINE} />
      <rect x="16" y="208" width="288" height="12" rx="6" fill="url(#hm)" />
      <defs>
        <linearGradient id="hm">
          <stop offset="0" stopColor={INK} stopOpacity=".08" />
          <stop offset="1" stopColor={INK} stopOpacity=".95" />
        </linearGradient>
      </defs>
      <line x1="275" y1="202" x2="275" y2="226" stroke={INK} strokeWidth="2" />
      <text x="248" y="236" fontSize="9" fill={INK} style={mono}>90% alarm</text>
    </svg>
  );
}

function Dashboard() {
  const bars = [0.55, 0.7, 0.62, 0.8, 0.74, 0.9];
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full">
      {[
        ["in transit", "NA → EU"],
        ["visibility", "3–6 wks"],
      ].map(([k, v], i) => (
        <g key={k} transform={`translate(${16 + i * 148} 16)`}>
          <rect width="140" height="58" rx="10" fill={SURF} stroke={LINE} />
          <text x="12" y="20" fontSize="9" fill={MUTED} style={mono}>{k}</text>
          <text x="12" y="44" fontSize="18" fontWeight="800" fill={INK}>{v}</text>
        </g>
      ))}
      <rect x="16" y="88" width="288" height="136" rx="10" fill={SURF} stroke={LINE} />
      <text x="28" y="108" fontSize="9" fill={MUTED} style={mono}>weekly review · units</text>
      {bars.map((b, i) => (
        <g key={i}>
          <rect x={36 + i * 44} y={208 - b * 84} width="14" height={b * 84} rx="3" fill={INK} />
          <rect x={52 + i * 44} y={208 - b * 70} width="14" height={b * 70} rx="3" fill={INK} opacity=".35" />
        </g>
      ))}
    </svg>
  );
}

function Stream() {
  const r = seeded(3);
  const pts = Array.from({ length: 28 }, (_, i) => [16 + i * 10.6, 150 - (40 + r() * 50 + Math.sin(i / 3) * 18)]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full">
      <text x="16" y="22" fontSize="9" fill={MUTED} style={mono}>posts / min</text>
      <circle cx="292" cy="18" r="4" fill={INK} />
      <text x="262" y="22" fontSize="9" fill={INK} style={mono}>live</text>
      {[60, 100, 140].map((y) => (
        <line key={y} x1="16" y1={y} x2="304" y2={y} stroke={LINE} strokeDasharray="3 4" />
      ))}
      <path d={`${line} L${pts[pts.length - 1][0]} 150 L16 150 Z`} fill={INK} opacity=".08" />
      <path d={line} fill="none" stroke={INK} strokeWidth="2" />
      {["extract", "load", "dbt"].map((s, i) => (
        <g key={s} transform={`translate(${16 + i * 98} 176)`}>
          <rect width="90" height="44" rx="10" fill={i === 2 ? INK : SURF} stroke={i === 2 ? INK : LINE} />
          <text x="45" y="27" textAnchor="middle" fontSize="11" fill={i === 2 ? "var(--on-ink)" : INK} style={mono}>
            {s}
          </text>
        </g>
      ))}
    </svg>
  );
}

function Lakehouse() {
  const layers = [
    { l: "presentation", w: 160, o: 1 },
    { l: "processed", w: 220, o: 0.6 },
    { l: "raw", w: 288, o: 0.3 },
  ];
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full">
      <text x="16" y="22" fontSize="9" fill={MUTED} style={mono}>delta lake · layers</text>
      {layers.map((L, i) => (
        <g key={L.l}>
          <rect x={160 - L.w / 2} y={44 + i * 54} width={L.w} height="42" rx="10" fill={INK} opacity={L.o} />
          <text
            x="160"
            y={70 + i * 54}
            textAnchor="middle"
            fontSize="11"
            fill={i === 2 ? INK : "var(--on-ink)"}
            style={mono}
          >
            {L.l}
          </text>
        </g>
      ))}
      <text x="16" y="222" fontSize="9" fill={MUTED} style={mono}>parquet · time travel ↺</text>
    </svg>
  );
}

const MAP: Record<Illustration, () => ReactElement> = {
  rag: Rag,
  dag: Dag,
  heatmap: Heatmap,
  dashboard: Dashboard,
  stream: Stream,
  lakehouse: Lakehouse,
};

export function MiniUI({ kind }: { kind: Illustration }) {
  const C = MAP[kind];
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-line bg-[var(--bg)] p-3" aria-hidden="true">
      <figcaption className="flex items-center justify-between px-1 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        <span>Illustrative UI</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-1.5 animate-pulse rounded-full bg-ink" /> live
        </span>
      </figcaption>
      <div className="min-h-0 flex-1">
        <C />
      </div>
    </figure>
  );
}
