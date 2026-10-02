import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export const dynamic = "force-static";

/** Web app manifest: lets visitors "Add to home screen" with the right name and colours. */
export default function manifest(): MetadataRoute.Manifest {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return {
    name: `${site.name}, portfolio`,
    short_name: site.shortName,
    description: site.description,
    start_url: `${base}/`,
    display: "standalone",
    background_color: "#edeff3",
    theme_color: "#2f3be8",
    icons: [{ src: `${base}/icon.svg`, sizes: "any", type: "image/svg+xml" }],
  };
}
