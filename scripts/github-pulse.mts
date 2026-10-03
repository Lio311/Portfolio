// Rebuilds src/data/github-pulse.json from the local clones' git history: exact per-day commit
// counts, no API quota. The browser then tries GitHub's stats API for fresher numbers and keeps
// this snapshot for any repo GitHub hasn't computed yet.
// Run: npx tsx scripts/github-pulse.mts   (pull the clones first for up-to-date numbers)
import { execFileSync } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { GithubPulse, RepoPulse } from "../src/lib/github-pulse";

const home = homedir();
const scratch = join(home, ".gemini/antigravity/scratch");
const CLONES = [
  join(scratch, "portfolio"),
  join(scratch, "publish-ai"),
  join(home, "Desktop/dira-bot"),
  join(home, "Desktop/libero-bot"),
  join(home, "Desktop/joBot"),
  join(home, "Desktop/perfume-studio"),
  join(scratch, "libero-management"),
  join(scratch, "libero-wholesale"),
  join(scratch, "kesefly"),
  join(scratch, "shared-account"),
  join(scratch, "fragrance-marketplace"),
  ...["Dental-Carries-Detector", "Gait-Analysis", "SmarTriageGantt", "ecg-simulator", "fourier-optics", "perfume-generator", "physio-simulator", "rPPG-Vitals-Analyzer", "ring-simulator", "stocks"].map(
    (d) => join(scratch, "bio-projects", d)
  ),
];

const DAY = 86400;
const now = Math.floor(Date.now() / 1000);
// Same grid GitHub uses: 52 weeks, each starting on a Sunday (UTC), the last one containing today
const today = Math.floor(now / DAY) * DAY;
const thisSunday = today - new Date(today * 1000).getUTCDay() * DAY;
const firstWeek = thisSunday - 51 * 7 * DAY;

const git = (dir: string, ...args: string[]) => execFileSync("git", ["-C", dir, ...args], { encoding: "utf8" }).trim();

// Languages come from one API call; the snapshot is still complete without them
let languages: Record<string, string | null> = {};
try {
  const res = await fetch("https://api.github.com/users/Lio311/repos?per_page=100");
  if (res.ok) languages = Object.fromEntries(((await res.json()) as { name: string; language: string | null }[]).map((r) => [r.name, r.language]));
} catch {}

const repos: RepoPulse[] = [];
for (const dir of CLONES) {
  if (!existsSync(join(dir, ".git"))) {
    console.warn(`skip (no clone): ${dir}`);
    continue;
  }
  const url = git(dir, "remote", "get-url", "origin").replace(/\.git$/, "");
  const name = url.split("/").pop()!;
  const stamps = git(dir, "log", `--since=${firstWeek}`, "--format=%ct").split("\n").filter(Boolean).map(Number);
  const days = new Array(52 * 7).fill(0);
  for (const t of stamps) {
    const i = Math.floor((t - firstWeek) / DAY);
    if (i >= 0 && i < days.length) days[i]++;
  }
  const last = Number(git(dir, "log", "-1", "--format=%ct"));
  repos.push({ name, url, language: languages[name] ?? null, pushedAt: new Date(last * 1000).toISOString(), firstWeek, days });
}

const pulse: GithubPulse = { generatedAt: new Date().toISOString(), repos };
writeFileSync(new URL("../src/data/github-pulse.json", import.meta.url), JSON.stringify(pulse));
const total = repos.reduce((s, r) => s + r.days.reduce((a, b) => a + b, 0), 0);
console.log(`Snapshot: ${repos.length} repos, ${total} commits in the last 52 weeks.`);
