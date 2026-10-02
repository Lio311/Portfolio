"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Command, CornerDownLeft, Download, FolderGit2, Hash, Mail, Search } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { projectsData } from "@/lib/projects-data";
import { scrollToId } from "@/lib/scroll";

interface PaletteItem {
  id: string;
  group: "Navigate" | "Projects" | "Actions";
  label: string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  run: () => void;
}

const EMAIL = "lior31197@gmail.com";

const openTab = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setCursor(0);
  }, []);

  const items = useMemo<PaletteItem[]>(
    () => [
      ...[
        ["home", "Home"],
        ["about", "About me"],
        ["bots", "Autonomous bots"],
        ["projects", "All projects"],
        ["contact", "Contact"],
      ].map(([id, label]) => ({
        id: `nav-${id}`,
        group: "Navigate" as const,
        label,
        hint: `#${id}`,
        icon: Hash,
        run: () => scrollToId(id),
      })),
      ...projectsData.map((p) => ({
        id: `project-${p.id}`,
        group: "Projects" as const,
        label: p.title,
        hint: p.tags.slice(0, 3).join(" · "),
        icon: FolderGit2,
        run: () => {
          const url = p.link ?? p.repo;
          if (url) openTab(url);
          else scrollToId("projects");
        },
      })),
      {
        id: "copy-email",
        group: "Actions",
        label: "Copy email address",
        hint: EMAIL,
        icon: Mail,
        run: () => {
          navigator.clipboard?.writeText(EMAIL).then(
            () => setToast("Email copied"),
            () => (window.location.href = `mailto:${EMAIL}`)
          );
        },
      },
      {
        id: "cv",
        group: "Actions",
        label: "Download CV (PDF)",
        icon: Download,
        run: () => {
          const a = document.createElement("a");
          a.href = "/lior-zafrir-cv.pdf";
          a.download = "Lior Zafrir - CV.pdf";
          a.click();
        },
      },
      { id: "github", group: "Actions", label: "Open GitHub", hint: "github.com/Lio311", icon: GithubIcon, run: () => openTab("https://github.com/Lio311") },
      { id: "linkedin", group: "Actions", label: "Open LinkedIn", hint: "linkedin.com/in/liorzafrir", icon: LinkedinIcon, run: () => openTab("https://linkedin.com/in/liorzafrir") },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    const words = q.split(/\s+/);
    return items.filter((it) => {
      const hay = `${it.label} ${it.hint ?? ""} ${it.group}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }, [items, query]);

  // Global shortcut: ⌘K / Ctrl+K toggles, "/" opens when not typing somewhere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && e.target.closest("input, textarea, [contenteditable=true]");
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onOpen);
    };
  }, [open]);

  // Freeze smooth scrolling behind the dialog
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
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${cursor}"]`)?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  const runItem = (item: PaletteItem | undefined) => {
    if (!item) return;
    close();
    // Let the dialog unmount (and Lenis restart) before scrolling
    setTimeout(item.run, 60);
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runItem(filtered[cursor]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  let lastGroup = "";

  return (
    <>
      {/* Floating launcher, also teaches the shortcut */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-[60] inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-zinc-300 text-xs font-medium backdrop-blur-md shadow-xl shadow-black/40 hover:text-white hover:border-indigo-500/60 transition-colors"
        aria-label="Open command palette"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Quick jump</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/50 border border-zinc-700 text-zinc-400">
          <Command className="w-2.5 h-2.5" />K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} aria-hidden="true" />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-xl rounded-2xl bg-zinc-950/95 border border-zinc-800 shadow-2xl shadow-indigo-950/40 overflow-hidden"
              data-lenis-prevent
            >
              <div className="flex items-center gap-3 px-4 border-b border-zinc-800">
                <Search className="w-4 h-4 text-zinc-500 shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setCursor(0);
                  }}
                  onKeyDown={onInputKey}
                  placeholder="Search projects, sections, actions…"
                  className="w-full bg-transparent py-4 text-base sm:text-sm text-white placeholder:text-zinc-500 outline-none"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="palette-list"
                  aria-activedescendant={filtered[cursor] ? `palette-${filtered[cursor].id}` : undefined}
                />
                <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-500">esc</kbd>
              </div>

              <ul ref={listRef} id="palette-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2 overscroll-contain">
                {filtered.length === 0 && <li className="px-3 py-8 text-center text-sm text-zinc-500">No results for “{query}”</li>}
                {filtered.map((item, i) => {
                  const showGroup = item.group !== lastGroup;
                  lastGroup = item.group;
                  const Icon = item.icon;
                  const active = i === cursor;
                  return (
                    <li key={item.id} role="presentation">
                      {showGroup && <p className="px-3 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">{item.group}</p>}
                      <div
                        id={`palette-${item.id}`}
                        role="option"
                        aria-selected={active}
                        data-index={i}
                        onMouseMove={() => setCursor(i)}
                        onClick={() => runItem(item)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer ${active ? "bg-indigo-600/20 text-white" : "text-zinc-300"}`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${active ? "text-indigo-300" : "text-zinc-500"}`} />
                        <span className="text-sm truncate">{item.label}</span>
                        {item.hint && <span className="ml-auto text-[11px] text-zinc-500 truncate max-w-[45%] hidden sm:block">{item.hint}</span>}
                        {active &&
                          (item.group === "Projects" ? (
                            <ArrowUpRight className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                          ) : (
                            <CornerDownLeft className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                          ))}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="flex items-center gap-4 px-4 py-2.5 border-t border-zinc-800 text-[11px] text-zinc-500">
                <span><kbd className="font-mono">↑↓</kbd> navigate</span>
                <span><kbd className="font-mono">↵</kbd> open</span>
                <span className="ml-auto">{filtered.length} results</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-20 right-5 z-[110] px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-sm backdrop-blur-md"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
