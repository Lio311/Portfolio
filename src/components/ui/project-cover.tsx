import type { CoverKind } from "@/lib/projects-data";

// Animated SVG covers for projects whose app is private (passcode dashboards) or has no
// screenshot. Pure SVG + CSS keyframes (globals.css, "cover-*"), so they cost nothing to render
// and freeze under prefers-reduced-motion.

const frame = "absolute inset-0 w-full h-full";

function PriceRadar() {
  // Libero's price vs. the cheapest competitor per product: bars above the line are "pricier".
  const bars = [62, 48, 80, 55, 70, 38, 66, 52, 74, 44, 58, 69];
  return (
    <svg viewBox="0 0 400 220" className={frame} aria-hidden="true">
      <defs>
        <linearGradient id="pr-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1a1033" />
          <stop offset="1" stopColor="#0b0b12" />
        </linearGradient>
        <linearGradient id="pr-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c084fc" />
          <stop offset="1" stopColor="#6366f1" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="pr-scan" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#22d3ee" stopOpacity="0" />
          <stop offset="1" stopColor="#22d3ee" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill="url(#pr-bg)" />
      {[50, 90, 130, 170].map((y) => (
        <line key={y} x1="24" x2="376" y1={y} y2={y} stroke="#ffffff" strokeOpacity="0.05" />
      ))}
      {bars.map((h, i) => (
        <rect
          key={i}
          x={32 + i * 29}
          y={176 - h * 1.35}
          width="16"
          height={h * 1.35}
          rx="3"
          fill="url(#pr-bar)"
          className="cover-bar"
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
      {/* the ±₪20 "same price" band */}
      <rect x="24" y="86" width="352" height="18" fill="#22c55e" fillOpacity="0.08" />
      <line x1="24" x2="376" y1="95" y2="95" stroke="#4ade80" strokeDasharray="4 4" strokeOpacity="0.7" />
      <rect x="0" y="0" width="70" height="220" fill="url(#pr-scan)" className="cover-scan" />
      <g fontFamily="ui-monospace, monospace" fontSize="10">
        <rect x="24" y="186" width="118" height="20" rx="10" fill="#ffffff" fillOpacity="0.06" stroke="#ffffff" strokeOpacity="0.1" />
        <circle cx="36" cy="196" r="3" fill="#4ade80" className="cover-blink" />
        <text x="45" y="199.5" fill="#d4d4d8">scanning 22 sites</text>
        <text x="376" y="82" textAnchor="end" fill="#86efac">±₪20 band</text>
      </g>
    </svg>
  );
}

function JobMatch() {
  const rows = [
    { t: "AI Engineer", c: "Series B startup", s: 94 },
    { t: "Full-Stack Developer", c: "Fintech", s: 81 },
    { t: "ML Engineer, Vision", c: "MedTech", s: 67 },
  ];
  const r = 13;
  const circ = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 400 220" className={frame} aria-hidden="true">
      <defs>
        <linearGradient id="jm-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0c1a2e" />
          <stop offset="1" stopColor="#0b0b12" />
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill="url(#jm-bg)" />
      {rows.map((row, i) => {
        const y = 46 + i * 56;
        const color = row.s >= 85 ? "#4ade80" : row.s >= 75 ? "#a78bfa" : "#fbbf24";
        return (
          <g key={row.t} className="cover-row" style={{ animationDelay: `${i * 0.25}s` }}>
            <rect x="24" y={y} width="352" height="44" rx="10" fill="#ffffff" fillOpacity="0.04" stroke="#ffffff" strokeOpacity="0.08" />
            <text x="40" y={y + 20} fill="#f4f4f5" fontSize="13" fontWeight="600" fontFamily="system-ui, sans-serif">
              {row.t}
            </text>
            <text x="40" y={y + 36} fill="#a1a1aa" fontSize="10" fontFamily="system-ui, sans-serif">
              {row.c}
            </text>
            <circle cx="350" cy={y + 23} r={r} fill="none" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="3" />
            <circle
              cx="350"
              cy={y + 23}
              r={r}
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - row.s / 100)}
              transform={`rotate(-90 350 ${y + 23})`}
              className="cover-ring"
              style={{ ["--ring-from" as string]: `${circ}px`, animationDelay: `${0.3 + i * 0.25}s` }}
            />
            <text x="350" y={y + 26.5} textAnchor="middle" fill={color} fontSize="9.5" fontWeight="700" fontFamily="ui-monospace, monospace">
              {row.s}
            </text>
            {i === 0 && (
              <g>
                <rect x="238" y={y + 12} width="78" height="20" rx="10" fill="#d97757" fillOpacity="0.15" stroke="#d97757" strokeOpacity="0.5" />
                <text x="277" y={y + 25.5} textAnchor="middle" fill="#f0a587" fontSize="9.5" fontFamily="ui-monospace, monospace">
                  Claude ✓ fit
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function AgentGraph() {
  const nodes = [
    { x: 70, y: 110, l: "Ingest" },
    { x: 170, y: 55, l: "RAG" },
    { x: 170, y: 165, l: "GraphRAG" },
    { x: 270, y: 110, l: "Editor" },
    { x: 345, y: 110, l: "Publish" },
  ];
  const edges: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [3, 4],
  ];
  return (
    <svg viewBox="0 0 400 220" className={frame} aria-hidden="true">
      <defs>
        <radialGradient id="ag-bg" cx="0.5" cy="0.5" r="0.7">
          <stop offset="0" stopColor="#1e1b4b" />
          <stop offset="1" stopColor="#09090b" />
        </radialGradient>
      </defs>
      <rect width="400" height="220" fill="url(#ag-bg)" />
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="#818cf8"
          strokeOpacity="0.6"
          strokeWidth="1.5"
          strokeDasharray="5 6"
          className="cover-flow"
        />
      ))}
      {nodes.map((n, i) => (
        <g key={n.l}>
          <circle cx={n.x} cy={n.y} r="22" fill="#818cf8" fillOpacity="0.12" className="cover-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
          <circle cx={n.x} cy={n.y} r="14" fill="#13131c" stroke="#a78bfa" strokeWidth="1.5" />
          <circle cx={n.x} cy={n.y} r="4" fill="#c4b5fd" />
          <text x={n.x} y={n.y + 32} textAnchor="middle" fill="#d4d4d8" fontSize="10" fontFamily="ui-monospace, monospace">
            {n.l}
          </text>
        </g>
      ))}
    </svg>
  );
}

function Device() {
  return (
    <svg viewBox="0 0 400 220" className={frame} aria-hidden="true">
      <defs>
        <linearGradient id="dv-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a0f1f" />
          <stop offset="1" stopColor="#0b0b12" />
        </linearGradient>
        <linearGradient id="dv-heat" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset="0.5" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill="url(#dv-bg)" />
      {/* strap + case */}
      <rect x="168" y="10" width="64" height="200" rx="18" fill="#18181b" stroke="#3f3f46" />
      <rect x="140" y="58" width="120" height="104" rx="26" fill="#0f0f14" stroke="#f472b6" strokeOpacity="0.6" strokeWidth="2" />
      <text x="200" y="100" textAnchor="middle" fill="#fda4af" fontSize="22" fontWeight="700" fontFamily="ui-monospace, monospace">
        36.8°
      </text>
      <polyline
        points="156,128 170,128 176,116 184,140 192,122 198,128 244,128"
        fill="none"
        stroke="#f472b6"
        strokeWidth="2"
        strokeLinejoin="round"
        className="cover-trace"
      />
      <rect x="296" y="50" width="10" height="120" rx="5" fill="url(#dv-heat)" opacity="0.8" />
      <circle cx="301" cy="92" r="6" fill="#fff" className="cover-blink" />
      <g fontFamily="ui-monospace, monospace" fontSize="10" fill="#a1a1aa">
        <text x="40" y="70">Arduino</text>
        <text x="40" y="92">SolidWorks</text>
        <text x="40" y="114">Thermal sensing</text>
      </g>
    </svg>
  );
}

const covers: Record<CoverKind, () => React.JSX.Element> = {
  "price-radar": PriceRadar,
  "job-match": JobMatch,
  "agent-graph": AgentGraph,
  device: Device,
};

export function ProjectCover({ kind }: { kind: CoverKind }) {
  const Cover = covers[kind];
  return <Cover />;
}
