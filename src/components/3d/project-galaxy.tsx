"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Line, OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { ArrowLeft, ArrowRight, ArrowUpRight, Lock, X } from "lucide-react";
import { projectsData, type Project, type ProjectCategory } from "@/lib/projects-data";
import { GithubIcon } from "@/components/ui/icons";

// Projects as a 3D star map: one cluster per primary category, stars sized by how much a project
// carries, and faint "constellations" between projects that share technologies. Clicking a star
// flies the camera to it; ←/→ step through the projects, Esc flies back out.

const CLUSTERS: Record<ProjectCategory, { center: [number, number, number]; color: string; label: string }> = {
  automation: { center: [-4.4, 1.4, 0.4], color: "#2dd4bf", label: "Bots & Automation" },
  ai: { center: [4.2, 2.2, -1.2], color: "#c084fc", label: "AI & ML" },
  fullstack: { center: [-1.2, -2.6, 1.6], color: "#818cf8", label: "Full-Stack" },
  biomedical: { center: [4.4, -2.4, 1.8], color: "#f472b6", label: "Biomedical" },
};

const HOME_CAMERA = new THREE.Vector3(0, 0.6, 14);

// Deterministic jitter so the layout is identical on every load
function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

// "Next.js 16" and "Next.js" are the same technology for constellation purposes
const normTag = (t: string) => t.toLowerCase().replace(/\s*\d+(\.\d+)?$/, "").trim();

interface Star {
  project: Project;
  pos: THREE.Vector3;
  color: string;
  size: number;
}

function buildStars(): Star[] {
  const counters: Partial<Record<ProjectCategory, number>> = {};
  return projectsData.map((project, i) => {
    const cat = project.categories[0];
    const n = (counters[cat] = (counters[cat] ?? 0) + 1);
    const c = CLUSTERS[cat];
    // Golden-angle spiral around the cluster centre, with depth jitter
    const angle = n * 2.399963;
    const radius = 0.55 + Math.sqrt(n) * 0.62;
    const pos = new THREE.Vector3(
      c.center[0] + Math.cos(angle) * radius,
      c.center[1] + Math.sin(angle) * radius * 0.75,
      c.center[2] + (rand(i + 1) - 0.5) * 2.2
    );
    const weight = (project.highlights?.length ?? 0) + (project.isNew ? 1 : 0);
    return { project, pos, color: c.color, size: 0.11 + weight * 0.025 };
  });
}

function buildLinks(stars: Star[]) {
  const links: [number, number][] = [];
  for (let a = 0; a < stars.length; a++) {
    const ta = new Set(stars[a].project.tags.map(normTag));
    for (let b = a + 1; b < stars.length; b++) {
      const shared = stars[b].project.tags.map(normTag).filter((t) => ta.has(t)).length;
      if (shared >= 2) links.push([a, b]);
    }
  }
  return links;
}

const STARS = buildStars();
const LINKS = buildLinks(STARS);

function StarMesh({
  star,
  dimmed,
  active,
  hovered,
  onHover,
  onSelect,
}: {
  star: Star;
  dimmed: boolean;
  active: boolean;
  hovered: boolean;
  onHover: (on: boolean) => void;
  onSelect: () => void;
}) {
  const halo = useRef<THREE.Mesh>(null);
  const phase = useMemo(() => rand(star.pos.x * 13 + star.pos.y) * Math.PI * 2, [star]);

  useFrame(({ clock }) => {
    if (!halo.current) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 1.6 + phase) * 0.12;
    const s = (active || hovered ? 3 : 2.4) * pulse;
    halo.current.scale.setScalar(THREE.MathUtils.lerp(halo.current.scale.x, s, 0.15));
  });

  const opacity = dimmed ? 0.12 : 1;
  return (
    <group position={star.pos}>
      <mesh
        onPointerOver={(e) => {
          if (dimmed) return;
          e.stopPropagation();
          onHover(true);
        }}
        onPointerOut={() => onHover(false)}
        onClick={(e) => {
          if (dimmed) return;
          e.stopPropagation();
          onSelect();
        }}
      >
        <sphereGeometry args={[star.size * 2.4, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[star.size, 24, 24]} />
        <meshBasicMaterial color={active || hovered ? "#ffffff" : star.color} transparent opacity={opacity} />
      </mesh>
      <mesh ref={halo}>
        <sphereGeometry args={[star.size, 16, 16]} />
        <meshBasicMaterial color={star.color} transparent opacity={0.18 * opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Always mounted: drei's Html owns a React root, and mounting it on hover races React's render */}
      <Html center distanceFactor={9} position={[0, star.size + 0.45, 0]} style={{ pointerEvents: "none" }}>
        <div
          className="whitespace-nowrap px-2.5 py-1 rounded-md bg-black/80 border border-white/15 text-white text-[13px] font-medium shadow-lg transition-opacity duration-200"
          style={{ opacity: (hovered || active) && !dimmed ? 1 : 0 }}
        >
          {star.project.title.replace(/\s*\(.*\)$/, "")}
        </div>
      </Html>
    </group>
  );
}

