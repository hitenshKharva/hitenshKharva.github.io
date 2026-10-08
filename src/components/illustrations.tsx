// Illustrative mini UIs for the work panels. Pure SVG, ink on cream. They sketch what
// each system does; every label and number in them is illustrative, not real data.
import type { ReactElement } from "react";
import type { Illustration } from "../content/site";

const INK = "var(--ink)";
const MUTED = "var(--muted)";
const LINE = "var(--line)";
const SURF = "var(--surface)";

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

function Queue() {
  const rows: { kind: "BI" | "ETL"; w: number; cancel?: boolean }[] = [
    { kind: "BI", w: 0.95, cancel: true },
    { kind: "ETL", w: 0.7 },
    { kind: "BI", w: 0.88, cancel: true },
    { kind: "BI", w: 0.4 },
    { kind: "ETL", w: 0.55 },
    { kind: "BI", w: 0.82, cancel: true },
  ];
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full">
      <text x="16" y="22" fontSize="9" fill={MUTED} style={mono}>queued queries · wait</text>
      {rows.map((r, i) => {
        const y = 32 + i * 24;
        return (
          <g key={i}>
            <rect x="16" y={y} width="30" height="16" rx="4" fill={r.kind === "ETL" ? INK : SURF} stroke={r.kind === "ETL" ? INK : LINE} />
            <text x="31" y={y + 11} textAnchor="middle" fontSize="8" fill={r.kind === "ETL" ? "var(--on-ink)" : INK} style={mono}>
              {r.kind}
            </text>
            <rect x="54" y={y + 5} width="190" height="6" rx="3" fill={LINE} />
            <rect x="54" y={y + 5} width={190 * r.w} height="6" rx="3" fill={INK} opacity={r.cancel ? 0.3 : 0.85} />
            {r.cancel && <line x1="54" y1={y + 8} x2={54 + 190 * r.w} y2={y + 8} stroke={INK} strokeWidth="1.5" />}
            <text x="252" y={y + 11} fontSize="8" fill={r.cancel ? INK : MUTED} style={mono}>
              {r.cancel ? "cancel" : r.kind === "ETL" ? "guarded" : "keep"}
            </text>
          </g>
        );
      })}
      <rect x="16" y="182" width="288" height="42" rx="10" fill={INK} />
      <text x="30" y="200" fontSize="9" fill="var(--on-ink)" opacity=".7" style={mono}>agent → guardrail → cancel</text>
      <text x="30" y="215" fontSize="10" fill="var(--on-ink)" style={mono}>3 cancelled · 0 failures</text>
      <circle cx="286" cy="203" r="6" fill="var(--on-ink)" />
    </svg>
  );
}

function Agents() {
  const specialists = ["data quality", "support", "analysis"];
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full">
      <text x="16" y="22" fontSize="9" fill={MUTED} style={mono}>slack · IDE · MCP</text>
      <rect x="110" y="32" width="100" height="34" rx="10" fill={INK} />
      <text x="160" y="53" textAnchor="middle" fontSize="10" fill="var(--on-ink)" style={mono}>router</text>
      {specialists.map((l, i) => {
        const x = 16 + i * 100;
        return (
          <g key={l}>
            <path d={`M160 66 C160 82 ${x + 44} 78 ${x + 44} 96`} fill="none" stroke={INK} strokeOpacity=".4" strokeWidth="1.5" />
            <rect x={x} y="96" width="88" height="34" rx="10" fill={SURF} stroke={LINE} />
            <text x={x + 44} y="117" textAnchor="middle" fontSize="9" fill={INK} style={mono}>{l}</text>
          </g>
        );
      })}
      <text x="16" y="156" fontSize="9" fill={MUTED} style={mono}>ticket workflow</text>
      {["trigger", "safety gate", "action"].map((l, i) => (
        <g key={l} transform={`translate(${16 + i * 100} 166)`}>
          <rect width="88" height="40" rx="10" fill={i === 1 ? INK : SURF} stroke={i === 1 ? INK : LINE} />
          <text x="44" y="24" textAnchor="middle" fontSize="9" fill={i === 1 ? "var(--on-ink)" : INK} style={mono}>{l}</text>
        </g>
      ))}
      <path d="M104 186 L116 186 M204 186 L216 186" stroke={INK} strokeWidth="1.5" />
      <text x="16" y="228" fontSize="9" fill={MUTED} style={mono}>answer → act, safely</text>
    </svg>
  );
}

