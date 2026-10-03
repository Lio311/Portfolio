import type { CoverKind } from "@/lib/projects-data";

// Animated SVG covers for projects with no screenshot (hardware, offline apps). Pure SVG + CSS
// keyframes (globals.css, "cover-*"), so they cost nothing to render and freeze under
// prefers-reduced-motion.

const frame = "absolute inset-0 w-full h-full";

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
  device: Device,
};

export function ProjectCover({ kind }: { kind: CoverKind }) {
  const Cover = covers[kind];
  return <Cover />;
}
