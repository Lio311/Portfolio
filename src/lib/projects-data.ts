export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  categories: ("fullstack" | "ai" | "biomedical")[];
  tags: string[];
}

export const projectsData: Project[] = [
  {
    id: "marketing-dashboard",
    title: "Marketing Dashboard",
    description:
      "End-to-end Marketing Operations platform built with React and Vite, running on Supabase backend with PostgreSQL. Features influencer collaboration management, campaign planning, and banner scheduling with modern glassmorphic UI.",
    image: "/images/marketing-dashboard.png",
    link: "https://libero-perfume.netlify.app/",
    categories: ["fullstack"],
    tags: ["React", "Vite", "Supabase", "PostgreSQL", "Tailwind CSS"],
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
      "Deep Learning solution for automated caries detection using YOLOv8-OBB with Transfer Learning. Achieved 86.2% precision and 75.7% recall with interactive Streamlit interface and real-time OpenCV annotation.",
    image: "/images/dental-carries-detector.png",
    link: "https://dental-carries-detector.streamlit.app/",
    categories: ["ai", "biomedical"],
    tags: ["YOLOv8", "PyTorch", "OpenCV", "Streamlit"],
  },
  {
    id: "keseflow",
    title: "Keseflow - Budget Manager",
    description:
      "Comprehensive budget management app with Next.js 14, TypeScript, Prisma ORM, and PostgreSQL. Features Hebrew-first RTL interface, recurring transactions, calendar integration, and optimistic UI updates.",
    image: "/images/budget-manager.png",
    link: "https://www.keseflow.com/",
    categories: ["fullstack"],
    tags: ["Next.js 14", "TypeScript", "Prisma", "PostgreSQL", "Clerk Auth"],
  },
  {
    id: "fourier-optics",
    title: "Fourier Optics Simulator",
    description:
      "Interactive 2D Spatial Filtering simulator modeling 4f optical systems using NumPy FFT. Demonstrates real-time edge detection and blurring through frequency domain manipulation.",
    image: "/images/fourieropticssimulator.png",
    link: "https://fourieropticssimulator.streamlit.app/",
    categories: ["biomedical"],
    tags: ["NumPy", "FFT", "OpenCV", "Streamlit"],
  },
  {
    id: "portfolio-manager",
    title: "Portfolio Manager",
    description:
      "FinTech dashboard for algorithmic portfolio tracking with yfinance API integration. Real-time market data, P/L calculations, multi-currency FX conversion, and interactive Plotly charts.",
    image: "/images/liostocks.png",
    link: "https://liostocks.streamlit.app/",
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
    link: "https://ecgarrhythmiasimulator.streamlit.app/",
    categories: ["biomedical"],
    tags: ["NeuroKit2", "Python", "Plotly", "Streamlit"],
  },
  {
    id: "ring-simulator",
    title: "Ring Configuration Simulator",
    description:
      "Procedural 2D rendering engine for gemological configurations using Pillow ImageDraw. Dynamic geometry rendering with 9 stone shapes, metal types, and rule-based pricing model in ILS.",
    image: "/images/ringsimulator.png",
    link: "https://ringsimulator.streamlit.app/",
    categories: ["ai"],
    tags: ["Python", "Pillow", "Streamlit"],
  },
  {
    id: "glucose-insulin",
    title: "Glucose-Insulin Minimal Model Simulator",
    description:
      "Systems Biology simulator modeling physiological dynamics through ODEs. Uses SciPy's solve_ivp for numerical solutions with interactive parameter modulation and Plotly visualization.",
    image: "/images/physiosimulator.png",
    link: "https://physiosimulator.streamlit.app/",
    categories: ["biomedical"],
    tags: ["SciPy", "ODEs", "NumPy", "Plotly"],
  },
  {
    id: "perfume-generator",
    title: "AI Perfume Description Generator",
    description:
      "AI-powered content generator for SEO-optimized e-commerce descriptions. Multi-step pipeline with Google Custom Search API, BeautifulSoup scraping, and Gemini API for structured generation.",
    image: "/images/perfumegenerator.png",
    link: "https://perfumegenerator.streamlit.app/",
    categories: ["ai"],
    tags: ["Google Gemini", "BeautifulSoup", "Custom Search API", "Streamlit"],
  },
  {
    id: "smarttriage",
    title: "SmartTriage - AI Agent Project Gantt",
    description:
      "Dynamic project management dashboard with Pandas data pipeline and interactive Gantt charts. Features automatic progress calculation, color-coded timelines, and custom CSS-styled UI with date filtering.",
    image: "/images/smartriage.png",
    link: "https://smartriagegantt.streamlit.app/",
    categories: ["ai"],
    tags: ["Pandas", "Plotly", "Excel Integration", "Streamlit"],
  },
];
