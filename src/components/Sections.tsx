import { m, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { education, experience, profile } from "../content";
import { Icon } from "./Icon";
import { OrTodo } from "./Todo";

function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <m.div
      initial={{ opacity: 0, y: reduce ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </m.div>
  );
}

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
      <h2 id="experience-title" className="font-display text-3xl font-bold text-fg sm:text-4xl">
        Experience
      </h2>
      <Reveal>
        <ol className="mt-8 divide-y divide-line border-y border-line">
          {experience.map((r) => (
            <li key={`${r.company}-${r.dates}`} className="grid gap-1 py-5 md:grid-cols-[14rem_1fr] md:gap-6">
              <p className="font-mono text-sm text-muted">{r.dates}</p>
              <div>
                <h3 className="font-semibold text-fg">
                  {r.role} <span className="text-muted">·</span> <span className="text-accent">{r.company}</span>
                </h3>
                <p className="mt-1 text-muted">
                  <OrTodo value={r.impact} label="one-line impact" />
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>

      <h2 id="education-title" className="mt-16 font-display text-2xl font-bold text-fg sm:text-3xl">
        Education
      </h2>
      <Reveal>
        <ul aria-labelledby="education-title" className="mt-6 grid gap-4 md:grid-cols-2">
          {education.map((d) => (
            <li key={d.degree} className="rounded-[var(--radius)] border border-line bg-surface p-5">
              <h3 className="font-semibold text-fg">{d.degree}</h3>
              <p className="mt-1 text-muted">
                <OrTodo value={d.university} label="university" /> <span aria-hidden="true">·</span>{" "}
                <span className="font-mono text-sm">{d.year}</span>
              </p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Older browsers / insecure contexts.
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  const ok = document.execCommand("copy");
  ta.remove();
  if (!ok) throw new Error("copy failed");
}

export function CopyEmail({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function onCopy() {
    try {
      await copyText(profile.email);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2500);
  }

  return (
    <>
      <button
        type="button"
        onClick={onCopy}
        className={`inline-flex min-h-11 items-center gap-2 rounded-lg border border-line font-medium text-fg transition-colors duration-200 hover:border-accent hover:text-accent ${
          compact ? "px-3 text-sm" : "px-4"
        }`}
      >
        <Icon name={state === "copied" ? "check" : "copy"} />
        {state === "copied" ? "Copied" : "Copy email"}
      </button>
      <span role="status" className="sr-only">
        {state === "copied" ? "Email address copied to clipboard" : state === "failed" ? `Copy failed. The address is ${profile.email}` : ""}
      </span>
    </>
  );
}

const linkCls =
  "inline-flex min-h-11 items-center gap-2 rounded-lg border border-line px-4 font-medium text-fg transition-colors duration-200 hover:border-accent hover:text-accent";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
      <Reveal className="rounded-[var(--radius)] border border-line bg-surface p-6 sm:p-10">
        <h2 id="contact-title" className="font-display text-3xl font-bold text-fg sm:text-4xl">
          Contact
        </h2>
        <p className="mt-3 text-muted">
          Email{" "}
          <a href={`mailto:${profile.email}`} className="break-all font-mono text-accent underline-offset-4 hover:underline">
            {profile.email}
          </a>
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <CopyEmail />
          <a href={`mailto:${profile.email}`} className={`${linkCls} border-accent bg-accent text-on-accent hover:text-on-accent hover:opacity-90`}>
            <Icon name="mail" /> Send email
          </a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className={linkCls}>
            <Icon name="github" /> GitHub<span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={linkCls}>
            <Icon name="linkedin" /> LinkedIn<span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a href={profile.resume} target="_blank" rel="noopener" className={linkCls}>
            <Icon name="file" /> Résumé (PDF)<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-6 font-mono text-sm text-muted sm:px-6">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p>{profile.location}</p>
      </div>
    </footer>
  );
}
