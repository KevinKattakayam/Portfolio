"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import { ProjectCard, sizeClass } from "@/components/work/ProjectCard";
import { archive, categories, projects, type Category } from "@/data/projects";
import { cn } from "@/lib/utils";
import { GitHubRepos } from "./GitHubRepos";
import { SectionHeader } from "./SectionHeader";

/** How many case studies show before "Show all". Matches the bento row layout. */
const INITIAL = 10;

const allTech = Array.from(new Set(projects.flatMap((p) => p.tech))).sort((a, b) =>
  a.localeCompare(b),
);

export function Work() {
  const [category, setCategory] = useState<Category | "All">("All");
  const [tech, setTech] = useState("");
  const [expanded, setExpanded] = useState(false);

  const visible = useMemo(
    () =>
      projects.filter(
        (p) => (category === "All" || p.category === category) && (!tech || p.tech.includes(tech)),
      ),
    [category, tech],
  );

  const filtering = category !== "All" || tech !== "";
  const shown = filtering || expanded ? visible : visible.slice(0, INITIAL);
  const hiddenCount = visible.length - shown.length;

  const reset = () => {
    setCategory("All");
    setTech("");
  };

  return (
    <section id="work" aria-labelledby="work-title" className="section">
      <div className="container-grid">
        <SectionHeader
          id="work"
          title="Selected work"
          intro={
            <p>
              {projects.length} projects with full case studies, from agent pipelines and a Kafka
              backbone to a GPU kernel and computer vision. Each case study links to its code.
            </p>
          }
        />

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
            {(["All", ...categories] as const).map((c) => {
              const active = category === c;
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "text-step--1 relative isolate rounded-full border px-4 py-2 transition-colors",
                    active ? "border-ink text-bg" : "border-line text-ink hover:border-ink",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="work-filter"
                      className="bg-ink absolute inset-0 -z-10 rounded-full"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  {c}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="tech-filter" className="text-step--1 text-muted">
              Built with
            </label>
            <select
              id="tech-filter"
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              className="border-line bg-surface text-step--1 text-ink h-10 rounded-full border px-4"
            >
              <option value="">Any technology</option>
              {allTech.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          Showing {shown.length} of {projects.length} projects
        </p>

        <motion.ul
          layout
          className="grid-12 grid-flow-dense auto-rows-auto gap-y-4 md:auto-rows-[minmax(22rem,auto)] md:gap-4"
          role="list"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((p, i) => (
              <motion.li
                key={p.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={cn("col-span-4 min-h-[22rem]", sizeClass[p.size])}
              >
                <ProjectCard project={p} priority={i === 0} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {hiddenCount > 0 && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="border-line hover:border-ink hover:bg-ink hover:text-bg rounded-full border px-7 py-3 transition-colors"
              data-cursor
            >
              Show all {projects.length} projects
            </button>
          </div>
        )}

        {visible.length === 0 && (
          <div className="border-line rounded-[var(--radius-card)] border border-dashed p-10 text-center">
            <p className="text-step-1">No project uses that combination yet.</p>
            <button type="button" onClick={reset} className="link-underline text-accent mt-3">
              Clear filters
            </button>
          </div>
        )}

        {/* Smaller projects */}
        <div className="grid-12 mt-24 gap-y-8">
          <h3 className="heading text-step-3 col-span-4 md:col-span-4">
            More things I&apos;ve built
          </h3>
          <ul
            className="divide-line border-line col-span-4 divide-y border-y md:col-span-8"
            role="list"
          >
            {archive.map((a) => (
              <li key={a.title} className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 py-5">
                <span className="heading text-step-1">
                  {a.href ? (
                    <a
                      href={a.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline hover:text-accent inline-flex items-center gap-1.5"
                    >
                      {a.title}
                      <ArrowUpRight className="text-muted size-4" aria-label="Open on GitHub" />
                    </a>
                  ) : (
                    a.title
                  )}
                </span>
                <span className="row-span-2 self-center">
                  {a.live && (
                    <a
                      href={a.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-line text-step--1 hover:border-accent hover:text-accent rounded-full border px-3 py-1 transition-colors"
                    >
                      Live
                    </a>
                  )}
                </span>
                <span className="text-muted">
                  {a.description} <span className="text-ink/60">{a.tech.join(", ")}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <GitHubRepos />
      </div>
    </section>
  );
}
