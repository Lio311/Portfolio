// Rebuilds src/data/github-pulse.json: per-day commit counts for every public repo pushed in the
// last year. Repos are cloned bare with --filter=blob:none (history only, no file contents), so
// it's fast and git clones don't count against the REST rate limit; the API is only used once to
// list the repos. Runs daily in .github/workflows/pulse.yml; locally: npm run pulse.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { GITHUB_USER, type GithubPulse, type RepoPulse } from "../src/lib/github-pulse";

const DAY = 86400;
const now = Math.floor(Date.now() / 1000);
// GitHub's grid: 52 weeks, each starting on a Sunday (UTC), the last one containing today
const today = Math.floor(now / DAY) * DAY;
const thisSunday = today - new Date(today * 1000).getUTCDay() * DAY;
const firstWeek = thisSunday - 51 * 7 * DAY;

type ApiRepo = { name: string; html_url: string; clone_url: string; language: string | null; pushed_at: string; fork: boolean };

const file = new URL("../src/data/github-pulse.json", import.meta.url);
let previous: GithubPulse | null = null;
try {
  previous = JSON.parse(readFileSync(file, "utf8"));
} catch {}

// New repos and languages come from the API; if it's rate-limited, refresh the repos we already track
let active: ApiRepo[];
const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&type=owner`, {
  headers: { Accept: "application/vnd.github+json", ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) },
});
if (res.ok) {
  active = ((await res.json()) as ApiRepo[]).filter((r) => !r.fork && Date.parse(r.pushed_at) / 1000 >= firstWeek);
} else if (previous?.repos.length) {
  console.warn(`GitHub API ${res.status}; refreshing the ${previous.repos.length} known repos.`);
  active = previous.repos.map((r) => ({ name: r.name, html_url: r.url, clone_url: `${r.url}.git`, language: r.language, pushed_at: r.pushedAt, fork: false }));
} else {
  console.error(`GitHub API ${res.status} and no previous snapshot; nothing written.`);
  process.exit(1);
}

const work = mkdtempSync(join(tmpdir(), "pulse-"));
const repos: RepoPulse[] = [];
try {
  for (const r of active) {
    const dir = join(work, r.name);
    try {
      execFileSync("git", ["clone", "--bare", "--filter=blob:none", "--quiet", r.clone_url, dir], { stdio: "pipe" });
    } catch {
      console.warn(`skip (clone failed): ${r.name}`);
      continue;
    }
    const stamps = execFileSync("git", ["-C", dir, "log", `--since=${firstWeek}`, "--format=%ct"], { encoding: "utf8" })
      .split("\n")
      .filter(Boolean)
      .map(Number);
    const days = new Array(52 * 7).fill(0);
    for (const t of stamps) {
      const i = Math.floor((t - firstWeek) / DAY);
      if (i >= 0 && i < days.length) days[i]++;
    }
    const last = Number(execFileSync("git", ["-C", dir, "log", "-1", "--format=%ct"], { encoding: "utf8" }).trim());
    if (stamps.length) repos.push({ name: r.name, url: r.html_url, language: r.language, pushedAt: new Date(last * 1000).toISOString(), firstWeek, days });
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}

if (!repos.length) {
  console.error("No commits found; snapshot left unchanged.");
  process.exit(1);
}

// Only touch the file when the numbers moved, so the daily job doesn't commit timestamp churn
const strip = (p: GithubPulse) => JSON.stringify(p.repos);
const pulse: GithubPulse = { generatedAt: new Date().toISOString(), repos };
const total = repos.reduce((s, r) => s + r.days.reduce((a, b) => a + b, 0), 0);
if (previous && strip(previous) === strip(pulse)) {
  console.log(`No change (${repos.length} repos, ${total} commits).`);
} else {
  writeFileSync(file, JSON.stringify(pulse));
  console.log(`Snapshot: ${repos.length} repos, ${total} commits in the last 52 weeks.`);
}
