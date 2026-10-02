"use client";

import { useEffect } from "react";
import { emit, EVENTS, toast } from "@/lib/events";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/**
 * Easter egg. The Konami code (or clicking the KK logo five times quickly)
 * triggers an "anomaly": the hero signal field spikes and the page glitches,
 * a nod to the anomaly detector in my observability pipeline.
 */
export function triggerAnomaly() {
  emit(EVENTS.anomaly);
  const z = (8 + Math.random() * 3).toFixed(1);
  toast(`Anomaly detected: z-score ${z}. You found the easter egg.`);
  document.querySelectorAll<HTMLElement>("[data-glitch]").forEach((el) => {
    el.classList.remove("anomaly-glitch");
    void el.offsetWidth; // restart the CSS animation
    el.classList.add("anomaly-glitch");
  });
  console.info(
    "%c Anomaly detected. Hiring? Say hi at kevinbastin369@gmail.com ",
    "background:#2f3be8;color:#fff;padding:4px 8px;border-radius:4px",
  );
}

export function Easter() {
  useEffect(() => {
    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = key === KONAMI[pos] ? pos + 1 : key === KONAMI[0] ? 1 : 0;
      if (pos === KONAMI.length) {
        pos = 0;
        triggerAnomaly();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return null;
}
