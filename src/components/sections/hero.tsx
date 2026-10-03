"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { ArrowRight, ChevronDown, Sparkles, Code2, Bot, Download, Activity } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { scrollToId } from "@/lib/scroll";
import { projectsData } from "@/lib/projects-data";

// Dynamically import the 3D background so it doesn't break SSR
const Hero3DBackground = dynamic(() => import("../3d/hero-model"), {
  ssr: false,
});

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Framer Motion Variants for Aggressive Modern Typography
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      // Drop the filter afterwards: a lingering blur(0px) layer paints a box over the WebGL canvas
      transitionEnd: { filter: "none" },
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        mass: 0.5,
      },
    },
  };

  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 15,
      },
    },
  };

  const titleText = "Lior Zafrir";

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-10 overflow-hidden scroll-mt-20"
    >
      {/* 3D Interactive Background */}
      <Hero3DBackground />

      {/* Soft veil so the copy stays readable over the orbiting icons */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: "radial-gradient(ellipse 55% 45% at 50% 52%, rgba(9,9,11,0.72), rgba(9,9,11,0.25) 60%, transparent 80%)" }}
      />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center pointer-events-none">
        <motion.div 
          className="flex flex-col items-center w-full pointer-events-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow Badge */}
          <motion.button
            type="button"
            variants={itemVariants}
            onClick={() => scrollToId("bots")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-800 hover:border-indigo-500/60 backdrop-blur-md mb-6 shadow-sm transition-colors"
          >
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-zinc-300">
              New: 3 autonomous bots running in production
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
          </motion.button>

          {/* Main Title */}
          <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter font-poppins mb-6 uppercase">
            <span className="block text-zinc-400 text-xl sm:text-2xl font-semibold mb-2 font-inter tracking-widest uppercase">
              Hi, I&apos;m
            </span>
            <span className="flex justify-center overflow-hidden py-2 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              {titleText.split("").map((char, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className={char === " " ? "mr-4" : "inline-block gradient-text"}
                  style={{ display: "inline-block" }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={itemVariants} className="text-lg sm:text-2xl font-bold text-zinc-200 mb-6 max-w-3xl leading-relaxed tracking-wide">
            AI Engineer <span className="text-indigo-400 mx-2">|</span> Full-Stack Developer <span className="text-purple-400 mx-2">|</span> Biomedical Engineer
          </motion.p>

          {/* Description */}
          <motion.p variants={itemVariants} className="text-base sm:text-lg text-zinc-400 max-w-2xl mb-10 leading-relaxed font-light">
            I build software that works on its own: LLM agents, scraping bots that run on a schedule, real-time 3D web apps, and the full-stack platforms behind them.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 w-full mb-12">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("projects");
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:-translate-y-1"
            >
              <span>View My Work</span>
              <ArrowRight className="w-5 h-5" />
            </a>

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("contact");
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-zinc-200 bg-zinc-900/80 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/80 hover:text-white transition-all duration-300 backdrop-blur-sm"
            >
              Get In Touch
            </a>

            <a
              href="/lior-zafrir-cv.pdf"
              download="Lior Zafrir - CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-zinc-200 bg-zinc-900/80 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/80 hover:text-white transition-all duration-300 backdrop-blur-sm group"
            >
              <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
              <span>Download CV</span>
            </a>
          </motion.div>

          {/* Quick Highlight Badges */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-12">
            <div className="glass-card p-4 rounded-xl flex items-center justify-center gap-3 hover:scale-105 transition-transform duration-300 border border-zinc-800 hover:border-indigo-500/50 bg-zinc-900/50 backdrop-blur-sm">
              <Bot className="w-5 h-5 text-indigo-400" />
              <span className="text-xs sm:text-sm font-bold text-zinc-200 uppercase tracking-wider">AI Agents & Bots</span>
            </div>
            <div className="glass-card p-4 rounded-xl flex items-center justify-center gap-3 hover:scale-105 transition-transform duration-300 border border-zinc-800 hover:border-purple-500/50 bg-zinc-900/50 backdrop-blur-sm">
              <Code2 className="w-5 h-5 text-purple-400" />
              <span className="text-xs sm:text-sm font-bold text-zinc-200 uppercase tracking-wider">Full-Stack & 3D</span>
            </div>
            <div className="glass-card p-4 rounded-xl flex items-center justify-center gap-3 col-span-2 sm:col-span-1 hover:scale-105 transition-transform duration-300 border border-zinc-800 hover:border-pink-500/50 bg-zinc-900/50 backdrop-blur-sm">
              <Activity className="w-5 h-5 text-pink-400" />
              <span className="text-xs sm:text-sm font-bold text-zinc-200 uppercase tracking-wider">Biomedical DSP</span>
            </div>
          </motion.div>

          <motion.p variants={itemVariants} className="text-xs font-mono text-zinc-500 tracking-wide">
            {projectsData.length} projects shipped <span className="text-zinc-700 mx-1.5">/</span> 3 bots on cron
            <span className="text-zinc-700 mx-1.5">/</span> 1 iOS app <span className="text-zinc-700 mx-1.5">/</span> press{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">/</kbd> to search
            <span className="hidden sm:inline">
              {" "}
              · <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">`</kbd> for a terminal
            </span>
          </motion.p>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto"
      >
        <button 
          onClick={() => scrollToId("about")}
          className="flex flex-col items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer group"
        >
          <span className="text-[11px] font-mono tracking-widest uppercase font-bold">SCROLL</span>
          <ChevronDown className="w-5 h-5 animate-bounce text-indigo-400 group-hover:text-indigo-300" />
        </button>
      </motion.div>
    </section>
  );
}
