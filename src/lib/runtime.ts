/** Pipeline-style metadata for timeline entries: status, task id and runtime. */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Build time stands in for "now" so the prerendered HTML and the client agree. */
export const builtAt = new Date(__BUILD_TIME__);

/** "Jul 2024" → months since year 0; a bare "2021" counts from January. */
function toMonths(part: string, now: Date): number | null {
  const p = part.trim();
  if (/^present$/i.test(p)) return now.getUTCFullYear() * 12 + now.getUTCMonth();
  const m = p.match(/^(?:([A-Z][a-z]{2}) )?(\d{4})$/);
  if (!m) return null;
  const month = m[1] ? MONTHS.indexOf(m[1]) : 0;
  return Number(m[2]) * 12 + Math.max(month, 0);
}

/** "Jul 2018 – Oct 2020" → "2y 3m". Returns null when the dates can't be read. */
export function runtime(dates: string, now = builtAt): string | null {
  const [from, to] = dates.split("–");
  if (!from || !to) return null;
  const a = toMonths(from, now);
  const b = toMonths(to, now);
  if (a === null || b === null || b < a) return null;
  const total = Math.max(b - a, 1);
  const y = Math.floor(total / 12);
  const mo = total % 12;
  return [y && `${y}y`, mo && `${mo}m`].filter(Boolean).join(" ");
}

export const isRunning = (dates: string) => /present\s*$/i.test(dates);

/** "Data Engineer II" → "data_engineer_ii" */
export const taskId = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
