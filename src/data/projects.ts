/*
 * Facts (tech, numbers, links, dates) come from the resumes. The "problem" and
 * "process" prose is written from them; read each case study once and adjust
 * the wording so it matches how you actually experienced the project.
 */
export type Category = "AI systems" | "Backend & infra" | "Full stack" | "Research";

/** Which generated cover to draw. Swap for a real screenshot with `cover`. */
export type ArtVariant =
  "pipeline" | "agents" | "grid" | "scan" | "wave" | "layers" | "kernel" | "gauge" | "stages";

export type Project = {
  slug: string;
  title: string;
  /** One line shown on the card. */
  summary: string;
  category: Category;
  /** Optional. Leave out if unsure; the card simply omits it. */
  year?: string;
  role: string;
  tech: string[];
  github?: string;
  live?: string;
  paper?: string;
  art: ArtVariant;
  /** Optional screenshot in /public/images/projects. Shown instead of generated art. */
  cover?: string;
  /** Bento size on the home grid. */
  size: "large" | "wide" | "tall" | "small";
  metrics: { value: string; label: string }[];
  /**
   * Optional system diagram on the case-study page. Nodes are drawn left to
   * right (top to bottom on phones); edges[i] labels the arrow after nodes[i].
   */
  architecture?: {
    nodes: { title: string; detail: string }[];
    edges: string[];
  };
  caseStudy: {
    problem: string;
    process: { title: string; body: string }[];
    solution: string[];
    result: string;
  };
};

export const categories: Category[] = ["AI systems", "Backend & infra", "Full stack", "Research"];

