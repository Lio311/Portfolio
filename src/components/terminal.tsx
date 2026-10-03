"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projectsData } from "@/lib/projects-data";
import { bots } from "@/lib/bots-data";
import { scrollToId } from "@/lib/scroll";

// Developer easter egg: a small shell over the portfolio. Opens with ` (backtick), the command
// palette, or the "open-terminal" event. Everything it prints comes from the same data the page
// renders; `run <bot>` replays the bot's illustrative log.

type Line = { kind: "in" | "out" | "err" | "accent" | "dim"; text: string; href?: string };

const EMAIL = "lior31197@gmail.com";
const PROMPT = "guest@lior-zafrir:~$";

const slug = (s: string) => s.toLowerCase().replace(/\(.*?\)/g, "").trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const projectSlugs = projectsData.map((p) => ({ slug: slug(p.title), project: p }));
const botSlugs = bots.map((b) => ({ slug: b.name.toLowerCase(), bot: b }));

const COMMANDS: Record<string, string> = {
  help: "list commands",
  whoami: "who is Lior",
  ls: "ls projects | ls bots",
  open: "open <project>  (tab completes)",
  run: "run <dirabot|liberobot|jobot>",
  skills: "the stack, by area",
  cv: "download the CV",
  contact: "email, GitHub, LinkedIn",
  goto: "goto <home|about|bots|projects|pulse|contact>",
  galaxy: "fly through the projects in 3D",
  clear: "clear the screen",
  exit: "close the terminal",
};

const BANNER: Line[] = [
  { kind: "accent", text: "lior-zafrir portfolio shell · v2.0" },
  { kind: "dim", text: "type `help` to start, tab to complete, ↑/↓ for history, esc to close" },
];

