import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

// ILLUSTRATIVE ONLY. These tickets, runbooks, scores and drafts are made up to show how
// the RAG Ticket Analyzer works. The real tool and its data are internal. The numbers in
// the results panel (15 → 3 min, < 15 s, ~78%) are the real production results.
interface Sample {
  id: string;
  label: string;
  title: string;
  body: string;
  runbooks: { title: string; score: number; snippet: string }[];
  analysis: string;
  severity: string;
  component: string;
  route: string;
}

const SAMPLES: Sample[] = [
  {
    id: "access",
    label: "Failed nightly load",
    title: "Nightly load failed: AccessDenied writing to bucket",
    body: "The 02:00 ingestion job failed at the write step with AccessDenied. Downstream dashboards are now stale.",
    runbooks: [
      {
        title: "Ingestion job fails with AccessDenied",
        score: 0.91,
        snippet: "Check the job role's write policy on the target bucket. Recent policy changes are the usual cause.",
      },
      {
        title: "Re-running a failed nightly load",
        score: 0.84,
        snippet: "After fixing the cause, re-run from the failed step to avoid duplicate partitions.",
      },
      {
        title: "Dashboard freshness alerts",
        score: 0.62,
        snippet: "Freshness alarms clear on their own once the upstream load completes.",
      },
    ],
    analysis:
      "Likely cause: the job role lost write access to the target bucket. Fix the role's bucket policy, then re-run the load from the failed step. Dashboards refresh once the load completes, so no separate action is needed there.",
    severity: "Sev 3",
    component: "Ingestion",
    route: "Data platform on-call",
  },
  {
    id: "inflated",
    label: "Inflated dashboard totals",
    title: "Weekly dashboard shows roughly double the expected quantity",
    body: "Totals on the weekly review dashboard jumped after yesterday's model release. Source systems look normal.",
    runbooks: [
      {
        title: "Inflated totals after a join",
        score: 0.89,
        snippet: "Look for a missing deduplication on many-to-many joins; compare row counts before and after the join.",
      },
      {
        title: "Validating a model change",
        score: 0.77,
        snippet: "Diff key metrics between the previous and current model versions before publishing.",
      },
      {
        title: "Reporting a data-quality issue",
        score: 0.58,
        snippet: "Flag affected dashboards and notify consumers while the fix is in progress.",
      },
    ],
    analysis:
      "Totals look inflated by a join that fans out rows. Check yesterday's model change for a missing deduplication step and compare row counts before and after the join. Flag the dashboard to consumers until the fix ships.",
    severity: "Sev 2",
    component: "Data model",
    route: "Data engineering",
  },
  {
    id: "timeouts",
    label: "Warehouse timeouts",
    title: "Query timeouts on the warehouse since this morning",
    body: "Several teams report dashboards timing out. The warehouse CPU alarm fired at 08:40.",
    runbooks: [
      {
        title: "Warehouse CPU or disk saturation",
        score: 0.88,
        snippet: "Find the top resource-consuming queries in the last hour and identify their owners.",
      },
      {
        title: "Workload management queues",
        score: 0.74,
        snippet: "Move heavy ad-hoc queries to a lower-priority queue to protect dashboards.",
      },
      {
        title: "Requesting a warehouse resize",
        score: 0.55,
        snippet: "Only resize after ruling out a single runaway workload.",
      },
    ],
    analysis:
      "Symptoms match resource saturation. Pull the top queries by CPU and disk for the last hour, identify their owners, and throttle or stop the offender. Escalate for a resize only if the load turns out to be legitimate.",
    severity: "Sev 2",
    component: "Warehouse",
    route: "Data platform on-call",
  },
];

const STAGES = ["Ticket in", "Retrieve runbooks", "Draft analysis", "Label, route, comment"] as const;
const STAGE_MS = [700, 1300, 0, 900]; // stage 3 lasts as long as the typing

type Phase = "idle" | "running" | "done";

