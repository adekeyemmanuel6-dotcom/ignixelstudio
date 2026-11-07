"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/** Smart cursor: a precise dot plus a smoothed ring that grows over interactive elements and shrinks on press.
 *  Mouse devices only; the native cursor stays visible (accessibility), and it is disabled for reduced motion. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const d = dot.current!, r = ring.current!;
    gsap.set([d, r], { xPercent: -50, yPercent: -50 });
    const dx = gsap.quickTo(d, "x", { duration: 0.12, ease: "power3" }), dy = gsap.quickTo(d, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.5, ease: "power3" }), ry = gsap.quickTo(r, "y", { duration: 0.5, ease: "power3" });
    const INTERACTIVE = "a,button,summary,[role=tab],[role=switch],label[for],select,[data-cursor]";
    let shown = false;
    const show = (v: boolean) => { if (shown !== v) { shown = v; gsap.to([d, r], { opacity: v ? 1 : 0, duration: 0.25 }); } };
    const move = (e: MouseEvent) => { show(true); dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); };
    const over = (e: MouseEvent) => {
      const t = e.target as Element | null;
      const text = t?.closest("input,textarea");
      const hot = !text && t?.closest(INTERACTIVE);
      gsap.to(r, { scale: text ? 0.4 : hot ? 1.6 : 1, backgroundColor: hot ? "rgba(255,255,255,.22)" : "rgba(255,255,255,0)", duration: 0.35, ease: "power3.out" });
      gsap.to(d, { scale: hot ? 0 : 1, duration: 0.25 });
    };
    const down = () => gsap.to(r, { scale: "-=0.35", duration: 0.2 });
    const up = (e: MouseEvent) => over(e);
    const leave = () => show(false);
    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over, { passive: true });
    window.addEventListener("mousedown", down); window.addEventListener("mouseup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move); document.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down); window.removeEventListener("mouseup", up);
      document.documentElement.removeEventListener("mouseleave", leave); gsap.killTweensOf([d, r]);
    };
  }, []);

  return (<><div ref={ring} className="cursor-ring" aria-hidden="true" /><div ref={dot} className="cursor-dot" aria-hidden="true" /></>);
}
