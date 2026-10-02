"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { ResumeMenu } from "@/components/ui/ResumeMenu";
import { nav, site } from "@/data/site";
import { SectionLink } from "./SectionLink";

/** Full-screen menu for small screens. Traps focus and closes on Escape. */
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    document.body.style.overflow = "hidden";
    const previouslyFocused = document.activeElement as HTMLElement | null;
    panel.current?.querySelector<HTMLElement>("button, a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panel.current) return;
      const focusable = panel.current.querySelectorAll<HTMLElement>("a, button");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.__lenis?.start();
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="bg-ink text-bg fixed inset-0 z-[75] flex flex-col"
          initial={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
          animate={{ clipPath: "circle(150% at calc(100% - 2.5rem) 2.5rem)" }}
          exit={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="container-grid flex h-[calc(var(--header-h)+0.75rem)] items-end justify-end pb-1">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="bg-bg text-ink mr-2 grid size-10 place-items-center rounded-full"
            >
              <X className="size-[18px]" aria-hidden />
            </button>
          </div>
          <nav aria-label="Mobile" className="container-grid flex flex-1 flex-col justify-center">
            <ul className="space-y-1">
              {nav.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <SectionLink
                    id={item.id}
                    onNavigate={onClose}
                    className="display text-step-5 hover:text-accent focus-visible:text-accent block py-1 transition-colors"
                  >
                    {item.label}
                  </SectionLink>
                </motion.li>
              ))}
            </ul>
          </nav>
          <motion.div
            className="container-grid flex flex-wrap items-center justify-between gap-4 pb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.5 } }}
          >
            <a href={`mailto:${site.email}`} className="link-underline text-step-0">
              {site.email}
            </a>
            <ResumeMenu
              variant="primary"
              align="left"
              className="[&>div]:top-auto [&>div]:bottom-[calc(100%+0.5rem)]"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
