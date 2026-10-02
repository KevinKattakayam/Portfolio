"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useId, useMemo, useRef, useState } from "react";
import { timeline } from "@/data/experience";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";

const norm = (s: string) => s.toLowerCase();

function usage(skill: string) {
  const s = norm(skill);
  return {
    projects: projects.filter((p) => p.tech.some((t) => norm(t) === s)),
    roles: timeline.filter(
      (t) =>
        t.kind === "work" &&
        (t.tech?.some((x) => norm(x) === s) || t.points.some((pt) => norm(pt).includes(s))),
    ),
  };
}

/**
 * Skills as evidence: pick a skill and see exactly which projects and roles
 * used it. Tabs follow the WAI-ARIA tabs pattern (arrow keys move between them).
 */
export function Skills() {
  const [groupIndex, setGroupIndex] = useState(0);
  const group = skillGroups[groupIndex];
  const [skill, setSkill] = useState<string | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  const selected = skill ?? group.skills[0];
  const used = useMemo(() => usage(selected), [selected]);

  const selectGroup = (i: number) => {
    setGroupIndex(i);
    setSkill(null);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = skillGroups.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight")
      next = groupIndex === last ? 0 : groupIndex + 1;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft")
      next = groupIndex === 0 ? last : groupIndex - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    selectGroup(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="skills" aria-labelledby="skills-title" className="section">
      <div className="container-grid">
        <SectionHeader
          id="skills"
          title="Skills, with receipts"
          intro={<p>Choose a skill to see the projects and roles where I actually used it.</p>}
        />

        <div className="grid-12 gap-y-6">
          <div
            role="tablist"
            aria-label="Skill areas"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            className="col-span-4 -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] pb-2 md:mx-0 md:flex-col md:overflow-visible md:px-0 md:pb-0"
          >
            {skillGroups.map((g, i) => {
              const active = i === groupIndex;
              return (
                <button
                  key={g.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  id={`${baseId}-tab-${g.id}`}
                  aria-selected={active}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => selectGroup(i)}
                  className={cn(
                    "relative isolate shrink-0 rounded-2xl px-5 py-4 text-left transition-colors md:w-full",
                    active ? "text-bg" : "text-ink hover:bg-surface-2",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="skill-tab"
                      className="bg-ink absolute inset-0 -z-10 rounded-2xl"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  )}
                  <span className="heading text-step-1 block whitespace-nowrap md:whitespace-normal">
                    {g.label}
                  </span>
                  <span
                    className={cn(
                      "text-step--1 hidden md:block",
                      active ? "text-bg/70" : "text-muted",
                    )}
                  >
                    {g.skills.length} skills
                  </span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`${baseId}-panel`}
            aria-labelledby={`${baseId}-tab-${group.id}`}
            className="col-span-4 grid gap-4 md:col-span-8 md:grid-cols-2"
          >
            <div className="border-line bg-surface rounded-[var(--radius-card)] border p-6 md:col-span-2 md:p-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="text-step-1 max-w-[48ch]">{group.blurb}</p>
                  <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${group.label} skills`}>
                    {group.skills.map((s) => {
                      const on = s === selected;
                      return (
                        <li key={s}>
                          <button
                            type="button"
                            aria-pressed={on}
                            onClick={() => setSkill(s)}
                            className={cn(
                              "rounded-full border px-4 py-2 transition-[background-color,border-color,color,transform] duration-300 hover:-translate-y-0.5",
                              on
                                ? "border-accent bg-accent text-accent-ink"
                                : "border-line hover:border-ink",
                            )}
                          >
                            {s}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>

            <div aria-live="polite" className="contents">
              <EvidenceCard title={`${selected} in projects`}>
                {used.projects.length ? (
                  <ul className="space-y-2">
                    {used.projects.map((p) => (
                      <li key={p.slug}>
                        <Link href={`/work/${p.slug}/`} className="link-underline">
                          {p.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">
                    Not in a featured project yet. See the full CV for coursework and
                    certifications.
                  </p>
                )}
              </EvidenceCard>
              <EvidenceCard title={`${selected} at work`}>
                {used.roles.length ? (
                  <ul className="space-y-2">
                    {used.roles.map((r) => (
                      <li key={r.org + r.start}>
                        {r.title}, <span className="text-muted">{r.org}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">Used in personal and academic projects so far.</p>
                )}
              </EvidenceCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EvidenceCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-line rounded-[var(--radius-card)] border p-6">
      <h3 className="mb-4 font-semibold">{title}</h3>
      {children}
    </div>
  );
}
