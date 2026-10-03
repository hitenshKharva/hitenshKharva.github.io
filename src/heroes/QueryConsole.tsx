import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { consoleQueries } from "../content";
import { Icon } from "../components/Icon";
import { useSite } from "../state";

/** Types a query out, then streams its result rows in. Rows with a case study are links. */
export function QueryConsole() {
  const reduce = useReducedMotion();
  const { jumpToProject } = useSite();
  const [tab, setTab] = useState(0);
  const [typed, setTyped] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const q = consoleQueries[tab];
  const done = reduce || typed >= q.sql.length;

  useEffect(() => {
    if (reduce) return;
    setTyped(0);
    const t = window.setInterval(() => {
      setTyped((n) => {
        if (n >= q.sql.length) {
          window.clearInterval(t);
          return n;
        }
        return n + 2;
      });
    }, 18);
    return () => window.clearInterval(t);
  }, [tab, q.sql.length, reduce]);

  function onTabKey(e: KeyboardEvent) {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (tab + dir + consoleQueries.length) % consoleQueries.length;
    setTab(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-line bg-surface shadow-[0_30px_80px_-30px_rgb(0_0_0/0.8)]">
      <div role="tablist" aria-label="Queries about my work" onKeyDown={onTabKey} className="flex overflow-x-auto border-b border-line">
        {consoleQueries.map((cq, i) => (
          <button
            key={cq.file}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            role="tab"
            id={`q-tab-${i}`}
            aria-selected={i === tab}
            aria-controls="q-panel"
            tabIndex={i === tab ? 0 : -1}
            onClick={() => setTab(i)}
            className={`relative min-h-11 shrink-0 px-4 font-mono text-xs transition-colors duration-200 sm:text-sm ${
              i === tab ? "text-fg" : "text-muted hover:text-fg"
            }`}
          >
            {cq.file}
            {i === tab && <m.span layoutId="q-tab" className="absolute inset-x-0 bottom-0 h-0.5 bg-accent" />}
          </button>
        ))}
      </div>

      <div id="q-panel" role="tabpanel" aria-labelledby={`q-tab-${tab}`} className="p-4 font-mono text-[13px] sm:p-5 sm:text-sm">
        <p className="text-muted">-- feed me data</p>
        <p className="mt-1 min-h-[2.8em] break-words text-fg">
          <span className="sr-only">{q.sql}</span>
          <span aria-hidden="true">
            {reduce ? q.sql : q.sql.slice(0, typed)}
            {!done && <span className="ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-accent" />}
          </span>
        </p>

        <div className="mt-3 min-h-[13.5rem]">
          <AnimatePresence mode="wait">
            {done && (
              <m.table
                key={tab}
                className="w-full border-collapse text-left"
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.07 } } }}
              >
                <thead>
                  <tr className="border-b border-line text-xs uppercase tracking-wider text-muted">
                    <th scope="col" className="py-2 pr-3 font-normal">
                      {q.columns[0]}
                    </th>
                    <th scope="col" className="py-2 text-right font-normal">
                      {q.columns[1]}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {q.rows.map((r) => (
                    <m.tr
                      key={r.cells[0]}
                      variants={{ hidden: { opacity: 0, x: reduce ? 0 : -8 }, show: { opacity: 1, x: 0 } }}
                      className="border-b border-line/60"
                    >
                      <td className="py-1 pr-3">
                        {r.open ? (
                          <button
                            type="button"
                            onClick={() => jumpToProject(r.open!)}
                            className="group inline-flex min-h-10 items-center gap-1.5 text-left text-fg underline decoration-line underline-offset-4 hover:text-accent hover:decoration-accent"
                          >
                            {r.cells[0]}
                            <Icon name="external" size={13} className="opacity-60 group-hover:opacity-100" />
                            <span className="sr-only">: open case study</span>
                          </button>
                        ) : (
                          <span className="inline-flex min-h-10 items-center text-fg">{r.cells[0]}</span>
                        )}
                      </td>
                      <td className="py-1 text-right font-semibold text-accent">{r.cells[1]}</td>
                    </m.tr>
                  ))}
                </tbody>
              </m.table>
            )}
          </AnimatePresence>
          {done && (
            <p className="mt-3 text-xs text-muted">
              {q.rows.length} rows · select a linked row to open the case study
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
