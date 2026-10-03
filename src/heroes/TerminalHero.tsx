import { m } from "motion/react";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { profile, projects, skills, type Project } from "../content";
import { LOOKS, LOOK_LABEL, isLook, useSite } from "../state";
import { Todo } from "../components/Todo";
import { HeroActions, HeroSection, useIntro } from "./shared";

interface Line {
  id: number;
  kind: "cmd" | "out" | "err";
  body: ReactNode;
}

const COMMANDS: { name: string; usage: string; desc: string }[] = [
  { name: "help", usage: "help", desc: "list commands" },
  { name: "whoami", usage: "whoami", desc: "who I am" },
  { name: "projects", usage: "projects", desc: "list projects" },
  { name: "open", usage: "open <name>", desc: "jump to a project" },
  { name: "stack", usage: "stack", desc: "tools I work with" },
  { name: "contact", usage: "contact", desc: "how to reach me" },
  { name: "theme", usage: "theme <name>", desc: "switch the site look" },
  { name: "clear", usage: "clear", desc: "clear the screen" },
];

const PROJECT_GROUPS: [Project["kind"], string][] = [
  ["work", "work (Amazon)"],
  ["side", "side projects"],
  ["earlier", "earlier"],
];

const TAPS = ["help", "whoami", "projects", "stack", "contact", "theme", "clear"];

function findProject(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;
  return (
    projects.find((p) => p.slug === q || p.id === q || p.name.toLowerCase() === q) ??
    projects.find((p) => p.slug.startsWith(q) || p.name.toLowerCase().startsWith(q))
  );
}

const linkCls = "text-accent underline underline-offset-4";

