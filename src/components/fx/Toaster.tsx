"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { EVENTS } from "@/lib/events";

/** Minimal toast: one message at a time, announced politely. */
export function Toaster() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: number | undefined;
    const onToast = (e: Event) => {
      setMessage((e as CustomEvent<string>).detail);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setMessage(null), 3600);
    };
    window.addEventListener(EVENTS.toast, onToast);
    return () => {
      window.removeEventListener(EVENTS.toast, onToast);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[95] flex justify-center px-4"
    >
      <AnimatePresence>
        {message && (
          <motion.p
            key={message}
            initial={{ y: 24, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="bg-ink text-step--1 text-bg shadow-soft rounded-full px-5 py-3 font-medium"
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
