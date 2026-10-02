import { archive, projects } from "./projects";

export const about = {
  // Short story paragraphs. Keep each under ~60 words.
  story: [
    "I'm a final-year computer science student at Karunya in Coimbatore, specialising in AI and machine learning.",
    "Most of what I build sits between two problems: getting LLM agents to give answers you can check, and building backends that don't lose data when something downstream breaks. PharmaTrace and my observability pipeline are the clearest examples of each.",
    "Along the way I published a computer vision paper in IEEE, finished Amazon ML Summer School and worked four internships plus a year-long generative AI traineeship.",
  ],
  // Animated counters. Keep them honest.
  stats: [
    { value: 4, suffix: "", label: "internships, plus a GenAI traineeship" },
    { value: projects.length + archive.length, suffix: "", label: "projects built" },
    { value: 10, suffix: "", label: "professional certifications" },
    { value: 1, suffix: "", label: "IEEE publication" },
  ],
  // Short timeline in the About section (the full one is in Experience).
  milestones: [
    { year: "2023", text: "Started B.Tech CSE (AI & ML) at Karunya" },
    { year: "2024", text: "First internship, building for the web" },
    { year: "2025", text: "Three generative AI roles, first multi-agent system" },
    { year: "2026", text: "IEEE paper, Amazon ML Summer School, production AI at TheAiSignal" },
    { year: "2027", text: "Graduating, and looking for the next team" },
  ],
  // Placeholder facts drawn from the resume. Rewrite them in your own voice.
  facts: [
    "Went to school in Angamaly, Kerala. PharmaTrace takes voice input in Malayalam, Hindi, Tamil and English.",
    "Writes tests for side projects: the observability pipeline has 78 of them.",
    "Holds certifications from Microsoft, Snowflake, Oracle, Salesforce, Redis and Google.",
  ],
};
