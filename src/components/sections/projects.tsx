"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { ProjectCard } from "@/components/ui/project-card";
import { projectsData } from "@/lib/projects-data";

type FilterCategory = "all" | "fullstack" | "ai" | "biomedical";

const filterOptions: { label: string; value: FilterCategory }[] = [
  { label: "All Projects", value: "all" },
  { label: "Full-Stack", value: "fullstack" },
  { label: "AI & ML", value: "ai" },
  { label: "Biomedical", value: "biomedical" },
];

export function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");

  const filteredProjects = projectsData.filter((project) => {
    if (activeFilter === "all") return true;
    return project.categories.includes(activeFilter);
  });

  return (
    <section id="projects" className="py-24 bg-zinc-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Portfolio Showcase"
          title="Featured Projects"
          subtitle="Explore 13 engineering solutions across Biomedical Engineering, AI/ML, and Full-Stack web platforms."
        />

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
