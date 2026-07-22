"use client";

import { useRef } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { Mail, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const contactItems = [
  {
    title: "Email",
    value: "lior31197@gmail.com",
    href: "mailto:lior31197@gmail.com",
    icon: Mail,
    color: "from-blue-500 to-indigo-500",
  },
  {
    title: "LinkedIn",
    value: "linkedin.com/in/liorzafrir",
    href: "https://linkedin.com/in/liorzafrir",
    icon: LinkedinIcon,
    color: "from-indigo-500 to-purple-500",
    external: true,
  },
  {
    title: "GitHub",
    value: "github.com/Lio311",
    href: "https://github.com/Lio311",
    icon: GithubIcon,
    color: "from-purple-500 to-pink-500",
    external: true,
  },
];

export function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".contact-header", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-header",
          start: "top 95%",
        },
      });

      gsap.from(".contact-card-item", {
        y: 40,
        opacity: 0,
        scale: 0.95,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-cards-container",
          start: "top 95%",
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section id="contact" ref={containerRef} className="py-20 bg-zinc-950/60 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="contact-header">
          <SectionHeader
            badge="Let's Connect"
            title="Get In Touch"
            subtitle="Open for opportunities, research collaborations, and biomedical/AI technology discussions."
          />
        </div>

        <div className="contact-cards-container grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {contactItems.map((item) => {
            const IconComp = item.icon;
            return (
              <a
                key={item.title}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="contact-card-item gradient-border-card p-6 rounded-2xl flex flex-col items-center text-center group hover:-translate-y-1.5 transition-all duration-300 shadow-xl"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${item.color} p-[1px] mb-4`}
                >
                  <div className="w-full h-full bg-zinc-950 rounded-[15px] flex items-center justify-center">
                    <IconComp className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white font-poppins mb-1 flex items-center gap-1 group-hover:text-indigo-300 transition-colors">
                  {item.title}
                  {item.external && <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-indigo-300" />}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 font-mono tracking-tight group-hover:text-zinc-200 transition-colors">
                  {item.value}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
