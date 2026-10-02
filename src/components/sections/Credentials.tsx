import { ArrowUpRight } from "lucide-react";
import { Marquee } from "@/components/ui/Marquee";
import { achievements, certifications, publication, research } from "@/data/credentials";
import { testimonials } from "@/data/testimonials";
import { SectionHeader } from "./SectionHeader";

export function Credentials() {
  return (
    <section
      id="credentials"
      aria-labelledby="credentials-title"
      className="section bg-ink text-bg"
    >
      <div className="container-grid">
        <SectionHeader
          id="credentials"
          title="Proof, not adjectives"
          intro={
            <p className="text-bg/70">
              An IEEE paper, a research preprint, Amazon&apos;s ML school and ten professional
              certifications.
            </p>
          }
        />

        <div className="grid-12 gap-y-4">
          <a
            href={publication.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-accent text-accent-ink col-span-4 flex flex-col justify-between gap-10 rounded-[var(--radius-card)] p-7 transition-transform duration-500 hover:-translate-y-1 md:col-span-8 md:p-10"
          >
            <span className="text-step--1 flex items-center justify-between">
              <span>
                {publication.venue} publication, {publication.year}
              </span>
              <ArrowUpRight
                className="size-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                aria-hidden
              />
            </span>
            <span className="heading text-step-3">{publication.title}</span>
          </a>
          <ul className="col-span-4 grid gap-4">
            {achievements.map((a) => (
              <li
                key={a.title}
                className="border-bg/15 flex flex-col justify-end rounded-[var(--radius-card)] border p-7"
              >
                <p className="heading text-step-2">{a.title}</p>
                <p className="text-bg/70 mt-1">
                  {a.issuer}
                  {a.year && `, ${a.year}`}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-grid mt-4">
        <ul className={research.length > 1 ? "grid gap-4 md:grid-cols-2" : "grid gap-4"}>
          {research.map((r) => (
            <li key={r.href}>
              <a
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group border-bg/15 hover:border-bg/40 flex h-full items-start justify-between gap-6 rounded-[var(--radius-card)] border p-7 transition-colors"
              >
                <span>
                  <span className="text-step--1 text-bg/70">
                    {r.status}, {r.detail.toLowerCase()}
                  </span>
                  <span className="heading text-step-2 mt-2 block">{r.title}</span>
                </span>
                <ArrowUpRight
                  className="mt-1 size-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <Marquee label="Certifications" duration={60} className="mt-14">
        {certifications.map((c) => (
          <li
            key={c.title}
            className="border-bg/20 shrink-0 rounded-full border px-6 py-3 whitespace-nowrap"
          >
            <span className="font-medium">{c.title}</span>{" "}
            <span className="text-bg/60">{c.issuer}</span>
          </li>
        ))}
      </Marquee>

      {testimonials.length > 0 && (
        <div className="mt-20">
          <h3 className="container-grid heading text-step-3">
            What people I&apos;ve worked with say
          </h3>
          <Marquee label="Testimonials" duration={80} className="mt-8">
            {testimonials.map((t) => (
              <li key={t.name} className="w-[min(26rem,80vw)] shrink-0">
                <figure className="border-bg/15 h-full rounded-[var(--radius-card)] border p-7">
                  <blockquote className="text-step-1">“{t.quote}”</blockquote>
                  <figcaption className="text-bg/70 mt-6">
                    <span className="text-bg font-medium">{t.name}</span>, {t.role}
                  </figcaption>
                </figure>
              </li>
            ))}
          </Marquee>
        </div>
      )}
    </section>
  );
}