export default function TerminalHero() {
  const { container, item } = useIntro(0.1);
  const { setLook, jumpToProject } = useSite();
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const nextId = useRef(0);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const push = (kind: Line["kind"], body: ReactNode) => setLines((ls) => [...ls, { id: nextId.current++, kind, body }]);

  function cmdButton(cmd: string, label = cmd) {
    return (
      <button type="button" onClick={() => run(cmd)} className="rounded px-1 text-accent underline underline-offset-4 hover:bg-surface-2">
        {label}
      </button>
    );
  }

  function run(raw: string) {
    const text = raw.trim();
    if (!text) return;
    setHistory((h) => [...h, text]);
    setHistIdx(-1);
    const [cmd, ...args] = text.split(/\s+/);
    const arg = args.join(" ");
    const name = cmd.toLowerCase();

    if (name === "clear") {
      setLines([]);
      return;
    }
    push("cmd", text);

    switch (name) {
      case "help":
        push(
          "out",
          <ul className="grid gap-x-6 sm:grid-cols-2">
            {COMMANDS.map((c) => (
              <li key={c.name}>
                <span className="text-fg">{c.usage.padEnd(14, " ")}</span>
                <span className="text-muted">{c.desc}</span>
              </li>
            ))}
          </ul>,
        );
        break;
      case "whoami":
        push(
          "out",
          <div>
            <p className="text-fg">
              {profile.name} <span className="text-muted">·</span> {profile.role}, {profile.company}
            </p>
            <p className="text-fg">{profile.headline ?? <Todo>headline</Todo>}</p>
            <p className="text-muted">{profile.location}</p>
          </div>,
        );
        break;
      case "projects":
        push(
          "out",
          <div className="space-y-2">
            {PROJECT_GROUPS.map(([kind, label]) => (
              <div key={kind}>
                <p className="text-muted"># {label}</p>
                <ul>
                  {projects
                    .filter((p) => p.kind === kind)
                    .map((p) => (
                      <li key={p.id}>
                        {cmdButton(`open ${p.slug}`, p.slug)} <span className="text-muted">· {p.name}</span>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>,
        );
        break;
      case "open": {
        const p = findProject(arg);
        if (!p) {
          push("err", arg ? `open: no project matches "${arg}". Try "projects".` : "usage: open <name>. Try \"projects\".");
          break;
        }
        push("out", `opening ${p.name}…`);
        jumpToProject(p.id);
        break;
      }
      case "stack":
        push(
          "out",
          <ul>
            {skills.map((g) => (
              <li key={g.group}>
                <span className="text-accent">{g.group.toLowerCase()}:</span> <span className="text-fg">{g.items.join(", ")}</span>
              </li>
            ))}
          </ul>,
        );
        break;
      case "contact":
        push(
          "out",
          <ul>
            <li>
              email{"    "}
              <a className={linkCls} href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </li>
            <li>
              github{"   "}
              <a className={linkCls} href={profile.github} target="_blank" rel="noopener noreferrer">
                {profile.githubHandle}
              </a>
            </li>
            <li>
              linkedin{" "}
              <a className={linkCls} href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                hitensh-kharva
              </a>
            </li>
          </ul>,
        );
        break;
      case "theme": {
        const target = arg.toLowerCase();
        if (isLook(target)) {
          push("out", `switching to ${LOOK_LABEL[target]}…`);
          setLook(target);
        } else {
          push(
            "out",
            <p>
              {target ? <span className="text-todo">unknown theme "{arg}". </span> : null}
              <span className="text-muted">usage: theme </span>
              {LOOKS.map((l, i) => (
                <span key={l}>
                  {i > 0 && <span className="text-muted"> | </span>}
                  {cmdButton(`theme ${l}`, l)}
                </span>
              ))}
            </p>,
          );
        }
        break;
      }
      case "sudo":
        push("err", "nice try.");
        break;
      default:
        push("err", `command not found: ${cmd}. Type "help".`);
    }
  }

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    run(input);
    setInput("");
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const idx = histIdx < 0 ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(idx);
      setInput(history[idx]);
    } else if (e.key === "ArrowDown" && histIdx >= 0) {
      e.preventDefault();
      const idx = histIdx + 1;
      if (idx >= history.length) {
        setHistIdx(-1);
        setInput("");
      } else {
        setHistIdx(idx);
        setInput(history[idx]);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  }

  return (
    <HeroSection className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 md:pt-16">
      <m.div variants={container} initial="hidden" animate="show">
        <m.h1 variants={item} id="hero-title" className="font-mono text-3xl font-bold text-fg sm:text-4xl">
          <span className="text-accent">~/</span>
          {profile.firstName.toLowerCase()}
          <span className="text-muted">.</span>
          {profile.lastName.toLowerCase()}
          <span className="sr-only"> ({profile.name})</span>
        </m.h1>

        <m.div
          variants={item}
          className="mt-6 overflow-hidden rounded-[var(--radius)] border border-line bg-surface font-mono text-sm shadow-2xl"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a,button")) return;
            inputRef.current?.focus({ preventScroll: true });
          }}
        >
          <div className="flex items-center gap-2 border-b border-line px-4 py-2.5" aria-hidden="true">
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#febc2e]" />
            <span className="size-3 rounded-full bg-[#28c840]" />
            <span className="ml-2 text-xs text-muted">{profile.githubHandle.toLowerCase()} — zsh</span>
          </div>

          <div
            ref={logRef}
            role="log"
            aria-live="polite"
            aria-label="Terminal output"
            className="h-72 overflow-y-auto px-4 py-3 leading-relaxed sm:h-80"
          >
            <p className="text-muted">
              Welcome. Type <span className="text-fg">help</span> to see the commands, or tap one below.
            </p>
            {lines.map((l) => (
              <div key={l.id} className="mt-1.5">
                {l.kind === "cmd" ? (
                  <p>
                    <span className="text-accent">❯ </span>
                    <span className="text-fg">{l.body}</span>
                  </p>
                ) : (
                  <div className={l.kind === "err" ? "text-todo" : "text-fg"}>{l.body}</div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-line px-4 py-2 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[var(--ring)]">
            <label htmlFor="term-input" className="text-accent">
              <span aria-hidden="true">❯</span>
              <span className="sr-only">Terminal command</span>
            </label>
            <input
              ref={inputRef}
              id="term-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="go"
              placeholder="type a command…"
              className="min-h-11 flex-1 bg-transparent text-base text-fg caret-accent outline-none placeholder:text-muted sm:text-sm"
            />
            <button type="submit" className="min-h-11 rounded px-3 text-accent hover:bg-surface-2">
              run
            </button>
          </form>
        </m.div>

        <m.div variants={item} role="group" aria-label="Quick commands" className="mt-4 flex flex-wrap gap-2">
          {TAPS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => run(t)}
              className="min-h-11 rounded-[var(--radius)] border border-line px-3.5 font-mono text-sm text-fg transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              {t}
            </button>
          ))}
        </m.div>

        <HeroActions item={item} />
      </m.div>
    </HeroSection>
  );
}
