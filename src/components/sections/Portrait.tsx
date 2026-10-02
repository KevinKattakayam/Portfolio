"use client";

import { useState } from "react";
import { site } from "@/data/site";
import { asset } from "@/lib/utils";

/** Photo with a graceful monogram fallback if /public/images/kevin.jpg is missing. */
export function Portrait() {
  const [failed, setFailed] = useState(false);

  return (
    <figure className="bg-ink relative aspect-[4/5] overflow-hidden rounded-[1.75rem]">
      {!failed && site.photo ? (
        // A plain <img> so a missing file can fall back cleanly in a static export.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={asset(site.photo)}
          alt={`Portrait of ${site.name}`}
          width={800}
          height={1000}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="size-full object-cover object-top"
        />
      ) : (
        <div
          className="grid size-full place-items-center"
          role="img"
          aria-label={`${site.name} monogram`}
        >
          <span className="display text-bg text-[clamp(6rem,18vw,14rem)]">{site.initials}</span>
        </div>
      )}
      <figcaption className="bg-bg/85 text-step--1 text-ink absolute inset-x-4 bottom-4 rounded-full px-4 py-2 backdrop-blur">
        {site.location}
      </figcaption>
    </figure>
  );
}
