import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/content/posts";
import { asset, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Notes on engineering decisions from Kevin Kattakayam's projects: LLM agents, distributed systems and more.",
  alternates: { canonical: asset("/blog/") },
};

export default function BlogIndex() {
  return (
    <section className="container-grid pt-36 pb-[var(--section)]">
      <h1 className="display text-step-6">Writing</h1>
      <p className="text-step-1 text-muted mt-6 max-w-[44ch]">
        Short write-ups of decisions I made while building things, and why.{" "}
        <a
          href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/feed.xml`}
          className="link-underline text-ink"
        >
          Follow with RSS
        </a>
      </p>
      <ul className="border-line mt-16 border-t">
        {posts.map((p) => (
          <li key={p.slug} className="border-line border-b">
            <Link
              href={`/blog/${p.slug}/`}
              data-cursor-label="Read"
              className="group grid-12 gap-y-3 py-10"
            >
              <time dateTime={p.date} className="text-muted col-span-4 md:col-span-3">
                {formatDate(p.date)}
              </time>
              <span className="col-span-4 md:col-span-7">
                <span className="heading text-step-3 group-hover:text-accent block transition-colors">
                  {p.title}
                </span>
                <span className="text-muted mt-3 block">{p.summary}</span>
              </span>
              <span className="text-muted col-span-4 md:col-span-2 md:text-right">
                {p.tags.join(", ")}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
