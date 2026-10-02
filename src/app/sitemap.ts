import type { MetadataRoute } from "next";
import { posts } from "@/content/posts";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/blog/`, changeFrequency: "monthly", priority: 0.6 },
    ...projects.map((p) => ({
      url: `${base}/work/${p.slug}/`,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
    ...posts.map((p) => ({ url: `${base}/blog/${p.slug}/`, lastModified: p.date, priority: 0.5 })),
  ];
}
