"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { EVENTS } from "@/lib/events";

const TerminalImpl = dynamic(() => import("./Terminal").then((m) => m.Terminal), {
  ssr: false,
});

/**
 * Keeps the terminal out of the first load. It mounts the first time someone
 * presses ` (backtick) or asks for it from the navbar or the command menu.
 */
export function LazyTerminal() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;
    const arm = () => setMounted(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "`" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault();
      arm();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(EVENTS.openTerminal, arm);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(EVENTS.openTerminal, arm);
    };
  }, [mounted]);

  return mounted ? <TerminalImpl initialOpen /> : null;
}