function CameraRig({ target }: { target: THREE.Vector3 | null }) {
  const camera = useThree((st) => st.camera);
  // Portrait screens see less sideways, so the home view backs off until every cluster fits
  const aspect = useThree((st) => st.size.width / st.size.height);
  const controls = useThree((st) => st.controls) as OrbitControlsImpl | null;
  const flying = useRef(false);
  const goal = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    flying.current = true;
    if (target) {
      // Approach from the current side so the flight never swings through the cluster
      const dir = camera.position.clone().sub(target).setY(0).normalize();
      goal.copy(target).addScaledVector(dir, 5.5).add(new THREE.Vector3(0, 0.8, 0));
      look.copy(target);
    } else {
      goal.copy(HOME_CAMERA).multiplyScalar(Math.min(1.9, Math.max(1, 1.15 / aspect)));
      look.set(0, 0, 0);
    }
  }, [target, camera, goal, look, aspect]);

  // Grabbing the scene hands control back to the user mid-flight
  useEffect(() => {
    if (!controls) return;
    const stop = () => (flying.current = false);
    controls.addEventListener("start", stop);
    return () => controls.removeEventListener("start", stop);
  }, [controls]);

  useFrame((state, dt) => {
    const c = state.controls as OrbitControlsImpl | null;
    if (!c || !flying.current) return;
    const k = 1 - Math.pow(0.02, dt); // frame-rate independent ease
    state.camera.position.lerp(goal, k);
    c.target.lerp(look, k);
    if (state.camera.position.distanceTo(goal) < 0.02) flying.current = false;
  });
  return null;
}

