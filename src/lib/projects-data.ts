export type ProjectCategory = "automation" | "fullstack" | "ai" | "biomedical";

/** Code-drawn covers for projects without a public screenshot (see ui/project-cover.tsx). */
export type CoverKind = "device";

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
    image: "/images/libero-bot.jpg",
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
    image: "/images/jobot.jpg",
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
    title: "PublishAI (Multi-Agent Research Platform)",
    description:
      "SaaS that takes an academic paper from Word/PDF to journal-ready: 14 specialised agents (planning, scientific review, QA, cover letter, rebuttal) orchestrated with LangGraph and Inngest, track-changes review UI, GraphRAG consistency checks, sandboxed code execution, and auto-submission to journals through custom MCP servers.",
    image: "/images/publish-ai.jpg",
    link: "https://publish-ai-nine.vercel.app",
    repo: "https://github.com/Lio311/PublishAI",
    categories: ["ai", "fullstack"],
    tags: ["LangGraph", "Inngest", "MCP", "Claude + OpenAI + Gemini", "pgvector", "E2B", "Langfuse", "Next.js 16"],
    highlights: ["14 AI agents", "447 commits", "Own MCP servers"],
  },
  {
    id: "kesefly",
    title: "Kesefly (Personal & Business Finance SaaS)",
    description:
      "Production Hebrew-first finance platform with personal and business modes: budgets, debts and savings goals, clients and suppliers, invoices, quotes and credit notes with digitally signed PDFs, VAT handling, Excel import, PayPal subscriptions and AI insights. Optimistic UI over server actions, installable as a PWA.",
    image: "/images/kesefly.jpg",
    link: "https://www.kesefly.co.il",
    repo: "https://github.com/Lio311/budget-manager-plus",
    categories: ["fullstack", "ai"],
    tags: ["Next.js", "Prisma", "Neon", "Clerk", "PayPal", "Gemini", "PDF signing", "PWA"],
    highlights: ["2,300+ commits", "Live product", "Signed PDF invoices"],
  },
  {
    id: "libero-management",
    title: "Libero Management (ERP)",
    description:
      "The internal ERP that runs a perfume company day to day: inventory and shortages, production and QC, shipping labels with a QR scanner and remote printing, coupons and marketing, shift scheduling with a Hebrew calendar, and a finance area behind TOTP two-factor auth. Push notifications and generated PDFs throughout.",
    image: "/images/marketing-dashboard.png",
    link: "https://libero-management.vercel.app/login",
    repo: "https://github.com/Lio311/libero-management",
    categories: ["fullstack"],
    tags: ["Next.js 16", "Drizzle", "Neon", "Clerk", "TOTP 2FA", "Web Push", "QR scanning", "Puppeteer"],
    highlights: ["800+ commits", "15+ business modules", "In production"],
  },
  {
    id: "libero-wholesale",
    title: "Libero Wholesale (B2B Store)",
    description:
      "B2B ordering portal for the company's wholesale customers: catalog with live inventory sync, cart and checkout, order history, an admin area, branded order emails and generated PDF and Excel order documents.",
    image: "/images/libero-wholesale.png",
    link: "https://www.libero-wholesale.co.il/sign-in",
    repo: "https://github.com/Lio311/libero-wholesale",
    categories: ["fullstack"],
    tags: ["Next.js 16", "Drizzle", "Neon", "Clerk", "React Email", "React-PDF", "Zustand"],
    highlights: ["In production", "Inventory sync", "PDF + Excel orders"],
  },
  {
    id: "smarttriage",
    title: "SmartTriage (Multi-Agent ER Triage)",
    description:
      "Final project: a 'council of experts' multi-agent LLM system for emergency-room triage, where 5 agents mirror a multidisciplinary team and reach a joint decision. 88.0% accuracy, 87.3% F1 and 96.8% recall on 468 cases. The linked app is the Gantt dashboard I built to run the project timeline.",
    image: "/images/smartriage.png",
    repo: "https://github.com/Lio311/SmarTriageGantt",
    categories: ["ai", "biomedical"],
    tags: ["LLMs", "Multi-Agent", "LangGraph", "Python", "Prompt Engineering"],
    highlights: ["96.8% recall", "468 cases", "5 agents"],
  },
  {
    id: "dental-caries",
    title: "Dental Caries Detection",
    description:
      "YOLOv8 detector for caries in dental X-rays, trained with transfer learning (97% precision, 88.3% mAP50). The model is exported to ONNX and now runs entirely in the browser with ONNX Runtime Web, so X-rays never leave the user's device.",
    image: "/images/dental-carries-detector.png",
    link: "https://dental-carries-detector.vercel.app",
    repo: "https://github.com/Lio311/Dental-Carries-Detector",
    categories: ["ai", "biomedical"],
    tags: ["YOLOv8", "PyTorch", "ONNX Runtime Web", "Transfer Learning", "Next.js"],
    highlights: ["97% precision", "In-browser inference", "Private by design"],
  },
  {
    id: "rppg-vitals",
    title: "rPPG Vitals from Video",
    description:
      "Contactless heart-rate and HRV measurement from a face video: facial region tracking with OpenCV, Butterworth band-pass filtering, peak detection and FFT/PSD analysis for BPM and RMSSD.",
    image: "/images/rppgvitalsanalyzer.png",
    repo: "https://github.com/Lio311/rPPG-Vitals-Analyzer",
    categories: ["biomedical", "ai"],
    tags: ["OpenCV", "SciPy", "DSP", "FFT", "MediaPipe"],
    highlights: ["Contactless", "BPM + HRV"],
  },
  {
    id: "gait-analysis",
    title: "Gait Analysis",
    description:
      "Markerless biomechanics lab: pose landmarks from ordinary video, joint-angle kinematics and knee-angle curves for each leg, with interactive plots for comparing gait cycles.",
    image: "/images/gaitanalysis3.png",
    repo: "https://github.com/Lio311/Gait-Analysis",
    categories: ["biomedical", "ai"],
    tags: ["MediaPipe Pose", "OpenCV", "NumPy", "Biomechanics"],
    highlights: ["No markers", "Joint kinematics"],
  },
  {
    id: "ml_tlv",
    title: "ml-tlv (E-commerce)",
    description:
      "Perfume e-commerce storefront: secure cart and Stripe checkout, Clerk accounts, an interactive 3D product configurator in React Three Fiber, GSAP animations and transactional email. The site is currently being redesigned.",
    image: "/images/ml_tlv.png",
    link: "https://www.ml-tlv.com",
    categories: ["fullstack"],
    tags: ["Next.js", "React Three Fiber", "GSAP", "Stripe", "Clerk", "Nodemailer"],
  },
  {
    id: "dental-clinic",
    title: "Dental Clinic Management",
    description:
      "Clinic system for a working dental practice: appointment scheduling engine, patient and treatment records synced in real time with Firestore, automated email reminders and an RTL admin dashboard.",
    image: "/images/dental-clinic.png",
    link: "https://lior-hadad.web.app",
    categories: ["fullstack"],
    tags: ["React", "Firebase", "Firestore", "EmailJS", "shadcn/ui"],
    highlights: ["Real-time sync", "Live clinic site"],
  },
  {
    id: "fourier-optics",
    title: "Fourier Optics Simulator",
    description:
      "Interactive 4f optical system: upload any image, see its 2D Fourier spectrum, apply low-, high- or band-pass masks in the frequency plane and watch edge detection or blur happen. The 2D FFT runs in the browser.",
    image: "/images/fourier-optics.jpg",
    link: "https://fourier-optics-simulator.vercel.app",
    repo: "https://github.com/Lio311/Fourier-Optics-Simulator",
    categories: ["biomedical"],
    tags: ["2D FFT", "fft.js", "Canvas", "Signal Processing", "Next.js"],
  },
  {
    id: "ecg-arrhythmia",
    title: "ECG Arrhythmia Simulator",
    description:
      "Teaching simulator that synthesises ECG traces for normal rhythm and arrhythmias such as AFib, flutter, SVT, VT, VF and AV blocks, with live heart-rate and duration controls and a clinical note for each rhythm.",
    image: "/images/ecg-simulator.jpg",
    link: "https://ecg-arrhythmia-simulator.vercel.app",
    repo: "https://github.com/Lio311/ECG-Arrhythmia-Simulator",
    categories: ["biomedical"],
    tags: ["Next.js", "Chart.js", "Signal Synthesis", "Cardiology"],
  },
  {
    id: "glucose-insulin",
    title: "Glucose-Insulin Simulator",
    description:
      "Real-time Bergman minimal model: the ODEs are integrated step by step in the browser while you feed meals and inject insulin, and glucose and insulin curves respond live on a dual-axis chart.",
    image: "/images/physio-simulator.jpg",
    link: "https://physio-simulator.vercel.app",
    repo: "https://github.com/Lio311/Physio-Simulator",
    categories: ["biomedical"],
    tags: ["ODEs", "Bergman Model", "Chart.js", "Next.js"],
  },
  {
    id: "portfolio-manager",
    title: "Stock Portfolio Tracker",
    description:
      "Personal investment dashboard: holdings with live prices, profit and loss per position, USD/ILS conversion and allocation and performance charts.",
    image: "/images/liostocks.png",
    link: "https://mystocks-liorzafrir.vercel.app",
    repo: "https://github.com/Lio311/Stocks",
    categories: ["fullstack"],
    tags: ["Next.js", "Chart.js", "FX API", "Excel export"],
  },
  {
    id: "ring-simulator",
    title: "Ring Designer",
    description:
      "Jewellery configurator that renders a ring live as you pick stone shape, carat, metal and setting style, with rule-based pricing in ILS.",
    image: "/images/ring-simulator.jpg",
    link: "https://ring-simulator.vercel.app",
    repo: "https://github.com/Lio311/Ring-Simulator",
    categories: ["fullstack"],
    tags: ["Next.js", "Procedural rendering", "GSAP"],
  },
  {
    id: "perfume-generator",
    title: "AI Perfume Description Generator",
    description:
      "Generates SEO-ready Hebrew product descriptions for perfumes from a few notes about the scent, using Google Gemini with structured prompts, ready to paste into an e-commerce store.",
    image: "/images/perfume-generator.jpg",
    link: "https://perfume-generator.vercel.app",
    repo: "https://github.com/Lio311/perfume_generator",
    categories: ["ai"],
    tags: ["Google Gemini", "Prompt Engineering", "Next.js", "RTL"],
  },
  {
    id: "watchit",
    title: "WatchIT Medical Device",
    description:
      "Led end-to-end R&D of an Arduino-based wearable for real-time thermal sensing: embedded C firmware, mechanical design in SolidWorks, and prototyping cycles driven by direct clinical feedback.",
    cover: "device",
    categories: ["biomedical"],
    tags: ["Embedded C", "Arduino", "SolidWorks", "Prototyping"],
  },
];
