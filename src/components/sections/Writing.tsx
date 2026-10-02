import Link from "next/link";
import { posts } from "@/content/posts";
import { formatDate } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";

export function Writing() {
  if (!posts.length) return null;
  return (
    <section id="writing" aria-labelledby="writing-title" className="section">
      <div className="container-grid">
        <SectionHeader
          id="writing"
          title="Writing"
          intro={
            <p>
              Notes on decisions from my projects.{" "}
              <Link href="/blog/" className="link-underline text-ink">
                All posts
              </Link>
            </p>
          }
        />
        <ul className="border-line border-t">
          {posts.slice(0, 3).map((p) => (
            <li key={p.slug} className="border-line border-b">
              <Link
                href={`/blog/${p.slug}/`}
                data-cursor-label="Read"
                className="group grid-12 gap-y-3 py-8 transition-colors md:py-10"
              >
                <time dateTime={p.date} className="text-muted col-span-4 md:col-span-3">
                  {formatDate(p.date)}
                </time>
                <span className="col-span-4 md:col-span-6">
                  <span className="heading text-step-3 group-hover:text-accent block transition-colors duration-300">
                    {p.title}
                  </span>
                  <span className="text-muted mt-3 block max-w-[60ch]">{p.summary}</span>
                </span>
                <span className="text-muted col-span-4 md:col-span-3 md:text-right">
                  {p.readingMinutes} min read
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
