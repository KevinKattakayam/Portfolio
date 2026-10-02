export type TimelineEntry = {
  kind: "work" | "education";
  title: string;
  org: string;
  start: string; // display text
  end: string;
  current?: boolean;
  points: string[];
  tech?: string[];
};

/** Newest first. The timeline draws in this order. */
export const timeline: TimelineEntry[] = [
  {
    kind: "work",
    title: "Full Stack AI Developer Intern",
    org: "TheAiSignal",
    start: "May 2026",
    end: "Jul 2026",
    points: [
      "Built AI-powered features across a React frontend, a FastAPI backend and the REST API between them, for production applications.",
      "Maintained deployment pipelines and release workflows across several projects with GitHub and Cloudflare.",
    ],
    tech: ["React", "FastAPI", "Cloudflare"],
  },
  {
    kind: "work",
    title: "Generative AI Trainee",
    org: "Karunya Computer Technology Centre",
    start: "Dec 2024",
    end: "Present",
    current: true,
    points: [
      "Building LLM applications with a team across several generative AI projects using LangChain, ChromaDB and FAISS.",
      "Applying retrieval-augmented generation, prompt engineering and OCR extraction to document-processing workflows.",
    ],
    tech: ["LangChain", "ChromaDB", "FAISS", "OCR"],
  },
  {
    kind: "work",
    title: "Generative AI Intern",
    org: "YoungMinds Technology Solutions",
    start: "May 2025",
    end: "Jul 2025",
    points: [
      "Developed generative AI applications and automation tools in Python against LLM and REST APIs.",
    ],
    tech: ["Python", "LLM APIs"],
  },
  {
    kind: "work",
    title: "Generative AI Intern",
    org: "Karunya Innovation and Design Studio (KIDS)",
    start: "May 2025",
    end: "Jun 2025",
    points: [
      "Built PatentDoc Co-Pilot: five CrewAI agents covering claim writing, prior-art search and IPO compliance, exporting a full filing package.",
    ],
    tech: ["CrewAI", "Streamlit"],
  },
  {
    kind: "work",
    title: "Web Development Intern",
    org: "Octanet Services",
    start: "May 2024",
    end: "Jun 2024",
    points: ["Built responsive web applications in HTML, CSS and JavaScript, mobile first."],
    tech: ["HTML", "CSS", "JavaScript"],
  },
  {
    kind: "education",
    title: "B.Tech, Computer Science and Engineering (AI & ML)",
    org: "Karunya Institute of Technology and Sciences, Coimbatore",
    start: "2023",
    end: "2027",
    current: true,
    points: ["CGPA 8.39 / 10. Graduating 2027."],
  },
  {
    kind: "education",
    title: "Secondary and Higher Secondary (CBSE)",
    org: "Viswajyothi CMI Public School, Angamaly",
    start: "2021",
    end: "2023",
    points: ["Class 10: 92.2%. Class 12: 86%."],
  },
];
