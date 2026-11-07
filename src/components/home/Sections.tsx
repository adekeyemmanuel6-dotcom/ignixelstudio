import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Ico";
import { SectionHead } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { Ico } from "@/components/ui/Ico";
import { TechCard, TechMarquee } from "@/components/TechGrid";
import { ServiceCategoryCard, PostCard, TestimonialCard } from "@/components/Cards";
import { TeamGrid } from "@/components/team/TeamGrid";
import { InquiryForm } from "@/components/InquiryForm";
import { CtaBand } from "@/components/ui/CtaBand";
import { CtaPair } from "@/components/ui/CtaPair";
import { ProjectTabs } from "./ProjectTabs";
import { TechTabs } from "./TechTabs";
import { photo } from "@/lib/images";
import { getAllServices, getCaseStudies, getCategories, getLatestPosts, getSection, getTeam, getTechnologies, getTestimonials } from "@/lib/content";

type C = Record<string, any>;

const BAND = [
  { k: "whiteboard", n: "01", t: "Strategy", d: "Goals before pixels" },
  { k: "swatches", n: "02", t: "Design", d: "Systems that scale" },
  { k: "codeDark", n: "03", t: "Engineering", d: "Fast, secure, maintainable" },
  { k: "analytics", n: "04", t: "Growth", d: "Measured, then improved" },
] as const;

