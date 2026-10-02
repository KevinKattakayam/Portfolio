/**
 * Blog registry. To add a post:
 *   1. Create src/content/blog/<slug>.mdx
 *   2. Add an entry here (newest first).
 * Kept separate from the MDX so lists and the command palette stay tiny.
 */
export type PostMeta = {
  slug: string;
  title: string;
  summary: string;
  date: string; // ISO
  readingMinutes: number;
  tags: string[];
};

export const posts: PostMeta[] = [
  {
    slug: "at-least-once-without-losing-sleep",
    title: "At-least-once delivery without losing sleep",
    summary:
      "How my observability pipeline commits Kafka offsets, and why a circuit breaker turns a database outage into lag instead of loss.",
    date: "2026-08-14",
    readingMinutes: 5,
    tags: ["Kafka", "Rust", "Distributed systems"],
  },
  {
    slug: "a-jargon-firewall-for-llm-outputs",
    title: "A jargon firewall for LLM outputs",
    summary:
      "Using Pydantic validators to stop a medical assistant from inventing terminology, instead of hoping the prompt is enough.",
    date: "2026-06-02",
    readingMinutes: 4,
    tags: ["LLMs", "Pydantic", "LangGraph"],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
