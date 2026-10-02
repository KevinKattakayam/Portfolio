import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { asset } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/fx/Reveal";
import { SectionLink } from "@/components/layout/SectionLink";
import { buttonVariants } from "@/components/ui/button";
import { ShareButton } from "@/components/ui/ShareButton";
import { ArchitectureFlow } from "@/components/work/ArchitectureFlow";
import { CaseStudyKeys } from "@/components/work/CaseStudyKeys";
import { ProjectArt } from "@/components/work/ProjectArt";
import { getProject, projects } from "@/data/projects";
import { site } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: asset(`/work/${p.slug}/`) },
    openGraph: {
      title: `${p.title}, a case study by ${site.name}`,
      description: p.summary,
      url: asset(`/work/${p.slug}/`),
    },
  };
}

export default async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const index = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(index + 1) % projects.length];
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const links = [
    p.live && { label: "Live site", href: p.live },
    p.github && { label: "Source on GitHub", href: p.github },
    p.paper && { label: "Read the paper", href: p.paper },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <article className="pt-32">
      <CaseStudyKeys prev={prev.slug} next={next.slug} />
      <div className="container-grid">
        <div className="flex items-center justify-between gap-4">
          <SectionLink
            id="work"
            className="link-underline text-muted hover:text-ink inline-flex items-center gap-2"
          >
            <ArrowLeft className="size-4" aria-hidden />
            All work
          </SectionLink>
          <ShareButton title={`${p.title}, a case study by ${site.name}`} />
        </div>

        <header className="grid-12 mt-10 gap-y-8">
          <div className="col-span-4 md:col-span-9">
            <p className="text-muted">
              {p.category}
              {p.year ? `, ${p.year}` : ""}
            </p>
            <h1 data-glitch className="display text-step-6 mt-3">
              {p.title}
            </h1>
            <p className="heading text-step-2 mt-6 max-w-[34ch]">{p.summary}</p>
          </div>
          <dl className="border-line col-span-4 grid grid-cols-2 gap-6 border-t pt-6 md:col-span-12 md:grid-cols-4">
            <div>
              <dt className="text-step--1 text-muted">Role</dt>
              <dd className="mt-1">{p.role}</dd>
            </div>
            <div>
              <dt className="text-step--1 text-muted">Type</dt>
              <dd className="mt-1">{p.category}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-step--1 text-muted">Links</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {links.map((l, i) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({ variant: i === 0 ? "ink" : "outline", size: "sm" })}
                  >
                    {l.label}
                    <ArrowUpRight aria-hidden />
                  </a>
                ))}
              </dd>
            </div>
          </dl>
        </header>
      </div>

      <div className="container-grid mt-14">
        <div className="border-line bg-surface relative aspect-[16/9] overflow-hidden rounded-[1.75rem] border md:aspect-[21/9]">
          {p.cover ? (
            <Image
              src={p.cover}
              alt={`${p.title} screenshot`}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <ProjectArt variant={p.art} seed={p.slug} className="absolute inset-0" />
          )}
        </div>

        <dl className="grid-12 mt-6 gap-y-4">
          {p.metrics.map((m) => (
            <div
              key={m.label}
              className="bg-surface col-span-4 flex flex-col-reverse rounded-[var(--radius-card)] p-6"
            >
              <dt className="text-muted mt-1">{m.label}</dt>
              <dd className="display text-step-5">{m.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {p.architecture && (
        <section aria-labelledby="architecture-title" className="container-grid mt-24 md:mt-32">
          <h2 id="architecture-title" className="heading text-step-2 mb-8">
            How it fits together
          </h2>
          <ArchitectureFlow architecture={p.architecture} />
        </section>
      )}

      <div className="container-grid section space-y-24 md:space-y-32">
        <Block title="The problem">
          <p className="text-step-1">{p.caseStudy.problem}</p>
        </Block>

        <Block title="How I approached it">
          <ol className="space-y-8">
            {p.caseStudy.process.map((step, i) => (
              <Reveal
                as="li"
                key={step.title}
                className="border-line grid grid-cols-[3rem_1fr] gap-4 border-t pt-6"
              >
                <span className="display text-step-3 text-accent tabular-nums">{i + 1}</span>
                <div>
                  <h3 className="heading text-step-2">{step.title}</h3>
                  <p className="text-muted mt-2">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Block>

        <Block title="What I built">
          <ul className="space-y-4">
            {p.caseStudy.solution.map((s) => (
              <li key={s} className="border-line rounded-2xl border px-5 py-4">
                {s}
              </li>
            ))}
          </ul>
        </Block>

        <Block title="The result">
          <p className="heading text-step-3">{p.caseStudy.result}</p>
        </Block>

        <Block title="Built with">
          <ul className="flex flex-wrap gap-2">
            {p.tech.map((t) => (
              <li key={t} className="border-line rounded-full border px-4 py-2">
                {t}
              </li>
            ))}
          </ul>
        </Block>
      </div>

      <nav aria-label="Next project" className="border-line border-t">
        <Link
          href={`/work/${next.slug}/`}
          data-cursor-label="Next"
          className="group container-grid flex flex-col gap-3 py-16 md:py-24"
        >
          <span className="text-muted">Next project</span>
          <span className="display text-step-5 group-hover:text-accent transition-colors duration-300">
            {next.title}
          </span>
        </Link>
      </nav>
    </article>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid-12 gap-y-6">
      <h2 className="heading text-step-2 col-span-4 md:col-span-4">{title}</h2>
      <div className="col-span-4 max-w-[64ch] md:col-span-7 md:col-start-6">{children}</div>
    </section>
  );
}
