"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { EVENTS } from "@/lib/events";

const Palette = dynamic(() => import("./CommandPalette").then((m) => m.CommandPalette), {
  ssr: false,
});

/**
 * Keeps the palette (cmdk plus its data) out of the first load. It is
 * downloaded in the background about ten seconds after load, and mounted the first
 * time someone presses Ctrl/Cmd + K or clicks the navbar shortcut.
 */
export function LazyCommandPalette() {
  const [mounted, setMounted] = useState(false);
  const [openOnMount, setOpenOnMount] = useState(false);

  useEffect(() => {
    if (mounted) return;
    const arm = () => {
      setOpenOnMount(true);
      setMounted(true);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        arm();
      }
    };
    const warm = window.setTimeout(() => void import("./CommandPalette"), 10000);
    window.addEventListener("keydown", onKey);
    window.addEventListener(EVENTS.openPalette, arm);
    return () => {
      window.clearTimeout(warm);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(EVENTS.openPalette, arm);
    };
  }, [mounted]);

  return mounted ? <Palette initialOpen={openOnMount} /> : null;
}