const allProjects: Project[] = [
  {
    slug: "observability-pipeline",
    title: "Distributed observability pipeline",
    summary:
      "A Datadog-style metrics pipeline in Go and Rust that keeps every data point when storage fails.",
    category: "Backend & infra",
    year: "2026",
    role: "Personal project",
    tech: [
      "Go",
      "Rust",
      "Kafka",
      "ClickHouse",
      "Prometheus",
      "Grafana",
      "Kubernetes",
      "Helm",
      "Terraform",
      "gRPC",
    ],
    github: "https://github.com/KevinKattakayam/datadog",
    art: "pipeline",
    size: "large",
    metrics: [
      { value: "53", label: "unit tests across Go and Rust" },
      { value: "25", label: "integration tests" },
      { value: "14", label: "containers load-tested with k6" },
    ],
    architecture: {
      nodes: [
        { title: "Clients", detail: "Go SDK, HTTP POST /ingest, gRPC :50051" },
        {
          title: "Ingestor (Go)",
          detail: "Gin, rate limiting, multi-tenancy, Avro validation, Redis cache",
        },
        { title: "Kafka (KRaft)", detail: "3 topics, 6 partitions, RF=2, dead-letter queue" },
        {
          title: "Processor (Rust)",
          detail: "EWMA + Z-score anomalies, circuit breaker, batch writer",
        },
        {
          title: "Storage",
          detail: "ClickHouse (1-year TTL, hourly rollups) and Prometheus (15 days)",
        },
        {
          title: "Observe",
          detail: "Grafana, AlertManager, Tempo and Jaeger via the OTel Collector",
        },
      ],
      edges: ["HTTP / gRPC", "metrics.raw (Avro)", "consume", "commit after write", "query"],
    },
    caseStudy: {
      problem:
        "Metrics pipelines usually fail quietly. When the database slows down, consumers either drop data or stall ingestion for everyone. I wanted to build the whole path of a Datadog-style system myself and make each failure mode an explicit design decision.",
      process: [
        {
          title: "Ingest",
          body: "A Go service on Gin validates incoming metrics and publishes them to 6-partition Kafka topics, with a dead-letter queue for anything malformed. gRPC/protobuf definitions describe the same contract.",
        },
        {
          title: "Detect",
          body: "A Rust consumer on tokio runs EWMA and rolling Z-score anomaly detection on each series as it streams through.",
        },
        {
          title: "Store",
          body: "Two tiers: Prometheus keeps 15 days hot, ClickHouse MergeTree keeps a year with monthly partitions, a TTL and hourly rollups.",
        },
        {
          title: "Operate",
          body: "Per-tenant token-bucket rate limiting, W3C Trace Context propagated to Tempo and Jaeger, and multi-window SLO burn-rate alerts modeled on the Google SRE workbook.",
        },
      ],
      solution: [
        "Kafka offsets are committed only after a successful ClickHouse write, which gives at-least-once delivery with no silent data loss.",
        "A circuit breaker opens after 5 consecutive failures and backs off exponentially to 60 seconds, so a degraded database shows up as bounded consumer lag instead of a stalled pipeline.",
        "A 12-component Helm chart with HPAs and PDBs, plus a Terraform blueprint for AWS EKS, describe how the stack would run in production.",
      ],
      result:
        "The full 14-container stack runs locally and is covered by 53 unit tests (41 Go, 12 Rust), 25 integration tests and a k6 load-test script.",
    },
  },
  {
    slug: "pharmatrace",
    title: "PharmaTrace",
    summary:
      "Six LLM agents check a medicine against three drug registries and refuse to invent medical terms.",
    category: "AI systems",
    year: "2026",
    role: "Personal project",
    tech: [
      "Python",
      "FastAPI",
      "LangGraph",
      "Pydantic",
      "Llama 3.3",
      "Whisper",
      "React",
      "PWA",
      "Supabase",
      "PostGIS",
      "Tesseract",
    ],
    github: "https://github.com/KevinKattakayam/pharma_trace",
    art: "agents",
    size: "tall",
    metrics: [
      { value: "6", label: "LangGraph agents" },
      { value: "3", label: "drug registries" },
      { value: "4", label: "voice languages" },
    ],
    architecture: {
      nodes: [
        {
          title: "React 19 PWA",
          detail: "Tesseract OCR, Whisper voice in 4 languages, IndexedDB outbox",
        },
        { title: "FastAPI", detail: "Strict Pydantic schemas and the jargon firewall" },
        {
          title: "LangGraph",
          detail: "Barcode, FDA lookup, recall, interaction, safety and report agents",
        },
        { title: "Registries", detail: "OpenFDA, RxNav / RxNorm, CDSCO, FAERS signals" },
        {
          title: "Report + audit",
          detail: "Severity-sorted warnings, SHA-256 hash-chained log in Supabase",
        },
      ],
      edges: ["scan or speak", "6-agent graph", "asyncio.gather", "validated output"],
    },
    caseStudy: {
      problem:
        "Checking whether a medicine is genuine, recalled or unsafe for a particular patient means cross-referencing several registries that disagree in format. An LLM can summarise that well, but it also likes to make up confident clinical terms, which is the one thing a health tool cannot do.",
      process: [
        {
          title: "Split the job into agents",
          body: "A LangGraph pipeline with six agents (barcode, FDA lookup, recall, interaction, safety, report) over OpenFDA, RxNav and India's CDSCO registry. Independent lookups run in parallel with asyncio.gather to cut end-to-end latency.",
        },
        {
          title: "Replace counts with signal",
          body: "Naive adverse-event report counts were replaced with NLM RxNorm clinical mapping, FAERS signal strength and severity-sorted warnings.",
        },
        {
          title: "Constrain the model",
          body: "Strict Pydantic schemas plus a field-validator 'jargon firewall' structurally block hallucinated medical terminology. Patient age, weight and renal function are injected into prompts to trigger dosage warnings.",
        },
        {
          title: "Work offline",
          body: "A React 19 PWA with in-browser Tesseract OCR for expiry dates, IndexedDB caching and a Background Sync outbox for poor connectivity.",
        },
      ],
      solution: [
        "Whisper-based voice input in Malayalam, Hindi, Tamil and English.",
        "Every verification is written to a SHA-256 hash-chained audit log, so tampering with history is detectable.",
        "Deployment configs for Railway (API) and Vercel (PWA).",
      ],
      result:
        "A verification flow that answers in the user's language, keeps working without a network, and returns warnings that are traceable to a registry rather than to the model's imagination.",
    },
  },
  {
    slug: "collegefind",
    title: "CollegeFind",
    summary:
      "A live college discovery platform with comparison, filters and an admission predictor.",
    category: "Full stack",
    year: "2026",
    role: "Personal project",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "NextAuth", "Prisma", "PostgreSQL", "Neon"],
    github: "https://github.com/KevinKattakayam/collegefind",
    live: "https://college-discovery-zeta.vercel.app",
    art: "grid",
    size: "wide",
    metrics: [
      { value: "200+", label: "colleges covered" },
      { value: "11+", label: "comparison metrics" },
      { value: "Live", label: "on Vercel" },
    ],
    caseStudy: {
      problem:
        "Choosing a college in India means juggling rankings, fees, cut-offs and placement data across a dozen tabs. Students need to filter, compare side by side and share what they found.",
      process: [
        {
          title: "Search that keeps up",
          body: "Debounced search, multi-facet filters and URL-synced state so every result page can be shared or bookmarked.",
        },
        {
          title: "Compare and predict",
          body: "Side-by-side comparison across 11+ metrics, and an admission predictor that maps an exam rank to likely colleges.",
        },
        {
          title: "Community",
          body: "Saved comparisons and a Q&A thread with optimistic UI, behind NextAuth sign-in.",
        },
      ],
      solution: [
        "Next.js 16 frontend on Vercel proxying to a Render backend over serverless Neon Postgres via Prisma.",
        "Skeleton loaders on every async view so the interface never jumps.",
      ],
      result: "Shipped and live, covering 200+ colleges.",
    },
  },
  {
    slug: "patentdoc-copilot",
    title: "PatentDoc Co-Pilot",
    summary:
      "Five CrewAI agents draft, check and package an IPO-compliant patent filing in one click.",
    category: "AI systems",
    year: "2025",
    role: "Generative AI intern, KIDS (Karunya)",
    tech: ["Python", "CrewAI", "LLMs", "OpenRouter", "Streamlit", "Docker"],
    github: "https://github.com/KevinKattakayam/Patent_Doc_Copilot",
    art: "agents",
    size: "small",
    metrics: [
      { value: "5", label: "agents" },
      { value: "9", label: "IPO sections generated" },
      { value: "3", label: "filing forms exported" },
    ],
    caseStudy: {
      problem:
        "Drafting a patent for the Indian Patent Office takes nine strictly formatted sections, diagrams and several forms. Most of that is structure, which makes it a good fit for agents that check each other.",
      process: [
        {
          title: "Draft",
          body: "Agents write claims and drawing descriptions, and generate block, flow and sequence diagrams automatically.",
        },
        {
          title: "Verify",
          body: "Separate agents run prior-art search, format validation against IPO rules and a final quality review.",
        },
        {
          title: "Package",
          body: "Everything is exported as a filing package (Forms 1, 3 and 5) in PDF and DOCX.",
        },
      ],
      solution: ["A containerised Streamlit app wrapping a 5-agent CrewAI pipeline."],
      result:
        "All 9 IPO-compliant sections and the filing forms produced from a single invention description.",
    },
  },
  {
    slug: "schamroth-detection",
    title: "Schamroth window detection",
    summary:
      "Computer vision that screens for finger clubbing, a sign of lung and heart disease. Published in IEEE.",
    category: "Research",
    year: "2026",
    role: "Research project, published in IEEE",
    tech: ["Python", "MediaPipe", "OpenCV", "Streamlit"],
    github: "https://github.com/KevinKattakayam/schamroth",
    paper: "https://ieeexplore.ieee.org/document/11469562",
    art: "scan",
    size: "small",
    metrics: [
      { value: "IEEE", label: "published 2026" },
      { value: "5", label: "clinical risk levels" },
      { value: "65", label: "image test set" },
    ],
    caseStudy: {
      problem:
        "Clubbed fingers can be an early sign of lung cancer and heart disease. Doctors check with the Schamroth window test: two fingers back to back, looking for a diamond-shaped gap of light. Image analysis can make that screening easier to access.",
      process: [
        {
          title: "Find the fingers",
          body: "MediaPipe hand landmarks locate the opposing index fingertips, with a centre-based fallback for close-up frames and image-quality gates before analysis.",
        },
        {
          title: "Measure the gap",
          body: "A gap-presence score built from bright/dark pixel ratios, contrast and left-right symmetry, after CLAHE enhancement.",
        },
        {
          title: "Evaluate honestly",
          body: "An evaluation harness reporting accuracy, sensitivity, specificity, F1 and a confusion matrix over 65 images of healthy, simulated and clinical cases.",
        },
      ],
      solution: [
        "The score maps to 5 clinical risk levels with quality-weighted confidence, wrapped in a Streamlit app.",
      ],
      result:
        "Published as 'Early Lung Cancer and Heart Disease Prediction from Clubbed Fingers Using Machine Vision' (IEEE, 2026).",
    },
  },
  {
    slug: "devsync",
    title: "DevSync",
    summary: "A real-time developer workspace with live co-editing, Kanban and role-based access.",
    category: "Full stack",
    year: "2026",
    role: "Personal project",
    tech: [
      "TypeScript",
      "Node.js",
      "Express",
      "Next.js",
      "React",
      "PostgreSQL",
      "Prisma",
      "Socket.io",
      "Zod",
      "Jest",
    ],
    github: "https://github.com/KevinKattakayam/devsync",
    art: "grid",
    size: "wide",
    metrics: [
      { value: "Live", label: "co-editing over Socket.io" },
      { value: "RBAC", label: "role-based access" },
      { value: "Jest", label: "integration suites" },
    ],
    caseStudy: {
      problem:
        "Small teams bounce between a doc editor, a task board and chat. DevSync puts shared documents and tasks in one place with real permissions.",
      process: [
        { title: "Model the data", body: "A PostgreSQL schema and data-access layer in Prisma." },
        {
          title: "Make it live",
          body: "Socket.io rooms for real-time document co-editing and Kanban updates.",
        },
        {
          title: "Harden the API",
          body: "JWT auth, RBAC, Zod validation and centralised error handling, with Jest/Supertest integration suites across auth, roles and task workflows.",
        },
      ],
      solution: ["An Express REST API in TypeScript behind a Next.js client."],
      result:
        "A collaborative workspace whose permission rules are covered by tests, not just by UI.",
    },
  },
  {
    slug: "vjepa-video",
    title: "V-JEPA video representations",
    summary:
      "Adapting Meta's self-supervised V-JEPA features to video classification on a small GPU.",
    category: "Research",
    year: "2025",
    role: "Personal research project",
    tech: ["PyTorch", "V-JEPA", "CUDA", "Python"],
    github: "https://github.com/KevinKattakayam/finetunevjpea",
    art: "wave",
    size: "small",
    metrics: [
      { value: "UCF101", label: "benchmark" },
      { value: "Probes", label: "attentive probing" },
      { value: "Low VRAM", label: "constrained GPU memory" },
    ],
    caseStudy: {
      problem:
        "Self-supervised video models learn strong features without labels, but adapting them to a new task usually assumes plenty of GPU memory.",
      process: [
        {
          title: "Probe, don't fine-tune",
          body: "Attentive probes on top of frozen pretrained V-JEPA representations for UCF101 classification.",
        },
        {
          title: "Experiment under limits",
          body: "Compared temporal sampling strategies, probe configurations and batch sizes within constrained GPU memory.",
        },
      ],
      solution: [
        "A PyTorch setup for training attentive probes on V-JEPA features within a constrained GPU memory budget.",
      ],
      result:
        "A practical comparison of what matters when adapting video foundation models on a budget.",
    },
  },
  {
    slug: "nexusbank",
    title: "NexusBank",
    summary: "A banking API with hashed PINs, validated transfers and rule-based fraud scoring.",
    category: "Backend & infra",
    year: "2025",
    role: "Personal project",
    tech: ["Node.js", "Express", "MongoDB", "Mongoose", "bcrypt"],
    github: "https://github.com/KevinKattakayam/online_bank_simulation",
    art: "wave",
    size: "small",
    metrics: [
      { value: "0–100", label: "weighted fraud risk score" },
      { value: "4", label: "fraud rules" },
      { value: "bcrypt", label: "hashed PIN auth" },
    ],
    caseStudy: {
      problem:
        "A banking simulation is a good excuse to get the boring, important parts right: authentication, balance checks and spotting suspicious activity.",
      process: [
        {
          title: "Secure the basics",
          body: "bcrypt-hashed PIN authentication with MongoDB-backed sessions, balance-validated transfers and beneficiaries.",
        },
        {
          title: "Score risk",
          body: "Rule-based fraud detection on amount, velocity, odd hours and daily limits, combined into a weighted 0–100 risk score.",
        },
        {
          title: "Query efficiently",
          body: "Compound-indexed, paginated transaction history and aggregation-pipeline spending analytics.",
        },
      ],
      solution: ["An Express 5 API with a dark-mode dashboard showing live balance updates."],
      result: "Every transfer is validated and scored before it lands.",
    },
  },

  {
    slug: "razor-agent-payment-risk",
    title: "Razor: risk layer for AI-agent payments",
    summary:
      "Catches what fraud tools miss: an AI agent with a valid payment mandate that was hijacked into buying the wrong thing.",
    category: "AI systems",
    role: "Personal project",
    tech: [
      "Python",
      "FastAPI",
      "Razorpay",
      "scikit-learn",
      "XGBoost",
      "LightGBM",
      "SHAP",
      "Pydantic",
      "pytest",
    ],
    github: "https://github.com/KevinKattakayam/razor",
    art: "layers",
    size: "wide",
    metrics: [
      { value: "4", label: "layers: mandate, behaviour, intent, evidence" },
      { value: "0.87", label: "ROC-AUC, held-out synthetic data" },
      { value: "6", label: "attack classes simulated" },
    ],
    architecture: {
      nodes: [
        { title: "Agent session", detail: "Cart, delegated mandate and prior history" },
        {
          title: "L1 Mandate",
          detail: "Amount, category, time, lifecycle and identity checks with a JSON reason trail",
        },
        {
          title: "L2 Behaviour",
          detail: "Sequence, timing, token reuse and velocity, scored with a risk model",
        },
        {
          title: "L3 Intent",
          detail: "Purpose against cart, injection patterns, beneficiary novelty",
        },
        {
          title: "L4 Evidence",
          detail: "Liability call, evidence packet, grounded narrative, step-up or mandate pause",
        },
      ],
      edges: ["verify", "score", "check purpose", "escalate"],
    },
    caseStudy: {
      problem:
        "Agentic checkout protocols deliberately leave merchant fraud modelling out of scope. Legacy signals such as device, IP and clickstream describe the agent, not the person behind it, so honest automation can look like a bot while a hijacked agent can still make a purchase that sits inside its mandate. The new failure is indirect prompt injection: an agent reads attacker-controlled content and then buys something unrelated to its task.",
      process: [
        {
          title: "Was it authorised?",
          body: "L1 verifies the delegated mandate (amount, category, time window, lifecycle, identity) and returns pass or fail with a JSON reason trail. Razorpay has no first-class AI-agent object, so delegation is modelled as a mandate: a scoped, revocable, user-approved grant.",
        },
        {
          title: "Did the session behave normally?",
          body: "L2 scores sequence, timing, token reuse and velocity, and returns a risk score with the features that drove it.",
        },
        {
          title: "Did the outcome match the purpose?",
          body: "L3 looks for divergence between the stated purpose and the cart, injection structures, and beneficiary novelty combined with high value and timing escalation.",
        },
        {
          title: "What is the evidence?",
          body: "L4 makes a deterministic liability call and builds an evidence packet with a grounded narrative, then triggers a step-up, a mandate pause or the Razorpay dispute flow.",
        },
      ],
      solution: [
        "The headline demo (A6) is a valid, in-limit mandate on a normal-looking session whose cart (a crypto voucher, a luxury watch, a gaming console) no longer matches a grocery purpose. L1 and L2 pass, L3 flags it, and L4 escalates to the provider.",
        "A simulator with six attack classes, from A1 consent replay to A6 injected intent, and a browser console that shows each case layer by layer.",
      ],
      result:
        "On a frozen, mandate-disjoint held-out split, Layer 2 reaches ROC-AUC 0.867 and PR-AUC 0.611, and catches 100% of spoofed-identity, over-ceiling and slow-drain attacks. It deliberately scores injected intent (A6) at 0%, because those sessions look normal; Layer 3 handles that class at 100% precision and 65% recall. All figures are on synthetic data, not production fraud rates.",
    },
  },
  {
    slug: "flashgraph",
    title: "FlashGraph",
    summary:
      "A C++/CUDA inference engine that fuses a transformer block's RMSNorm, MatMul and GELU into one INT8 GPU kernel.",
    category: "AI systems",
    role: "Personal project",
    tech: ["C++", "CUDA", "PyTorch", "Python", "CMake", "Nsight Compute", "pytest"],
    github: "https://github.com/KevinKattakayam/flashgraph",
    art: "kernel",
    size: "small",
    metrics: [
      { value: "1", label: "GPU launch for three ops" },
      { value: "INT8", label: "weights, FP16 compute" },
      { value: "0", label: "mallocs after init" },
    ],
    architecture: {
      nodes: [
        {
          title: "Python API",
          detail: "fused_inference(), quantize_weights(), cpu_inference() and benchmark()",
        },
        {
          title: "C++ binding",
          detail:
            "Validates inputs and hands PyTorch tensors to the kernel as raw pointers, zero-copy",
        },
        {
          title: "CUDA fused kernel",
          detail:
            "RMSNorm, then MatMul (INT8 to FP16), then GELU in one launch with shared-memory tiling",
        },
        {
          title: "Memory arena",
          detail: "64-byte aligned bump allocator: no malloc after initialisation",
        },
      ],
      edges: ["zero-copy", "launch", "allocate"],
    },
    caseStudy: {
      problem:
        "Run naively, a transformer block launches a separate GPU kernel for each operation and sends every intermediate result back through global memory. FlashGraph is an exercise in how far fusion, quantisation and careful memory management can go on a deliberately small block.",
      process: [
        {
          title: "Fuse",
          body: "RMSNorm, MatMul and GELU run in a single GPU launch with intermediates kept in on-chip memory, using shared-memory tiling (64x64x32) and FP32 accumulators.",
        },
        {
          title: "Quantise",
          body: "Symmetric per-tensor INT8 weights are stored in global memory and dequantised to FP16 on the fly. FP16 maths uses vectorised half2 operations, accumulating in FP32 so values do not overflow.",
        },
        {
          title: "Manage memory",
          body: "A 64-byte aligned bump-pointer arena (posix_memalign) means zero malloc after initialisation, which also gives a standalone C++ deployment path. Pinned host memory and non-blocking CUDA streams let transfers overlap compute.",
        },
        {
          title: "Validate and profile",
          body: "A CPU baseline checks the GPU output. Nsight Compute roofline and bandwidth commands are included for profiling the fused kernel.",
        },
      ],
      solution: [
        "A PyTorch extension (flashgraph) with a small Python API, plus a CPU-only build with Make or CMake so the C++ side can be built and tested without a GPU.",
        "A Colab notebook for building and running on a cloud GPU.",
      ],
      result:
        "A working C++/CUDA extension callable from PyTorch, with a CPU reference for correctness, four C++ arena unit tests and a Python validation suite.",
    },
  },
  {
    slug: "fact-verifier",
    title: "Fact-Verifier",
    summary:
      "A multi-agent pipeline that breaks a claim apart, checks it against five outside sources and returns a 0 to 100 truth score with citations.",
    category: "AI systems",
    role: "Personal project",
    tech: [
      "Python",
      "FastAPI",
      "Multi-agent",
      "Wikipedia API",
      "WolframAlpha",
      "NewsAPI",
      "Google Knowledge Graph",
      "pytest",
    ],
    github: "https://github.com/KevinKattakayam/fact_verifier",
    art: "agents",
    size: "small",
    metrics: [
      { value: "5", label: "evidence sources" },
      { value: "0–100", label: "truth score" },
      { value: "CPU", label: "no GPU needed" },
    ],
    architecture: {
      nodes: [
        { title: "Claim", detail: "A sentence from the web UI or POST /api/verify" },
        { title: "Decompose", detail: "Splits the claim into parts that can be checked" },
        {
          title: "Retrieve",
          detail: "Wikipedia, WolframAlpha, NewsAPI, Google Knowledge Graph and the Fact Check API",
        },
        {
          title: "Analyse and compare",
          detail: "Weighs how well the evidence supports or contradicts each part",
        },
        {
          title: "Score and report",
          detail: "Verdict, truth score, confidence, reasoning steps and cited sources",
        },
      ],
      edges: ["", "query", "evidence", "score"],
    },
    caseStudy: {
      problem:
        "A claim is easy to state and hard to check. The aim was a system that shows its work: where each piece of evidence came from, how it was weighed and how confident the verdict is.",
      process: [
        {
          title: "Decompose",
          body: "A claim is split into parts that can each be checked against evidence.",
        },
        {
          title: "Retrieve",
          body: "Agents query Wikipedia, WolframAlpha, NewsAPI, Google Knowledge Graph and the Fact Check API. Keys are optional, so it still runs with fewer sources.",
        },
        {
          title: "Analyse and compare",
          body: "Evidence from different sources is compared for agreement and contradiction.",
        },
        {
          title: "Score",
          body: "The result is a 0 to 100 truth score, a verdict and a confidence value.",
        },
      ],
      solution: [
        "Transparent reports: full citations, reasoning steps and an evidence breakdown for every verdict.",
        "A FastAPI service with a dark, responsive web interface, running on CPU with an optional lightweight LLM.",
      ],
      result:
        "A service that returns a verdict, a truth score, a confidence value, evidence, reasoning steps and sources for any natural-language claim.",
    },
  },
  {
    slug: "metis-research-mentor",
    title: "METIS: an AI research mentor",
    summary:
      "A stage-aware assistant that guides students from idea to paper. LLM judges preferred it to Claude Sonnet 4.5 in 71% of 90 prompts.",
    category: "Research",
    role: "Research project (preprint)",
    tech: ["Python", "LLMs", "Tool use", "Retrieval", "LLM-as-a-judge"],
    github: "https://github.com/KevinKattakayam/research_mentor",
    art: "stages",
    size: "wide",
    metrics: [
      { value: "71%", label: "preferred over Claude Sonnet 4.5" },
      { value: "54%", label: "preferred over GPT-5" },
      { value: "90", label: "single-turn prompts judged" },
    ],
    caseStudy: {
      problem:
        "Many students lack access to expert research mentorship. METIS asks whether an AI mentor can move an undergraduate from an idea to a paper.",
      process: [
        {
          title: "Build",
          body: "A tool-augmented, stage-aware assistant with literature search, curated guidelines, methodology checks and memory.",
        },
        {
          title: "Evaluate",
          body: "Compared with GPT-5 and Claude Sonnet 4.5 across six writing stages, using pairwise LLM-judge preferences, student-persona rubrics, short multi-turn tutoring sessions and evidence and compliance checks.",
        },
        {
          title: "Make it reproducible",
          body: "Scripts for single-turn stages A to F, student judge scores and multi-turn runs, with the raw logs and analysis reports used in the preprint.",
        },
      ],
      solution: [
        "Stage-aware routing and grounding: gains concentrate in the document-grounded stages (D to F).",
        "Failure modes are reported openly: premature tool routing, shallow grounding and occasional stage misclassification.",
      ],
      result:
        "On 90 single-turn prompts, LLM judges preferred METIS to Claude Sonnet 4.5 in 71% of cases and to GPT-5 in 54%. In multi-turn sessions it produced slightly higher final quality than GPT-5. Code and evaluation artifacts are public; the work is described as a preprint.",
    },
  },
  {
    slug: "battery-guard",
    title: "Battery Guard",
    summary:
      "A cross-platform battery daemon that caps charging, predicts time to target and alerts you on Slack, Telegram, WhatsApp and more.",
    category: "Backend & infra",
    role: "Personal project",
    tech: ["Python", "psutil", "CustomTkinter", "pystray", "Webhooks", "Telegram", "ntfy"],
    github: "https://github.com/KevinKattakayam/battery_guard",
    art: "gauge",
    size: "small",
    metrics: [
      { value: "2", label: "operating systems" },
      { value: "7", label: "alert channels" },
      { value: "JSONL", label: "audit log, CSV export" },
    ],
    architecture: {
      nodes: [
        {
          title: "Sensors",
          detail: "psutil and /sys: health, cycles, voltage, capacity and ACPI thermals",
        },
        {
          title: "Controller",
          detail: "Dashboard, time-to-target predictor, charge limit and power-profile switching",
        },
        { title: "Alert dispatcher", detail: "Edge-triggered, with cooldowns and quiet hours" },
        {
          title: "Channels",
          detail: "Desktop, Slack, Teams, Discord, WhatsApp, Telegram and ntfy",
        },
      ],
      edges: ["poll", "events", "send"],
    },
    caseStudy: {
      problem:
        "Laptop batteries and UPS units wear out early from chronic overcharging and heat. Battery Guard enforces user-defined charge limits, automates power states and alerts you before it becomes a problem.",
      process: [
        {
          title: "Monitor",
          body: "Real-time health percentage, cycle count, voltage, design versus actual capacity in Wh, and ACPI motherboard and CPU thermal sensors.",
        },
        {
          title: "Limit",
          body: "On supported Linux kernels it writes the charge_control_end_threshold file to physically stop charging at the chosen limit.",
        },
        {
          title: "Predict",
          body: "A time-series estimator uses historical charge and discharge curves to show a time to target.",
        },
        {
          title: "Alert",
          body: "A notification pipeline sends desktop popups, webhooks (Slack, Teams, Discord), WhatsApp, Telegram and ntfy messages, with cooldown timers and quiet hours.",
        },
      ],
      solution: [
        "Automatic Linux power-profile switching (power-saver at low charge, balanced when charging) and sleep safeguards.",
        "A system-tray app plus a headless --daemon mode for servers and UPS monitoring, on Ubuntu and Windows.",
        "A JSON-lines audit log and one-click CSV reports for asset tracking.",
      ],
      result:
        "A background service with a dashboard, tray icon and audit trail that limits battery wear on both Linux and Windows workstations.",
    },
  },
];

