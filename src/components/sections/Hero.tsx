import { ArrowDown } from "lucide-react";
import { Magnetic } from "@/components/fx/Magnetic";
import { RotatingText } from "@/components/fx/RotatingText";
import { SectionLink } from "@/components/layout/SectionLink";
import { HeroVisual } from "@/components/three/HeroVisual";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/data/site";
import { AvailabilityBadge } from "./AvailabilityBadge";

export function Hero() {
  const [first, ...rest] = site.name.split(" ");
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden pt-32 pb-14 md:pb-20"
    >
      <div className="absolute inset-x-0 top-[38%] bottom-0 -z-10 opacity-60 md:top-[8%] md:opacity-100">
        <HeroVisual />
      </div>

      <div className="container-grid grid-12 gap-y-10">
        <div className="col-span-4 md:col-span-12">
          <div className="fade-in mb-6" style={{ ["--d" as string]: "0.5s" }}>
            <AvailabilityBadge />
          </div>
          <h1 id="hero-title" data-glitch className="display text-step-6">
            <span className="reveal-line">
              <span>{first}</span>
            </span>
            <span className="reveal-line">
              <span style={{ ["--d" as string]: "0.08s" }}>{rest.join(" ")}</span>
            </span>
          </h1>
        </div>

        <div className="col-span-4 md:col-span-7 lg:col-span-6">
          <p className="heading text-step-3">
            Hire me as your next <RotatingText words={site.roles} />
          </p>
          <p
            className="fade-in text-step-1 text-muted mt-5 max-w-[46ch]"
            style={{ ["--d" as string]: "0.45s" }}
          >
            {site.tagline} Final-year CSE (AI &amp; ML) at Karunya, graduating 2027.
          </p>
          <div className="fade-in mt-9 flex flex-wrap gap-3" style={{ ["--d" as string]: "0.55s" }}>
            <Magnetic>
              <SectionLink
                id="work"
                className={buttonVariants({ variant: "ink", size: "lg" })}
                data-cursor
              >
                View work
              </SectionLink>
            </Magnetic>
            <Magnetic>
              <SectionLink
                id="contact"
                className={buttonVariants({ variant: "outline", size: "lg" })}
                data-cursor
              >
                Hire me
              </SectionLink>
            </Magnetic>
          </div>
        </div>

        <div
          className="fade-in col-span-4 hidden items-end justify-end gap-6 md:col-span-5 md:flex lg:col-span-6"
          style={{ ["--d" as string]: "0.8s" }}
        >
          <p className="text-step--1 text-muted max-w-[26ch] text-right">
            Move your cursor across the field. Push it hard enough and the anomaly detector notices.
          </p>
          <SectionLink
            id="work"
            aria-label="Scroll to work"
            className="border-line hover:border-ink grid size-12 shrink-0 place-items-center rounded-full border transition-colors"
          >
            <ArrowDown className="size-4" aria-hidden />
          </SectionLink>
        </div>
      </div>
    </section>
  );
}
