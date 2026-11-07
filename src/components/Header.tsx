"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X, ArrowUpRight, ArrowRight } from "@/components/ui/Ico";
import { Logo } from "./Logo";

type Cat = { slug: string; title: string };
const LIGHT_HERO = [/^\/blog\/[^/]+$/, /^\/privacy-policy$/, /^\/terms$/, /^\/404/];

export function Header({ logoUrl, categories }: { logoUrl?: string; categories: Cat[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [sub, setSub] = useState(false);
  const [mSub, setMSub] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => { setOpen(false); setSub(false); }, [pathname]);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); setSub(false); } }; window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, []);

  const lightHero = LIGHT_HERO.some((r) => r.test(pathname));
  const solid = scrolled || lightHero || open;
  const dark = open || !solid; // white text over dark hero / dark mobile menu
  const link = (href: string) => `rounded-[5px] px-4 py-2 text-base font-medium transition ${dark ? "hover:text-[#9a9aff]" : "hover:text-brand"} ${pathname === href || (href !== "/" && pathname.startsWith(href)) ? (dark ? "text-[#9a9aff]" : "text-brand") : dark ? "text-white/90" : "text-text"}`;

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${solid && !open ? "border-b border-line bg-white/85 py-2.5 shadow-sm backdrop-blur-xl" : "bg-transparent py-5"}`}>
        <div className="container-x flex items-center justify-between">
          <Link href="/" aria-label="Ignixel Studio home"><Logo url={logoUrl} dark={dark} className="h-9" /></Link>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            <Link href="/" className={link("/")}>Home</Link>
            <div className="relative" onMouseEnter={() => setSub(true)} onMouseLeave={() => setSub(false)}>
              <button type="button" aria-expanded={sub} aria-haspopup="true" onClick={() => setSub((s) => !s)} className={`${link("/services")} inline-flex items-center gap-1`}>
                Services <ChevronDown className={`h-4 w-4 transition ${sub ? "rotate-180" : ""}`} />
              </button>
              <div className={`absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3 transition ${sub ? "visible translate-y-0 opacity-100" : "invisible translate-y-2 opacity-0"}`}>
                <div className="card p-2">
                  {categories.map((c) => <Link key={c.slug} href={`/services/${c.slug}`} className="block rounded-xl px-4 py-3 text-base font-medium text-text hover:bg-paper hover:text-brand">{c.title}</Link>)}
                  <Link href="/services" className="mt-1 block rounded-xl border-t border-line px-4 py-3 text-base font-semibold text-brand">All services</Link>
                </div>
              </div>
            </div>
            <Link href="/work" className={link("/work")}>Our Work</Link>
            <Link href="/about" className={link("/about")}>About</Link>
            <Link href="/blog" className={link("/blog")}>Blog</Link>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/website-cost-calculator" className={`text-base font-medium underline-offset-4 hover:underline ${dark ? "text-white/90" : "text-text"}`}>Calculate Project Cost</Link>
            <Link href="/contact" className="btn-primary">Let&apos;s Talk</Link>
          </div>

          <button type="button" className={`grid h-12 w-12 place-items-center rounded-[5px] lg:hidden ${dark ? "text-white" : "text-text"}`} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      <div id="mobile-menu" inert={!open} aria-hidden={!open}
        className={`dark-surface fixed inset-0 z-40 overflow-y-auto transition-[opacity,visibility,transform] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] lg:hidden ${open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-3 opacity-0"}`}>
        <div className="page-x flex min-h-[100dvh] flex-col pb-8 pt-[calc(var(--header-h)+12px)]">
          <nav aria-label="Mobile">
            <ul className="border-t border-white/10">
              {[
                { href: "/", label: "Home" }, { services: true, label: "Services" }, { href: "/work", label: "Our Work" },
                { href: "/about", label: "About" }, { href: "/blog", label: "Blog" }, { href: "/solutions", label: "Solutions" },
              ].map((it, i) => {
                const delay = { transitionDelay: open ? `${120 + i * 55}ms` : "0ms" };
                const item = `border-b border-white/10 transition-all duration-500 ${open ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`;
                const row = "flex min-h-[64px] w-full items-center justify-between gap-4 text-left font-heading text-[1.65rem] font-semibold leading-tight";
                if ("services" in it) {
                  const onServices = pathname.startsWith("/services");
                  return (
                    <li key="services" className={item} style={delay}>
                      <button type="button" aria-expanded={mSub} aria-controls="m-services" onClick={() => setMSub((v) => !v)} className={`${row} ${onServices ? "text-[#9a9aff]" : "text-white"}`}>
                        Services
                        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition duration-300 ${mSub ? "border-[#6fdc5a] bg-[#6fdc5a] text-ink" : "border-white/25 text-white"}`}>
                          <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${mSub ? "rotate-180" : ""}`} />
                        </span>
                      </button>
                      <div id="m-services" className={`grid transition-[grid-template-rows] duration-300 ease-out ${mSub ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                        <div className="overflow-hidden" inert={!mSub}>
                          <ul className="space-y-2 pb-5">
                            {categories.map((c) => (
                              <li key={c.slug}><Link href={`/services/${c.slug}`} onClick={() => setOpen(false)} className={`flex min-h-[52px] items-center justify-between gap-3 rounded-[5px] border px-4 text-lg font-medium transition ${pathname === `/services/${c.slug}` ? "border-[#9a9aff] bg-brand/30 text-white" : "border-white/10 bg-white/[0.06] text-white hover:border-white/30"}`}>{c.title}<ArrowUpRight className="h-5 w-5 text-white/60" /></Link></li>
                            ))}
                            <li><Link href="/services" onClick={() => setOpen(false)} className="flex min-h-[48px] items-center gap-2 px-1 font-semibold text-[#6fdc5a]">View all services <ArrowRight className="h-5 w-5" /></Link></li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  );
                }
                const active = it.href === "/" ? pathname === "/" : pathname.startsWith(it.href!);
                return (
                  <li key={it.href} className={item} style={delay}>
                    <Link href={it.href!} onClick={() => setOpen(false)} className={`${row} ${active ? "text-[#9a9aff]" : "text-white"}`}>{it.label}<ArrowUpRight className="h-6 w-6 shrink-0 text-white/40" /></Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className={`cta-stack mt-auto pt-10 transition-all duration-500 ${open ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`} style={{ transitionDelay: open ? "520ms" : "0ms" }}>
            <Link href="/contact" onClick={() => setOpen(false)} className="btn-primary">Let&apos;s Talk <ArrowUpRight /></Link>
            <Link href="/website-cost-calculator" onClick={() => setOpen(false)} className="btn-secondary-dark">Calculate Project Cost</Link>
          </div>
        </div>
      </div>
    </>
  );
}
