import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge must know our fluid type scale (text-step-0 ... text-step-6)
 * is a font SIZE. Otherwise it treats it as a text colour and silently drops
 * the real colour class (this once made the primary button text unreadable).
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["step--1", "step-0", "step-1", "step-2", "step-3", "step-4", "step-5", "step-6"] },
      ],
    },
  },
});

/** Merge Tailwind classes without conflicts (shadcn/ui convention). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Prefix a /public path with the configured basePath.
 * Needed for plain <a href> and <img> tags when deploying to a GitHub Pages
 * project site; next/link already handles basePath itself.
 */
export function asset(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Small deterministic PRNG so generated art is identical on server and client. */
export function seededRandom(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const day = 86_400_000;
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (diff < day) return rtf.format(-Math.round(diff / 3_600_000), "hour");
  if (diff < 30 * day) return rtf.format(-Math.round(diff / day), "day");
  if (diff < 365 * day) return rtf.format(-Math.round(diff / (30 * day)), "month");
  return rtf.format(-Math.round(diff / (365 * day)), "year");
}
