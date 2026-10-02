import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareButton } from "@/components/ui/ShareButton";
import { getPost, posts } from "@/content/posts";
import { site } from "@/data/site";
import { asset, formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: asset(`/blog/${post.slug}/`) },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { default: Body } = await import(`@/content/blog/${slug}.mdx`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    author: { "@type": "Person", name: site.name, url: site.url },
  };

  return (
    <article className="container-grid pt-36 pb-[var(--section)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/blog/"
        className="link-underline text-muted hover:text-ink inline-flex items-center gap-2"
      >
        <ArrowLeft className="size-4" aria-hidden />
        All writing
      </Link>
      <header className="mt-10 max-w-[30ch]">
        <h1 className="display text-step-5">{post.title}</h1>
        <p className="text-muted mt-6">
          <time dateTime={post.date}>{formatDate(post.date)}</time>, {post.readingMinutes} min read
        </p>
        <ShareButton title={post.title} className="mt-6" />
      </header>
      <div className="prose-kk mt-14">
        <Body />
      </div>
      <footer className="border-line mt-20 max-w-[68ch] border-t pt-8">
        <p className="text-muted">
          Questions or disagreements?{" "}
          <a
            href={`mailto:${site.email}?subject=${encodeURIComponent(post.title)}`}
            className="link-underline text-ink"
          >
            Email me
          </a>
          .
        </p>
      </footer>
    </article>
  );
}
