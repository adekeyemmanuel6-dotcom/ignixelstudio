import type { ReactNode } from "react";

/** Server-friendly wrapper: GSAP (components/Motion.tsx) animates [data-reveal] on scroll. */
export function Reveal({ children, delay = 0, y = 32, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return <div className={className} data-reveal data-delay={delay || undefined} data-y={y !== 32 ? y : undefined}>{children}</div>;
}
