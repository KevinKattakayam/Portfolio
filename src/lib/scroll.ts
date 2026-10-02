import type Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Scroll to a section id (or a pixel offset). Uses Lenis when smooth scrolling
 * is active and falls back to native scrolling (instant for reduced motion).
 */
export function scrollToTarget(target: string | number) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const el = typeof target === "string" ? document.getElementById(target.replace(/^#/, "")) : null;
  const top = typeof target === "number" ? target : 0;

  if (window.__lenis) {
    window.__lenis.scrollTo(el ?? top, { offset: 0, duration: 1.2 });
  } else if (el) {
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  } else {
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  }

  // Move keyboard focus to the section so screen readers announce it.
  if (el) {
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }
}
