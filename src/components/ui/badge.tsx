import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** Small pill for tech names and tags. */
export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "border-line text-step--1 text-muted inline-flex items-center rounded-full border px-2.5 py-0.5 leading-6",
        className,
      )}
      {...props}
    />
  );
}