function Catalog() {
  const domains: [string, number][] = [
    ["domain a", 3],
    ["domain b", 3],
    ["domain c", 3],
    ["domain d", 4],
    ["domain e", 3],
    ["domain f", 3],
    ["domain g", 3],
    ["domain h", 3],
  ];
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full">
      <text x="16" y="22" fontSize="9" fill={MUTED} style={mono}>curated datasets · weekly</text>
      {domains.map(([d, n], i) => (
        <g key={d} transform={`translate(16 ${34 + i * 23})`}>
          <text x="0" y="12" fontSize="9" fill={MUTED} style={mono}>{d}</text>
          {Array.from({ length: n }, (_, k) => (
            <rect key={k} x={64 + k * 22} y="2" width="18" height="14" rx="3" fill={INK} opacity={0.35 + ((i + k) % 3) * 0.25} />
          ))}
        </g>
      ))}
      <path d="M168 128 C190 128 196 128 214 128" fill="none" stroke={INK} strokeOpacity=".5" strokeWidth="1.5" strokeDasharray="3 3" />
      <rect x="214" y="96" width="90" height="64" rx="12" fill={INK} />
      <text x="259" y="122" textAnchor="middle" fontSize="10" fill="var(--on-ink)" style={mono}>MCP</text>
      <text x="259" y="140" textAnchor="middle" fontSize="9" fill="var(--on-ink)" opacity=".7" style={mono}>planning agent</text>
    </svg>
  );
}

function Gem() {
  const lines: [string, string][] = [
    ["$ gem push pkg-1.0.gem", "published"],
    ["$ gem install pkg", "1 gem installed"],
    ["$ bundle install", "resolved deps"],
  ];
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full">
      <rect x="16" y="16" width="288" height="110" rx="10" fill={INK} />
      {lines.map(([cmd, out], i) => (
        <g key={cmd}>
          <text x="30" y={40 + i * 30} fontSize="10" fill="var(--on-ink)" style={mono}>{cmd}</text>
          <text x="30" y={52 + i * 30} fontSize="8" fill="var(--on-ink)" opacity=".6" style={mono}>↳ {out}</text>
        </g>
      ))}
      {["client", "adapter", "backend"].map((l, i) => (
        <g key={l} transform={`translate(${16 + i * 100} 160)`}>
          <rect width="88" height="40" rx="10" fill={i === 1 ? INK : SURF} stroke={i === 1 ? INK : LINE} />
          <text x="44" y="24" textAnchor="middle" fontSize="10" fill={i === 1 ? "var(--on-ink)" : INK} style={mono}>{l}</text>
        </g>
      ))}
      <path d="M104 180 L116 180 M204 180 L216 180" stroke={INK} strokeWidth="1.5" />
      <text x="16" y="224" fontSize="9" fill={MUTED} style={mono}>RubyGems protocol · Java service</text>
    </svg>
  );
}

function Dashboard() {
  const bars = [0.55, 0.7, 0.62, 0.8, 0.74, 0.9];
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full">
      {[
        ["sources", "unified"],
        ["data prep", "hrs → min"],
      ].map(([k, v], i) => (
        <g key={k} transform={`translate(${16 + i * 148} 16)`}>
          <rect width="140" height="58" rx="10" fill={SURF} stroke={LINE} />
          <text x="12" y="20" fontSize="9" fill={MUTED} style={mono}>{k}</text>
          <text x="12" y="44" fontSize="18" fontWeight="800" fill={INK}>{v}</text>
        </g>
      ))}
      <rect x="16" y="88" width="288" height="136" rx="10" fill={SURF} stroke={LINE} />
      <text x="28" y="108" fontSize="9" fill={MUTED} style={mono}>weekly view · trend</text>
      {bars.map((b, i) => (
        <g key={i}>
          <rect x={36 + i * 44} y={208 - b * 84} width="14" height={b * 84} rx="3" fill={INK} />
          <rect x={52 + i * 44} y={208 - b * 70} width="14" height={b * 70} rx="3" fill={INK} opacity=".35" />
        </g>
      ))}
    </svg>
  );
}

const MAP: Record<Illustration, () => ReactElement> = {
  queue: Queue,
  agents: Agents,
  catalog: Catalog,
  rag: Rag,
  gem: Gem,
  dashboard: Dashboard,
  dag: Dag,
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
