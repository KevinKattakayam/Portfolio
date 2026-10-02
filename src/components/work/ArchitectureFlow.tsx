import { ArrowDown, ArrowRight } from "lucide-react";
import { Fragment } from "react";
import type { Project } from "@/data/projects";

/**
 * Data-driven system diagram: left-to-right on wide screens, top-to-bottom on
 * phones. Plain HTML, so it scales, reflows and reads well with a screen reader.
 */
export function ArchitectureFlow({
  architecture,
}: {
  architecture: NonNullable<Project["architecture"]>;
}) {
  const { nodes, edges } = architecture;
  return (
    <ol
      className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-stretch"
      aria-label="System architecture"
    >
      {nodes.map((n, i) => (
        <Fragment key={n.title}>
          <li
            className={
              "flex flex-1 flex-col gap-2 rounded-2xl border p-5 " +
              (i === 0 || i === nodes.length - 1 ? "border-line bg-bg" : "border-ink/30 bg-surface")
            }
          >
            <span className="heading text-step-1">{n.title}</span>
            <span className="text-step--1 text-muted">{n.detail}</span>
          </li>
          {i < nodes.length - 1 && (
            <li
              aria-hidden={!edges[i]}
              className="text-accent flex shrink-0 items-center justify-center gap-2 py-1 lg:w-16 lg:flex-col lg:py-0"
            >
              <ArrowDown className="size-4 lg:hidden" aria-hidden />
              <ArrowRight className="hidden size-4 lg:block" aria-hidden />
              {edges[i] && (
                <span className="text-center text-[0.72rem] leading-tight">{edges[i]}</span>
              )}
            </li>
          )}
        </Fragment>
      ))}
    </ol>
  );
}
