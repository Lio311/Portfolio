"use client";

import { useEffect, useRef } from "react";

// Full-page GPU backdrop: a domain-warped fBm "nebula" in raw WebGL (one fullscreen triangle, no
// three.js). It swirls around the cursor, flows faster with scroll velocity, and cross-fades its
// palette per section (and per selected bot via the "accent-change" event). Rendered at a fraction
// of the screen resolution; quality steps down if frames run slow, and it freezes on one frame
// for prefers-reduced-motion.

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseStr;
uniform float uVel;
uniform float uScroll;
uniform vec3 uColA;
uniform vec3 uColB;
uniform vec3 uColC;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = r * p * 2.02; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec2 m = (uMouse - 0.5) * vec2(uRes.x / uRes.y, 1.0);

  // Cursor: a soft vortex that twists the field around the pointer
  vec2 dm = p - m;
  float infl = exp(-dot(dm, dm) * 5.0) * uMouseStr;
  float a = infl * 1.8;
  p = m + mat2(cos(a), -sin(a), sin(a), cos(a)) * dm;

  // Scrolling drags the field upward; scroll speed stretches it vertically
  p.y += uScroll * 0.35;
  p.y *= 1.0 - clamp(uVel, 0.0, 1.0) * 0.35;

  float t = uTime * 0.045 * (1.0 + uVel * 2.5);
  vec2 q = vec2(fbm(p * 1.3 + vec2(0.0, t)), fbm(p * 1.3 + vec2(5.2, 1.3 - t)));
  vec2 r = vec2(fbm(p * 1.3 + 3.0 * q + vec2(1.7, 9.2) + 0.15 * t),
                fbm(p * 1.3 + 3.0 * q + vec2(8.3, 2.8) - 0.126 * t));
  float f = fbm(p * 1.3 + 3.0 * r);

  vec3 col = mix(uColA, uColB, clamp(f * f * 2.2, 0.0, 1.0));
  col = mix(col, uColC, clamp(length(r) * 0.55 - 0.15, 0.0, 1.0));
  float glow = smoothstep(0.3, 1.0, f) * 0.62 + infl * 0.35;

  vec3 base = vec3(0.035, 0.035, 0.043);
  col = base + col * glow * 0.42;
  col *= 1.0 - 0.45 * length(uv - 0.5);
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.014; // grain kills banding
  gl_FragColor = vec4(col, 1.0);
}
`;

type RGB = [number, number, number];
const hex = (h: string): RGB => {
  const n = parseInt(h.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

const PALETTES: Record<string, [string, string, string]> = {
  home: ["#4f46e5", "#9333ea", "#db2777"],
  about: ["#1d4ed8", "#6366f1", "#0891b2"],
  bots: ["#4f46e5", "#2dd4bf", "#2dd4bf"],
  projects: ["#7c3aed", "#db2777", "#4f46e5"],
  contact: ["#4338ca", "#2563eb", "#9333ea"],
};

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
  return s;
}

export function ShaderBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, depth: false, powerPreference: "low-power" });
    if (!gl) return; // CSS background stays as the fallback

    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    } catch {
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u("uRes"), uTime = u("uTime"), uMouse = u("uMouse"), uMouseStr = u("uMouseStr");
    const uVel = u("uVel"), uScroll = u("uScroll"), uColA = u("uColA"), uColB = u("uColB"), uColC = u("uColC");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    // Fraction of CSS pixels rendered; the blur-like field upscales without visible loss
    let scale = coarse ? 0.3 : 0.5;

    const resize = () => {
      const w = Math.max(1, Math.round(window.innerWidth * scale));
      const h = Math.max(1, Math.round(window.innerHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    resize();

    // Eased state
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, str: 0, tstr: 0 };
    let vel = 0;
    let lastScrollY = window.scrollY;
    const cur = PALETTES.home.map(hex) as [RGB, RGB, RGB];
    let target = PALETTES.home.map(hex) as [RGB, RGB, RGB];
    let section = "home";
    let botAccent = "#2dd4bf";

    const setSection = (id: string) => {
      section = id;
      const pal = id === "bots" ? ["#312e81", botAccent, botAccent] : PALETTES[id] ?? PALETTES.home;
      target = pal.map(hex) as [RGB, RGB, RGB];
      if (reduced) draw(performance.now());
    };

    const onAccent = (e: Event) => {
      botAccent = (e as CustomEvent<string>).detail;
      if (section === "bots") setSection("bots");
    };

    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = 1 - e.clientY / window.innerHeight;
      mouse.tstr = 1;
    };

    const io = new IntersectionObserver(
      (entries) => {
        // The section crossing the middle of the viewport owns the palette
        for (const en of entries) if (en.isIntersecting) setSection(en.target.id);
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    ["home", "about", "bots", "projects", "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    const start = performance.now();
    let raf = 0;
    let frames = 0;
    let slowFrames = 0;
    let prev = start;

    function draw(now: number) {
      const k = reduced ? 1 : 0.04;
      for (let i = 0; i < 3; i++) for (let c = 0; c < 3; c++) cur[i][c] += (target[i][c] - cur[i][c]) * k;
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      mouse.str += (mouse.tstr - mouse.str) * 0.05;
      mouse.tstr *= 0.985; // vortex relaxes when the pointer rests

      const sy = window.scrollY;
      const dy = Math.abs(sy - lastScrollY);
      lastScrollY = sy;
      vel += (Math.min(dy / 60, 1) - vel) * 0.08;

      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      gl!.uniform1f(uTime, reduced ? 12 : (now - start) / 1000);
      gl!.uniform2f(uMouse, mouse.x, mouse.y);
      gl!.uniform1f(uMouseStr, coarse ? 0 : mouse.str);
      gl!.uniform1f(uVel, vel);
      gl!.uniform1f(uScroll, sy / window.innerHeight);
      gl!.uniform3fv(uColA, cur[0]);
      gl!.uniform3fv(uColB, cur[1]);
      gl!.uniform3fv(uColC, cur[2]);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }

    const loop = (now: number) => {
      // Performance budget: step resolution down after sustained slow frames, stop at the floor
      const dt = now - prev;
      prev = now;
      if (++frames > 30 && dt > 28) slowFrames++;
      if (slowFrames > 45) {
        slowFrames = 0;
        if (scale > 0.22) {
          scale = Math.max(0.2, scale * 0.7);
          resize();
        } else {
          draw(now); // keep the last frame as a still image
          canvas.dataset.quality = "static";
          return;
        }
      }
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduced && canvas.dataset.quality !== "static") {
        prev = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    const onLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("accent-change", onAccent);
    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("webglcontextlost", onLost);

    if (reduced) draw(start);
    else raf = requestAnimationFrame(loop);
    canvas.style.opacity = "1";

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("accent-change", onAccent);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none opacity-0 transition-opacity duration-1000"
    />
  );
}