function StageIcon({ state }: { state: "pending" | "active" | "done" }) {
  if (state === "done")
    return (
      <span className="flex size-7 items-center justify-center rounded-full bg-accent text-on-accent">
        <Icon name="check" size={15} />
      </span>
    );
  return (
    <span className={`relative flex size-7 items-center justify-center rounded-full border ${state === "active" ? "border-accent" : "border-line"}`}>
      {state === "active" && <span className="absolute inset-1 animate-ping rounded-full bg-accent/40" />}
      <span className={`size-2 rounded-full ${state === "active" ? "bg-accent" : "bg-line"}`} />
    </span>
  );
}

export function TriageDemo() {
  const reduce = useReducedMotion();
  const [sampleId, setSampleId] = useState(SAMPLES[0].id);
  const [phase, setPhase] = useState<Phase>("idle");
  const [stage, setStage] = useState(-1);
  const [typed, setTyped] = useState(0);
  const timers = useRef<number[]>([]);
  const sample = SAMPLES.find((s) => s.id === sampleId)!;

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  function reset(nextId = sampleId) {
    clearTimers();
    setSampleId(nextId);
    setPhase("idle");
    setStage(-1);
    setTyped(0);
  }

  function run() {
    reset();
    if (reduce) {
      setStage(STAGES.length);
      setTyped(sample.analysis.length);
      setPhase("done");
      return;
    }
    setPhase("running");
    setStage(0);
    timers.current.push(window.setTimeout(() => setStage(1), STAGE_MS[0]));
    timers.current.push(window.setTimeout(() => setStage(2), STAGE_MS[0] + STAGE_MS[1]));
  }

  // Stage 2: type the draft.
  useEffect(() => {
    if (stage !== 2 || reduce) return;
    const total = sample.analysis.length;
    const t = window.setInterval(() => setTyped((n) => Math.min(total, n + 4)), 16);
    return () => window.clearInterval(t);
  }, [stage, sample.analysis.length, reduce]);

  // Advance once the draft is fully typed, then finish after the routing step.
  useEffect(() => {
    if (stage === 2 && typed >= sample.analysis.length) setStage(3);
    if (stage === 3 && phase === "running") {
      const t = window.setTimeout(() => {
        setStage(STAGES.length);
        setPhase("done");
      }, STAGE_MS[3]);
      return () => window.clearTimeout(t);
    }
  }, [stage, typed, phase, sample.analysis.length]);

  const stateOf = (i: number) => (stage > i ? "done" : stage === i ? "active" : "pending");
  const status =
    phase === "idle"
      ? ""
      : phase === "done"
        ? `Done. Routed to ${sample.route} with a drafted analysis.`
        : `${STAGES[Math.min(stage, STAGES.length - 1)]}…`;

  return (
    <section id="triage-demo" aria-labelledby="demo-title" className="scroll-mt-6 rounded-[var(--radius)] border border-accent/40 bg-bg p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">Try it</p>
          <h3 id="demo-title" className="mt-2 font-display text-3xl text-fg sm:text-4xl">
            Triage a ticket
          </h3>
        </div>
        <p className="max-w-xs text-xs leading-relaxed text-muted">
          Illustrative simulation. The tickets and runbooks are made-up samples; the real tool is internal.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2" role="group" aria-label="Sample ticket">
        {SAMPLES.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={s.id === sampleId}
            onClick={() => reset(s.id)}
            className={`min-h-11 rounded-full border px-4 text-sm transition-colors duration-200 ${
              s.id === sampleId ? "border-accent text-fg" : "border-line text-muted hover:border-fg hover:text-fg"
            }`}
          >
            {s.label}
          </button>
        ))}
        <button
          type="button"
          onClick={run}
          disabled={phase === "running"}
          className="ml-auto inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 font-semibold text-on-accent transition-transform duration-200 enabled:hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
        >
          {phase === "done" ? "Run again" : phase === "running" ? "Running…" : "Run triage"}
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {status}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <ol className="space-y-3">
          {STAGES.map((name, i) => {
            const st = phase === "idle" ? "pending" : stateOf(i);
            const open = phase !== "idle" && stage >= i;
            return (
              <li key={name} className="rounded-xl border border-line bg-surface p-4">
                <div className="flex items-center gap-3">
                  <StageIcon state={st} />
                  <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className={`font-medium ${st === "pending" ? "text-muted" : "text-fg"}`}>{name}</span>
                </div>
                <AnimatePresence initial={false}>
                  {open && (
                    <m.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      transition={{ duration: reduce ? 0 : 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-10 pt-3">
                        {i === 0 && (
                          <div className="rounded-lg border border-line bg-bg p-3">
                            <p className="font-medium text-fg">{sample.title}</p>
                            <p className="mt-1 text-sm text-muted">{sample.body}</p>
                          </div>
                        )}
                        {i === 1 && (
                          <ul className="space-y-2.5">
                            {sample.runbooks.map((r, n) => (
                              <li key={r.title}>
                                <div className="flex items-baseline justify-between gap-3 text-sm">
                                  <span className={n === 0 ? "text-fg" : "text-muted"}>{r.title}</span>
                                  <span className="font-mono text-xs text-accent">{r.score.toFixed(2)}</span>
                                </div>
                                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
                                  <m.div
                                    className="h-full rounded-full bg-accent"
                                    initial={{ width: reduce ? `${r.score * 100}%` : 0 }}
                                    animate={{ width: `${r.score * 100}%` }}
                                    transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : n * 0.15 }}
                                  />
                                </div>
                                {n === 0 && <p className="mt-1.5 text-xs text-muted">{r.snippet}</p>}
                              </li>
                            ))}
                          </ul>
                        )}
                        {i === 2 && (
                          <p className="rounded-lg border border-line bg-bg p-3 text-sm leading-relaxed text-fg">
                            {sample.analysis.slice(0, typed)}
                            {stage === 2 && <span className="ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] bg-accent" />}
                          </p>
                        )}
                        {i === 3 && (
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            <span className="rounded-full border border-line px-3 py-1 font-mono text-xs text-fg">{sample.severity}</span>
                            <span className="rounded-full border border-line px-3 py-1 font-mono text-xs text-fg">{sample.component}</span>
                            <span className="text-muted">→</span>
                            <span className="rounded-full bg-surface-2 px-3 py-1 font-mono text-xs text-fg">{sample.route}</span>
                            {stage > 3 && (
                              <span className="inline-flex items-center gap-1 text-accent">
                                <Icon name="check" size={14} /> Analysis posted as a comment
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ol>

        <aside aria-label="Real production results" className="space-y-5 rounded-xl border border-line bg-surface p-5">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Time per ticket (real)</p>
          {[
            { label: "Searching runbooks by hand", value: "~15 min", pct: 100, muted: true },
            { label: "With the analyzer", value: "~3 min", pct: 20, muted: false },
          ].map((bar) => (
            <div key={bar.label}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className={bar.muted ? "text-muted" : "text-fg"}>{bar.label}</span>
                <span className={`font-mono ${bar.muted ? "text-muted" : "text-accent"}`}>{bar.value}</span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-surface-2">
                <m.div
                  className={`h-full rounded-full ${bar.muted ? "bg-muted/60" : "bg-accent"}`}
                  initial={false}
                  animate={{ width: phase === "done" ? `${bar.pct}%` : "0%" }}
                  transition={{ duration: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          ))}
          <dl className="grid grid-cols-3 gap-2 border-t border-line pt-4 text-center">
            <div>
              <dt className="text-xs text-muted">Time saved</dt>
              <dd className="font-display text-3xl text-accent">80%</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Latency</dt>
              <dd className="font-display text-3xl text-fg">&lt;15s</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Avg. confidence</dt>
              <dd className="font-display text-3xl text-fg">~78%</dd>
            </div>
          </dl>
          <p className="text-xs leading-relaxed text-muted">
            The simulation runs in seconds. The bars use the real per-ticket times from production.
          </p>
        </aside>
      </div>
    </section>
  );
}
