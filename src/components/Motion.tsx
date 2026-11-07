"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * Site-wide GSAP motion system. Markup opts in with data attributes (set in server components):
 *   data-hero / data-hero-item   load-in sequence          data-split          line-masked headline reveal
 *   data-reveal [data-y,data-delay]  fade-up on scroll      data-stagger        children stagger on scroll
 *   data-img-reveal              clip-path image reveal     data-parallax="n"   image parallax (md+)
 *   data-float="n"               scrubbed drift (md+)       data-magnetic       magnetic button (mouse only)
 *   data-progress                scrubbed CSS var --p (0→1) for timelines
 * Everything lives in a gsap.matchMedia context: reverted on route change/unmount, and skipped for reduced motion.
 */
export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const mm = gsap.matchMedia();
    let alive = true;
    try {
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 768px)", fine: "(hover: hover) and (pointer: fine)" }, (ctx) => {
        const { motion, wide, fine } = ctx.conditions as { motion: boolean; wide: boolean; fine: boolean };
        if (!motion) { root.dataset.motion = "off"; return; }
        root.dataset.motion = "on";
        const q = <T extends Element = HTMLElement>(sel: string) => gsap.utils.toArray<T>(sel);

        // Headline reveals (line masks). autoSplit re-splits on resize/font load.
        q("[data-split]").forEach((el) => {
          SplitText.create(el, {
            type: "lines", mask: "lines", autoSplit: true, linesClass: "split-line", maskClass: "split-mask",
            onSplit: (self) => { gsap.set(el, { visibility: "visible" }); return gsap.from(self.lines, { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.09, delay: el.hasAttribute("data-hero-title") ? 0.1 : 0, scrollTrigger: el.hasAttribute("data-hero-title") ? undefined : { trigger: el, start: "top 88%", once: true } }); },
          });
        });

        // Hero entrance
        const heroItems = q("[data-hero-item]");
        if (heroItems.length) gsap.fromTo(heroItems, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.12, delay: 0.35 });

        // Scroll reveals
        q("[data-reveal]").forEach((el) => {
          gsap.fromTo(el, { autoAlpha: 0, y: Number(el.dataset.y ?? 32) }, { autoAlpha: 1, y: 0, duration: 0.95, ease: "power3.out", delay: Number(el.dataset.delay ?? 0), scrollTrigger: { trigger: el, start: "top 90%", once: true } });
        });
        q("[data-stagger]").forEach((el) => {
          gsap.fromTo(Array.from(el.children), { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.09, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
        });

        // Image clip reveals
        q("[data-img-reveal]").forEach((el) => {
          const img = el.querySelector("img");
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 90%", once: true } });
          tl.to(el, { clipPath: "inset(0% 0 0 0)", duration: 1.3, ease: "expo.out" });
          if (img) tl.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.6, ease: "expo.out" }, 0);
        });

        // Parallax + drift (desktop/tablet only: no scroll-jank on phones)
        if (wide) {
          q("[data-parallax]").forEach((el) => {
            const n = Number(el.dataset.parallax || 10);
            gsap.fromTo(el, { yPercent: -n }, { yPercent: n, ease: "none", scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true } });
          });
          q("[data-float]").forEach((el) => {
            const n = Number(el.dataset.float || 40);
            gsap.fromTo(el, { y: n }, { y: -n, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 } });
          });
        }

        // Scrubbed timelines (CSS variable --p)
        q("[data-progress]").forEach((el) => {
          gsap.fromTo(el, { "--p": 0 }, { "--p": 1, ease: "none", scrollTrigger: { trigger: el.parentElement ?? el, start: "top 75%", end: "bottom 60%", scrub: 0.5 } });
        });

        // Mouse-driven effects: card tilt + glare, section spotlight (mouse devices only)
        if (fine) {
          q("[data-tilt]").forEach((el) => {
            const max = Number(el.dataset.tiltMax ?? 7);
            gsap.set(el, { transformPerspective: 900 });
            const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3" });
            const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3" });
            const enter = () => gsap.to(el, { y: -6, duration: 0.45, ease: "power3.out", overwrite: "auto" });
            const move = (e: MouseEvent) => {
              const r = el.getBoundingClientRect(); const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
              ry((px - 0.5) * max * 2); rx(-(py - 0.5) * max * 2);
              el.style.setProperty("--gx", `${px * 100}%`); el.style.setProperty("--gy", `${py * 100}%`);
            };
            const leave = () => { rx(0); ry(0); gsap.to(el, { y: 0, duration: 0.6, ease: "power3.out", overwrite: "auto" }); };
            el.addEventListener("mouseenter", enter); el.addEventListener("mousemove", move); el.addEventListener("mouseleave", leave);
          });
          q("[data-spotlight]").forEach((el) => {
            const mx = gsap.quickTo(el, "--mx", { duration: 0.8, ease: "power3", unit: "px" });
            const my = gsap.quickTo(el, "--my", { duration: 0.8, ease: "power3", unit: "px" });
            const move = (e: MouseEvent) => { const r = el.getBoundingClientRect(); mx(e.clientX - r.left); my(e.clientY - r.top); };
            el.addEventListener("mouseenter", () => el.style.setProperty("--spot", "1"));
            el.addEventListener("mouseleave", () => el.style.setProperty("--spot", "0"));
            el.addEventListener("mousemove", move);
          });
        }

        // Magnetic buttons
        if (fine) {
          q("[data-magnetic]").forEach((el) => {
            const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
            const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
            const move = (e: MouseEvent) => { const r = el.getBoundingClientRect(); xTo((e.clientX - (r.left + r.width / 2)) * 0.28); yTo((e.clientY - (r.top + r.height / 2)) * 0.28); };
            const leave = () => { xTo(0); yTo(0); };
            el.addEventListener("mousemove", move); el.addEventListener("mouseleave", leave);
            return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
          });
        }
      });
    } catch (e) {
      console.warn("Motion disabled:", e);
      root.dataset.motion = "off";
    }

    const refresh = () => alive && ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    const t = window.setTimeout(refresh, 800); // after images/layout settle
    return () => { alive = false; window.clearTimeout(t); window.removeEventListener("load", refresh); mm.revert(); };
  }, [pathname]);

  return null;
}
