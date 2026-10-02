"use client";

import { motion } from "motion/react";
import { useEffect } from "react";

// The first page load is never animated (the CSS intro handles it, and
// content must be visible before JavaScript runs). Later navigations fade in.
let firstLoad = true;

export default function Template({ children }: { children: React.ReactNode }) {
  const animate = !firstLoad;
  useEffect(() => {
    firstLoad = false;
  }, []);

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 16 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
