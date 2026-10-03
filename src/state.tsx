import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export const LOOKS = ["pipeline", "terminal", "bold", "horizon"] as const;
export type Look = (typeof LOOKS)[number];

export const LOOK_LABEL: Record<Look, string> = {
  pipeline: "Pipeline",
  terminal: "Terminal",
  bold: "Bold",
  horizon: "Horizon",
};

const STORAGE_KEY = "portfolio-look";

export function isLook(value: unknown): value is Look {
  return typeof value === "string" && (LOOKS as readonly string[]).includes(value);
}

function readStoredLook(): Look {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLook(stored)) return stored;
  } catch {
    // Storage blocked (private mode, sandbox): fall back to the default.
  }
  return "pipeline";
}

export interface JumpTarget {
  id: string;
  tick: number;
}

interface SiteState {
  look: Look;
  setLook: (look: Look) => void;
  /** Id of the project whose "How it works" panel is open. */
  openProject: string | null;
  setOpenProject: (id: string | null) => void;
  /** Scroll to a project, clear filters that hide it, and open its details. */
  jumpToProject: (id: string) => void;
  /** Latest jump request; the project list resets its filter, then scrolls and focuses. */
  jumpTarget: JumpTarget | null;
}

const SiteContext = createContext<SiteState | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [look, setLookState] = useState<Look>(readStoredLook);
  const [openProject, setOpenProject] = useState<string | null>(null);
  const [jumpTarget, setJumpTarget] = useState<JumpTarget | null>(null);

  useEffect(() => {
    document.documentElement.dataset.look = look;
    const meta = document.querySelector('meta[name="theme-color"]');
    const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
    if (meta && bg) meta.setAttribute("content", bg);
  }, [look]);

  const setLook = useCallback((next: Look) => {
    setLookState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore: the choice just won't persist.
    }
  }, []);

  const jumpToProject = useCallback((id: string) => {
    setOpenProject(id);
    setJumpTarget({ id, tick: Date.now() });
  }, []);

  const value = useMemo(
    () => ({ look, setLook, openProject, setOpenProject, jumpToProject, jumpTarget }),
    [look, setLook, openProject, jumpToProject, jumpTarget],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside SiteProvider");
  return ctx;
}
