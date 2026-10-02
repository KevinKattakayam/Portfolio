"use client";

import { ArrowUpRight, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { fallbackRepos, loadRepos, type Repo } from "@/lib/github";
import { relativeTime } from "@/lib/utils";
import { site } from "@/data/site";

export function GitHubRepos() {
  const [repos, setRepos] = useState<Repo[]>(fallbackRepos);
  const [status, setStatus] = useState<"idle" | "live" | "offline">("idle");
  const ref = useRef<HTMLDivElement>(null);

  // Only call the API when the list is about to be seen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        loadRepos().then(({ repos, live }) => {
          setRepos(repos);
          setStatus(live ? "live" : "offline");
        });
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid-12 mt-24 gap-y-8">
      <div className="col-span-4 md:col-span-4">
        <h3 className="heading text-step-3">Recently on GitHub</h3>
        <p className="text-muted mt-3 max-w-[32ch]">
          {status === "offline"
            ? "GitHub's API is resting (rate limit). This is a saved list; the profile has everything."
            : "Pulled live from the GitHub API, most recently pushed first."}
        </p>
        <a
          href={`https://github.com/${site.githubUser}`}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline text-accent mt-4 inline-flex items-center gap-1"
        >
          github.com/{site.githubUser}
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </div>
      <ul
        className="col-span-4 grid gap-3 sm:grid-cols-2 md:col-span-8"
        aria-busy={status === "idle"}
      >
        {repos.map((r) => (
          <li key={r.name}>
            <a
              href={r.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group border-line hover:border-ink flex h-full flex-col gap-2 rounded-2xl border p-5 transition-[border-color,transform] duration-300 hover:-translate-y-0.5"
            >
              <span className="flex items-start justify-between gap-3">
                <span className="font-medium break-all">{r.name}</span>
                <ArrowUpRight
                  className="text-muted size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </span>
              <span className="text-step--1 text-muted line-clamp-2">
                {r.description ?? "No description yet."}
              </span>
              <span className="text-step--1 text-muted mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-2">
                {r.language && <span>{r.language}</span>}
                {r.stargazers_count > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <Star className="size-3.5" aria-label="Stars" /> {r.stargazers_count}
                  </span>
                )}
                {r.pushed_at && <span>Updated {relativeTime(r.pushed_at)}</span>}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
