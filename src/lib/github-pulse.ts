// GitHub activity for the "Pulse" section. The data is a snapshot in src/data/github-pulse.json,
// rebuilt daily from the repos' git history by scripts/github-pulse.mts (GitHub Actions).

export const GITHUB_USER = "Lio311";
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
