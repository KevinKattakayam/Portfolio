import Image from "next/image";
import Link from "next/link";
import { Tilt } from "@/components/fx/Tilt";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";
import { ProjectArt } from "./ProjectArt";

export const sizeClass: Record<Project["size"], string> = {
  large: "md:col-span-8 md:row-span-2",
  tall: "md:col-span-4 md:row-span-2",
  wide: "md:col-span-8",
  small: "md:col-span-4",
};

export function ProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  const p = project;
  const big = p.size === "large" || p.size === "tall";
  return (
    <Tilt className="h-full" max={big ? 3 : 5}>
      <Link
        href={`/work/${p.slug}/`}
        data-cursor-label="Open"
        className="group border-line bg-surface hover:border-ink/40 hover:shadow-soft focus-visible:border-accent relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border transition-[border-color,box-shadow] duration-500"
      >
        <div className={cn("bg-bg relative overflow-hidden", big ? "min-h-56 flex-1" : "h-48")}>
          {p.cover ? (
            <Image
              src={p.cover}
              alt=""
              fill
              priority={priority}
              sizes="(min-width: 768px) 66vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          ) : (
            <ProjectArt
              variant={p.art}
              seed={p.slug}
              className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
            />
          )}

          {/* Hover preview: key numbers. Always visible on touch screens. */}
          <dl className="bg-ink/90 text-bg absolute inset-x-3 bottom-3 grid grid-cols-3 gap-2 rounded-2xl p-3 backdrop-blur transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] [@media(hover:hover)]:translate-y-4 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:translate-y-0 [@media(hover:hover)]:group-focus-visible:opacity-100">
            {p.metrics.map((m) => (
              <div key={m.label} className="min-w-0">
                <dt className="sr-only">{m.label}</dt>
                <dd className="heading text-step-1 truncate">{m.value}</dd>
                <dd className="truncate text-[0.72rem] leading-tight opacity-70">{m.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-col gap-3 p-5 md:p-6">
          <div className="text-step--1 text-muted flex items-baseline justify-between gap-4">
            <span>{p.category}</span>
            {p.year && <span>{p.year}</span>}
          </div>
          <h3 className="heading text-step-2">{p.title}</h3>
          <p className="text-muted max-w-[52ch]">{p.summary}</p>
          <ul className="mt-1 flex flex-wrap gap-1.5" aria-label="Built with">
            {p.tech.slice(0, big ? 6 : 4).map((t) => (
              <li key={t} className="bg-surface-2 text-step--1 rounded-full px-2.5 py-0.5">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </Tilt>
  );
}
