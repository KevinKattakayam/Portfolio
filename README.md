# Kevin Kattakayam, portfolio

A statically exported Next.js site. No API keys, no database, no server, no `.env`.

## Run it

Requires Node.js 20.9+ (22 recommended).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # writes the static site to /out
npm start          # serves /out locally to check the production build
npm run lint       # ESLint (Next.js + TypeScript rules)
npm run format     # Prettier
npm run check      # type-check + lint + production build in one go
```

## Edit your content

Everything you'd want to change lives in `src/data` and `src/content`. Components never need touching.

| What                                                              | Where                                                         |
| ----------------------------------------------------------------- | ------------------------------------------------------------- |
| Name, tagline, email, socials, availability badge, rotating roles | `src/data/site.ts`                                            |
| Resume PDFs shown in the "Resume" picker                          | `src/data/site.ts` (`resumes`) + files in `public/resume/`    |
| Projects and case studies                                         | `src/data/projects.ts`                                        |
| Smaller projects list                                             | `src/data/projects.ts` (`archive`)                            |
| Repos hidden from the live "Recently on GitHub" list              | `src/data/site.ts` (`hiddenRepos`)                            |
| Experience and education timeline                                 | `src/data/experience.ts`                                      |
| Skills (matched automatically to projects)                        | `src/data/skills.ts`                                          |
| About story, counters, milestones, facts                          | `src/data/about.ts`                                           |
| Publication, achievements, certifications                         | `src/data/credentials.ts`                                     |
| Testimonials (hidden until you add one)                           | `src/data/testimonials.ts`                                    |
| Blog posts                                                        | `src/content/blog/*.mdx` + an entry in `src/content/posts.ts` |

**Photo:** `public/images/kevin.jpg` (already added, ~140 KB). To change it, replace the file, keeping a portrait shape around 1000 px wide; the face should sit in the upper half. If the file is ever missing, a "KK" monogram is shown.

**Project screenshots:** add an image to `public/images/projects/` and set `cover: "/images/projects/name.png"` on the project. Otherwise a generated cover is drawn.

**Social preview image:** `public/og.png` (1200×630). Replace it any time.

## Contact form

By default the form validates input, then opens the visitor's email app with the message filled in (`mailto:`). Works with zero setup.

To receive messages directly in your inbox (free, optional):

- **Formspree:** create a form at formspree.io, then set `FORM_ENDPOINT = "https://formspree.io/f/yourid"` in `src/data/site.ts`.
- **Web3Forms:** get an access key at web3forms.com, then set `FORM_ENDPOINT = "https://api.web3forms.com/submit"` and `FORM_ACCESS_KEY = "your-key"`.

## Deploy for free

The build output is plain files in `/out`, so any static host works. First, set `site.url` in `src/data/site.ts` to your final URL (used for SEO, the sitemap and social cards).

**Netlify** (your current host): push to GitHub, then "Add new site → Import from Git". `netlify.toml` already sets the build command and the `out` folder. To keep your Netlify address, connect the repo to your existing site under Site configuration → Build & deploy.

**Vercel:** import the repo at vercel.com/new. It detects Next.js and the static export automatically. No settings to change.

**Cloudflare:** import the repo. Build command `npm run build`, deploy command `npx wrangler deploy` (reads `wrangler.jsonc`, which serves the `out` folder). If the build fails on Node, add a build variable `NODE_VERSION` = `22`.

**GitHub Pages:** push to `main`, then in the repo go to Settings → Pages → Source: "GitHub Actions". The included workflow (`.github/workflows/deploy-pages.yml`) builds and publishes with the right base path. Also set `site.url` to `https://<your-user>.github.io/<repo>` so canonical links, the sitemap and RSS point to the right place.

## How it's built

- Next.js 16 (App Router, static export), React 19, TypeScript
- Tailwind CSS 4 with design tokens in `src/app/globals.css`; shadcn/ui conventions (`components.json`, `cva` button variants)
- Motion (Framer Motion) for interaction, GSAP ScrollTrigger for the timeline, Lenis for smooth scrolling
- React Three Fiber for the hero field: one GPU draw call, loaded only on desktop after the browser is idle, with an SVG fallback
- cmdk for the command palette, next-themes for dark mode, `@next/mdx` for posts
- Fonts: Bricolage Grotesque and JetBrains Mono (both SIL Open Font License), self-hosted via `next/font/local`

**Why no image optimizer:** `next/image` optimization needs a server, which static hosting doesn't have, so images are served as-is (`images.unoptimized`). Export photos as WebP or AVIF around 1600px wide and you lose nothing.

## Measured quality

Tested on the production build (gzip-compressed, locally) with Lighthouse 12 and axe-core. Lighthouse varies a few points between runs, so ranges are shown.

|                         | Mobile | Desktop |
| ----------------------- | ------ | ------- |
| Performance, home       | 79–84  | 94–99   |
| Performance, case study | 82–88  | 99      |
| Accessibility           | 100    | 100     |
| Best practices          | 100    | 100     |
| SEO                     | 100    | 100     |

Also verified: 0 axe-core WCAG 2.1 A/AA violations (8 pages including the new case studies, light and dark); no horizontal scrolling at 360, 768, 1024 and 1440 px; content readable with JavaScript disabled; reduced-motion mode skips the intro, 3D and smooth scrolling; the first Tab press reaches "Skip to content"; every internal link resolves; GitHub Pages base-path build has no unprefixed paths.

Mobile performance is measured under Lighthouse's 4x CPU slowdown. The remaining cost is hydrating the interactive sections the brief asks for (filters, tabs, timeline, form). Re-run Lighthouse on your live URL, since hosting changes the numbers.

To keep the first load light: the 3D field loads only after a mouse move (or 3 s), Lenis is desktop-only, GSAP loads when the timeline is near, the command palette loads on first use, the display font is subset, and the code font only loads on blog posts with code.

## Project facts

Every number and claim in the case studies comes from your resumes or the project READMEs (checked line by line). Years are left off projects where the date wasn't known.

## Extras

- RSS feed at `/feed.xml` (linked from the blog page and discoverable by feed readers)
- Web app manifest, so the site can be added to a phone's home screen
- Share button on case studies and posts (native share sheet on phones, copy link on desktop)
- "What's this about?" topic chips on the contact form, added to the email subject
- Security headers for Netlify (`netlify.toml`) and Vercel (`vercel.json`)

## Hidden things

- `Ctrl` / `Cmd` + `K` (or `/`) opens the command palette.
- `` ` `` (backtick) or the terminal icon in the navbar opens a working terminal. Type `help`; on phones, tap the command buttons.
- `?` shows every keyboard shortcut. `g` then a letter jumps to a section (`g w` Work, `g c` Contact).
- `←` / `→` on a case study moves to the previous or next project.
- The Konami code (↑ ↑ ↓ ↓ ← → ← → B A) or five quick clicks on the logo triggers an "anomaly".
