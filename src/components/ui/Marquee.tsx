import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Infinite CSS marquee. The track is duplicated (second copy hidden from
 * assistive tech) and pauses on hover or keyboard focus. Reduced motion turns
 * it into a static wrapped list.
 */
export function Marquee({
  children,
  duration = 50,
  reverse = false,
  className,
  label,
}: {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
  label: string;
}) {
  const style = {
    ["--marquee-duration" as string]: `${duration}s`,
    animationDirection: reverse ? "reverse" : undefined,
  };
  return (
    <div className={cn("marquee", className)} role="region" aria-label={label}>
      <ul className="marquee__track" style={style}>
        {children}
      </ul>
      <ul className="marquee__track" style={style} aria-hidden="true">
        {children}
      </ul>
    </div>
  );
}
