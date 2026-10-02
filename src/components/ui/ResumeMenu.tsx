"use client";

import { AnimatePresence, motion } from "motion/react";
import { Download } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { resumes } from "@/data/site";
import { asset, cn } from "@/lib/utils";
import { buttonVariants } from "./button";

/**
 * "Resume" button that opens a short list of role-specific PDFs, so a
 * backend recruiter gets the backend resume.
 */
export function ResumeMenu({
  variant = "outline",
  size = "sm",
  align = "right",
  label = "Resume",
  className,
}: {
  variant?: "outline" | "ink" | "primary" | "ghost";
  size?: "sm" | "md" | "lg";
  align?: "left" | "right";
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        root.current?.querySelector("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className={cn("relative", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        className={buttonVariants({ variant, size })}
      >
        <Download aria-hidden />
        {label}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className={cn(
              "glass shadow-soft absolute top-[calc(100%+0.5rem)] z-50 w-[min(20rem,calc(100vw-2rem))] rounded-2xl p-2",
              align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left",
            )}
          >
            <p className="text-step--1 text-muted px-3 pt-2 pb-1">Pick the version for your role</p>
            <ul>
              {resumes.map((r) => (
                <li key={r.id}>
                  <a
                    href={asset(r.file)}
                    download
                    onClick={() => setOpen(false)}
                    className="hover:bg-accent-soft focus-visible:bg-accent-soft block rounded-xl px-3 py-2 transition-colors"
                  >
                    <span className="text-ink block font-medium">{r.label}</span>
                    <span className="text-step--1 text-muted block">{r.detail}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
