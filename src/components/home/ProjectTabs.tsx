"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ArrowUpRight } from "@/components/ui/Ico";
import type { CaseStudy } from "@/lib/types";

export function ProjectTabs({ projects, fallback }: { projects: CaseStudy[]; fallback: string[] }) {
  const [i, setI] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (!panel.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-tab-anim]", { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.07, ease: "power3.out" });
      gsap.fromTo("[data-tab-img]", { scale: 1.14 }, { scale: 1, duration: 1.2, ease: "expo.out" });
    }, panel);
    return () => ctx.revert();
  }, [i]);

  const onKey = (e: React.KeyboardEvent, idx: number) => {
    const n = projects.length; let t = idx;
    if (e.key === "ArrowRight") t = (idx + 1) % n; else if (e.key === "ArrowLeft") t = (idx - 1 + n) % n; else if (e.key === "Home") t = 0; else if (e.key === "End") t = n - 1; else return;
    e.preventDefault(); setI(t); refs.current[t]?.focus();
  };
  const p = projects[i];
  const own = p.featured_image || p.desktop_image || p.mobile_image;
  const img = own || (p.is_placeholder ? fallback[i % fallback.length] : null);

  return (
    <div>
      <div role="tablist" aria-label="Selected projects" className="grid border-b border-white/15 sm:grid-cols-3">
        {projects.map((x, idx) => (
          <button key={x.id} ref={(el) => { refs.current[idx] = el; }} role="tab" id={`ptab-${idx}`} aria-selected={i === idx} aria-controls="ppanel" tabIndex={i === idx ? 0 : -1}
            onClick={() => setI(idx)} onKeyDown={(e) => onKey(e, idx)}
            className={`group relative flex items-baseline gap-4 px-1 py-5 text-left transition sm:px-6 ${i === idx ? "text-white" : "text-white/50 hover:text-white/85"}`}>
            <span className="font-heading text-lg tabular-nums">0{idx + 1}</span>
            <span><span className="block font-heading text-xl font-semibold sm:text-2xl">{x.title.replace(" (placeholder)", "")}</span><span className="text-base">{x.industry}</span></span>
            <span aria-hidden className={`absolute -bottom-px left-0 h-[3px] bg-brand transition-all duration-500 ${i === idx ? "w-full" : "w-0"}`} />
          </button>
        ))}
      </div>

      <div ref={panel} role="tabpanel" id="ppanel" aria-labelledby={`ptab-${i}`} className="mt-10 grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <div data-tilt="dark" data-tilt-max="5" className="relative mx-auto aspect-[3/4] w-full max-w-[460px] overflow-hidden rounded-xl bg-ink-2 lg:mx-0">
          {img ? <Image data-tab-img src={img} alt={`${p.title} preview`} fill sizes="(min-width:1024px) 40vw, 90vw" className="object-cover" /> : (
            <div data-tab-img aria-hidden className="absolute inset-0 grid place-items-center bg-gradient-to-br from-brand to-brand-deep"><span className="font-heading text-[6rem] font-bold text-white/25">{p.title.slice(0, 2).toUpperCase()}</span></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" aria-hidden />
          {p.is_placeholder && <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-base font-medium text-text">Sample layout</span>}
          {p.technologies?.length > 0 && <ul className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">{p.technologies.map((t) => <li key={t} className="rounded-full bg-white/15 px-3 py-1 text-base text-white backdrop-blur-sm">{t}</li>)}</ul>}
        </div>
        <div className="flex flex-col justify-center">
          <p data-tab-anim className="eyebrow">{p.industry}</p>
          <h3 data-tab-anim className="mt-4 !text-[clamp(2rem,4vw,3.25rem)]">{p.title.replace(" (placeholder)", "")}</h3>
          {p.client_name && <p data-tab-anim className="mt-2 text-white/60">Client: {p.client_name}</p>}
          <p data-tab-anim className="mt-6 max-w-xl text-lg text-white/75">{p.description}</p>
          {p.services?.length > 0 && <ul data-tab-anim aria-label="Services delivered" className="mt-6 flex flex-wrap gap-2">{p.services.map((s) => <li key={s} className="rounded-full border border-white/20 px-3.5 py-1.5 text-base">{s}</li>)}</ul>}
          {p.results?.length > 0 && <dl data-tab-anim className="mt-8 grid grid-cols-2 gap-6 border-t border-white/15 pt-6 sm:grid-cols-3">{p.results.map((r) => <div key={r.label}><dd className="font-heading text-4xl font-semibold text-white">{r.value}</dd><dt className="mt-1 text-white/60">{r.label}</dt></div>)}</dl>}
          <div data-tab-anim className="mt-9"><Link href={`/work/${p.slug}`} className="btn-primary" data-magnetic>View Case Study <ArrowUpRight /></Link></div>
        </div>
      </div>
    </div>
  );
}
