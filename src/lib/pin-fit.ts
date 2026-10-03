import { ScrollTrigger } from "gsap/ScrollTrigger";

// Pins a scroll-driven block below the navbar, scaled down when needed so the whole block stays in
// frame. Candidates go from most to least complete (e.g. "header + stage", then "stage"); the first
// that still reads well at the screen's height wins. `fit` is the element that gets scaled; `pin` is
// its wrapper, whose height is set to the scaled size so the layout below doesn't leave a gap.

const NAVBAR = 84;
const BREATHING_ROOM = 16;
/** Below this the 13px copy drops under ~10px, so a smaller candidate is better. */
const MIN_SCALE = 0.78;

export interface FitCandidate {
  pin: HTMLElement;
  fit: HTMLElement;
}

const available = () => window.innerHeight - NAVBAR - BREATHING_ROOM;
// offsetHeight ignores transforms, so this is the natural height even while scaled
const scaleFor = (c: FitCandidate) => Math.min(1, available() / c.fit.offsetHeight);

export function createFitPin(candidates: FitCandidate[], vars: Omit<ScrollTrigger.Vars, "trigger" | "pin" | "start">) {
  const chosen = candidates.find((c) => scaleFor(c) >= MIN_SCALE);
  if (!chosen) return null;

  const fit = () => {
    const s = scaleFor(chosen);
    chosen.fit.style.transformOrigin = "top center";
    chosen.fit.style.transform = s < 1 ? `scale(${s})` : "";
    chosen.pin.style.height = s < 1 ? `${chosen.fit.offsetHeight * s}px` : "";
  };
  fit();
  ScrollTrigger.addEventListener("refreshInit", fit);

  const st = ScrollTrigger.create({ ...vars, trigger: chosen.pin, pin: chosen.pin, start: `top top+=${NAVBAR}` });

  return {
    st,
    cleanup() {
      ScrollTrigger.removeEventListener("refreshInit", fit);
      chosen.fit.style.transform = "";
      chosen.pin.style.height = "";
    },
  };
}