export function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const print = useCallback((...l: Line[]) => setLines((prev) => [...prev, ...l]), []);

  const close = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setBusy(false);
    setOpen(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && e.target.closest("input, textarea, [contenteditable=true]");
      if (e.key === "`" && !typing) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-terminal", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-terminal", onOpen);
    };
  }, []);

  useEffect(() => {
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    if (open) {
      lenis?.stop();
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      lenis?.start();
    }
  }, [open]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const leaveAnd = (fn: () => void) => {
    close();
    setTimeout(fn, 80);
  };

  const exec = (raw: string) => {
    const cmd = raw.trim();
    print({ kind: "in", text: `${PROMPT} ${cmd}` });
    if (!cmd) return;
    setHistory((h) => [cmd, ...h.filter((x) => x !== cmd)].slice(0, 50));
    setHistIdx(-1);
    const [name, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(" ").toLowerCase();

    switch (name.toLowerCase()) {
      case "help":
        print(...Object.entries(COMMANDS).map(([k, v]) => ({ kind: "out" as const, text: `  ${k.padEnd(9)} ${v}` })));
        break;
      case "whoami":
        print(
          { kind: "accent", text: "Lior Zafrir, AI Engineer & Full-Stack Developer" },
          { kind: "out", text: "B.Sc. Biomedical Engineering, Tel Aviv University." },
          { kind: "out", text: "Builds LLM agents, scraping bots that run on cron, 3D web apps and the platforms behind them." }
        );
        break;
      case "ls":
        if (arg.startsWith("bot")) {
          print(...bots.map((b) => ({ kind: "out" as const, text: `  ${b.name.padEnd(11)} cron "${b.cron}"  ${b.tagline}` })));
        } else if (!arg || arg.startsWith("proj")) {
          print(...projectSlugs.map(({ slug: s, project }) => ({ kind: "out" as const, text: `  ${s.padEnd(30)} ${project.categories.join(",")}` })));
          print({ kind: "dim", text: `${projectSlugs.length} projects · try: open ${projectSlugs[0].slug}` });
        } else {
          print({ kind: "err", text: `ls: ${arg}: no such directory (try projects or bots)` });
        }
        break;
      case "open": {
        const hit = projectSlugs.find((p) => p.slug === arg) ?? projectSlugs.find((p) => p.slug.startsWith(arg) && arg);
        if (!hit) {
          print({ kind: "err", text: `open: ${arg || "<project>"}: not found. \`ls projects\` lists them.` });
          break;
        }
        const url = hit.project.link ?? hit.project.repo;
        print({ kind: "accent", text: hit.project.title }, { kind: "out", text: hit.project.description });
        if (url) {
          print({ kind: "dim", text: `opening ${url}`, href: url });
          window.open(url, "_blank", "noopener,noreferrer");
        }
        break;
      }
      case "run": {
        const hit = botSlugs.find((b) => b.slug === arg || b.slug.replace("bot", "") === arg);
        if (!hit) {
          print({ kind: "err", text: `run: unknown bot "${arg}". Bots: ${botSlugs.map((b) => b.slug).join(", ")}` });
          break;
        }
        setBusy(true);
        print({ kind: "dim", text: `▶ replaying a ${hit.bot.name} run (illustrative, not live data)` });
        hit.bot.log.slice(1).forEach((l, i) => {
          timers.current.push(
            setTimeout(() => {
              print({ kind: l.startsWith("✓") ? "accent" : "out", text: l });
              if (i === hit.bot.log.length - 2) {
                print({ kind: "dim", text: `done · next scheduled run: cron "${hit.bot.cron}" UTC` });
                setBusy(false);
              }
            }, 380 * (i + 1))
          );
        });
        break;
      }
      case "skills":
        print(
          { kind: "out", text: "  ai        Claude API, LangGraph, RAG/GraphRAG, pgvector, MCP, multi-agent systems" },
          { kind: "out", text: "  web       TypeScript, React 19, Next.js 16, Three.js / R3F, GSAP, Tailwind" },
          { kind: "out", text: "  data      Postgres (Neon), Drizzle, Prisma, Inngest, Playwright, Cheerio, Apify" },
          { kind: "out", text: "  ml / dsp  PyTorch, YOLOv8, ONNX, MediaPipe, OpenCV, SciPy, FFT" }
        );
        break;
      case "cv":
      case "resume": {
        const a = document.createElement("a");
        a.href = "/lior-zafrir-cv.pdf";
        a.download = "Lior Zafrir - CV.pdf";
        a.click();
        print({ kind: "accent", text: "downloading Lior Zafrir - CV.pdf" });
        break;
      }
      case "contact":
      case "email":
        print(
          { kind: "out", text: `  email     ${EMAIL}`, href: `mailto:${EMAIL}` },
          { kind: "out", text: "  github    github.com/Lio311", href: "https://github.com/Lio311" },
          { kind: "out", text: "  linkedin  linkedin.com/in/liorzafrir", href: "https://linkedin.com/in/liorzafrir" }
        );
        break;
      case "goto":
      case "cd": {
        const target = arg.replace(/^[#/~]+/, "") || "home";
        if (!document.getElementById(target)) {
          print({ kind: "err", text: `${name}: ${target}: no such section` });
          break;
        }
        leaveAnd(() => scrollToId(target));
        break;
      }
      case "galaxy":
        leaveAnd(() => {
          scrollToId("projects");
          window.dispatchEvent(new CustomEvent("projects-view", { detail: "galaxy" }));
        });
        break;
      case "sudo":
        print({ kind: "accent", text: arg.includes("hire") ? "Permission granted. Sending offer letter… (email works faster: `contact`)" : "nice try." });
        break;
      case "clear":
        setLines([]);
        break;
      case "exit":
      case "quit":
        close();
        break;
      default:
        print({ kind: "err", text: `command not found: ${name}. Type \`help\`.` });
    }
  };

  const complete = () => {
    const [name, ...rest] = input.split(/\s+/);
    if (!rest.length) {
      const hits = Object.keys(COMMANDS).filter((c) => c.startsWith(name));
      if (hits.length === 1) setInput(`${hits[0]} `);
      else if (hits.length > 1) print({ kind: "dim", text: hits.join("  ") });
      return;
    }
    const arg = rest.join(" ");
    const pool =
      name === "open" ? projectSlugs.map((p) => p.slug) : name === "run" ? botSlugs.map((b) => b.slug) : name === "ls" ? ["projects", "bots"] : ["home", "about", "bots", "projects", "pulse", "contact"];
    const hits = pool.filter((p) => p.startsWith(arg.toLowerCase()));
    if (hits.length === 1) setInput(`${name} ${hits[0]}`);
    else if (hits.length > 1) print({ kind: "dim", text: hits.join("  ") });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (busy) return;
      exec(input);
      setInput("");
    } else if (e.key === "Tab") {
      e.preventDefault();
      complete();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const i = Math.min(histIdx + 1, history.length - 1);
      if (history[i] !== undefined) {
        setHistIdx(i);
        setInput(history[i]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const i = histIdx - 1;
      setHistIdx(Math.max(i, -1));
      setInput(i >= 0 ? history[i] : "");
    } else if (e.key === "Escape" || (e.key === "`" && !input)) {
      e.preventDefault();
      close();
    } else if (e.key.toLowerCase() === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  const color: Record<Line["kind"], string> = {
    in: "text-zinc-100",
    out: "text-zinc-300",
    err: "text-red-400",
    accent: "text-emerald-300",
    dim: "text-zinc-500",
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-[120] px-3 sm:px-6 pb-3 sm:pb-6"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Terminal"
            data-lenis-prevent
            className="mx-auto max-w-4xl rounded-xl overflow-hidden border border-zinc-700/80 bg-[#07070a]/95 backdrop-blur-xl shadow-2xl shadow-black/60"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/70">
              <button type="button" aria-label="Close terminal" onClick={close} className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 text-xs font-mono text-zinc-500">zsh · lior-zafrir</span>
              <span className="ml-auto text-[10px] font-mono text-zinc-600 hidden sm:inline">` to toggle</span>
            </div>
            <div ref={bodyRef} className="h-[46vh] sm:h-[42vh] overflow-y-auto overscroll-contain p-4 font-mono text-[12.5px] leading-6">
              {lines.map((l, i) =>
                l.href ? (
                  <a key={i} href={l.href} target="_blank" rel="noopener noreferrer" className={`block whitespace-pre-wrap hover:underline ${color[l.kind]}`}>
                    {l.text}
                  </a>
                ) : (
                  <div key={i} className={`whitespace-pre-wrap ${color[l.kind]}`}>
                    {l.text}
                  </div>
                )
              )}
              <div className="flex items-center gap-2">
                <span className="text-indigo-400 shrink-0">{PROMPT}</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  aria-label="Terminal input"
                  className="flex-1 bg-transparent outline-none text-zinc-100 caret-emerald-400 text-base sm:text-[12.5px]"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
