"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";
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
  const dark = !solid; // white text over dark hero
  const link = (href: string) => `rounded-full px-4 py-2 text-base font-medium transition hover:text-brand ${pathname === href || (href !== "/" && pathname.startsWith(href)) ? "text-brand" : dark ? "text-white/90" : "text-text"}`;

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${solid ? "border-b border-line bg-white/85 py-2.5 shadow-sm backdrop-blur-xl" : "bg-transparent py-5"}`}>
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
            <Link href="/contact" className="btn-primary !min-h-[44px] !py-2">Let&apos;s Talk</Link>
          </div>

          <button type="button" className={`grid h-12 w-12 place-items-center rounded-full lg:hidden ${dark ? "text-white" : "text-text"}`} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <div id="mobile-menu" className={`fixed inset-0 z-40 overflow-y-auto bg-white px-5 pb-10 pt-24 transition duration-300 lg:hidden ${open ? "visible translate-x-0 opacity-100" : "invisible translate-x-6 opacity-0"}`}>
        <nav aria-label="Mobile" className="mx-auto flex max-w-md flex-col">
          {[["/", "Home"]].map(([h, l]) => <Link key={h} href={h} className="border-b border-line py-4 font-heading text-2xl font-semibold">{l}</Link>)}
          <button type="button" aria-expanded={mSub} onClick={() => setMSub((s) => !s)} className="flex items-center justify-between border-b border-line py-4 text-left font-heading text-2xl font-semibold">
            Services <ChevronDown className={`transition ${mSub ? "rotate-180" : ""}`} />
          </button>
          {mSub && <div className="border-b border-line py-2 pl-3">{categories.map((c) => <Link key={c.slug} href={`/services/${c.slug}`} className="block py-3 text-lg font-medium text-text-2">{c.title}</Link>)}</div>}
          {[["/work", "Our Work"], ["/about", "About"], ["/blog", "Blog"], ["/solutions", "Solutions"]].map(([h, l]) => <Link key={h} href={h} className="border-b border-line py-4 font-heading text-2xl font-semibold">{l}</Link>)}
          <Link href="/contact" className="btn-primary mt-8">Let&apos;s Talk <ArrowUpRight className="h-5 w-5" /></Link>
          <Link href="/website-cost-calculator" className="btn-ghost mt-3">Calculate Project Cost</Link>
        </nav>
      </div>
    </>
  );
}
