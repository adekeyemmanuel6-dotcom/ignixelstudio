"use client";
import { useEffect, useState } from "react";
import { Ico } from "@/components/ui/Ico";

/** Bottom-left "back to top" with a scroll-progress ring. Appears after the first screen of scrolling. */
export function BackToTop() {
  const [show, setShow] = useState(false);
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const calc = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      setShow(scrollY > 600); setP(max > 0 ? Math.min(1, scrollY / max) : 0);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(calc); };
    calc(); window.addEventListener("scroll", on, { passive: true }); window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); if (raf) cancelAnimationFrame(raf); };
  }, []);

  const go = () => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  const C = 2 * Math.PI * 22;
  return (
    <button type="button" onClick={go} aria-label="Back to top" tabIndex={show ? 0 : -1} data-cursor
      className={`group fixed bottom-4 left-4 z-40 grid h-14 w-14 place-items-center rounded-[5px] bg-ink text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,.6)] ring-1 ring-white/15 transition duration-300 hover:bg-brand sm:bottom-6 sm:left-6 ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}>
      <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="2" />
        <circle cx="24" cy="24" r="22" fill="none" stroke="#6fdc5a" strokeWidth="2" strokeDasharray={C} strokeDashoffset={C * (1 - p)} strokeLinecap="round" />
      </svg>
      <Ico name="arrow_upward" className="relative h-6 w-6 transition group-hover:-translate-y-0.5" />
    </button>
  );
}
