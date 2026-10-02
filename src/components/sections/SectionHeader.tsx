import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Section title plus an optional short intro, aligned to the 12-column grid. */
export function SectionHeader({
  id,
  title,
  intro,
  className,
  children,
}: {
  id: string;
  title: string;
  intro?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <header className={cn("grid-12 mb-12 gap-y-5 md:mb-16", className)}>
      <h2 id={`${id}-title`} className="display text-step-5 col-span-4 md:col-span-6">
        {title}
      </h2>
      {intro && (
        <div className="text-step-1 text-muted col-span-4 self-end md:col-span-5 md:col-start-8">
          {intro}
        </div>
      )}
      {children}
    </header>
  );
}
