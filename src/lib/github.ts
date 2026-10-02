import { projects } from "@/data/projects";
import { site } from "@/data/site";

export type Repo = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  pushed_at: string | null;
};

// Bump the version whenever hiddenRepos changes so old cached lists are dropped.
const CACHE_KEY = "kk-github-repos-v2";
const hidden = new Set<string>(site.hiddenRepos.map((n) => n.toLowerCase()));
const isHidden = (name: string) => hidden.has(name.toLowerCase());
const TTL = 60 * 60 * 1000; // 1 hour: well inside the 60 requests/hour unauthenticated limit

/** Shown on first paint and whenever the API is unavailable or rate-limited. */
export const fallbackRepos: Repo[] = projects
  .filter((p) => p.github && !isHidden(p.github.split("/").pop()!))
  .slice(0, 6)
  .map((p) => ({
    name: p.github!.split("/").pop()!,
    description: p.summary,
    html_url: p.github!,
    language: p.tech[0] ?? null,
    stargazers_count: 0,
    pushed_at: null,
  }));

/**
 * Latest public repos via the unauthenticated GitHub REST API.
 * Cached in localStorage so repeat visits don't spend the rate limit.
 */
export async function loadRepos(): Promise<{ repos: Repo[]; live: boolean }> {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { at, repos } = JSON.parse(cached) as { at: number; repos: Repo[] };
      const visible = repos.filter((r) => !isHidden(r.name));
      if (Date.now() - at < TTL && visible.length) return { repos: visible, live: true };
    }
  } catch {
    /* storage unavailable: just fetch */
  }

  try {
    const res = await fetch(
      `https://api.github.com/users/${site.githubUser}/repos?sort=pushed&per_page=20&type=owner`,
      { headers: { Accept: "application/vnd.github+json" } },
    );
    if (!res.ok) throw new Error(`GitHub responded ${res.status}`);
    const data = (await res.json()) as (Repo & { fork: boolean; archived: boolean })[];
    const repos = data
      .filter((r) => !r.fork && !r.archived && !isHidden(r.name))
      .slice(0, 6)
      .map(({ name, description, html_url, language, stargazers_count, pushed_at }) => ({
        name,
        description,
        html_url,
        language,
        stargazers_count,
        pushed_at,
      }));
    if (!repos.length) throw new Error("No repos");
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), repos }));
    } catch {
      /* ignore quota errors */
    }
    return { repos, live: true };
  } catch {
    return { repos: fallbackRepos, live: false };
  }
}
