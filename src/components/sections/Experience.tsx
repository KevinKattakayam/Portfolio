"use client";

import { Briefcase, GraduationCap } from "lucide-react";
import { useEffect, useRef } from "react";
import { timeline } from "@/data/experience";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";

/**
 * Vertical timeline. GSAP ScrollTrigger draws the accent line as you scroll
 * (scrubbed to scroll position) and lights up each node as the line reaches it.
 */
export function Experience() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let revert: (() => void) | undefined;
    let cancelled = false;

    // GSAP (~70 kB) is only downloaded when this section is about to be seen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
          ([{ gsap }, { ScrollTrigger }]) => {
            if (cancelled) return;
            gsap.registerPlugin(ScrollTrigger);
            const ctx = gsap.context(() => {
              gsap.fromTo(
                "[data-tl-progress]",
                { scaleY: 0 },
                {
                  scaleY: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: "[data-tl-list]",
                    start: "top 70%",
                    end: "bottom 70%",
                    scrub: 0.6,
                  },
                },
              );
              gsap.utils.toArray<HTMLElement>("[data-tl-item]").forEach((item) => {
                gsap.from(item.querySelector("[data-tl-body]"), {
                  opacity: 0,
                  y: 32,
                  duration: 0.9,
                  ease: "power3.out",
                  scrollTrigger: { trigger: item, start: "top 82%" },
                });
                ScrollTrigger.create({
                  trigger: item,
                  start: "top 70%",
                  toggleClass: {
                    targets: item.querySelector("[data-tl-node]"),
                    className: "is-reached",
                  },
                });
              });
            }, el);
            revert = () => ctx.revert();
          },
        );
      },
      { rootMargin: "700px 0px" },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      revert?.();
    };
  }, []);

  return (
    <section ref={root} id="experience" aria-labelledby="experience-title" className="section">
      <div className="container-grid">
        <SectionHeader
          id="experience"
          title="Experience and education"
          intro={
            <p>
              Four internships and a generative AI traineeship, alongside a degree in AI and machine
              learning.
            </p>
          }
        />

        <ol data-tl-list className="relative md:ml-[calc(25%-1px)]">
          {/* Track and scroll-drawn progress line */}
          <span aria-hidden className="bg-line absolute top-2 bottom-2 left-[11px] w-px" />
          <span
            aria-hidden
            data-tl-progress
            className="bg-accent absolute top-2 bottom-2 left-[11px] w-px origin-top"
          />
          {timeline.map((t) => {
            const Icon = t.kind === "work" ? Briefcase : GraduationCap;
            return (
              <li
                key={t.org + t.start}
                data-tl-item
                className="relative pb-14 pl-12 last:pb-0 md:pl-16"
              >
                <span
                  data-tl-node
                  aria-hidden
                  className={cn(
                    "border-line bg-bg text-muted absolute top-0.5 left-0 grid size-6 place-items-center rounded-full border transition-colors duration-500",
                    "[&.is-reached]:border-accent [&.is-reached]:bg-accent [&.is-reached]:text-accent-ink",
                  )}
                >
                  <Icon className="size-3" />
                </span>
                <div data-tl-body className="grid gap-x-8 gap-y-3 md:grid-cols-[1fr_12rem]">
                  <div>
                    <h3 className="heading text-step-2">{t.title}</h3>
                    <p className="text-step-1 text-muted mt-1">{t.org}</p>
                    <ul className="mt-4 max-w-[62ch] space-y-2">
                      {t.points.map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ul>
                    {t.tech && (
                      <p className="text-step--1 text-muted mt-4">
                        <span className="sr-only">Tools: </span>
                        {t.tech.join(", ")}
                      </p>
                    )}
                  </div>
                  <p className="text-step--1 text-muted row-start-1 whitespace-nowrap tabular-nums md:col-start-2 md:pt-2 md:text-right">
                    <span className="sr-only">{t.kind === "work" ? "Role" : "Study"} from </span>
                    {t.start} – {t.end}
                    {t.current && (
                      <span className="bg-accent-soft text-accent ml-2 rounded-full px-2 py-0.5">
                        now
                      </span>
                    )}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
