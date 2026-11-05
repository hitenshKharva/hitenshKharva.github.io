import { useEffect, useRef, useState, type MouseEvent } from "react";
import { links, profile } from "../content/site";
import { useScrollTo } from "../lib/smoothScroll";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";
import { Eyebrow, Heading } from "./Section";

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
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

function CopyEmail() {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const onCopy = async () => {
    try {
      await copyText(profile.email);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2400);
  };
  return (
    <>
      <button
        type="button"
        onClick={onCopy}
        className="inline-flex min-h-12 items-center gap-2 rounded-md bg-accent px-5 font-medium text-on-accent transition-transform duration-200 hover:-translate-y-0.5"
      >
        <Icon name={state === "copied" ? "check" : "copy"} size={17} />
        {state === "copied" ? "Copied" : "Copy email"}
      </button>
      <span role="status" className="sr-only">
        {state === "copied" ? "Email address copied" : state === "failed" ? `Copy failed. The address is ${profile.email}` : ""}
      </span>
    </>
  );
}

const pill =
  "inline-flex min-h-12 items-center gap-2 rounded-md border border-ink/20 px-5 font-medium text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-on-ink";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative outline-none">
      <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 sm:py-36">
        <Reveal>
          <Eyebrow number="07" label="Contact" />
          <div className="mt-6">
            <Heading id="contact-title" lead="Let's" accent="build" tail="something." />
          </div>
          <p className="mt-6 max-w-xl text-lg text-muted">
            Data platforms, pipelines or AI tools that need to work in production. My inbox is open.
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-10 inline-block break-words text-[1.6rem] font-extrabold tracking-[-0.03em] text-ink underline decoration-line decoration-2 underline-offset-8 transition-colors duration-200 hover:decoration-ink sm:text-5xl"
          >
            {profile.email}
          </a>
          <div className="mt-10 flex flex-wrap gap-3">
            <CopyEmail />
            <a href={links.github} target="_blank" rel="noopener noreferrer" className={pill}>
              <Icon name="github" size={17} /> GitHub<span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className={pill}>
              <Icon name="linkedin" size={17} /> LinkedIn<span className="sr-only"> (opens in a new tab)</span>
            </a>
            {__HAS_RESUME__ && (
              <a href={profile.resume} download="Kharva_Hitensh_Resume.pdf" className={pill}>
                <Icon name="file" size={17} /> Resume
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Build date (UTC) for the footer freshness stamp. */
const stamp = __BUILD_TIME__.slice(0, 10);

export function Footer() {
  const scrollTo = useScrollTo();
  const toTop = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollTo("#top");
  };
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-8 sm:px-6">
        <p className="text-sm text-ink">
          <span className="font-semibold">{profile.name}</span>
          <span className="text-muted"> · {profile.location}</span>
        </p>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs tabular-nums text-muted">
          <span>
            <span aria-hidden="true" className="mr-1.5 inline-block size-1.5 rounded-full bg-accent align-middle" />
            build <b className="font-medium text-ink">passing</b>
          </span>
          <span>
            last refreshed <b className="font-medium text-ink">{stamp}</b>
          </span>
          <span>
            commit <b className="font-medium text-ink">{__BUILD_SHA__}</b>
            {__BUILD_RUN__ && <> · run #{__BUILD_RUN__}</>}
          </span>
        </p>
        <a href="#top" onClick={toTop} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-ink underline-offset-4 hover:underline">
          Back to top <Icon name="arrowDown" size={15} className="rotate-180" />
        </a>
      </div>
    </footer>
  );
}
