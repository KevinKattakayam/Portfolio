/**
 * Skill names are matched (case-insensitive) against project `tech` lists, so
 * the Skills section can show where each one was actually used. Keep the
 * spelling consistent with /src/data/projects.ts.
 */
export const skillGroups = [
  {
    id: "ai",
    label: "AI and LLM systems",
    blurb: "Agents that call tools, check each other and return structured, validated output.",
    skills: [
      "LangGraph",
      "CrewAI",
      "LangChain",
      "RAG",
      "Pydantic",
      "LLMs",
      "Whisper",
      "Prompt engineering",
      "ChromaDB",
      "FAISS",
      "Hugging Face",
    ],
  },
  {
    id: "backend",
    label: "Backend and distributed systems",
    blurb:
      "Services that keep their promises under failure: delivery guarantees, rate limits, back-pressure.",
    skills: [
      "Go",
      "Rust",
      "Python",
      "FastAPI",
      "Node.js",
      "Express",
      "Kafka",
      "gRPC",
      "Socket.io",
      "REST APIs",
    ],
  },
  {
    id: "frontend",
    label: "Frontend and product",
    blurb: "Fast, accessible interfaces, including ones that keep working offline.",
    skills: ["TypeScript", "React", "Next.js", "Tailwind CSS", "PWA", "NextAuth", "Streamlit"],
  },
  {
    id: "data",
    label: "Data stores",
    blurb: "Picking the store for the access pattern, from OLAP to vectors.",
    skills: [
      "PostgreSQL",
      "ClickHouse",
      "MongoDB",
      "Prisma",
      "Supabase",
      "PostGIS",
      "Redis",
      "Snowflake",
      "Neon",
    ],
  },
  {
    id: "infra",
    label: "Infrastructure and quality",
    blurb: "Shipping it, watching it and proving it works.",
    skills: [
      "Docker",
      "Kubernetes",
      "Helm",
      "Terraform",
      "Prometheus",
      "Grafana",
      "CI/CD",
      "Jest",
      "pytest",
      "Zod",
    ],
  },
  {
    id: "ml",
    label: "ML and computer vision",
    blurb: "From hand landmarks to self-supervised video features, evaluated properly.",
    skills: [
      "PyTorch",
      "OpenCV",
      "MediaPipe",
      "V-JEPA",
      "CUDA",
      "Tesseract",
      "PaddleOCR",
      "Computer vision",
    ],
  },
] as const;
