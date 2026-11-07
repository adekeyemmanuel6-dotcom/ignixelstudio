import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Globe, Quote } from "@/components/ui/Ico";
import { Social } from "./ui/Social";
import type { BlogPost, CaseStudy, Service, ServiceCategory, TeamMember, Testimonial } from "@/lib/types";
import { BrowserMockup, PhoneMockup, Avatar } from "./ui/Visuals";
import { Icon } from "./ui/Icon";
import { formatDate } from "@/lib/utils";
import { photo, PHOTO } from "@/lib/images";

const TONES = ["#010BCC", "#0e7490", "#7c3aed", "#be185d"];

const SVC_PHOTO = { "web-design": "wireframe", "web-development": "webdev", "ecommerce-applications": "ecommerce", "ai-services": "ai" } as const;
export function ServiceCategoryCard({ c, subs, i }: { c: ServiceCategory; subs: Service[]; i: number }) {
  const src = c.image_url || photo((SVC_PHOTO as Record<string, keyof typeof PHOTO>)[c.slug] ?? "office", 1200, 900);
  return (
    <article data-tilt="dark" className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white transition-[border-color,box-shadow] duration-500 hover:border-brand/40 hover:shadow-glow">
      <div className="relative aspect-[4/3] overflow-hidden bg-ink">
        <Image src={src} alt="" fill sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" className="object-cover transition duration-700 ease-out group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent" aria-hidden />
        <span className="absolute left-5 top-5 font-heading text-lg tabular-nums text-white/80">0{i + 1}</span>
        <span className="absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-lg bg-white/90 text-brand transition group-hover:bg-brand group-hover:text-white"><Icon name={c.icon} /></span>
        <h3 className="absolute inset-x-5 bottom-5 !text-[1.7rem] !leading-tight !text-white">{c.title}</h3>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-text-2">{c.short_description}</p>
        <ul className="mt-5 space-y-2">{subs.slice(0, 4).map((s) => <li key={s.id} className="flex items-start gap-2.5"><span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />{s.title}</li>)}</ul>
        <Link href={`/services/${c.slug}`} className="mt-auto inline-flex items-center gap-2 pt-7 font-semibold text-brand after:absolute after:inset-0 after:content-['']">
          <span className="link-u">View Service</span> <ArrowUpRight className="h-5 w-5 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Link>
      </div>
    </article>
  );
}

export function SubServiceCard({ s, i }: { s: Service; i: number }) {
  return (
    <article className="group relative flex flex-col rounded-2xl border border-line bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-card">
      <div className="mb-5 overflow-hidden rounded-xl bg-paper p-3"><BrowserMockup src={s.image_url} alt={`${s.title} illustration`} tone={TONES[i % 4]} className="!shadow-none !border-line" /></div>
      <h3 className="!text-xl">{s.title}</h3>
      <p className="mt-2 flex-1 text-text-2">{s.description}</p>
      <a href={`#${s.slug}`} className="mt-5 inline-flex items-center gap-1.5 font-semibold text-brand after:absolute after:inset-0">Learn More <ArrowUpRight className="h-5 w-5" /></a>
    </article>
  );
}

export function ProjectShowcase({ p, i }: { p: CaseStudy; i: number }) {
  const rev = i % 2 === 1;
  return (
    <article className="group relative grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
      <div className={`relative ${rev ? "lg:order-2" : ""}`}>
        <div className="relative rounded-3xl bg-gradient-to-br from-brand-deep to-ink p-6 sm:p-10">
          <div className="dots absolute inset-0 rounded-3xl opacity-40" aria-hidden />
          <div className="relative"><BrowserMockup src={p.desktop_image || p.featured_image} alt={`${p.title} website on desktop`} tone={TONES[i % 4]} className="transition duration-500 group-hover:-translate-y-1" />
            <PhoneMockup src={p.mobile_image} alt={`${p.title} on mobile`} tone={TONES[i % 4]} className="absolute -bottom-6 -right-2 sm:-right-6" /></div>
        </div>
      </div>
      <div>
        <p className="eyebrow mb-3">{p.industry}</p>
        <h3>{p.title}</h3>
        {p.client_name && <p className="mt-2 font-medium text-text">Client: {p.client_name}</p>}
        <p className="mt-4 text-text-2">{p.description}</p>
        {p.services?.length > 0 && <ul className="mt-5 flex flex-wrap gap-2" aria-label="Services delivered">{p.services.map((s) => <li key={s} className="rounded-full bg-brand-soft px-3 py-1 text-base font-medium text-brand-deep">{s}</li>)}</ul>}
        {p.technologies?.length > 0 && <p className="mt-4 text-text-2"><span className="font-medium text-text">Built with:</span> {p.technologies.join(", ")}</p>}
        {p.results?.length > 0 && <dl className="mt-6 grid grid-cols-2 gap-4">{p.results.map((r) => <div key={r.label} className="rounded-xl border border-line p-4"><dd className="font-heading text-2xl font-semibold text-brand">{r.value}</dd><dt className="text-text-2">{r.label}</dt></div>)}</dl>}
        <Link href={`/work/${p.slug}`} className="btn-dark mt-7 after:absolute after:inset-0">View Case Study <ArrowUpRight className="h-5 w-5" /></Link>
      </div>
    </article>
  );
}

