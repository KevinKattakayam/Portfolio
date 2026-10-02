import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export function AvailabilityBadge({ className }: { className?: string }) {
  const { open, label } = site.availability;
  return (
    <p
      className={cn(
        "border-line bg-surface/70 text-step--1 inline-flex items-center gap-2.5 rounded-full border py-1.5 pr-4 pl-3 backdrop-blur",
        className,
      )}
    >
      <span className="relative flex size-2.5" aria-hidden>
        {open && (
          <span className="bg-accent absolute inset-0 animate-ping rounded-full opacity-60 motion-reduce:hidden" />
        )}
        <span className={cn("relative size-2.5 rounded-full", open ? "bg-accent" : "bg-muted")} />
      </span>
      {open ? label : "Not taking new work right now"}
    </p>
  );
}
