"use client";

import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

/**
 * Lenis smooth scrolling, loaded on demand. It only runs for mouse/trackpad
 * users who haven't asked for reduced motion: phones keep native momentum
 * scrolling (better feel, and none of the JavaScript is downloaded).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const skip =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches;
    if (skip) return;

    let cancelled = false;
    let raf = 0;
    let lenis: import("lenis").default | undefined;

    const start = async () => {
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;
      lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
      window.__lenis = lenis;
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };

    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    const id = idle(start, { timeout: 1500 });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (window.cancelIdleCallback && typeof id === "number") window.cancelIdleCallback(id);
      lenis?.destroy();
      delete window.__lenis;
    };
  }, []);

  // New page: start at the top, or at the #hash target.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const el = hash ? document.getElementById(hash) : null;
    requestAnimationFrame(() => {
      if (el) {
        if (window.__lenis) window.__lenis.scrollTo(el, { immediate: true });
        else el.scrollIntoView();
      } else if (window.__lenis) {
        window.__lenis.scrollTo(0, { immediate: true });
      }
    });
  }, [pathname]);

  return <>{children}</>;
}
