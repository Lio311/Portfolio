"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Sparkles, Code2, Cpu } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!heroContentRef.current) return;

      const elements = heroContentRef.current.children;
      gsap.fromTo(
        elements,
        {
          y: 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.2,
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-zinc-950"
    >
      {/* Ambient Animated Mesh Background */}
      <div className="ambient-bg">
        <div className="ambient-blob-1" />
        <div className="ambient-blob-2" />
        <div className="ambient-blob-3" />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div ref={heroContentRef} className="flex flex-col items-center">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-800 backdrop-blur-md mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-zinc-300">
              Biomedical Engineering & Tech Innovation
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight font-poppins mb-6">
            <span className="block text-zinc-400 text-xl sm:text-2xl font-normal mb-2 font-inter">
              Hi, I&apos;m
            </span>
            <span className="gradient-text">Lior Zafrir</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-2xl font-medium text-zinc-200 mb-6 max-w-3xl leading-relaxed">
            Biomedical Engineer <span className="text-indigo-400">|</span> Full-Stack Developer <span className="text-purple-400">|</span> AI Enthusiast
          </p>

          {/* Description */}
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mb-10 leading-relaxed font-light">
            Bridging engineering innovation and clinical needs through cutting-edge medical devices, artificial intelligence, and full-stack software architecture.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="#projects"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              <span>View My Work</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="#contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-zinc-200 bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 hover:text-white transition-all duration-300 backdrop-blur-sm"
            >
              Get In Touch
            </Link>
          </div>

          {/* Quick Highlight Badges */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-2xl">
            <div className="glass-card p-4 rounded-xl flex items-center justify-center gap-3">
              <Cpu className="w-5 h-5 text-indigo-400" />
              <span className="text-xs sm:text-sm font-medium text-zinc-300">DSP & AI/ML</span>
            </div>
            <div className="glass-card p-4 rounded-xl flex items-center justify-center gap-3">
              <Code2 className="w-5 h-5 text-purple-400" />
              <span className="text-xs sm:text-sm font-medium text-zinc-300">Full-Stack Web</span>
            </div>
            <div className="glass-card p-4 rounded-xl flex items-center justify-center gap-3 col-span-2 sm:col-span-1">
              <Sparkles className="w-5 h-5 text-pink-400" />
              <span className="text-xs sm:text-sm font-medium text-zinc-300">Medical Devices</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-500">
        <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce text-indigo-400" />
      </div>
    </section>
  );
}
