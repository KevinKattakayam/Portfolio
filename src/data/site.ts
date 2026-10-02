/**
 * Everything personal lives in /src/data. Edit these files, not components.
 */

export const site = {
  name: "Kevin Kattakayam",
  shortName: "Kevin",
  initials: "KK",
  // Used for canonical URLs, Open Graph, sitemap and JSON-LD. Update after deploying.
  url: "https://kevinkattakayam.dev",
  role: "Software engineer",
  // Rotating text in the hero. Each maps to one of the resume variants below.
  roles: ["AI engineer", "backend engineer", "full-stack engineer", "ML researcher"],
  tagline: "I build multi-agent AI systems and the backend that keeps them reliable.",
  description:
    "Kevin Kattakayam is a software engineer graduating in 2027, working on multi-agent LLM systems, RAG, computer vision and distributed backends in Go, Rust and Python.",
  location: "Coimbatore, India",
  timeZone: "Asia/Kolkata",
  email: "kevinbastin369@gmail.com",
  availability: {
    open: true,
    label: "Open to internships and full-time roles from 2027",
  },
  socials: [
    { label: "GitHub", href: "https://github.com/KevinKattakayam" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/kevin-kattakayam-6805a3290" },
    { label: "IEEE paper", href: "https://ieeexplore.ieee.org/document/11469562" },
  ],
  githubUser: "KevinKattakayam",
  /**
   * Public repos that should never appear in the live "Recently on GitHub" list.
   * Names are matched case-insensitively. Add any repo name here to hide it.
   */
  hiddenRepos: ["varco-coverage-not-lexicons", "Kevinbastin", "KevinKattakayam"],
  // Put your photo at /public/images/kevin.jpg (the one from your old site works).
  // If the file is missing, a monogram is shown instead.
  photo: "/images/kevin.jpg",
} as const;

/**
 * Contact form delivery.
 * Leave FORM_ENDPOINT empty and the form opens the visitor's email app (mailto).
 * To receive messages in your inbox instead, create a free form at
 * https://formspree.io (or https://web3forms.com) and paste the endpoint here.
 *   Formspree:  "https://formspree.io/f/abcdwxyz"
 *   Web3Forms:  "https://api.web3forms.com/submit" plus FORM_ACCESS_KEY below
 */
export const FORM_ENDPOINT = "";
export const FORM_ACCESS_KEY = ""; // Web3Forms only. This key is public by design.

/**
 * Optional analytics. Left off on purpose. If you want privacy-friendly free
 * analytics later, Netlify / Vercel / Cloudflare Web Analytics can be enabled
 * from the host's dashboard with no code change.
 */
export const ANALYTICS_ENABLED = false;

export type ResumeVariant = { id: string; label: string; detail: string; file: string };

/** Resume PDFs in /public/resume. Recruiters pick the one that matches the role. */
export const resumes: ResumeVariant[] = [
  {
    id: "general",
    label: "General",
    detail: "AI, backend and full stack on one page",
    file: "/resume/Kevin_Kattakayam_Resume.pdf",
  },
  {
    id: "ai",
    label: "AI / ML engineer",
    detail: "Agents, RAG, OCR, applied ML",
    file: "/resume/Kevin_Kattakayam_Resume_AI_ML.pdf",
  },
  {
    id: "backend",
    label: "Backend and distributed systems",
    detail: "Go, Rust, Kafka, Kubernetes",
    file: "/resume/Kevin_Kattakayam_Resume_Backend.pdf",
  },
  {
    id: "fullstack",
    label: "Full stack",
    detail: "TypeScript, React, Next.js, Node",
    file: "/resume/Kevin_Kattakayam_Resume_FullStack.pdf",
  },
  {
    id: "research",
    label: "ML research",
    detail: "Computer vision, self-supervised video",
    file: "/resume/Kevin_Kattakayam_Resume_ML_Research.pdf",
  },
  {
    id: "cv",
    label: "Full CV",
    detail: "Every project and certification",
    file: "/resume/Kevin_Kattakayam_CV.pdf",
  },
];

export const nav = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "writing", label: "Writing" },
  { id: "contact", label: "Contact" },
] as const;
