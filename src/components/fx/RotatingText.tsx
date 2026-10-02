"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/** Cycles through words with a vertical slide. Announces the full list once. */
export function RotatingText({
  words,
  interval = 2400,
}: {
  words: readonly string[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => window.clearInterval(id);
  }, [interval, reduce, words.length]);

  return (
    <span className="relative -mb-[0.2em] inline-grid overflow-hidden pb-[0.2em] align-bottom">
      <span className="sr-only">{words.join(", ")}</span>
      {/* Invisible longest word reserves width so the line doesn't jump. */}
      <span aria-hidden className="invisible col-start-1 row-start-1 whitespace-nowrap">
        {words.reduce((a, b) => (b.length > a.length ? b : a), "")}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          aria-hidden
          key={words[index]}
          className="decoration-accent col-start-1 row-start-1 whitespace-nowrap underline decoration-[length:0.08em] underline-offset-[0.16em]"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