function Scene({
  stars,
  links,
  filter,
  selected,
  setSelected,
}: {
  stars: Star[];
  links: [number, number][];
  filter: ProjectCategory | "all";
  selected: number | null;
  setSelected: (i: number | null) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const coarse = useMemo(() => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches, []);
  const matches = (s: Star) => filter === "all" || s.project.categories.includes(filter);
  const focus = hovered ?? selected;

  useEffect(() => {
    document.body.style.cursor = hovered !== null ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  return (
    <>
      <Stars radius={60} depth={40} count={2500} factor={3} saturation={0} fade speed={0.6} />
      {(Object.keys(CLUSTERS) as ProjectCategory[]).map((k) => (
        <Html key={k} position={[CLUSTERS[k].center[0], CLUSTERS[k].center[1] + 1.9, CLUSTERS[k].center[2]]} center distanceFactor={12} style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap text-[13px] font-mono uppercase tracking-[0.25em]" style={{ color: CLUSTERS[k].color, opacity: filter === "all" || filter === k ? 0.85 : 0.2 }}>
            {CLUSTERS[k].label}
          </div>
        </Html>
      ))}
      {links.map(([a, b]) => {
        const lit = focus !== null && (a === focus || b === focus);
        const visible = matches(stars[a]) && matches(stars[b]);
        return (
          <Line
            key={`${a}-${b}`}
            points={[stars[a].pos, stars[b].pos]}
            color={lit ? "#e0e7ff" : "#6366f1"}
            transparent
            opacity={!visible ? 0.02 : lit ? 0.75 : 0.09}
            lineWidth={lit ? 1.4 : 1}
          />
        );
      })}
      {stars.map((s, i) => (
        <StarMesh
          key={s.project.id}
          star={s}
          dimmed={!matches(s)}
          active={selected === i}
          hovered={hovered === i}
          onHover={(on) => setHovered((h) => (on ? i : h === i ? null : h))}
          onSelect={() => setSelected(i)}
        />
      ))}
      <OrbitControls
        makeDefault
        autoRotate={selected === null}
        enablePan={false}
        enableRotate={!coarse}
        enableZoom
        minDistance={2.5}
        maxDistance={32}
        autoRotateSpeed={0.35}
        enableDamping
      />
      <CameraRig target={selected !== null ? stars[selected].pos : null} />
    </>
  );
}

export default function ProjectGalaxy({ filter }: { filter: ProjectCategory | "all" }) {
  const stars = STARS;
  const links = LINKS;
  const [selected, setSelected] = useState<number | null>(null);
  const [inView, setInView] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);
  const visible = useMemo(() => stars.map((s, i) => (filter === "all" || s.project.categories.includes(filter) ? i : -1)).filter((i) => i >= 0), [stars, filter]);

  // A filter change that hides the open project closes it
  const shown = selected !== null && visible.includes(selected) ? selected : null;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const step = (dir: 1 | -1) => {
    if (!visible.length) return;
    const at = shown === null ? -1 : visible.indexOf(shown);
    setSelected(visible[(at + dir + visible.length) % visible.length]);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "Escape") setSelected(null);
    else return;
    e.preventDefault();
  };

  const p = shown !== null ? stars[shown].project : null;
  const href = p?.link ?? p?.repo;

  return (
    <div
      ref={wrapRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label="3D map of projects. Use the arrow keys to move between projects, Escape to zoom out."
      className="relative h-[72vh] min-h-[520px] rounded-2xl overflow-hidden border border-zinc-800 bg-[radial-gradient(ellipse_at_center,#14112b_0%,#060609_70%)] outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <Canvas frameloop={inView ? "always" : "never"} camera={{ position: HOME_CAMERA.toArray(), fov: 50 }} dpr={[1, 2]} onPointerMissed={() => setSelected(null)}>
        <Scene stars={stars} links={links} filter={filter} selected={shown} setSelected={setSelected} />
      </Canvas>

      <div className="pointer-events-none absolute top-4 left-4 text-[11px] font-mono text-zinc-500 leading-5">
        <p>{visible.length} projects · {links.length} shared-tech links</p>
        <p className="hidden sm:block">drag to orbit · scroll to zoom · click a star · ←/→</p>
        <p className="sm:hidden">tap a star · pinch to zoom</p>
      </div>

      <div className="absolute top-3 right-3 flex gap-2">
        <button type="button" onClick={() => step(-1)} aria-label="Previous project" className="p-2 rounded-lg bg-black/60 border border-zinc-700 text-zinc-300 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => step(1)} aria-label="Next project" className="p-2 rounded-lg bg-black/60 border border-zinc-700 text-zinc-300 hover:text-white">
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {p && (
        <div className="absolute left-3 right-3 bottom-3 sm:left-auto sm:right-4 sm:bottom-4 sm:w-[380px] rounded-xl bg-zinc-950/90 border border-zinc-700/80 backdrop-blur-md p-5 shadow-2xl" role="region" aria-live="polite" aria-label={p.title}>
          <button type="button" onClick={() => setSelected(null)} aria-label="Close" className="absolute top-3 right-3 text-zinc-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
          <p className="text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: CLUSTERS[p.categories[0]].color }}>
            {CLUSTERS[p.categories[0]].label}
          </p>
          <h3 className="text-base font-bold text-white font-poppins mb-2 pr-6">{p.title}</h3>
          <p className="text-[13px] text-zinc-300 leading-relaxed line-clamp-4 mb-3">{p.description}</p>
          <div className="flex flex-wrap gap-1 mb-4">
            {p.tags.slice(0, 6).map((t) => (
              <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300">
                {t}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {p.link ? (
              <a href={p.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white">
                Live <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            ) : href ? (
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-800">
                <Lock className="w-3.5 h-3.5" /> Private app
              </span>
            ) : null}
            {p.repo && (
              <a href={p.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700">
                <GithubIcon className="w-3.5 h-3.5" /> Code
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