export async function Hero({ c }: { c: C }) {
  const cats = await getCategories();
  return (
    <section data-spotlight className="dark-surface relative overflow-hidden hero-pad">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute -left-40 -top-20 h-[560px] w-[560px] rounded-full bg-brand/30 blur-[140px]" aria-hidden />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[460px] w-[460px] rounded-full bg-[#4a4aff]/20 blur-[130px]" aria-hidden />
      <div className="container-x relative">
        <div className="grid gap-14 lg:grid-cols-[1.12fr_0.88fr] lg:items-start lg:gap-16">
          <div className="lg:pt-6">
            <p className="eyebrow mb-5" data-hero-item>{c.label}</p>
            <h1 data-split data-hero-title className="!text-[clamp(2.6rem,5.3vw,4.9rem)] !leading-none">{c.headline}</h1>
            <p className="lead mt-4 max-w-xl" data-hero-item>{c.description}</p>
            <CtaPair heroItem primary={{ label: <>{c.primary_label} <ArrowRight /></>, href: c.primary_href || "/contact" }} secondary={{ label: c.secondary_label, href: c.secondary_href || "/work" }} />
            {c.trust && (
              <div className="mt-12 flex items-center gap-4 border-t border-white/10 pt-6" data-hero-item>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand/20 text-[#9a9aff]"><Ico name="verified_user" className="h-6 w-6" /></span>
                <p className="text-white/70">{c.trust}</p>
              </div>
            )}
          </div>
          <div className="relative" data-hero-item>
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-brand/70 via-white/10 to-transparent" aria-hidden />
            <div className="ring-glow relative rounded-2xl border border-white/10 bg-ink-2 p-6 sm:p-8">
              <div className="dots pointer-events-none absolute right-4 top-4 h-24 w-24 opacity-50" aria-hidden />
              <div className="relative">
                <h2 className="!text-3xl">Tell us about your project</h2>
                <p className="mb-6 mt-2 text-white/65">Share a few details and we&apos;ll respond with next steps.</p>
                <InquiryForm services={cats.map((x) => x.title)} variant="hero" />
              </div>
            </div>
          </div>
        </div>

        <ul className="mt-20 grid grid-cols-2 gap-4 sm:mt-28 md:grid-cols-4 md:gap-card" aria-label="How we work">
          {BAND.map((b, idx) => (
            <li key={b.k} data-float={idx % 2 ? 26 : -4} className={idx % 2 ? "md:mt-14" : ""}>
              <figure>
                <div data-img-reveal className="relative aspect-[3/4] overflow-hidden rounded-xl bg-ink-2">
                  <Image src={photo(b.k, 700, 940)} alt="" fill priority={idx < 2} sizes="(min-width:768px) 22vw, 46vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" aria-hidden />
                  <figcaption className="absolute inset-x-0 bottom-0 p-4 sm:p-5"><span className="font-heading text-sm tabular-nums text-[#9a9aff]">{b.n}</span><p className="font-heading text-xl font-semibold text-white sm:text-2xl">{b.t}</p><p className="hidden text-base text-white/70 sm:block">{b.d}</p></figcaption>
                </div>
              </figure>
            </li>
          ))}
        </ul>
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
        <div className="flex flex-wrap items-end justify-between gap-6"><SectionHead eyebrow="What we do" title={c.heading} description={c.description} /><Link href="/services" className="btn-ghost" data-magnetic>All services <ArrowRight /></Link></div>
        <div className="mt-sect grid auto-rows-fr items-stretch gap-card sm:grid-cols-2 lg:grid-cols-4" data-stagger>
          {cats.map((cat, i) => <ServiceCategoryCard key={cat.id} c={cat} subs={subs.filter((s) => s.category_id === cat.id)} i={i} />)}
        </div>
      </div>
    </section>
  );
}

const PROJECT_FALLBACK = [photo("digital", 900, 1200), photo("ecommerce", 900, 1200), photo("services", 900, 1200)];
export async function Projects({ c }: { c: C }) {
  const projects = (await getCaseStudies()).filter((p) => p.featured).slice(0, 3);
  if (!projects.length) return null;
  return (
    <section data-spotlight className="dark-surface section relative overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="container-x relative">
        <div className="flex flex-wrap items-end justify-between gap-6"><SectionHead eyebrow="Selected work" title={c.heading} description={c.description} />
          <Link href="/work" className="btn-ghost-dark" data-magnetic>{c.cta_label || "View All Projects"} <ArrowRight /></Link></div>
        <div className="mt-sect" data-reveal><ProjectTabs projects={projects} fallback={PROJECT_FALLBACK} /></div>
      </div>
    </section>
  );
}

export function Why({ c }: { c: C }) {
  const items: C[] = c.items ?? [];
  return (
    <section className="section bg-white">
      <div className="container-x">
        <SectionHead eyebrow="Why Ignixel" title={c.heading} />
        <div className="mt-sect grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-12">
          <div data-img-reveal className="relative mx-auto aspect-[3/4] w-full max-w-[480px] overflow-hidden rounded-xl lg:mx-0 lg:aspect-auto lg:h-full lg:min-h-[560px] lg:max-w-none">
            <Image src={photo("conference", 900, 1200)} alt="A project team working around a table with laptops" fill sizes="(min-width:1024px) 40vw, 90vw" className="object-cover" data-parallax-img />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" aria-hidden />
            <p className="absolute bottom-6 left-6 right-6 font-heading text-2xl font-semibold text-white sm:text-3xl">Strategy first. Pixels second.</p>
          </div>
          <div className="grid overflow-hidden rounded-xl border border-line sm:grid-cols-2" data-stagger>
            {items.map((it, i) => (
              <div key={it.title} className={`group card-pad relative bg-white transition duration-300 hover:bg-brand hover:text-white ${i % 2 === 0 ? "sm:border-r" : ""} ${i < items.length - 2 ? "border-b" : i === items.length - 2 ? "border-b sm:border-b-0" : ""} border-line`}>
                <span className="grid h-12 w-12 place-items-center rounded-lg bg-brand-soft text-brand transition group-hover:bg-white/15 group-hover:text-white"><Icon name={it.icon} className="h-6 w-6" /></span>
                <h3 className="mt-6 !text-2xl transition group-hover:!text-white">{it.title}</h3>
                <p className="mt-2 text-text-2 transition group-hover:text-white/85">{it.description}</p>
              </div>
            ))}
          </div>
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
        <div className="relative mt-16">
          <div className="absolute bottom-6 left-6 top-6 w-px bg-line lg:bottom-auto lg:left-0 lg:right-0 lg:top-6 lg:h-px lg:w-auto" aria-hidden />
          <div data-progress aria-hidden className="absolute bottom-6 left-6 top-6 w-px origin-top bg-brand [transform:scaleY(var(--p,1))] lg:bottom-auto lg:left-0 lg:right-0 lg:top-6 lg:h-0.5 lg:w-auto lg:origin-left lg:[transform:scaleX(var(--p,1))]" />
          <ol className="relative grid gap-10 lg:grid-cols-5 lg:gap-card" data-stagger>
            {items.map((it, i) => (
              <li key={it.title} className="relative pl-16 lg:pl-0 lg:pt-16">
                <span className="absolute left-0 top-0 grid h-12 w-12 place-items-center rounded-full border-2 border-brand bg-white font-heading text-lg font-bold text-brand">{i + 1}</span>
                <h3 className="!text-2xl">{it.title}</h3><p className="mt-2 text-text-2">{it.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function Solutions({ c }: { c: C }) {
  const items: C[] = c.items ?? [];
  return (
    <section data-spotlight className="dark-surface section relative overflow-hidden">
      <div className="pointer-events-none absolute -right-40 top-20 h-[480px] w-[480px] rounded-full bg-brand/20 blur-[140px]" aria-hidden />
      <div className="container-x relative">
        <div className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHead eyebrow="Challenges we solve" title={c.heading} description={c.description} />
            <Link href="/solutions" className="btn-ghost-dark mt-8" data-magnetic>Explore all solutions <ArrowRight /></Link>
          </div>
          <ul className="border-t border-white/15" data-stagger>
            {items.map((s, i) => (
              <li key={s.slug} className="group relative border-b border-white/15 transition-colors duration-300 hover:bg-white/[0.04]">
                <Link href={`/solutions/${s.slug}`} className="grid grid-cols-[auto_1fr_auto] items-start gap-4 px-1 py-7 sm:gap-7 sm:px-4">
                  <span className="pt-2 font-heading text-lg tabular-nums text-[#9a9aff]">0{i + 1}</span>
                  <span>
                    <span className="block font-heading text-[clamp(1.35rem,2.4vw,1.9rem)] font-semibold leading-tight text-white">&ldquo;{s.problem}&rdquo;</span>
                    <span className="mt-2 block max-w-xl text-white/60">{s.summary}</span>
                    <span className="link-u mt-4 inline-block font-semibold text-white">{s.cta}</span>
                  </span>
                  <span className="mt-1 grid h-12 w-12 place-items-center rounded-full border border-white/25 text-white transition duration-300 group-hover:border-brand group-hover:bg-brand"><ArrowUpRight className="h-6 w-6 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export async function Stack({ c }: { c: C }) {
  const tech = await getTechnologies();
  const cats = [...new Set(tech.map((t) => t.category))];
  const tabs = cats.map((cat) => {
    const items = tech.filter((t) => t.category === cat);
    return { label: cat, count: items.length, node: <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">{items.map((t) => <TechCard key={t.id} t={t} />)}</ul> };
  });
  return (
    <section className="section bg-white">
      <div className="container-x">
        <SectionHead center eyebrow="Technology" title={c.heading} description={c.description} />
        <div className="mt-sect" data-reveal><TechTabs tabs={tabs} /></div>
      </div>
    </section>
  );
}

const IND_PHOTO: Record<string, Parameters<typeof photo>[0]> = { Healthcare: "healthcare", "SaaS & Technology": "saas", "Professional Services": "services", "Real Estate": "realestate", "eCommerce & Retail": "retail", Logistics: "logistics", Education: "education", Finance: "finance", Hospitality: "hospitality", Manufacturing: "manufacturing" };
const SPAN = ["lg:col-span-2 lg:row-span-2", "", "", "", "", "lg:col-span-2", "", "", "lg:col-span-2", "lg:col-span-2"];
export function Industries({ c }: { c: C }) {
  const items: C[] = c.items ?? [];
  return (
    <section data-spotlight className="dark-surface section">
      <div className="container-x">
        <SectionHead eyebrow="Industries" title={c.heading} description={c.description} />
        <ul className="mt-sect grid auto-rows-[260px] gap-4 sm:grid-cols-2 lg:auto-rows-[230px] lg:grid-cols-4" data-stagger>
          {items.map((it, i) => (
            <li key={it.name} className={`${SPAN[i] ?? ""}`}>
              <Link href={it.href || "/services"} className="group relative block h-full overflow-hidden rounded-xl bg-ink-2">
                <Image src={it.image || photo(IND_PHOTO[it.name] ?? "office", 1000, 1000)} alt="" fill sizes={i === 0 ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"} className="object-cover transition duration-700 ease-out group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/10 transition group-hover:from-brand-deep/90" aria-hidden />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <h3 className={`${i === 0 ? "!text-3xl" : "!text-xl"} !text-white`}>{it.name}</h3>
                  <p className="mt-1.5 max-w-sm text-white/80 transition duration-300 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-visible:translate-y-0 lg:group-focus-visible:opacity-100">{it.description}</p>
                </div>
                <span className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm transition group-hover:bg-white group-hover:text-brand"><ArrowUpRight /></span>
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
    <section className="section bg-white">
      <div className="container-x">
        <SectionHead eyebrow="Testimonials" title={c.heading} description={c.description} />
        <div className="mt-sect grid gap-card md:grid-cols-2 lg:grid-cols-3" data-stagger>{items.map((t) => <TestimonialCard key={t.id} t={t} />)}</div>
      </div>
    </section>
  );
}

const OLD_TEAM_HEADING = "The People Behind Your Project";
export async function TeamPreview({ c }: { c: C }) {
  const team = (await getTeam()).slice(0, 4);
  if (!team.length) return null;
  const heading = !c.heading || c.heading === OLD_TEAM_HEADING ? "Meet the Team Behind Your Next Digital Breakthrough." : c.heading;
  return (
    <section className="section bg-white">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead eyebrow="The people behind Ignixel" title={heading} description="Strategists, designers and engineers who care about the details, and about the results your business sees." />
          <Link href="/about#team" className="btn-secondary" data-magnetic>{c.cta_label || "Meet Our Team"} <ArrowRight /></Link>
        </div>
        <div className="mt-sect"><TeamGrid members={team} /></div>
      </div>
    </section>
  );
}

export async function BlogPreview({ c }: { c: C }) {
  const posts = await getLatestPosts(3);
  if (!posts.length) return null;
  return (
    <section data-spotlight className="dark-surface section relative overflow-hidden">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6"><SectionHead eyebrow="Insights" title={c.heading} description={c.description} /><Link href="/blog" className="btn-secondary-dark" data-magnetic>{c.cta_label || "View All Articles"} <ArrowRight /></Link></div>
        <div className="mt-sect grid gap-card md:grid-cols-2 lg:grid-cols-3" data-stagger>{posts.map((p) => <PostCard key={p.id} p={p} />)}</div>
      </div>
    </section>
  );
}

export function Cta({ c }: { c: C }) {
  return <div className="bg-white pt-sect"><CtaBand title={c.heading} description={c.description} primary={{ label: c.primary_label, href: c.primary_href }} secondary={{ label: c.secondary_label, href: c.secondary_href }} /></div>;
}

export const SECTION_MAP: Record<string, (p: { c: C }) => any> = {
  hero: Hero, trusted: Trusted, services: Services, solutions: Solutions, projects: Projects, why: Why, process: Process,
  stack: Stack, industries: Industries, testimonials: Testimonials, team: TeamPreview, blog: BlogPreview, cta: Cta,
};
export { getSection, Reveal };
