"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { Command, Menu, SquareTerminal } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Magnetic } from "@/components/fx/Magnetic";
import { ResumeMenu } from "@/components/ui/ResumeMenu";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { nav } from "@/data/site";
import { emit, EVENTS } from "@/lib/events";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { SectionLink } from "./SectionLink";

/** Tracks which section is in the middle of the viewport. */
function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (pathname !== "/") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids, pathname]);
  return pathname === "/" ? active : null;
}

// "top" (the hero) is observed too, so no link stays highlighted back at the top.
const ids = ["top", ...nav.map((n) => n.id)];

export function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(ids);

  // Hide on scroll down, show on scroll up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 160 && y > prev + 2 && !menuOpen);
    if (y < prev - 2) setHidden(false);
  });

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 pt-3"
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container-grid">
          <nav
            aria-label="Main"
            className={cn(
              "flex h-[var(--header-h)] items-center justify-between rounded-full pr-2 pl-4 transition-[background-color,border-color,box-shadow] duration-500",
              scrolled ? "glass shadow-soft" : "border border-transparent",
            )}
          >
            <Logo />

            <ul className="hidden items-center gap-1 lg:flex">
              {nav.map((item) => (
                <li key={item.id}>
                  <SectionLink
                    id={item.id}
                    aria-current={active === item.id ? "true" : undefined}
                    className="text-step--1 text-muted hover:text-ink aria-[current=true]:text-ink relative isolate block rounded-full px-4 py-2 transition-colors"
                  >
                    {active === item.id && (
                      <motion.span
                        layoutId="nav-active"
                        className="bg-surface-2 absolute inset-0 -z-10 rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      />
                    )}
                    {item.label}
                  </SectionLink>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => emit(EVENTS.openPalette)}
                aria-label="Open command menu (Ctrl or Command + K)"
                className="text-step--1 text-muted hover:bg-surface-2 hover:text-ink hidden h-10 items-center gap-2 rounded-full px-3 transition-colors sm:flex"
              >
                <Command className="size-4" aria-hidden />
                <span>K</span>
              </button>
              <button
                type="button"
                onClick={() => emit(EVENTS.openTerminal)}
                aria-label="Open terminal (backtick key)"
                title="Terminal ( ` )"
                className="text-ink hover:bg-surface-2 grid size-10 place-items-center rounded-full transition-colors"
              >
                <SquareTerminal className="size-[18px]" aria-hidden />
              </button>
              <ThemeToggle />
              <ResumeMenu className="hidden sm:block" />
              <Magnetic className="lg:hidden">
                <button
                  type="button"
                  onClick={() => setMenuOpen(true)}
                  aria-label="Open menu"
                  aria-expanded={menuOpen}
                  aria-controls="mobile-menu"
                  className="bg-ink text-bg grid size-10 place-items-center rounded-full"
                >
                  <Menu className="size-[18px]" aria-hidden />
                </button>
              </Magnetic>
            </div>
          </nav>
        </div>
      </motion.header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
