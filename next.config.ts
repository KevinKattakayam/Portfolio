import createMDX from "@next/mdx";
import type { NextConfig } from "next";

/**
 * Static export: `npm run build` writes a fully static site to /out that any
 * free host can serve (Vercel, Netlify, GitHub Pages). No server, no database.
 *
 * GitHub Pages project sites live under /<repo-name>. Set NEXT_PUBLIC_BASE_PATH
 * (e.g. "/portfolio") only for that case; leave it empty everywhere else.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  trailingSlash: true,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: {
    // The default image optimizer needs a server; static hosts don't have one.
    // Images are still lazy-loaded and sized by next/image.
    unoptimized: true,
  },
  reactStrictMode: true,
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
