import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Credentials } from "@/components/sections/Credentials";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Skills } from "@/components/sections/Skills";
import { Work } from "@/components/sections/Work";
import { Writing } from "@/components/sections/Writing";
import { timeline } from "@/data/experience";
import { site } from "@/data/site";

export default function Home() {
  // Structured data so search engines understand who this page is about.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: site.name,
        url: site.url,
        email: `mailto:${site.email}`,
        image: `${site.url}${site.photo}`,
        jobTitle: site.role,
        description: site.description,
        address: { "@type": "PostalAddress", addressLocality: "Coimbatore", addressCountry: "IN" },
        alumniOf: timeline
          .filter((t) => t.kind === "education")
          .map((t) => ({ "@type": "EducationalOrganization", name: t.org })),
        sameAs: site.socials.map((s) => s.href),
        knowsAbout: [
          "Multi-agent LLM systems",
          "Retrieval-augmented generation",
          "Distributed systems",
          "Computer vision",
        ],
      },
      { "@type": "WebSite", name: site.name, url: site.url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Work />
      <About />
      <Skills />
      <Experience />
      <Credentials />
      <Writing />
      <Contact />
    </>
  );
}
