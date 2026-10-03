// GitHub activity for the "Pulse" section. The page renders a snapshot built from local git
// history (scripts/github-pulse.mts), then the browser asks GitHub's stats API for fresher numbers.
// commit_activity answers 202 while GitHub computes a repo's stats, so the browser makes one attempt
// per repo and keeps the snapshot for the rest (anonymous calls: 60 an hour per visitor).

export const GITHUB_USER = "Lio311";
const REPO_LIMIT = 12;
const WEEK = 7 * 86400;

export interface RepoPulse {
  name: string;
  url: string;
  language: string | null;
  pushedAt: string;
  /** Unix seconds of the Sunday that starts `days`. */
  firstWeek: number;
  /** Commits per day, 52 weeks × 7, oldest first. */
  days: number[];
}

export interface GithubPulse {
  generatedAt: string;
  repos: RepoPulse[];
}

type WeekStat = { week: number; total: number; days: number[] };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function gh<T>(path: string, token?: string): Promise<{ status: number; data: T | null }> {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: { Accept: "application/vnd.github+json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    cache: "no-store",
  });
  if (res.status !== 200) return { status: res.status, data: null };
  return { status: 200, data: (await res.json()) as T };
}

async function commitActivity(repo: string, attempts: number, token?: string): Promise<WeekStat[] | null> {
  for (let i = 0; i < attempts; i++) {
    const { status, data } = await gh<WeekStat[]>(`/repos/${GITHUB_USER}/${repo}/stats/commit_activity`, token);
    if (status === 200 && Array.isArray(data) && data.length) return data;
    if (status !== 202) return null;
    if (i < attempts - 1) await sleep(2000 * (i + 1));
  }
  return null;
}

/** Live activity of the most recently pushed repos; null when rate-limited or nothing is ready. */
export async function fetchGithubPulse({ attempts = 1, token }: { attempts?: number; token?: string } = {}): Promise<GithubPulse | null> {
  const list = await gh<{ name: string; html_url: string; language: string | null; pushed_at: string; fork: boolean }[]>(
    `/users/${GITHUB_USER}/repos?sort=pushed&per_page=50`,
    token
  );
  if (!list.data) return null;
  const candidates = list.data.filter((r) => !r.fork).slice(0, REPO_LIMIT);
  const stats = await Promise.all(candidates.map((r) => commitActivity(r.name, attempts, token)));

  const repos = candidates.flatMap((r, i): RepoPulse[] => {
    const weeks = stats[i];
    if (!weeks) return [];
    return [{ name: r.name, url: r.html_url, language: r.language, pushedAt: r.pushed_at, firstWeek: weeks[0].week, days: weeks.flatMap((w) => w.days) }];
  });
  return repos.length ? { generatedAt: new Date().toISOString(), repos } : null;
}

/** Live repos win; snapshot repos fill the gaps (GitHub still computing, or rate-limited). */
export function mergePulse(snapshot: GithubPulse, live: GithubPulse | null): GithubPulse {
  if (!live) return snapshot;
  const byName = new Map(snapshot.repos.map((r) => [r.name, r]));
  live.repos.forEach((r) => byName.set(r.name, r));
  return { generatedAt: live.generatedAt, repos: [...byName.values()] };
}

/** Daily totals across repos on a common 52-week grid ending at the newest repo's last week. */
export function aggregate(pulse: GithubPulse) {
  const firstWeek = Math.max(...pulse.repos.map((r) => r.firstWeek));
  const days = new Array(52 * 7).fill(0);
  const repos = pulse.repos
    .map((r) => {
      const shift = Math.round((firstWeek - r.firstWeek) / WEEK) * 7;
      const aligned = Array.from({ length: 52 * 7 }, (_, i) => r.days[i + shift] ?? 0);
      aligned.forEach((n, i) => (days[i] += n));
      const weeks = Array.from({ length: 52 }, (_, w) => aligned.slice(w * 7, w * 7 + 7).reduce((a, b) => a + b, 0));
      return { ...r, weeks, total: weeks.reduce((a, b) => a + b, 0) };
    })
    .filter((r) => r.total > 0)
    .sort((a, b) => b.total - a.total);
  return { firstWeek, days, repos };
}
