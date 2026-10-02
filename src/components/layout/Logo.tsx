"use client";

import Link from "next/link";
import { useRef } from "react";
import { triggerAnomaly } from "@/components/fx/Easter";
import { site } from "@/data/site";

/** Wordmark. Five quick clicks trigger the easter egg. */
export function Logo() {
  const clicks = useRef<number[]>([]);

  return (
    <Link
      href="/"
      aria-label={`${site.name}, home`}
      className="group flex items-center gap-2.5"
      onClick={() => {
        const now = Date.now();
        clicks.current = [...clicks.current.filter((t) => now - t < 1500), now];
        if (clicks.current.length >= 5) {
          clicks.current = [];
          triggerAnomaly();
        }
      }}
    >
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
        <rect
          width="32"
          height="32"
          rx="9"
          className="fill-ink group-hover:fill-accent transition-colors duration-300"
        />
        {/* A tiny signal trace with one spike: the brand mark. */}
        <path
          d="M6 19h6l2.5-9 3.5 14 2.5-7H26"
          fill="none"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-bg"
        />
      </svg>
      <span className="heading text-step-1 tracking-tight">{site.shortName}</span>
    </Link>
  );
}
