"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";
import { copyText } from "@/lib/events";
import { cn } from "@/lib/utils";

/**
 * Uses the native share sheet on phones (Web Share API) and copies the link
 * everywhere else. Recruiters forward case studies; make that one tap.
 */
export function ShareButton({ title, className }: { title: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Cancelled or unsupported: fall through to copying.
      }
    }
    if (await copyText(url)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      className={cn(
        "border-line text-step--1 hover:border-ink inline-flex h-9 items-center gap-2 rounded-full border px-4 transition-colors",
        className,
      )}
    >
      {copied ? (
        <Check className="text-accent size-4" aria-hidden />
      ) : (
        <Share2 className="size-4" aria-hidden />
      )}
      <span aria-live="polite">{copied ? "Link copied" : "Share"}</span>
    </button>
  );
}
