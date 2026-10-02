"use client";

import Image from "next/image";
import { ArrowUpRight, Lock } from "lucide-react";
import { Project } from "@/lib/projects-data";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React from "react";
import { GithubIcon } from "@/components/ui/icons";
import { ProjectCover } from "@/components/ui/project-cover";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-4deg", "4deg"]);

  // Spotlight that follows the pointer across the card
  const glowX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);
  const spotlight = useTransform(
    [glowX, glowY],
    ([gx, gy]) => `radial-gradient(420px circle at ${gx} ${gy}, rgba(129,140,248,0.12), transparent 60%)`
  );

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  // The whole card opens the live app, or the code when the app is private.
  const primaryHref = project.link ?? project.repo;

  return (
    <motion.div
      // Inline transition beats .gradient-border-card's `transition: all`, which would also ease
      // the spring-driven tilt and make the card lag, then snap
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", transition: "box-shadow 0.3s ease" }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="gradient-border-card relative rounded-2xl overflow-hidden flex flex-col h-full group transition-shadow duration-300 shadow-xl shadow-black/40 bg-zinc-950/40 backdrop-blur-md border border-white/10 hover:shadow-indigo-900/30 focus-within:ring-2 focus-within:ring-indigo-500/70"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: spotlight }}
      />

      {/* Media */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-zinc-900/50">
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} screenshot`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : project.cover ? (
          <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500">
            <ProjectCover kind={project.cover} />
          </div>
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent pointer-events-none" />
        {primaryHref && (
          // Mouse/touch target for the image; keyboard users get the title link
          <a href={primaryHref} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true" className="absolute inset-0" />
        )}

        <div className="absolute top-3 left-3 flex gap-1.5 pointer-events-none">
          {project.isNew && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-lg">
              New
            </span>
          )}
          {project.categories.includes("automation") && (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 rounded-md bg-black/60 text-emerald-300 border border-emerald-500/30 backdrop-blur">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              cron · autonomous
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-white font-poppins mb-2.5 group-hover:text-indigo-300 transition-colors">
          {primaryHref ? (
            <a
              href={primaryHref}
              target="_blank"
              rel="noopener noreferrer"
              className="outline-none after:absolute after:inset-0 after:content-['']"
            >
              {project.title}
            </a>
          ) : (
            project.title
          )}
        </h3>
        <p className="text-sm text-zinc-300 font-light leading-relaxed mb-4 line-clamp-5">
          {project.description}
        </p>

        {project.highlights && (
          <ul className="flex flex-wrap gap-x-3 gap-y-1 mb-4" aria-label="Highlights">
            {project.highlights.map((h) => (
              <li key={h} className="text-xs text-indigo-300 font-medium flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-indigo-400" />
                {h}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-1.5 pt-4 mt-auto border-t border-zinc-800/80">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/5 text-zinc-300 border border-white/10 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions sit above the stretched title link */}
        {(project.link || project.repo) && (
          <div className="relative z-20 flex items-center gap-2 mt-4">
            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600/90 hover:bg-indigo-500 text-white transition-colors"
              >
                Live <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-800" title="Private dashboard behind a passcode">
                <Lock className="w-3.5 h-3.5" /> Private app
              </span>
            )}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" /> Code
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
