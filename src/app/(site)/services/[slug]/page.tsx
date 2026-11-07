import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check } from "@/components/ui/Ico";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHead } from "@/components/ui/Heading";
import { SubServiceCard, ProjectShowcase } from "@/components/Cards";
import { TechGrid } from "@/components/TechGrid";
import { FaqList } from "@/components/ui/Faq";
import { CtaBand } from "@/components/ui/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { getCaseStudies, getCategories, getCategory, getTechnologies } from "@/lib/content";
import { SITE_URL } from "@/lib/supabase/env";

export const revalidate = 60;
export async function generateStaticParams() { return (await getCategories()).map((c) => ({ slug: c.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const data = await getCategory((await params).slug);
  if (!data) return {};
  const { category: c } = data;
  const title = c.seo_title || c.title, description = c.seo_description || c.hero_description || undefined;
  return { title: { absolute: title }, description, alternates: { canonical: `/services/${c.slug}` }, openGraph: { title, description: description ?? undefined, url: `${SITE_URL}/services/${c.slug}` } };
}

const COMPARE = [
  ["Best for", "Content-heavy sites, blogs, many editors", "Design-led marketing sites with rich interaction", "Fast-launch, expressive marketing sites", "Online stores and catalogues"],
  ["Editing experience", "Familiar, flexible, plugin-extensible", "Visual editor and clean CMS", "Visual canvas, simple CMS", "Built for products and orders"],
  ["Maintenance", "Updates and plugins need care", "Hosted and managed", "Hosted and managed", "Hosted and managed"],
  ["Customisation", "Very high with code", "High within platform", "High for design, moderate for logic", "High with apps and themes"],
];

export default async function ServiceCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getCategory(slug);
  if (!data) notFound();
  const { category: c, services } = data;
  const [allTech, cases] = await Promise.all([getTechnologies(), getCaseStudies()]);
  const tech = c.technology_slugs.map((s) => allTech.find((t) => t.slug === s)).filter(Boolean) as typeof allTech;
  const related = cases.filter((p) => p.services.some((s) => s.toLowerCase().includes(c.title.split(" ")[0].toLowerCase()))).slice(0, 2);
  const projects = related.length ? related : cases.slice(0, 2);

  return (
    <>
      <PageHero crumbs={[{ name: "Services", href: "/services" }, { name: c.title }]} eyebrow={c.title} title={c.hero_headline ?? c.title} description={c.hero_description}
        ctas={[{ label: c.cta_label || "Start a Project", href: "/contact" }, { label: "Calculate Project Cost", href: "/website-cost-calculator", secondary: true }]} />

      <section className="section bg-white" id="services">
        <div className="container-x">
          <SectionHead eyebrow="What We Do" title={`${c.title} services`} description={c.short_description} />
          <div className="mt-sect grid auto-rows-fr gap-card sm:grid-cols-2 lg:grid-cols-3">{services.map((s, i) => <Reveal key={s.id} className="h-full" delay={(i % 3) * 0.07}><SubServiceCard s={s} i={i} /></Reveal>)}</div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x">
          <SectionHead eyebrow="In detail" title="What each service includes" />
          <div className="mt-sect space-y-6">
            {services.map((s) => (
              <article key={s.id} id={s.slug} className="card scroll-mt-28 grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_1.4fr]">
                <div><h3>{s.title}</h3><p className="mt-3 text-text-2">{s.description}</p><Link href="/contact" className="btn-primary mt-6">Discuss this service</Link></div>
                <dl className="space-y-5">
                  {s.details && <div><dt className="font-heading text-lg font-semibold text-text">What it includes</dt><dd className="mt-1 text-text-2">{s.details}</dd></div>}
                  {s.who_for && <div><dt className="font-heading text-lg font-semibold text-text">Who it&apos;s for</dt><dd className="mt-1 text-text-2">{s.who_for}</dd></div>}
                  {s.problems_solved && <div><dt className="font-heading text-lg font-semibold text-text">Problems it solves</dt><dd className="mt-1 text-text-2">{s.problems_solved}</dd></div>}
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      {c.capabilities.length > 0 && (
        <section className="section bg-white">
          <div className="container-x">
            <SectionHead eyebrow="Capabilities" title={slug === "web-development" ? "Engineering that covers the whole stack" : `${c.title} capabilities`} />
            <ul className="mt-sect grid gap-card sm:grid-cols-2 lg:grid-cols-3">
              {c.capabilities.map((k) => <li key={k.title} className="rounded-2xl border border-line p-6 transition hover:border-brand/40 hover:shadow-card"><span className="grid h-9 w-9 place-items-center rounded-full bg-brand-soft text-brand"><Check className="h-5 w-5" /></span><h3 className="mt-4 !text-xl">{k.title}</h3><p className="mt-2 text-text-2">{k.description}</p></li>)}
            </ul>
          </div>
        </section>
      )}

      {c.process.length > 0 && (
        <section className="dark-surface section relative overflow-hidden">
          <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
          <div className="container-x relative">
            <SectionHead eyebrow="Process" title={slug === "web-design" ? "Our design process" : slug === "web-development" ? "Our technical process" : `How ${c.title} projects run`} />
            <ol className="mt-sect grid gap-card md:grid-cols-4">
              {c.process.map((p, i) => <Reveal key={p.title} delay={i * 0.1}><li className="h-full rounded-2xl border border-white/10 bg-white/5 p-6"><span className="font-heading text-4xl font-bold text-[#8b8bff]">0{i + 1}</span><h3 className="mt-3 !text-2xl">{p.title}</h3><p className="mt-2 text-white/65">{p.description}</p></li></Reveal>)}
            </ol>
          </div>
        </section>
      )}

      {slug === "web-design" && (
        <section className="section bg-white">
          <div className="container-x">
            <SectionHead eyebrow="Platform comparison" title="Which platform fits your project?" description="A practical overview. We recommend the best fit during discovery." />
            <div className="mt-sect overflow-x-auto rounded-2xl border border-line">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-paper"><tr><th className="p-4" scope="col"><span className="sr-only">Criteria</span></th>{["WordPress", "Webflow", "Framer", "Shopify"].map((h) => <th key={h} scope="col" className="p-4 font-heading text-lg">{h}</th>)}</tr></thead>
                <tbody>{COMPARE.map((r) => <tr key={r[0]} className="border-t border-line align-top"><th scope="row" className="p-4 font-semibold">{r[0]}</th>{r.slice(1).map((x, i) => <td key={i} className="p-4 text-text-2">{x}</td>)}</tr>)}</tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {tech.length > 0 && (
        <section className="section bg-white">
          <div className="container-x"><SectionHead eyebrow="Technology" title="The stack behind this service" /><div className="mt-10"><TechGrid items={tech} grouped={false} /></div></div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="section bg-white">
          <div className="container-x">
            <SectionHead eyebrow="Related work" title="Projects in this area" />
            <div className="mt-sect space-y-24">{projects.map((p, i) => <ProjectShowcase key={p.id} p={p} i={i} />)}</div>
          </div>
        </section>
      )}

      {c.faqs.length > 0 && (
        <section className="section bg-white">
          <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
            <SectionHead eyebrow="FAQs" title="Questions we hear most" /><FaqList faqs={c.faqs} />
          </div>
        </section>
      )}

      <CtaBand title={`Ready to talk about ${c.title.toLowerCase()}?`} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Service", name: c.title, description: c.hero_description, url: `${SITE_URL}/services/${c.slug}`, provider: { "@type": "Organization", name: "Ignixel Studio", url: SITE_URL },
        hasOfferCatalog: { "@type": "OfferCatalog", name: `${c.title} services`, itemListElement: services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, description: s.description } })) } }} />
    </>
  );
}
