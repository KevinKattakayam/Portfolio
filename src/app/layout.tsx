import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Cursor } from "@/components/fx/Cursor";
import { Easter } from "@/components/fx/Easter";
import { Intro, introScript } from "@/components/fx/Intro";
import { ScrollProgress } from "@/components/fx/ScrollProgress";
import { Shortcuts } from "@/components/fx/Shortcuts";
import { Toaster } from "@/components/fx/Toaster";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "@/components/providers/Providers";
import { LazyCommandPalette } from "@/components/ui/LazyCommandPalette";
import { LazyTerminal } from "@/components/ui/LazyTerminal";
import { site } from "@/data/site";
import { asset } from "@/lib/utils";
import "./globals.css";

// Free, open-source (OFL) variable fonts, self-hosted from /src/app/fonts via
// next/font: preloaded, subset to Latin, zero requests to third parties, and the
// build works offline. Bricolage Grotesque carries weight, width and optical-size axes,
// subset to Latin characters (all three axes kept) to save bytes.
const bricolage = localFont({
  src: "./fonts/BricolageGrotesque-Variable.woff2",
  weight: "200 800",
  display: "swap",
  variable: "--font-bricolage",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const jetbrains = localFont({
  src: "./fonts/JetBrainsMono-Variable.woff2",
  weight: "100 800",
  display: "swap",
  variable: "--font-jetbrains",
  preload: false, // only used inside blog code blocks
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: ${site.role}, AI and backend`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    "Kevin Kattakayam",
    "software engineer",
    "AI engineer",
    "backend engineer",
    "LangGraph",
    "multi-agent systems",
    "Go",
    "Rust",
    "Kafka",
    "Next.js",
    "portfolio",
  ],
  alternates: {
    canonical: asset("/"),
    types: { "application/rss+xml": [{ url: asset("/feed.xml"), title: `${site.name}: Writing` }] },
  },
  openGraph: {
    type: "website",
    url: asset("/"),
    siteName: site.name,
    title: `${site.name}, ${site.role}`,
    description: site.tagline,
    locale: "en_IN",
    images: [
      { url: asset("/og.png"), width: 1200, height: 630, alt: `${site.name}, ${site.role}` },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}, ${site.role}`,
    description: site.tagline,
    images: [asset("/og.png")],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#edeff3" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0e1f" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bricolage.variable} ${jetbrains.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="bg-ink text-bg fixed top-3 left-3 z-[110] -translate-y-24 rounded-full px-5 py-3 transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <Providers>
          <Intro />
          <ScrollProgress />
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <LazyCommandPalette />
          <LazyTerminal />
          <Shortcuts />
          <Cursor />
          <Toaster />
          <Easter />
        </Providers>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
