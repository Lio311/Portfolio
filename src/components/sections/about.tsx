"use client";

import { useRef } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { Code, Brain, Activity, Layers, Award } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

type SkillKey = "web" | "ai" | "backend" | "dl";

const skillCategories: { key: SkillKey; title: string; icon: typeof Code; color: string; skills: string[] }[] = [
  {
    key: "web",
    title: "Languages & Web",
    icon: Code,
    color: "from-indigo-500 to-blue-500",
    skills: ["TypeScript, JavaScript, Python", "React 19, Next.js 16, Node.js", "Three.js / React Three Fiber, Tailwind CSS"],
  },
  {
    key: "ai",
    title: "AI & LLM",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    skills: ["Claude API (structured output), LangGraph, Vercel AI SDK", "RAG, Vector DBs (pgvector), GraphRAG", "Multi-Agent Systems (Swarm)"],
  },
  {
    key: "backend",
    title: "Backend, Data & Automation",
    icon: Layers,
    color: "from-amber-500 to-orange-500",
    skills: ["PostgreSQL, Neon, Drizzle ORM, Inngest", "Scraping: Playwright, Cheerio, Apify", "GitHub Actions cron pipelines, Vercel"],
  },
  {
    key: "dl",
    title: "Deep Learning & Vision",
    icon: Activity,
    color: "from-cyan-500 to-emerald-500",
    skills: ["PyTorch, YOLOv8", "Computer Vision", "Signal Processing"],
  },
];

// From the CV. Each stop lights up the skill cards it built.
const journey: { when: string; title: string; text: string; tags: string[]; lights: SkillKey[] }[] = [
  {
    when: "2016–2020",
    title: "Medical Organization Officer · IDF",
    text: "Four years of military service as a medical organization officer. Alongside it, web developer and graphic designer at Combar (2017–2018).",
    tags: ["Organization", "HTML / CSS / JS", "Photoshop"],
    lights: ["web"],
  },
  {
    when: "2022",
    title: "B.Sc. Biomedical Engineering · TAU",
    text: "Started the degree at Tel Aviv University: signal and image processing, deep learning, tissue engineering. Joined Libero as business developer, where I drove 75% sales growth.",
    tags: ["Signal Processing", "Image Processing", "MATLAB"],
    lights: ["dl"],
  },
  {
    when: "During the degree",
    title: "Deep learning & medical devices",
    text: "YOLOv8 caries detection trained on 2,706 X-rays (97% precision), the WatchIT thermal-sensing wearable in embedded C and SolidWorks, and rPPG and ECG signal tools.",
    tags: ["YOLOv8", "PyTorch", "Embedded C", "DSP"],
    lights: ["dl", "web"],
  },
  {
    when: "2025",
    title: "Full-stack SaaS in production",
    text: "Built Kesefly, a financial SaaS, from architecture to deployment and cut operational overhead by about 40% with automation. Then Libero's ERP and its B2B wholesale store.",
    tags: ["Next.js", "Postgres", "Server Actions", "Automation"],
    lights: ["web", "backend"],
  },
  {
    when: "2026",
    title: "AI agents & autonomous bots",
    text: "Final project: a multi-agent ER triage system with 96.8% recall. PublishAI's 14-agent research platform, three bots that run themselves on cron, and data operations at Leumi Partners.",
    tags: ["Multi-Agent", "LangGraph", "Claude API", "GitHub Actions"],
    lights: ["ai", "backend"],
  },
];

const INTRO_END = 0.12;

/** Shows the journey stop for scroll progress `p`: the intro first, then one stop per slice. */
function applyJourney(stage: HTMLElement, p: number) {
  const stop = p < INTRO_END ? -1 : Math.min(journey.length - 1, Math.floor(((p - INTRO_END) / (1 - INTRO_END)) * journey.length));
  stage.querySelectorAll<HTMLElement>(".journey-panel").forEach((el, i) => (el.dataset.on = String(i === stop + 1)));
  stage.querySelectorAll<HTMLElement>(".journey-node").forEach((el, i) => {
    el.dataset.on = String(i <= stop);
    el.classList.toggle("is-current", i === stop);
  });
  const fill = stage.querySelector<HTMLElement>(".journey-fill");
  if (fill) fill.style.transform = `scaleX(${stop < 0 ? 0 : stop / (journey.length - 1)})`;
  const lit = stop < 0 ? null : new Set(journey[stop].lights);
  stage.querySelectorAll<HTMLElement>(".skill-bento-card").forEach((el) => {
    el.dataset.lit = lit === null ? "all" : String(lit.has(el.dataset.skill as SkillKey));
  });
}

