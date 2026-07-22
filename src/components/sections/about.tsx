"use client";

import { useRef } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { Code, Brain, Activity, Layers, GraduationCap, Award } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const skillCategories = [
  {
    title: "Languages & Frameworks",
    icon: Code,
    color: "from-indigo-500 to-blue-500",
    skills: [
      "Python (NumPy, SciPy, Pandas)",
      "JavaScript (React, Next.js, Node.js)",
      "TypeScript",
    ],
  },
  {
    title: "AI & Machine Learning",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    skills: [
      "PyTorch, TensorFlow",
      "YOLOv8, Computer Vision",
      "Google Gemini API",
    ],
  },
  {
    title: "Biomedical Engineering",
    icon: Activity,
    color: "from-cyan-500 to-emerald-500",
    skills: [
      "Signal Processing (DSP)",
      "Medical Device Development",
      "ECG/PPG Analysis & Biomechanics",
    ],
  },
  {
    title: "Full-Stack Development",
    icon: Layers,
    color: "from-amber-500 to-orange-500",
    skills: [
      "PostgreSQL, Firebase, Supabase",
      "Prisma ORM, Drizzle",
      "Vercel & Netlify Deployment",
    ],
  },
];

export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Header Animation
      gsap.fromTo(".about-header",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-header",
            start: "top 85%",
          },
        }
      );

      // Bio Card Animation
      gsap.fromTo(".bio-card",
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".bio-card",
            start: "top 80%",
          },
        }
      );

      // Skills Cards Stagger Animation
      gsap.fromTo(".skill-bento-card",
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".skills-grid-container",
            start: "top 80%",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section id="about" ref={containerRef} className="pt-0 pb-20 bg-zinc-950/60 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="about-header">
          <SectionHeader
            badge="Background & Expertise"
            title="About Me"
            subtitle="Final-year Biomedical Engineering student at Tel Aviv University bridging technical innovation and clinical impact."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Bio Card */}
          <div className="bio-card lg:col-span-5 gradient-border-card p-8 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-poppins">Lior Zafrir</h3>
                <p className="text-sm text-indigo-400">Tel Aviv University</p>
              </div>
            </div>

            <div className="space-y-4 text-zinc-300 text-sm sm:text-base leading-relaxed font-light">
              <p>
                Final-year <strong className="text-white font-medium">Biomedical Engineering student</strong> at Tel Aviv University with hands-on experience in medical device development, signal processing, and product design.
              </p>
              <p>
                Demonstrated analytical and leadership skills through leading a multidisciplinary medical device project at <strong className="text-white font-medium">Beilinson Hospital</strong>.
              </p>
              <p>
                Proficient in <strong className="text-indigo-300 font-medium">Python, JavaScript, React, Next.js</strong>, and modern AI/ML frameworks for healthcare and commercial applications.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Award className="w-4 h-4 text-indigo-400" />
                <span>Tel Aviv University</span>
              </div>
              <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                B.Sc. candidate
              </span>
            </div>
          </div>

          {/* Right Skills Bento Grid */}
          <div className="skills-grid-container lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skillCategories.map((cat) => {
              const IconComp = cat.icon;
              return (
                <div
                  key={cat.title}
                  className="skill-bento-card gradient-border-card p-6 rounded-2xl group hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center gap-3.5 mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${cat.color} p-[1px]`}
                    >
                      <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center">
                        <IconComp className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <h4 className="text-base font-bold text-white font-poppins group-hover:text-indigo-300 transition-colors">
                      {cat.title}
                    </h4>
                  </div>

                  <ul className="space-y-2">
                    {cat.skills.map((skill) => (
                      <li
                        key={skill}
                        className="text-xs sm:text-sm text-zinc-400 flex items-center gap-2 font-light"
                      >
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
