import { Mail } from "lucide-react";
import { Github, Linkedin } from "@/components/icons";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-zinc-950 border-t border-zinc-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <span className="gradient-text font-bold text-xs">LZ</span>
            </div>
            <p className="text-sm text-zinc-400">
              © {currentYear} Lior Zafrir. All rights reserved.
            </p>
          </div>

          {/* Center text */}
          <p className="text-xs text-zinc-500 text-center">
            Built with Next.js 15, Tailwind CSS, shadcn/ui & GSAP. Deployed on Vercel.
          </p>

          {/* Right social links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Lio311"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 transition-all"
              aria-label="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com/in/liorzafrir"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 transition-all"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:lior31197@gmail.com"
              className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 transition-all"
              aria-label="Send Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
