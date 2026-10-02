"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isTypingTarget } from "@/lib/events";

/** Left and right arrow keys flip between case studies. */
export function CaseStudyKeys({ prev, next }: { prev: string; next: string }) {
  const router = useRouter();

  useEffect(() => {
    router.prefetch(`/work/${prev}/`);
    router.prefetch(`/work/${next}/`);
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || isTypingTarget(e.target)) return;
      if (e.key === "ArrowLeft") router.push(`/work/${prev}/`);
      if (e.key === "ArrowRight") router.push(`/work/${next}/`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, router]);

  return null;
}
