"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";

type ViewTransitionDoc = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

/**
 * Light/dark toggle. Where the View Transitions API exists, the new theme
 * spreads out in a circle from the button; elsewhere it switches instantly.
 */
export function useThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();

  const switchTo = (next: string, origin?: { x: number; y: number }) => {
    const doc = document as ViewTransitionDoc;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!doc.startViewTransition || reduce) {
      setTheme(next);
      return;
    }
    const x = origin?.x ?? window.innerWidth / 2;
    const y = origin?.y ?? 0;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const t = doc.startViewTransition(() => flushSync(() => setTheme(next)));
    t.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        {
          duration: 650,
          easing: "cubic-bezier(.65,0,.35,1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };

  return { resolvedTheme, switchTo, setTheme };
}

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, switchTo } = useThemeSwitch();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        switchTo(isDark ? "light" : "dark", { x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "text-ink hover:bg-surface-2 grid size-10 place-items-center rounded-full transition-colors",
        className,
      )}
    >
      {/* Both icons render; CSS picks one so there's no hydration flash. */}
      <Sun className="hidden size-[18px] dark:block" aria-hidden />
      <Moon className="size-[18px] dark:hidden" aria-hidden />
    </button>
  );
}
