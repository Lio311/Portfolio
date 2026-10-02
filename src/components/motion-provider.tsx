"use client";

import { MotionConfig } from "framer-motion";

/** Framer Motion follows the OS "reduce motion" setting site-wide. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
