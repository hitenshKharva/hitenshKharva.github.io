import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/** Heavy grotesk headline with one italic-serif accent word: "Things I've *built.*" */
export function Heading({
  lead,
  accent,
  tail,
  as: Tag = "h2",
  id,
}: {
  lead: string;
  accent: string;
  tail?: string;
  as?: "h1" | "h2";
  id?: string;
}) {
  return (
    <Tag id={id} className="text-5xl font-extrabold leading-[0.95] tracking-[-0.035em] text-ink sm:text-6xl lg:text-7xl">
      {lead} <em className="font-serif font-normal tracking-normal text-ink/70">{accent}</em>
      {tail && <> {tail}</>}
    </Tag>
  );
}

/** Mono uppercase eyebrow with section number: "— 04 — CERTIFICATIONS". */
export function Eyebrow({ number, label }: { number?: string; label: string }) {
  return (
    <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
      {number && <span>{number}</span>}
      <span aria-hidden="true" className="h-px w-8 bg-muted/60" />
      <span>{label}</span>
    </p>
  );
}

export function Section({
  id,
  number,
  eyebrow,
  lead,
  accent,
  tail,
  intro,
  children,
  className = "",
}: {
  id: string;
  number: string;
  eyebrow: string;
  lead: string;
  accent: string;
  tail?: string;
  intro?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`relative outline-none ${className}`}>
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <Eyebrow number={number} label={eyebrow} />
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <Heading id={`${id}-title`} lead={lead} accent={accent} tail={tail} />
            {intro && <p className="max-w-sm text-muted">{intro}</p>}
          </div>
        </Reveal>
        <div className="mt-14">{children}</div>
      </div>
    </section>
  );
}
