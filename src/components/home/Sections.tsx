import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SectionHead } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { TechGrid, TechMarquee } from "@/components/TechGrid";
import { ServiceCategoryCard, ProjectShowcase, PostCard, TeamCard, TestimonialCard } from "@/components/Cards";
import { InquiryForm } from "@/components/InquiryForm";
import { CtaBand } from "@/components/ui/CtaBand";
import { getAllServices, getCaseStudies, getCategories, getLatestPosts, getSection, getTeam, getTechnologies, getTestimonials } from "@/lib/content";

type C = Record<string, any>;

export async function Hero({ c }: { c: C }) {
  const cats = await getCategories();
  return (
    <section className="dark-surface relative overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-brand/30 blur-[130px]" aria-hidden />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-[#4a4aff]/20 blur-[120px]" aria-hidden />
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="eyebrow mb-6">{c.label}</p>
          <h1>{c.headline}</h1>
          <p className="lead mt-6 max-w-xl">{c.description}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={c.primary_href || "/contact"} className="btn-primary">{c.primary_label} <ArrowRight className="h-5 w-5" /></Link>
            <Link href={c.secondary_href || "/work"} className="btn-ghost-dark">{c.secondary_label}</Link>
          </div>
          {c.trust && (
            <div className="mt-10 flex items-center gap-4 border-t border-white/10 pt-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand/20 text-[#9a9aff]"><Icon name="shield-check" /></span>
              <p className="text-white/70">{c.trust}</p>
            </div>
          )}
        </div>
        <div className="relative">
          <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-br from-brand/70 via-white/10 to-transparent" aria-hidden />
          <div className="relative rounded-[2rem] border border-white/10 bg-ink-2/90 p-6 shadow-glow backdrop-blur sm:p-8">
            <div className="dots pointer-events-none absolute right-4 top-4 h-24 w-24 opacity-60" aria-hidden />
            <div className="relative">
              <h2 className="!text-3xl">Tell us about your project</h2>
              <p className="mb-6 mt-2 text-white/65">Share a few details and we&apos;ll respond with next steps.</p>
              <InquiryForm services={cats.map((x) => x.title)} variant="hero" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export async function Trusted({ c }: { c: C }) {
  const tech = await getTechnologies();
  const top = tech.filter((t) => ["Design & Frontend", "CMS & Website Platforms", "Databases & Infrastructure", "AI & Automation"].includes(t.category)).slice(0, 24);
  return (
    <section className="border-b border-line bg-white py-10" aria-label="Technology platforms">
      <div className="container-x"><p className="mb-6 text-center text-base font-medium uppercase tracking-[0.12em] text-text-2">{c.heading}</p><TechMarquee items={top} /></div>
    </section>
  );
}

export async function Services({ c }: { c: C }) {
  const [cats, subs] = await Promise.all([getCategories(), getAllServices()]);
  return (
    <section className="section bg-white">
      <div className="container-x">
        <SectionHead eyebrow="What we do" title={c.heading} description={c.description} />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {cats.map((cat, i) => <Reveal key={cat.id} delay={(i % 2) * 0.08}><ServiceCategoryCard c={cat} subs={subs.filter((s) => s.category_id === cat.id)} i={i} /></Reveal>)}
        </div>
      </div>
    </section>
  );
}

export function Solutions({ c }: { c: C }) {
  return (
    <section className="section bg-paper">
      <div className="container-x">
        <SectionHead eyebrow="Challenges we solve" title={c.heading} description={c.description} />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {(c.items ?? []).map((s: C, i: number) => (
            <Reveal key={s.slug} delay={i * 0.06}>
              <article className="group relative flex h-full flex-col rounded-2xl border border-line bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-card">
                <span className="font-heading text-5xl font-bold text-brand/15">0{i + 1}</span>
                <h3 className="mt-2 !text-2xl">&ldquo;{s.problem}&rdquo;</h3>
                <p className="mt-3 flex-1 text-text-2">{s.summary}</p>
                <Link href={`/solutions/${s.slug}`} className="mt-6 inline-flex items-center gap-2 font-semibold text-brand after:absolute after:inset-0">{s.cta} <ArrowUpRight className="h-5 w-5 transition group-hover:translate-x-1 group-hover:-translate-y-1" /></Link>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center"><Link href="/solutions" className="btn-ghost">Explore all solutions</Link></div>
      </div>
    </section>
  );
}

export async function Projects({ c }: { c: C }) {
  const projects = (await getCaseStudies()).filter((p) => p.featured).slice(0, 3);
  return (
    <section className="section bg-white">
      <div className="container-x">
        <SectionHead eyebrow="Selected work" title={c.heading} description={c.description} />
        <div className="mt-16 space-y-24 sm:space-y-32">{projects.map((p, i) => <Reveal key={p.id}><ProjectShowcase p={p} i={i} /></Reveal>)}</div>
        <div className="mt-16 text-center"><Link href="/work" className="btn-primary">{c.cta_label || "View All Projects"} <ArrowRight className="h-5 w-5" /></Link></div>
      </div>
    </section>
  );
}

export function Why({ c }: { c: C }) {
  return (
    <section className="dark-surface section relative overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div className="container-x relative">
        <SectionHead eyebrow="Why Ignixel" title={c.heading} />
        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {(c.items ?? []).map((it: C, i: number) => (
            <Reveal key={it.title} delay={i * 0.05} className="bg-ink">
              <div className="group h-full p-8 transition duration-300 hover:bg-ink-2">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand/20 text-[#9a9aff] transition duration-300 group-hover:scale-110 group-hover:bg-brand group-hover:text-white"><Icon name={it.icon} className="h-7 w-7" /></span>
                <h3 className="mt-6 !text-2xl">{it.title}</h3><p className="mt-3 text-white/65">{it.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Process({ c }: { c: C }) {
  const items: C[] = c.items ?? [];
  return (
    <section className="section bg-white">
      <div className="container-x">
        <SectionHead eyebrow="Our process" title={c.heading} description={c.description} />
        <ol className="relative mt-16 grid gap-10 lg:grid-cols-5 lg:gap-6">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-line lg:block" aria-hidden />
          <div className="absolute left-6 top-0 h-full w-px bg-line lg:hidden" aria-hidden />
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.12}>
              <li className="relative pl-16 lg:pl-0 lg:pt-16">
                <span className="absolute left-0 top-0 grid h-12 w-12 place-items-center rounded-full bg-brand font-heading text-lg font-bold text-white shadow-[0_0_0_6px_rgba(16,16,232,.12)]">{i + 1}</span>
                <h3 className="!text-2xl">{it.title}</h3><p className="mt-2 text-text-2">{it.description}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export async function Stack({ c }: { c: C }) {
  const tech = await getTechnologies();
  return (
    <section className="section bg-paper">
      <div className="container-x">
        <SectionHead center eyebrow="Technology" title={c.heading} description={c.description} />
        <div className="mt-14"><TechGrid items={tech} /></div>
      </div>
    </section>
  );
}

export function Industries({ c }: { c: C }) {
  return (
    <section className="section bg-white">
      <div className="container-x">
        <SectionHead eyebrow="Industries" title={c.heading} description={c.description} />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {(c.items ?? []).map((it: C, i: number) => (
            <li key={it.name}>
              <Link href={it.href || "/services"} className="group relative flex h-full min-h-[260px] flex-col justify-end overflow-hidden rounded-2xl p-5 text-white transition duration-300 hover:-translate-y-1" style={{ background: `linear-gradient(160deg, ${it.tone || "#1010E8"}, #101113 120%)` }}>
                <svg className="absolute right-0 top-0 h-32 w-32 opacity-25 transition duration-500 group-hover:rotate-12 group-hover:scale-110" viewBox="0 0 100 100" aria-hidden><circle cx="70" cy="30" r="40" fill="none" stroke="#fff" strokeDasharray="2 5" /><circle cx="70" cy="30" r="22" fill="none" stroke="#fff" /><rect x="58" y="18" width="24" height="24" rx="6" fill="#fff" fillOpacity=".25" transform={`rotate(${i * 17} 70 30)`} /></svg>
                <h3 className="!text-xl !text-white">{it.name}</h3><p className="mt-2 text-white/80">{it.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 font-semibold">Explore <ArrowUpRight className="h-4 w-4" /></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export async function Testimonials({ c }: { c: C }) {
  const items = (await getTestimonials()).filter((t) => t.featured).slice(0, 6);
  if (!items.length) return null;
  return (
    <section className="section bg-paper">
      <div className="container-x">
        <SectionHead eyebrow="Testimonials" title={c.heading} description={c.description} />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{items.map((t, i) => <Reveal key={t.id} delay={i * 0.07}><TestimonialCard t={t} /></Reveal>)}</div>
      </div>
    </section>
  );
}

export async function TeamPreview({ c }: { c: C }) {
  const team = (await getTeam()).slice(0, 4);
  if (!team.length) return null;
  return (
    <section className="section bg-white">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead eyebrow="Our team" title={c.heading} description={c.description} />
          <Link href="/about#team" className="btn-ghost">{c.cta_label || "Meet Our Team"} <ArrowRight className="h-5 w-5" /></Link>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">{team.map((m, i) => <Reveal key={m.id} delay={i * 0.06}><TeamCard m={m} /></Reveal>)}</div>
      </div>
    </section>
  );
}

export async function BlogPreview({ c }: { c: C }) {
  const posts = await getLatestPosts(3);
  if (!posts.length) return null;
  return (
    <section className="section bg-paper">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead eyebrow="Insights" title={c.heading} description={c.description} />
          <Link href="/blog" className="btn-ghost">{c.cta_label || "View All Articles"} <ArrowRight className="h-5 w-5" /></Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{posts.map((p, i) => <Reveal key={p.id} delay={i * 0.07}><PostCard p={p} /></Reveal>)}</div>
      </div>
    </section>
  );
}

export function Cta({ c }: { c: C }) {
  return <div className="bg-white pt-20 sm:pt-28"><CtaBand title={c.heading} description={c.description} primary={{ label: c.primary_label, href: c.primary_href }} secondary={{ label: c.secondary_label, href: c.secondary_href }} /></div>;
}

export const SECTION_MAP: Record<string, (p: { c: C }) => any> = {
  hero: Hero, trusted: Trusted, services: Services, solutions: Solutions, projects: Projects, why: Why, process: Process,
  stack: Stack, industries: Industries, testimonials: Testimonials, team: TeamPreview, blog: BlogPreview, cta: Cta,
};
export { getSection };
