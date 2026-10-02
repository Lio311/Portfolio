// The production bots, described stage by stage. Schedules mirror each repo's
// .github/workflows cron (UTC), so the countdown on the site is the real next run.

export interface BotStage {
  title: string;
  items: string[];
}

export interface Bot {
  id: string;
  name: string;
  tagline: string;
  accent: string;
  cron: string;
  /** UTC hours the workflow fires at (minute 0 unless `minute` is set). */
  hoursUtc: number[];
  minute?: number;
  scheduleLabel: string;
  stages: [BotStage, BotStage, BotStage, BotStage];
  /** Representative log of one run (illustrative, no live data). */
  log: string[];
  link?: string;
  repo: string;
}

export const bots: Bot[] = [
  {
    id: "dira",
    name: "diraBot",
    tagline: "Every 4–5 room flat in 9 cities, from 6 sources, in one map.",
    accent: "#2dd4bf",
    cron: "0 */8 * * *",
    hoursUtc: [0, 8, 16],
    scheduleLabel: "every 8 hours",
    stages: [
      { title: "Trigger", items: ["GitHub Actions cron", "Cached Playwright browsers"] },
      {
        title: "Collect",
        items: ["Yad2 · Playwright (__NEXT_DATA__)", "OnMap · public JSON API", "Homeless · rotating city boards", "Madlan + Facebook · Apify actors"],
      },
      {
        title: "Understand",
        items: ["Hebrew post parsing (₪, rooms, m²)", "Cross-site fingerprint dedupe", "Price-drop history", "Taken-down ad verification"],
      },
      {
        title: "Deliver",
        items: ["Neon Postgres", "Map-first Next.js dashboard", "Emails to double-opt-in subscribers"],
      },
    ],
    log: [
      "$ npm run scrape",
      "▸ yad2      playwright · parsing __NEXT_DATA__",
      "▸ onmap     GET /api/search?city=…&rooms=4-5",
      "▸ homeless  board rotates by 8h slot (Cloudflare-friendly)",
      "▸ apify     madlan + facebook groups · spend guard on",
      "✓ dedupe    fingerprint(city, street, no., rooms, m²)",
      "✓ verify    re-checking ads unseen for 3+ days",
      "✉ notify    new listings + price drops → subscribers",
    ],
    link: "https://dira-bot-three.vercel.app",
    repo: "https://github.com/Lio311/dira-bot",
  },
  {
    id: "libero",
    name: "liberoBot",
    tagline: "Is our perfume cheaper than 22 competitors? Answered every morning.",
    accent: "#c084fc",
    cron: "0 1 * * *",
    hoursUtc: [1],
    scheduleLabel: "nightly · email at 08:00 Israel",
    stages: [
      { title: "Trigger", items: ["Nightly scan cron", "DST-aware 08:00 digest"] },
      {
        title: "Collect",
        items: ["Own catalog · WooCommerce REST", "Shopify /products.json", "WooCommerce Store API", "Konimbo · SFCC · Magento HTML"],
      },
      {
        title: "Understand",
        items: ["Barcode match, verified by volume", "Fallback: brand + name + ml + concentration", "Tester only vs tester", "±₪20 band vs cheapest in stock"],
      },
      {
        title: "Deliver",
        items: ["Daily snapshot + price history", "Passcode-protected dashboard", "Morning digest + instant failure alerts"],
      },
    ],
    log: [
      "$ npm run scrape",
      "▸ libero    WooCommerce REST · in-stock bottles & testers",
      "▸ sources   22 competitor sites in parallel",
      "▸ match     barcode → name + volume + concentration",
      "✓ classify  pricier / cheaper / same (±₪20)",
      "✓ snapshot  today's comparison saved to Neon",
      "⚠ alert     a site failed → keep last price, mark stale",
      "✉ digest    08:00 Israel · biggest gaps both ways",
    ],
    repo: "https://github.com/Lio311/libero-bot",
  },
  {
    id: "jo",
    name: "joBot",
    tagline: "A recruiter that reads every job board and my CV, three times a day.",
    accent: "#fbbf24",
    cron: "0 4,10,16 * * *",
    hoursUtc: [4, 10, 16],
    scheduleLabel: "3× a day",
    stages: [
      { title: "Trigger", items: ["GitHub Actions cron", "Profile edits re-score instantly"] },
      {
        title: "Collect",
        items: ["LinkedIn · AllJobs · Drushim", "JobMaster · GotFriends", "60+ ATS boards (Greenhouse, Lever, Ashby, Comeet)", "Google X-ray · Facebook groups"],
      },
      {
        title: "Understand",
        items: ["Free local keyword scoring", "Claude scores the promising ones", "JSON-schema output: fit, matched, missing", "CV PDF → profile draft"],
      },
      {
        title: "Deliver",
        items: ["Email with the best matches", "PWA dashboard + jobs map", "Explains why each job fits"],
      },
    ],
    log: [
      "$ npm run scrape",
      "▸ boards    greenhouse · lever · ashby · comeet",
      "▸ portals   linkedin · alljobs · drushim · jobmaster",
      "▸ x-ray     google site: queries",
      "✓ score     local keyword pass on every job",
      "✦ claude    structured output → { score, reason, missing }",
      "✉ notify    top matches with the reason in Hebrew",
    ],
    repo: "https://github.com/Lio311/joBot",
  },
];

/** Next time (ms) the schedule fires after `now`. */
export function nextRun(bot: Bot, now: number): number {
  const minute = bot.minute ?? 0;
  const d = new Date(now);
  for (let dayOffset = 0; dayOffset < 2; dayOffset++) {
    for (const h of [...bot.hoursUtc].sort((a, b) => a - b)) {
      const t = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + dayOffset, h, minute);
      if (t > now) return t;
    }
  }
  return now;
}
