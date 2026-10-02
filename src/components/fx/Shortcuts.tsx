"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { emit, EVENTS, isTypingTarget } from "@/lib/events";
import { scrollToTarget } from "@/lib/scroll";

/** "g" then a letter jumps to a section, like Gmail or GitHub. */
const JUMPS: Record<string, { id: string; label: string }> = {
  h: { id: "top", label: "Top" },
  w: { id: "work", label: "Work" },
  a: { id: "about", label: "About" },
  s: { id: "skills", label: "Skills" },
  e: { id: "experience", label: "Experience" },
  r: { id: "credentials", label: "Credentials" },
  b: { id: "writing", label: "Writing" },
  c: { id: "contact", label: "Contact" },
};

const LIST: { keys: string[]; label: string }[] = [
  { keys: ["Ctrl", "K"], label: "Command menu" },
  { keys: ["/"], label: "Command menu" },
  { keys: ["`"], label: "Terminal" },
  { keys: ["?"], label: "This list" },
  ...Object.entries(JUMPS).map(([k, v]) => ({ keys: ["g", k], label: `Go to ${v.label}` })),
  { keys: ["←", "→"], label: "Previous or next case study" },
];

/**
 * Global keyboard shortcuts plus a "?" cheat sheet. Ignored while typing,
 * and inside dialogs, so they never fight a form field.
 */
export function Shortcuts() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const pending = useRef<number | null>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target)) return;

      if (pending.current !== null) {
        window.clearTimeout(pending.current);
        pending.current = null;
        const jump = JUMPS[e.key.toLowerCase()];
        if (jump) {
          e.preventDefault();
          if (pathname === "/") scrollToTarget(jump.id === "top" ? 0 : jump.id);
          else router.push(jump.id === "top" ? "/" : `/#${jump.id}`);
          return;
        }
      }

      if (e.key === "g") {
        pending.current = window.setTimeout(() => (pending.current = null), 1200);
      } else if (e.key === "?") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "/") {
        e.preventDefault();
        emit(EVENTS.openPalette);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(EVENTS.openShortcuts, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(EVENTS.openShortcuts, onOpen);
    };
  }, [pathname, router]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "?") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="bg-ink/30 fixed inset-0 z-[85] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-title"
            className="glass shadow-soft fixed top-1/2 left-1/2 z-[86] max-h-[80dvh] w-[min(26rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl p-6"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="shortcuts-title" className="heading text-step-2">
                Keyboard shortcuts
              </h2>
              <button
                type="button"
                autoFocus
                onClick={() => setOpen(false)}
                aria-label="Close shortcuts"
                className="hover:bg-surface-2 grid size-9 place-items-center rounded-full transition-colors"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <ul className="divide-line divide-y">
              {LIST.map((s) => (
                <li
                  key={s.label + s.keys.join()}
                  className="flex items-center justify-between gap-4 py-2"
                >
                  <span className="text-muted">{s.label}</span>
                  <span className="flex shrink-0 items-center gap-1">
                    {s.keys.map((k, i) => (
                      <kbd
                        key={i}
                        className="border-line bg-surface text-step--1 min-w-7 rounded-md border px-1.5 py-0.5 text-center"
                      >
                        {k}
                      </kbd>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