/**
 * Display order on the home page. The first 10 show by default and the rest sit
 * behind "Show all". Sizes are chosen so every row of the bento grid adds up to
 * a full 12 columns when listed in this order.
 */
const ORDER = [
  "observability-pipeline",
  "pharmatrace",
  "razor-agent-payment-risk",
  "flashgraph",
  "fact-verifier",
  "collegefind",
  "schamroth-detection",
  "metis-research-mentor",
  "patentdoc-copilot",
  "devsync",
  "battery-guard",
  "vjepa-video",
  "nexusbank",
];

export const projects: Project[] = ORDER.map((slug) => allProjects.find((p) => p.slug === slug)!);

/** Smaller projects listed without a case study. */
export type ArchiveItem = {
  title: string;
  description: string;
  tech: string[];
  href?: string;
  live?: string;
};

export const archive: ArchiveItem[] = [
  {
    title: "PDF OCR and structure extraction",
    description: "Validation, OCR, table normalisation and RAG-ready chunking with a batch CLI.",
    tech: ["Python", "Pydantic", "pytest"],
    href: "https://github.com/KevinKattakayam/pdf-ocr",
  },
  {
    title: "Invoice OCR to Excel",
    description:
      "Pulls invoice fields and line-item tables from images and PDFs into Excel and JSON.",
    tech: ["PaddleOCR", "OpenPyXL"],
    href: "https://github.com/KevinKattakayam/bill_excel",
  },
  {
    title: "GhostWorker",
    description: "Multi-agent bias detection and legal appeal generation across 5+ jurisdictions.",
    tech: ["FastAPI", "LangGraph", "Next.js"],
    href: "https://github.com/KevinKattakayam/ghost_worker",
  },
  {
    title: "AI Research Co-Scientist",
    description: "Team project: a GenAI module for literature review and hypothesis generation.",
    tech: ["LangChain", "ChromaDB"],
    href: "https://github.com/KevinKattakayam/co_research_scientist",
  },
  {
    title: "Research Paper Navigator",
    description: "Semantic paper search with summaries from a local LLM.",
    tech: ["Sentence Transformers", "FAISS", "Ollama"],
    href: "https://github.com/KevinKattakayam/Research-Paper-Navigator",
  },
  {
    title: "QuickClip",
    description:
      "Share text, code, passwords and files between two devices over a direct WebRTC link. No sign-up or storage.",
    tech: ["WebRTC", "PeerJS", "JavaScript"],
    href: "https://github.com/KevinKattakayam/copy-paste",
    live: "https://quickclip1.netlify.app/",
  },
  {
    title: "Financial report insights engine",
    description:
      "A retrieval-augmented generation app that pulls insights out of financial documents.",
    tech: ["RAG", "Python"],
    href: "https://github.com/KevinKattakayam/financereport",
  },
  {
    title: "Energy behaviour prediction",
    description:
      "Machine learning that predicts energy consumption patterns across campus buildings.",
    tech: ["Python", "Machine learning"],
    href: "https://github.com/KevinKattakayam/energy",
  },
  {
    title: "Smart Copy History",
    description:
      "A Chrome extension that supercharges the clipboard with a history you can browse.",
    tech: ["Chrome extension", "JavaScript"],
    href: "https://github.com/KevinKattakayam/copy_extension",
  },
  {
    title: "ACGP: governance console for AI agent payments",
    description:
      "An interactive prototype that runs agent payments through seven governance layers and simulates spoofing, mission-drift, swarm and policy-bypass attacks.",
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    href: "https://github.com/KevinKattakayam/amex",
  },
  {
    title: "Twitter sentiment analysis",
    description:
      "Six models, from Naive Bayes to a voting ensemble, on TF-IDF and VADER features, compared in a Streamlit dashboard.",
    tech: ["scikit-learn", "NLP", "Streamlit"],
    href: "https://github.com/KevinKattakayam/sentiment_analysis",
  },
  {
    title: "Fingerprint enhancement",
    description:
      "High-pass Fourier filtering (Butterworth, Gaussian, ideal) plus CLAHE to sharpen ridge detail for biometric matching.",
    tech: ["OpenCV", "NumPy", "FFT"],
    href: "https://github.com/KevinKattakayam/fingerprint_enhancement",
  },
  {
    title: "Adidas sales dashboard",
    description:
      "An interactive analytics dashboard with rolling trends, region and product filters, profit scatter and a correlation heatmap.",
    tech: ["Dash", "Plotly", "pandas"],
    href: "https://github.com/KevinKattakayam/dv_adidas_graph",
  },
  {
    title: "Karunya Admission Guide Bot",
    description:
      "A RAG chatbot answering campus and admission questions from institutional documents.",
    tech: ["LangChain", "FAISS"],
    // Add the repo URL once it's public, e.g. href: "https://github.com/KevinKattakayam/<repo>",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