export function PostCard({ p, featured }: { p: BlogPost; featured?: boolean }) {
  return (
    <article data-tilt data-tilt-max="4" className={`group relative flex overflow-hidden rounded-xl border border-line bg-white transition-shadow duration-300 hover:shadow-card ${featured ? "flex-col lg:flex-row" : "flex-col"}`}>
      <div className={`relative shrink-0 overflow-hidden bg-gradient-to-br from-brand to-brand-deep ${featured ? "aspect-[16/10] lg:aspect-auto lg:w-1/2" : "aspect-[16/10]"}`}>
        {p.featured_image ? <Image src={p.featured_image} alt="" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" /> :
          <div className="dots absolute inset-0 grid place-items-center" aria-hidden><span className="font-heading text-5xl font-bold text-white/30">{p.category?.name?.slice(0, 2) ?? "IX"}</span></div>}
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-x-3 text-base text-text-2">
          {p.category && <span className="font-semibold text-brand">{p.category.name}</span>}
          <time dateTime={p.published_at ?? undefined}>{formatDate(p.published_at)}</time><span>{p.reading_time} min read</span>
        </div>
        <h3 className={`mt-3 ${featured ? "" : "!text-[1.4rem]"}`}><Link href={`/blog/${p.slug}`} className="after:absolute after:inset-0 hover:text-brand">{p.title}</Link></h3>
        <p className="mt-3 flex-1 text-text-2">{p.excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 font-semibold text-brand">Read Article <ArrowUpRight className="h-5 w-5" /></span>
      </div>
    </article>
  );
}

export function TeamCard({ m, dark }: { m: TeamMember; dark?: boolean }) {
  const links = [[m.linkedin_url, "linkedin", "LinkedIn"], [m.twitter_url, "x", "X"], [m.website_url, "web", "Website"]] as const;
  return (
    <article data-tilt="dark" data-tilt-max="6" className="group">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-paper">
        <Avatar name={m.full_name} src={m.photo_url} className="h-full w-full text-6xl transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-5 pt-16 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
          <ul className="flex gap-2">{links.filter(([u]) => u).map(([u, k, n]) => <li key={n}><a href={u!} target="_blank" rel="noopener noreferrer" aria-label={`${m.full_name} on ${n}`} className="grid h-11 w-11 place-items-center rounded-full bg-white text-brand">{k === "web" ? <Globe className="h-5 w-5" /> : <Social name={k} />}</a></li>)}</ul>
        </div>
      </div>
      <h3 className="mt-4 !text-xl">{m.full_name}</h3>
      <p className={`font-medium ${dark ? "text-[#9a9aff]" : "text-brand"}`}>{m.job_title}</p>
      {m.bio && <p className={`mt-2 ${dark ? "text-white/65" : "text-text-2"}`}>{m.bio}</p>}
    </article>
  );
}

export function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure data-tilt data-tilt-max="5" className="flex h-full flex-col rounded-xl border border-line bg-white p-7 shadow-card">
      <Quote className="h-8 w-8 text-brand" aria-hidden />
      <blockquote className="mt-4 flex-1 text-lg text-text">{t.quote}</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <Avatar name={t.client_name} src={t.photo_url} className="h-12 w-12 shrink-0 rounded-full" />
        <div><p className="font-semibold text-text">{t.client_name}</p><p className="text-text-2">{[t.position, t.company].filter(Boolean).join(", ")}</p>{t.project_ref && <p className="text-brand">{t.project_ref}</p>}</div>
      </figcaption>
    </figure>
  );
}
