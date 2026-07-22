"use client";

import { useState, useRef } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { ProjectCard } from "@/components/ui/project-card";
import { projectsData } from "@/lib/projects-data";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type FilterCategory = "all" | "fullstack" | "ai" | "biomedical";

const filterOptions: { label: string; value: FilterCategory }[] = [
  { label: "All Projects", value: "all" },
  { label: "Full-Stack", value: "fullstack" },
  { label: "AI & ML", value: "ai" },
  { label: "Biomedical", value: "biomedical" },
];

export function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredProjects = projectsData.filter((project) => {
    if (activeFilter === "all") return true;
    return project.categories.includes(activeFilter);
  });

  useGSAP(
    () => {
      // Header Animation
      gsap.from(".projects-header", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".projects-header",
          start: "top 85%",
        },
      });

      // Filter Buttons Animation
      gsap.from(".filter-buttons-container", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".filter-buttons-container",
          start: "top 85%",
        },
      });

      // Grid Cards Stagger Animation on Scroll
      gsap.from(".project-card-wrapper", {
        y: 60,
        opacity: 0,
        scale: 0.96,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".projects-grid",
          start: "top 80%",
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section id="projects" ref={containerRef} className="py-20 bg-zinc-950 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="projects-header">
          <SectionHeader
            badge="Portfolio Showcase"
            title="Featured Projects"
            subtitle="Explore 13 engineering solutions across Biomedical Engineering, AI/ML, and Full-Stack web platforms."
          />
        </div>

        {/* Filter Buttons */}
        <div className="filter-buttons-container flex flex-wrap items-center justify-center gap-2 mb-12">
          {filterOptions.map((opt) => {
            const count =
              opt.value === "all"
                ? projectsData.length
                : projectsData.filter((p) =>
                    p.categories.includes(opt.value as "fullstack" | "ai" | "biomedical")
                  ).length;

            return (
              <button
                key={opt.value}
                onClick={() => setActiveFilter(opt.value)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                  activeFilter === opt.value
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-105"
                    : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700"
                }`}
              >
                {opt.label}
                <span className="ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-black/40 text-zinc-300">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project) => (
            <div key={project.id} className="project-card-wrapper h-full">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
