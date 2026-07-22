import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Project } from "@/lib/projects-data";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="gradient-border-card rounded-2xl overflow-hidden flex flex-col h-full group hover:-translate-y-1.5 transition-all duration-300 shadow-xl shadow-black/40">
      {/* Image Container */}
      <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-zinc-900">
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
      <div className="p-6 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-lg font-bold text-white font-poppins mb-2.5 group-hover:text-indigo-300 transition-colors">
            {project.title}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed mb-6 line-clamp-4">
            {project.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-zinc-800/80">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-zinc-900 text-zinc-300 border border-zinc-800/80 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
