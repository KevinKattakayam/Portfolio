"use client";

import { ArrowUp } from "lucide-react";
import { Magnetic } from "@/components/fx/Magnetic";
import { nav, site } from "@/data/site";
import { emit, EVENTS } from "@/lib/events";
import { scrollToTarget } from "@/lib/scroll";
import { LocalTime } from "./LocalTime";
import { SectionLink } from "./SectionLink";

export function Footer() {
  return (
    <footer className="border-line border-t pt-16 pb-10">
      <div className="container-grid grid-12 gap-y-12">
        <div className="col-span-4 md:col-span-5">
          <p className="heading text-step-3">{site.name}</p>
          <p className="text-muted mt-3 max-w-sm">{site.tagline}</p>
        </div>

        <nav aria-label="Footer" className="col-span-2 md:col-span-2">
          <p className="text-step--1 text-muted mb-3">Sections</p>
          <ul className="space-y-1.5">
            {nav.map((n) => (
              <li key={n.id}>
                <SectionLink id={n.id} className="link-underline">
                  {n.label}
                </SectionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-2 md:col-span-2">
          <p className="text-step--1 text-muted mb-3">Elsewhere</p>
          <ul className="space-y-1.5">
            {site.socials.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline"
                >
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${site.email}`} className="link-underline">
                Email
              </a>
            </li>
          </ul>
        </div>

        <div className="col-span-4 flex flex-col items-start justify-between gap-6 md:col-span-3 md:items-end">
          <Magnetic strength={0.4}>
            <button
              type="button"
              onClick={() => scrollToTarget(0)}
              className="group border-line hover:border-accent hover:bg-accent hover:text-accent-ink grid size-16 place-items-center rounded-full border transition-colors"
              aria-label="Back to top"
              data-cursor
            >
              <ArrowUp
                className="size-5 transition-transform duration-300 group-hover:-translate-y-1"
                aria-hidden
              />
            </button>
          </Magnetic>
          <p className="text-step--1">
            <LocalTime />
          </p>
        </div>
      </div>

      <div className="container-grid text-step--1 text-muted mt-16 flex flex-wrap justify-between gap-4">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p>
          Built with Next.js, statically exported. Try{" "}
          <kbd className="border-line rounded border px-1.5">Ctrl</kbd>{" "}
          <kbd className="border-line rounded border px-1.5">K</kbd>, or{" "}
          <button
            type="button"
            onClick={() => emit(EVENTS.openTerminal)}
            className="link-underline hover:text-ink"
          >
            open the terminal
          </button>
          .
        </p>
      </div>
    </footer>
  );
}
