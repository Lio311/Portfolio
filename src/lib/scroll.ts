type LenisLike = { scrollTo: (target: Element, options?: Record<string, unknown>) => void };

/** Smooth-scroll to a section through Lenis when it's running, native otherwise. */
export function scrollToId(id: string) {
  const target = document.getElementById(id.replace(/^#/, ""));
  if (!target) return;
  const lenis = (window as unknown as { lenis?: LenisLike }).lenis;
  if (lenis) lenis.scrollTo(target);
  else target.scrollIntoView({ behavior: "smooth" });
}
