"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Lock, Timer, Radio, Cpu, Send } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SectionHeader } from "@/components/ui/section-header";
import { GithubIcon } from "@/components/ui/icons";
import { bots, nextRun, type Bot } from "@/lib/bots-data";
import { useNow } from "@/lib/use-now";
import { createFitPin } from "@/lib/pin-fit";

const stageIcons = [Timer, Radio, Cpu, Send];

function formatCountdown(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${sec}`;
}

function Countdown({ bot, className = "" }: { bot: Bot; className?: string }) {
  const now = useNow();
  return (
    <span className={`font-mono tabular-nums ${className}`} suppressHydrationWarning>
      {now === null ? "--:--:--" : formatCountdown(nextRun(bot, now) - now)}
    </span>
  );
}

function Pipeline({ bot }: { bot: Bot }) {
  return (
    <div className="relative grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-3">
      {/* The rail packets travel along: horizontal on desktop, vertical on phones. When the
          section is scroll-driven, one packet follows the scroll instead of looping. */}
      <div aria-hidden="true" className="hidden md:block absolute top-9 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent overflow-visible">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="bot-packet-x absolute -top-[3px] w-[7px] h-[7px] rounded-full"
            style={{ background: bot.accent, boxShadow: `0 0 12px ${bot.accent}`, animationDelay: `${i * 1.1}s` }}
          />
        ))}
        <span
          className="bot-packet-scrub absolute -top-[6px] -ml-[6px] w-[13px] h-[13px] rounded-full"
          style={{ background: bot.accent, boxShadow: `0 0 20px 4px ${bot.accent}` }}
        />
      </div>
      <div aria-hidden="true" className="md:hidden absolute top-6 bottom-6 left-[27px] w-px bg-zinc-800 overflow-visible">
        {[0, 1].map((i) => (
          <span
            key={i}
            className="bot-packet-y absolute -left-[3px] w-[7px] h-[7px] rounded-full"
            style={{ background: bot.accent, boxShadow: `0 0 12px ${bot.accent}`, animationDelay: `${i * 1.6}s` }}
          />
        ))}
      </div>

      {bot.stages.map((stage, i) => {
        const Icon = stageIcons[i];
        return (
          <div key={stage.title} data-on="true" className="bot-stage-node relative flex md:flex-col gap-4 md:gap-3 md:items-center md:text-center" style={{ ["--i" as string]: i }}>
            <div
              className="node-box relative z-10 shrink-0 w-14 h-14 md:w-[72px] md:h-[72px] rounded-2xl bg-zinc-950 border flex items-center justify-center"
              style={{ borderColor: `${bot.accent}55`, boxShadow: `0 0 24px ${bot.accent}1f` }}
            >
              <Icon className="w-6 h-6" style={{ color: bot.accent }} />
            </div>
            <div className="node-items min-w-0">
              <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-1.5">
                {String(i + 1).padStart(2, "0")} · {stage.title}
              </p>
              <ul className="space-y-1">
                {stage.items.map((item) => (
                  <li key={item} className="text-[13px] text-zinc-300 leading-snug">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RunLog({ bot }: { bot: Bot }) {
  return (
    <div className="rounded-xl bg-black/60 border border-zinc-800 overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-zinc-800/80 bg-zinc-900/60">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
        <span className="ml-3 text-[11px] font-mono text-zinc-500">github-actions · {bot.name} · illustrative run</span>
      </div>
      <pre className="p-4 text-[12px] leading-[22px] font-mono overflow-x-auto">
        {bot.log.map((line, i) => (
          <div
            key={line}
            data-on="true"
            style={{ ["--i" as string]: i }}
            className={`bot-log-line ${
              line.startsWith("$")
                ? "text-zinc-100"
                : line.startsWith("✓")
                  ? "text-emerald-400"
                  : line.startsWith("⚠")
                    ? "text-amber-400"
                    : line.startsWith("✦")
                      ? "text-[#f0a587]"
                      : line.startsWith("✉")
                        ? "text-sky-300"
                        : "text-zinc-400"
            }`}
          >
            {line}
          </div>
        ))}
        <span className="inline-block w-2 h-4 align-middle bg-zinc-400 animate-pulse" aria-hidden="true" />
      </pre>
    </div>
  );
}

/** Lights the pipeline up to scroll progress `p` (0..1). Reads the live DOM, so it keeps working
 * after the selected bot changes and React swaps the stage contents. */
function applyProgress(stage: HTMLElement, p: number) {
  const nodes = stage.querySelectorAll<HTMLElement>(".bot-stage-node");
  const current = Math.min(nodes.length - 1, Math.floor(p * nodes.length));
  nodes.forEach((n, i) => {
    n.dataset.on = String(p > 0.02 && i <= current);
    n.classList.toggle("is-current", p > 0.02 && p < 0.98 && i === current);
  });
  const lines = stage.querySelectorAll<HTMLElement>(".bot-log-line");
  const shown = Math.round(p * lines.length);
  lines.forEach((l, i) => (l.dataset.on = String(i < shown)));
  const packet = stage.querySelector<HTMLElement>(".bot-packet-scrub");
  if (packet) packet.style.left = `${p * 100}%`;
  const bar = stage.querySelector<HTMLElement>(".bot-run-progress");
  if (bar) bar.style.transform = `scaleX(${p})`;
  const label = stage.querySelector<HTMLElement>(".bot-run-step");
  if (label) label.textContent = p < 0.02 ? "scroll to run ↓" : p > 0.98 ? "run complete ✓" : `step ${current + 1}/${nodes.length}`;
}

export function BotsSection() {
  const [activeId, setActiveId] = useState(bots[0].id);
  const active = bots.find((b) => b.id === activeId) ?? bots[0];
  const containerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fullPinRef = useRef<HTMLDivElement>(null);
  const fullFitRef = useRef<HTMLDivElement>(null);
  const stagePinRef = useRef<HTMLDivElement>(null);
  const progress = useRef<number | null>(null);

  // The shader backdrop tints toward the selected bot's colour
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("accent-change", { detail: active.accent }));
  }, [active.accent]);

  // A new bot mid-scroll picks up where the scroll is
  useEffect(() => {
    if (stageRef.current && progress.current !== null) applyProgress(stageRef.current, progress.current);
  }, [active.id]);

  useGSAP(
    () => {
      gsap.fromTo(
        ".bots-reveal",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: containerRef.current, start: "top 75%" },
        }
      );

      // Scroll-driven run: pin the heading with the stage when it fits, the stage alone otherwise
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)", () => {
        const stage = stageRef.current;
        const [fullPin, fullFit, stagePin] = [fullPinRef.current, fullFitRef.current, stagePinRef.current];
        if (!stage || !fullPin || !fullFit || !stagePin) return;
        stage.classList.add("is-scrubbed");
        const pin = createFitPin(
          [
            { pin: fullPin, fit: fullFit },
            { pin: stagePin, fit: stage },
          ],
          {
            end: "+=1500",
            scrub: true,
            onUpdate: (self) => {
              progress.current = self.progress;
              applyProgress(stage, self.progress);
            },
          }
        );
        if (!pin) {
          stage.classList.remove("is-scrubbed");
          return;
        }
        progress.current = pin.st.progress;
        applyProgress(stage, pin.st.progress);
        return () => {
          pin.cleanup();
          stage.classList.remove("is-scrubbed");
          progress.current = null;
          applyProgress(stage, 1);
        };
      });
    },
    { scope: containerRef }
  );

  return (
    <section id="bots" ref={containerRef} className="relative py-20 scroll-mt-20 overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-60" style={{ background: `radial-gradient(800px 400px at 50% 0%, ${active.accent}14, transparent 70%)`, transition: "background 0.6s" }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={fullPinRef}>
          <div ref={fullFitRef}>
            <div className="bots-reveal">
              <SectionHeader
                badge="Running in production"
                title="Autonomous Bots"
                subtitle="Three agents I designed end to end. They wake up on a schedule, scrape, match and score, then email the results, with no one pressing a button."
              />
            </div>

            <div ref={stagePinRef}>
              <div ref={stageRef} className="bots-stage" style={{ ["--accent" as string]: active.accent }}>
                <div className="bots-reveal">
                  {/* Bot selector */}
                  <div role="tablist" aria-label="Bots" className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                    {bots.map((bot) => {
                      const selected = bot.id === active.id;
                      return (
                        <button
                          key={bot.id}
                          role="tab"
                          id={`bot-tab-${bot.id}`}
                          aria-selected={selected}
                          aria-controls="bot-panel"
                          onClick={() => setActiveId(bot.id)}
                          className={`relative text-left p-4 rounded-2xl border transition-all duration-300 ${
                            selected ? "bg-zinc-900/90 border-zinc-600" : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                          }`}
                        >
                          {selected && (
                            <motion.span
                              layoutId="bot-tab-glow"
                              className="absolute inset-0 rounded-2xl pointer-events-none"
                              style={{ boxShadow: `inset 0 0 0 1px ${bot.accent}99, 0 0 32px ${bot.accent}26` }}
                            />
                          )}
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-poppins font-bold text-white">{bot.name}</span>
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              scheduled
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 leading-relaxed mb-3 min-h-[2.5rem]">{bot.tagline}</p>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                            <Clock className="w-3.5 h-3.5" />
                            next run in
                            <Countdown bot={bot} className="text-zinc-200" />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active bot */}
                  <div id="bot-panel" role="tabpanel" aria-labelledby={`bot-tab-${active.id}`} className="relative gradient-border-card rounded-2xl p-5 sm:p-7 overflow-hidden">
                    <div aria-hidden="true" className="bot-run-progress absolute top-0 left-0 right-0 h-[2px] origin-left" style={{ background: active.accent, transform: "scaleX(1)" }} />
                    <motion.div key={active.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
                        <div className="flex flex-wrap items-center gap-3">
                          <code className="text-xs px-2.5 py-1 rounded-md bg-black/50 border border-zinc-800 text-zinc-300">cron: &quot;{active.cron}&quot; UTC</code>
                          <span className="text-xs text-zinc-500">{active.scheduleLabel}</span>
                          <span className="bot-run-step text-[11px] font-mono" style={{ color: active.accent }} />
                        </div>
                        <div className="flex items-center gap-2">
                          {active.link ? (
                            <a href={active.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-zinc-950 transition-opacity hover:opacity-90" style={{ background: active.accent }}>
                              Open dashboard <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-800">
                              <Lock className="w-3.5 h-3.5" /> Dashboard is private
                            </span>
                          )}
                          <a href={active.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 transition-colors">
                            <GithubIcon className="w-3.5 h-3.5" /> Source
                          </a>
                        </div>
                      </div>

                      <Pipeline bot={active} />

                      <div className="mt-7">
                        <RunLog bot={active} />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
