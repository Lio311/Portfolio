export type ProjectCategory = "automation" | "fullstack" | "ai" | "biomedical";

/** Code-drawn covers for projects without a public screenshot (see ui/project-cover.tsx). */
export type CoverKind = "price-radar" | "job-match" | "agent-graph" | "device";

export interface Project {
  id: string;
  title: string;
  description: string;
  /** Screenshot in /public/images; projects without one get a drawn `cover`. */
  image?: string;
  cover?: CoverKind;
  /** Live site. Omit when the app is private (passcode dashboards) or offline. */
  link?: string;
  repo?: string;
  categories: ProjectCategory[];
  tags: string[];
  /** Short proof points shown on the card, e.g. "22 competitor sites". */
  highlights?: string[];
  isNew?: boolean;
}

export const projectsData: Project[] = [
  {
    id: "dira-bot",
    title: "diraBot (Real-Estate Aggregator)",
    description:
      "Autonomous bot that scrapes Yad2, Madlan, OnMap, Homeless and Facebook groups every 8 hours, dedupes the same flat across sites, tracks price history and verifies taken-down ads. Emails new matches and price drops to double-opt-in subscribers and serves a map-first dashboard.",
    image: "/images/dira-bot.jpg",
    link: "https://dira-bot-three.vercel.app",
    repo: "https://github.com/Lio311/dira-bot",
    categories: ["automation", "fullstack"],
    tags: ["Next.js 16", "Playwright", "Apify", "Drizzle", "Neon", "MapLibre", "GitHub Actions"],
    highlights: ["6 sources", "Runs every 8h", "Cross-site dedupe"],
    isNew: true,
  },
  {
    id: "libero-bot",
    title: "liberoBot (Price Intelligence)",
    description:
      "Nightly competitive-pricing engine for a perfume e-commerce store. Pulls in-stock products from the WooCommerce API, scans 22 competitor sites in parallel (Shopify, WooCommerce, Konimbo, SFCC, Magento parsers), matches products by barcode, volume and concentration, and emails a DST-aware 08:00 digest.",
    cover: "price-radar",
    repo: "https://github.com/Lio311/libero-bot",
    categories: ["automation", "fullstack"],
    tags: ["Next.js 16", "Cheerio", "WooCommerce API", "Drizzle", "Neon", "GitHub Actions"],
    highlights: ["22 competitor sites", "~1,300 SKUs tracked", "Zero paid scrapers"],
    isNew: true,
  },
  {
    id: "jobot",
    title: "joBot (AI Job Hunter)",
    description:
      "Personal job-search agent that crawls LinkedIn, AllJobs, Drushim, Google X-ray and 60+ company ATS boards (Greenhouse, Lever, Ashby, Comeet) three times a day. Scores every role against the CV locally, then Claude refines the promising ones with JSON-schema structured output and explains the fit.",
    cover: "job-match",
    repo: "https://github.com/Lio311/joBot",
    categories: ["automation", "ai", "fullstack"],
    tags: ["Claude API", "Structured Output", "Next.js 16", "Drizzle", "MapLibre", "PWA"],
    highlights: ["8 job sources", "LLM scoring", "CV → profile draft"],
    isNew: true,
  },
  {
    id: "perfume-studio",
    title: "Perfume Studio (3D Configurator)",
    description:
      "Real-time 3D configurator for private-label perfume packaging. Procedural bottles, caps and boxes snap together by real FEA neck standards, with transmission-glass rendering, undo/redo, PDF supplier-catalog import, a voice assistant, and a companion Swift iOS app that scans and measures physical parts.",
    image: "/images/perfume-studio.jpg",
    link: "https://perfume-studio-indol.vercel.app",
    repo: "https://github.com/Lio311/perfume-studio",
    categories: ["fullstack", "ai"],
    tags: ["React Three Fiber", "Three.js", "Zustand", "PDF.js", "Web Speech", "Swift / iOS", "Vitest"],
    highlights: ["Procedural 3D", "iOS scanner app", "68 test suites"],
    isNew: true,
  },
  {
    id: "publish-ai",
    title: "Publish-AI (Research Agent)",
    description:
      "AI platform automating academic paper editing and publication workflows. Built with Next.js 16, Neon Serverless Postgres, and an Inngest-powered multi-agent system utilizing RAG and GraphRAG.",
    cover: "agent-graph",
    link: "https://publish-ai-nine.vercel.app",
    repo: "https://github.com/Lio311/PublishAI",
    categories: ["fullstack", "ai"],
    tags: ["Next.js 16", "Vercel AI SDK", "Inngest", "pgvector", "RAG"],
  },
  {
    id: "ml_tlv",
    title: "ml-tlv",
    description:
      "Advanced Next.js E-commerce platform featuring a secure shopping cart, interactive 3D product configurators with React Three Fiber, complex GSAP animations, and smart personalized experiences.",
    image: "/images/ml_tlv.png",
    link: "https://ml-tlv.com",
    categories: ["fullstack", "ai"],
    tags: ["Next.js 14", "React Three Fiber", "Nodemailer", "GSAP", "API Integration", "Clerk Auth", "Stripe"],
  },
  {
    id: "libero-wholesale",
    title: "Libero Wholesale",
    description:
      "Modern B2B wholesale platform built with Next.js 16 and Drizzle ORM. Features Neon Serverless PostgreSQL, automated emails, and dynamic PDF generation.",
    image: "/images/libero-wholesale.png",
    link: "https://libero-wholesale.vercel.app",
    categories: ["fullstack"],
    tags: ["Next.js 16", "Drizzle ORM", "Neon DB", "React Email", "Tailwind CSS"],
  },
  {
    id: "kesefly",
    title: "Kesefly",
    description:
      "Comprehensive budget management app with Next.js, Prisma, and PostgreSQL. Features a Hebrew RTL interface, recurring transactions, and optimistic UI updates.",
    image: "/images/kesefly.png",
    link: "https://www.kesefly.co.il/",
    categories: ["fullstack"],
    tags: ["Next.js 14", "TypeScript", "Prisma", "PostgreSQL", "Clerk Auth"],
  },
  {
    id: "libero-management",
    title: "Libero Management (ERP)",
    description:
      "Comprehensive ERP and Business Management platform built with Next.js 16 and Drizzle ORM. Features modules for inventory tracking, order fulfillment, QC, finance, shift scheduling, and marketing operations running on Neon Serverless PostgreSQL.",
    image: "/images/marketing-dashboard.png",
    link: "https://libero-management.vercel.app/",
    categories: ["fullstack"],
    tags: ["Next.js 16", "Drizzle ORM", "Neon DB", "Tailwind CSS", "Clerk Auth"],
  },
  {
    id: "dental-clinic",
    title: "Dental Clinic Management System",
    description:
      "Full-stack clinic management system with React, Firebase, and real-time Firestore synchronization. Custom scheduling engine, automated notifications via EmailJS, and modern RTL-adapted UI.",
    image: "/images/dental-clinic.png",
    link: "https://lior-hadad.web.app/",
    categories: ["fullstack"],
    tags: ["React", "Firebase", "Firestore", "EmailJS", "Shadcn UI"],
  },
  {
    id: "dental-caries",
    title: "Dental Caries Detection",
    description:
      "Deep Learning solution for automated caries detection using YOLOv8-OBB with Transfer Learning. Achieved 97% precision and 88.3% mAP50. Interactive Streamlit interface.",
    image: "/images/dental-carries-detector.png",
    link: "https://dental-carries-detector.streamlit.app/",
    categories: ["ai", "biomedical"],
    tags: ["YOLOv8", "PyTorch", "OpenCV", "Streamlit"],
  },
  {
    id: "fourier-optics",
    title: "Fourier Optics Simulator",
    description:
      "Interactive 2D Spatial Filtering simulator modeling 4f optical systems using NumPy FFT. Demonstrates real-time edge detection and blurring through frequency domain manipulation.",
    image: "/images/fourieropticssimulator.png",
    link: "https://fourier-optics-simulator.vercel.app/",
    categories: ["biomedical"],
    tags: ["NumPy", "FFT", "OpenCV", "Streamlit"],
  },
  {
    id: "portfolio-manager",
    title: "Portfolio Manager",
    description:
      "FinTech dashboard for algorithmic portfolio tracking with yfinance API integration. Real-time market data, P/L calculations, multi-currency FX conversion, and interactive Plotly charts.",
    image: "/images/liostocks.png",
    link: "https://mystocks-liorzafrir.vercel.app/",
    categories: ["fullstack", "ai"],
    tags: ["Python", "yfinance", "Pandas", "Plotly", "Streamlit"],
  },
  {
    id: "rppg-vitals",
    title: "rPPG - Video-Based Vitals Analyzer",
    description:
      "Real-time cardiovascular monitoring using Computer Vision and DSP. Facial detection with OpenCV, Butterworth filtering, FFT/PSD analysis for heart rate, and HRV calculation (RMSSD).",
    image: "/images/rppgvitalsanalyzer.png",
    link: "https://rppgvitalsanalyzer.streamlit.app/",
    categories: ["biomedical", "ai"],
    tags: ["OpenCV", "SciPy", "NumPy", "DSP", "Plotly"],
  },
  {
    id: "gait-analysis",
    title: "Gait Analysis",
    description:
      "Computer Vision biomechanics lab using MediaPipe for markerless pose estimation. Real-time 3D landmark extraction, kinematic calculations, and interactive biomechanical visualization.",
    image: "/images/gaitanalysis3.png",
    link: "https://gaitanalysis3.streamlit.app/",
    categories: ["biomedical", "ai"],
    tags: ["MediaPipe", "OpenCV", "NumPy", "Plotly"],
  },
  {
    id: "ecg-arrhythmia",
    title: "ECG Arrhythmia Simulator",
    description:
      "Interactive cardiac electrophysiology simulator using NeuroKit2 for synthetic ECG generation. Simulates AFib, PVCs, VT, and AV Blocks with dynamic parameter control and real-time visualization.",
    image: "/images/ecgarrhythmiasimulator.png",
    link: "https://ecg-arrhythmia-simulator.vercel.app/",
    categories: ["biomedical"],
    tags: ["NeuroKit2", "Python", "Plotly", "Streamlit"],
  },
  {
    id: "ring-simulator",
    title: "Ring Configuration Simulator",
    description:
      "Procedural 2D rendering engine for gemological configurations using Pillow ImageDraw. Dynamic geometry rendering with 9 stone shapes, metal types, and rule-based pricing model in ILS.",
    image: "/images/ringsimulator.png",
    link: "https://ring-simulator.vercel.app/",
    categories: ["ai"],
    tags: ["Python", "Pillow", "Streamlit"],
  },
  {
    id: "glucose-insulin",
    title: "Glucose-Insulin Minimal Model Simulator",
    description:
      "Systems Biology simulator modeling physiological dynamics through ODEs. Uses SciPy's solve_ivp for numerical solutions with interactive parameter modulation and Plotly visualization.",
    image: "/images/physiosimulator.png",
    link: "https://physio-simulator.vercel.app/",
    categories: ["biomedical"],
    tags: ["SciPy", "ODEs", "NumPy", "Plotly"],
  },
  {
    id: "perfume-generator",
    title: "AI Perfume Description Generator",
    description:
      "AI-powered content generator for SEO-optimized e-commerce descriptions. Multi-step pipeline with Google Custom Search API, BeautifulSoup scraping, and Gemini API for structured generation.",
    image: "/images/perfumegenerator.png",
    link: "https://perfume-generator.vercel.app/",
    categories: ["ai"],
    tags: ["Google Gemini", "BeautifulSoup", "Custom Search API", "Streamlit"],
  },
  {
    id: "watchit",
    title: "WatchIT Medical Device",
    description:
      "Led end-to-end R&D of an Arduino based device for real-time thermal sensing. Executed mechanical design in SolidWorks and iterative prototyping cycles based on direct clinical feedback.",
    cover: "device",
    categories: ["biomedical"],
    tags: ["Embedded C", "Arduino", "SolidWorks", "Prototyping"],
  },
  {
    id: "smarttriage",
    title: "SmartTriage - Multi-Agent ER System",
    description:
      "Architected a 'Council of Experts' Multi-Agent LLM system for automated ER triage. Designed 5 AI agents mimicking a multidisciplinary team, achieving 88.0% accuracy and 96.8% recall across 468 cases.",
    image: "/images/smartriage.png",
    link: "https://smartriagegantt.streamlit.app/",
    categories: ["ai", "biomedical"],
    tags: ["LLMs", "LangGraph", "Python", "Prompt Engineering"],
  },
];
