import Link from "next/link";
import { Mail, Phone, MapPin } from "@/components/ui/Ico";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";
import { getCategories, getSettings, getLatestPosts } from "@/lib/content";

const socialLabels: Record<string, string> = { linkedin: "LinkedIn", x: "X", instagram: "Instagram", github: "GitHub", dribbble: "Dribbble", facebook: "Facebook" };

export async function Footer() {
  const [s, cats, posts] = await Promise.all([getSettings(), getCategories(), getLatestPosts(3)]);
  const socials = Object.entries(s.socials).filter(([, v]) => v);
  return (
    <footer className="dark-surface relative overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="container-x relative py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo url={s.logo_url} dark className="h-10" />
            <p className="mt-5 max-w-md text-white/70">{s.footer_description}</p>
            <p className="mt-3 font-heading text-lg text-white">Ignixel <span className="text-[#6fdc5a]">=</span> Ignite + Pixels</p>
            <div className="mt-7 max-w-md">
              <h2 className="mb-3 font-heading !text-xl">Get practical insights by email</h2>
              <NewsletterForm dark />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <nav aria-label="Services">
              <h3 className="mb-4 !text-base font-semibold uppercase tracking-wider text-white/50">Services</h3>
              <ul className="space-y-2.5">{cats.map((c) => <li key={c.slug}><Link className="hover:text-white" href={`/services/${c.slug}`}>{c.title}</Link></li>)}
                <li><Link className="hover:text-white" href="/solutions">Solutions</Link></li></ul>
            </nav>
            <nav aria-label="Company">
              <h3 className="mb-4 !text-base font-semibold uppercase tracking-wider text-white/50">Company</h3>
              <ul className="space-y-2.5">{[["/about", "About"], ["/work", "Our Work"], ["/website-cost-calculator", "Cost Calculator"], ["/contact", "Contact"]].map(([h, l]) => <li key={h}><Link className="hover:text-white" href={h}>{l}</Link></li>)}</ul>
            </nav>
            <nav aria-label="Blog">
              <h3 className="mb-4 !text-base font-semibold uppercase tracking-wider text-white/50">Blog</h3>
              <ul className="space-y-2.5">{posts.map((p) => <li key={p.slug}><Link className="line-clamp-2 hover:text-white" href={`/blog/${p.slug}`}>{p.title}</Link></li>)}
                <li><Link className="font-medium text-white" href="/blog">All articles →</Link></li></ul>
            </nav>
            <div>
              <h3 className="mb-4 !text-base font-semibold uppercase tracking-wider text-white/50">Contact</h3>
              <ul className="space-y-3">
                {s.contact_email && <li className="flex gap-2"><Mail className="mt-1 h-5 w-5 shrink-0" /><a className="break-all hover:text-white" href={`mailto:${s.contact_email}`}>{s.contact_email}</a></li>}
                {s.phone && <li className="flex gap-2"><Phone className="mt-1 h-5 w-5 shrink-0" /><a className="hover:text-white" href={`tel:${s.phone}`}>{s.phone}</a></li>}
                {s.address && <li className="flex gap-2"><MapPin className="mt-1 h-5 w-5 shrink-0" />{s.address}</li>}
              </ul>
              {socials.length > 0 && <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">{socials.map(([k, v]) => <li key={k}><a href={v} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-white hover:underline">{socialLabels[k] ?? k}</a></li>)}</ul>}
            </div>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {s.copyright}</p>
          <ul className="flex gap-6"><li><Link className="hover:text-white" href="/privacy-policy">Privacy Policy</Link></li><li><Link className="hover:text-white" href="/terms">Terms &amp; Conditions</Link></li></ul>
        </div>
      </div>
    </footer>
  );
}
