"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Sparkles, Code2, Cpu, Download } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isNavigating = false;
    
    const handleWheel = (e: WheelEvent) => {
      if (window.scrollY < 50 && e.deltaY > 0 && !isNavigating) {
        const target = document.getElementById("about");
        const customWindow = window as unknown as { lenis?: { scrollTo: (el: HTMLElement, options?: Record<string, unknown>) => void } };
        
        if (target && customWindow.lenis) {
          isNavigating = true;
          customWindow.lenis.scrollTo(target);
          setTimeout(() => { isNavigating = false; }, 2000);
        }
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY < 50 && !isNavigating) {
        const touchEndY = e.touches[0].clientY;
        if (touchStartY - touchEndY > 20) {
          const target = document.getElementById("about");
          const customWindow = window as unknown as { lenis?: { scrollTo: (el: HTMLElement) => void } };
          
          if (target && customWindow.lenis) {
            isNavigating = true;
            customWindow.lenis.scrollTo(target);
            setTimeout(() => { isNavigating = false; }, 2000);
          }
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  useGSAP(
    () => {
      if (!heroContentRef.current) return;

      const elements = heroContentRef.current.children;

      // Entrance Animation
      gsap.fromTo(
        elements,
        {
          y: 35,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.1,
        }
      );

      // Scroll Parallax on Ambient Blobs
      gsap.to(".ambient-blob-1", {
        y: 100,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".ambient-blob-2", {
        y: -80,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-10 overflow-hidden bg-zinc-950 scroll-mt-20"
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

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <div ref={heroContentRef} className="flex flex-col items-center w-full">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-800 backdrop-blur-md mb-6 shadow-sm">
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
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mb-8 leading-relaxed font-light">
            Bridging engineering innovation and clinical needs through cutting-edge medical devices, artificial intelligence, and full-stack software architecture.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 w-full mb-10">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById("projects");
                const customWindow = window as unknown as { lenis?: { scrollTo: (el: HTMLElement) => void } };
                if (target && customWindow.lenis) {
                  customWindow.lenis.scrollTo(target);
                } else if (target) {
                  target.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              <span>View My Work</span>
              <ArrowRight className="w-5 h-5" />
            </a>

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById("contact");
                const customWindow = window as unknown as { lenis?: { scrollTo: (el: HTMLElement) => void } };
                if (target && customWindow.lenis) {
                  customWindow.lenis.scrollTo(target);
                } else if (target) {
                  target.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-zinc-200 bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 hover:text-white transition-all duration-300 backdrop-blur-sm"
            >
              Get In Touch
            </a>

            <a
              href="/Lior Zafrir - CV.pdf"
              download="Lior Zafrir - CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-zinc-200 bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 hover:text-white transition-all duration-300 backdrop-blur-sm group"
            >
              <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
              <span>Download CV</span>
            </a>
          </div>

          {/* Quick Highlight Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-10">
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

          {/* Scroll Down Indicator */}
          <button 
            onClick={() => {
              const target = document.getElementById("about");
              const customWindow = window as unknown as { lenis?: { scrollTo: (el: HTMLElement, options?: Record<string, unknown>) => void } };
              if (target && customWindow.lenis) {
                customWindow.lenis.scrollTo(target);
              } else if (target) {
                target.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="flex flex-col items-center gap-1.5 text-zinc-500 pt-2 hover:text-zinc-300 transition-colors cursor-pointer"
          >
            <span className="text-[11px] font-mono tracking-widest uppercase">SCROLL</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-indigo-400" />
          </button>
        </div>
      </div>
    </section>
  );
}
