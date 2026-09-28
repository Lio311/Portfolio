"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Project } from "@/lib/projects-data";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React from "react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="gradient-border-card relative rounded-2xl overflow-hidden flex flex-col h-full group hover:-translate-y-1.5 transition-all duration-300 shadow-xl shadow-black/40 bg-zinc-950/40 backdrop-blur-md border border-white/10"
    >
      {/* Image Container */}
      <div 
        className="relative w-full h-48 sm:h-52 overflow-hidden bg-zinc-900/50"
        style={{ transform: "translateZ(40px)" }}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 flex items-center justify-center">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-indigo-600/90 text-white flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow-lg shadow-indigo-600/50 hover:bg-indigo-500"
            aria-label={`View ${project.title}`}
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Content Container */}
      <div 
        className="p-6 flex flex-col flex-grow justify-between"
        style={{ transform: "translateZ(30px)" }}
      >
        <div>
          <h3 className="text-lg font-bold text-white font-poppins mb-2.5 group-hover:text-indigo-300 transition-colors">
            {project.title}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed mb-6 line-clamp-5">
            {project.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-zinc-800/80">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/5 backdrop-blur-sm text-zinc-300 border border-white/10 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
