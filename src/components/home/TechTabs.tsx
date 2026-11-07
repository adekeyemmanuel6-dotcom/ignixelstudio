"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";

export function TechTabs({ tabs }: { tabs: { label: string; count: number; node: ReactNode }[] }) {
  const [i, setI] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (!box.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => gsap.fromTo("li", { autoAlpha: 0, y: 22, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.035, ease: "power3.out" }), box);
    return () => ctx.revert();
  }, [i]);
  const onKey = (e: React.KeyboardEvent, idx: number) => {
    const n = tabs.length; let t = idx;
    if (e.key === "ArrowRight") t = (idx + 1) % n; else if (e.key === "ArrowLeft") t = (idx - 1 + n) % n; else return;
    e.preventDefault(); setI(t); refs.current[t]?.focus();
  };
  return (
    <div>
      <div role="tablist" aria-label="Technology categories" className="flex flex-wrap gap-2">
        {tabs.map((t, idx) => (
          <button key={t.label} ref={(el) => { refs.current[idx] = el; }} role="tab" id={`ttab-${idx}`} aria-selected={i === idx} aria-controls="tpanel" tabIndex={i === idx ? 0 : -1} onClick={() => setI(idx)} onKeyDown={(e) => onKey(e, idx)}
            className={`rounded-full border px-5 py-2.5 text-base font-semibold transition ${i === idx ? "border-ink bg-ink text-white" : "border-line bg-white text-text hover:border-brand hover:text-brand"}`}>
            {t.label} <span className={i === idx ? "text-white/60" : "text-text-2"}>{t.count}</span>
          </button>
        ))}
      </div>
      <div ref={box} role="tabpanel" id="tpanel" aria-labelledby={`ttab-${i}`} className="mt-8 min-h-[220px]">{tabs[i].node}</div>
    </div>
  );
}
