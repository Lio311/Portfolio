/** How far the hero has scrolled out (0..1). Written by the hero's ScrollTrigger, read every frame
 * by the 3D scene, so it's a plain mutable object rather than React state. */
export const heroScroll = { progress: 0 };