export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(".about-header", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".about-header", start: "top 85%" } });
      gsap.fromTo(".bio-card", { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: ".bio-card", start: "top 80%" } });
      gsap.fromTo(
        ".skill-bento-card",
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: ".skills-grid-container", start: "top 80%" } }
      );

      // The journey is scroll-driven where the two columns sit side by side and fit on screen
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (min-height: 820px) and (prefers-reduced-motion: no-preference)", () => {
        const stage = stageRef.current;
        if (!stage) return;
        stage.classList.add("is-scrubbed");
        const st = ScrollTrigger.create({
          trigger: stage,
          start: "top top+=96",
          end: "+=1800",
          pin: true,
          scrub: true,
          onUpdate: (self) => applyJourney(stage, self.progress),
        });
        applyJourney(stage, st.progress);
        return () => stage.classList.remove("is-scrubbed");
      });
    },
    { scope: containerRef }
  );

  return (
    <section id="about" ref={containerRef} className="pt-0 pb-20 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="about-header">
          <SectionHeader badge="Background & Expertise" title="About Me" subtitle="From signal processing in the lab to autonomous agents in production." />
        </div>

        <div ref={stageRef} className="about-stage grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Bio + journey */}
          <div className="bio-card lg:col-span-5 gradient-border-card p-7 rounded-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-poppins">Lior Zafrir</h3>
                <p className="text-sm text-indigo-400">AI Engineer</p>
              </div>
            </div>

            {/* Timeline rail (scroll-driven layout only) */}
            <div className="journey-rail relative mb-6" aria-hidden="true">
              <div className="absolute top-[7px] left-[7px] right-[7px] h-px bg-zinc-800">
                <div className="journey-fill h-full origin-left bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" style={{ transform: "scaleX(0)" }} />
              </div>
              <ol className="relative flex justify-between">
                {journey.map((j) => (
                  <li key={j.title} data-on="false" className="journey-node flex flex-col items-center gap-2 w-0">
                    <span className="journey-dot w-[15px] h-[15px] rounded-full border-2 border-zinc-700 bg-zinc-950" />
                    <span className="journey-year text-[10px] font-mono text-zinc-500 whitespace-nowrap">{j.when === "During the degree" ? "B.Sc." : j.when.slice(0, 4)}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="journey-stack">
              <div data-on="true" className="journey-panel space-y-4 text-zinc-300 text-sm sm:text-base leading-relaxed font-light">
                <p>
                  <strong className="text-white font-medium">AI Engineer and Biomedical Engineering graduate</strong> dedicated to building high-impact SaaS and agentic AI platforms.
                </p>
                <p>
                  Demonstrated success in translating complex research into scalable software, architecting systems like a <strong className="text-white font-medium">Multi-Agent AI Decision System</strong> and Research Agents for publication workflows.
                </p>
                <p className="journey-hint text-xs font-mono text-indigo-300/80">scroll to walk through the path ↓</p>
              </div>
              {journey.map((j) => (
                <div key={j.title} data-on="true" className="journey-panel">
                  <p className="text-[11px] font-mono uppercase tracking-widest text-indigo-300 mb-1.5">{j.when}</p>
                  <h4 className="text-lg font-bold text-white font-poppins mb-2">{j.title}</h4>
                  <p className="text-sm text-zinc-300 leading-relaxed font-light mb-3">{j.text}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {j.tags.map((t) => (
                      <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Award className="w-4 h-4 text-indigo-400" />
                <span>Tel Aviv University</span>
              </div>
              <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">B.Sc. Graduate</span>
            </div>
          </div>

          {/* Skills bento */}
          <div className="skills-grid-container lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skillCategories.map((cat) => {
              const IconComp = cat.icon;
              return (
                <div key={cat.title} data-skill={cat.key} data-lit="all" className="skill-bento-card gradient-border-card p-6 rounded-2xl group">
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${cat.color} p-[1px]`}>
                      <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center">
                        <IconComp className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <h4 className="text-base font-bold text-white font-poppins group-hover:text-indigo-300 transition-colors">{cat.title}</h4>
                  </div>
                  <ul className="space-y-2">
                    {cat.skills.map((skill) => (
                      <li key={skill} className="text-xs sm:text-sm text-zinc-400 flex items-center gap-2 font-light">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/60" />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
