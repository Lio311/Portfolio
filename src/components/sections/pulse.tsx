"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { GithubIcon } from "@/components/ui/icons";
import snapshot from "@/data/github-pulse.json";
import { aggregate, type GithubPulse } from "@/lib/github-pulse";

const DAY_MS = 86400 * 1000;
const LEVELS = ["#18181b", "#312e81", "#4f46e5", "#a855f7", "#ec4899"];
const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572a5",
  "Jupyter Notebook": "#da5b0b",
  Swift: "#f05138",
};

function CountUp({ value, run }: { value: number; run: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1400);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, run]);
  return <span className="tabular-nums">{n.toLocaleString("en-US")}</span>;
}

function Sparkline({ weeks, color, run }: { weeks: number[]; color: string; run: boolean }) {
  const max = Math.max(1, ...weeks);
  const w = 160;
  const h = 32;
  const d = weeks.map((v, i) => `${i ? "L" : "M"}${((i / (weeks.length - 1)) * w).toFixed(1)},${(h - 2 - (v / max) * (h - 4)).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-28 sm:w-40 h-8" aria-hidden="true">
      <motion.path d={d} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: run ? 1 : 0 }} transition={{ duration: 1.4, ease: "easeOut" }} />
    </svg>
  );
}

const ago = (iso: string) => {
  const d = Math.floor((Date.now() - Date.parse(iso)) / DAY_MS);
  return d <= 0 ? "today" : d === 1 ? "yesterday" : d < 30 ? `${d}d ago` : `${Math.floor(d / 30)}mo ago`;
};

export function PulseSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const pulse = snapshot as GithubPulse;
  const [hover, setHover] = useState<{ i: number; x: number; y: number } | null>(null);
  const heatRef = useRef<HTMLDivElement>(null);

  const data = useMemo(() => {
    const { firstWeek, days, repos } = aggregate(pulse);
    const total = days.reduce((a, b) => a + b, 0);
    const active = days.filter(Boolean).length;
    let longest = 0;
    let run = 0;
    for (const n of days) {
      run = n ? run + 1 : 0;
      longest = Math.max(longest, run);
    }
    const busiest = days.reduce((m, n, i) => (n > days[m] ? i : m), 0);
    const nonZero = days.filter(Boolean).sort((a, b) => a - b);
    const q = (p: number) => nonZero[Math.floor(p * (nonZero.length - 1))] ?? 1;
    const cuts = [q(0.25), q(0.5), q(0.8)];
    const level = (n: number) => (n === 0 ? 0 : n <= cuts[0] ? 1 : n <= cuts[1] ? 2 : n <= cuts[2] ? 3 : 4);
    const dateOf = (i: number) => new Date(firstWeek * 1000 + i * DAY_MS);
    const months: { col: number; label: string }[] = [];
    for (let c = 0; c < 52; c++) {
      const d = dateOf(c * 7);
      if (d.getUTCDate() <= 7) months.push({ col: c, label: d.toLocaleString("en-US", { month: "short", timeZone: "UTC" }) });
    }
    return { days, repos, total, active, longest, busiest, level, dateOf, months };
  }, [pulse]);

  // Phones see the newest weeks first
  useEffect(() => {
    if (heatRef.current) heatRef.current.scrollLeft = heatRef.current.scrollWidth;
  }, []);

  const cell = 13;
  const gap = 3;

  return (
    <section id="pulse" ref={ref} className="relative py-20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader badge="From GitHub" title="Shipping Pulse" subtitle="Every commit across my repos over the last twelve months." />

        <div className="flex justify-center mb-8 -mt-2">
          <span className="inline-flex items-center gap-2 text-[11px] font-mono px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            auto-updated daily · last sync {new Date(pulse.generatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {[
            { label: "commits · 12 months", value: data.total },
            { label: "active days", value: data.active },
            { label: "longest streak (days)", value: data.longest },
            { label: `busiest day · ${data.dateOf(data.busiest).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })}`, value: data.days[data.busiest] },
          ].map((s) => (
            <div key={s.label} className="gradient-border-card rounded-2xl p-5">
              <p className="text-3xl sm:text-4xl font-bold font-poppins text-white">
                <CountUp value={s.value} run={inView} />
              </p>
              <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="gradient-border-card rounded-2xl p-5 sm:p-6 mb-6 relative">
          <div ref={heatRef} className="overflow-x-auto pb-2" data-lenis-prevent-horizontal>
            <svg width={52 * (cell + gap) + 28} height={7 * (cell + gap) + 22} className="block mx-auto" role="img" aria-label={`${data.total} commits over the last 52 weeks`}>
              {data.months.map((m) => (
                <text key={m.col} x={28 + m.col * (cell + gap)} y={11} fill="#71717a" fontSize="10" fontFamily="ui-monospace, monospace">
                  {m.label}
                </text>
              ))}
              {["Mon", "Wed", "Fri"].map((d, i) => (
                <text key={d} x={0} y={22 + (i * 2 + 1) * (cell + gap) + cell - 3} fill="#52525b" fontSize="9" fontFamily="ui-monospace, monospace">
                  {d}
                </text>
              ))}
              {Array.from({ length: 52 }, (_, c) => (
                <motion.g key={c} initial={{ opacity: 0, y: 6 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: c * 0.018, duration: 0.35 }}>
                  {Array.from({ length: 7 }, (_, r) => {
                    const i = c * 7 + r;
                    const n = data.days[i];
                    const future = data.dateOf(i).getTime() > Date.now();
                    if (future) return null;
                    return (
                      <rect
                        key={r}
                        x={28 + c * (cell + gap)}
                        y={20 + r * (cell + gap)}
                        width={cell}
                        height={cell}
                        rx={3}
                        fill={LEVELS[data.level(n)]}
                        stroke={hover?.i === i ? "#fff" : "transparent"}
                        onPointerEnter={(e) => {
                          const card = heatRef.current?.parentElement?.getBoundingClientRect();
                          const rb = e.currentTarget.getBoundingClientRect();
                          if (card) setHover({ i, x: rb.left - card.left + rb.width / 2, y: rb.top - card.top - 6 });
                        }}
                        onPointerLeave={() => setHover(null)}
                      />
                    );
                  })}
                </motion.g>
              ))}
            </svg>
          </div>
          {hover && (
            <div className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full px-2.5 py-1.5 rounded-md bg-black/90 border border-zinc-700 text-[11px] text-zinc-200 whitespace-nowrap" style={{ left: hover.x, top: hover.y }}>
              <b className="text-white">{data.days[hover.i]}</b> commits ·{" "}
              {data.dateOf(hover.i).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" })}
            </div>
          )}
          <div className="flex items-center justify-end gap-1.5 mt-3 text-[10px] text-zinc-500 font-mono">
            less
            {LEVELS.map((c) => (
              <span key={c} className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />
            ))}
            more
          </div>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.repos.slice(0, 6).map((r, i) => {
            const color = LANG_COLORS[r.language ?? ""] ?? "#a1a1aa";
            return (
              <motion.li key={r.name} initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 + i * 0.08 }}>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 hover:border-zinc-600 transition-colors group">
                  <GithubIcon className="w-4 h-4 text-zinc-500 group-hover:text-white shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-zinc-100 truncate">{r.name}</p>
                    <p className="text-[11px] text-zinc-500 flex items-center gap-1.5" suppressHydrationWarning>
                      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                      {r.language ?? "—"} · pushed {ago(r.pushedAt)}
                    </p>
                  </div>
                  <Sparkline weeks={r.weeks} color={color} run={inView} />
                  <span className="text-sm font-mono text-zinc-300 tabular-nums w-14 text-right">{r.total.toLocaleString("en-US")}</span>
                </a>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
