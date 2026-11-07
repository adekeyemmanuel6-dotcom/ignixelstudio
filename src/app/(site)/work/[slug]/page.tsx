import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHead } from "@/components/ui/Heading";
import { BrowserMockup, PhoneMockup } from "@/components/ui/Visuals";
import { CtaBand } from "@/components/ui/CtaBand";
import { getCaseImages, getCaseStudies, getCaseStudy } from "@/lib/content";
import { SITE_URL } from "@/lib/supabase/env";

export const revalidate = 60;
export async function generateStaticParams() { return (await getCaseStudies()).map((c) => ({ slug: c.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getCaseStudy((await params).slug); if (!p) return {};
  const title = p.seo_title || `${p.title} Case Study`, description = p.seo_description || p.description || undefined;
  return { title, description, alternates: { canonical: `/work/${p.slug}` }, openGraph: { title, description, url: `${SITE_URL}/work/${p.slug}`, images: p.featured_image ? [p.featured_image] : undefined } };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getCaseStudy((await params).slug);
  if (!p) notFound();
  const gallery = await getCaseImages(p.id);
  const others = (await getCaseStudies()).filter((x) => x.slug !== p.slug).slice(0, 2);
  return (
    <>
      <PageHero crumbs={[{ name: "Our Work", href: "/work" }, { name: p.title }]} eyebrow={p.industry ?? "Case study"} title={p.title} description={p.description} visual={false}>
        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">{p.client_name && <div><dt className="text-white/50">Client</dt><dd className="font-medium text-white">{p.client_name}</dd></div>}{p.services.length > 0 && <div><dt className="text-white/50">Services</dt><dd className="font-medium text-white">{p.services.join(", ")}</dd></div>}{p.technologies.length > 0 && <div><dt className="text-white/50">Technology</dt><dd className="font-medium text-white">{p.technologies.join(", ")}</dd></div>}</dl>
      </PageHero>
      <section className="section bg-white"><div className="container-x">
        <div className="relative mx-auto max-w-5xl"><BrowserMockup src={p.desktop_image || p.featured_image} alt={`${p.title} desktop`} className="!border-line" />{(p.mobile_image || true) && <PhoneMockup src={p.mobile_image} alt={`${p.title} mobile`} className="absolute -bottom-8 right-2 sm:-right-8" />}</div>
        <div className="mt-24 grid gap-12 lg:grid-cols-2">
          <div><SectionHead eyebrow="Challenge" title="The challenge" /><p className="mt-5 text-lg text-text-2">{p.challenge}</p></div>
          <div><SectionHead eyebrow="Solution" title="Our solution" /><p className="mt-5 text-lg text-text-2">{p.solution}</p></div>
        </div>
        {p.results.length > 0 && <div className="mt-20"><SectionHead eyebrow="Results" title="Measured outcomes" /><dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{p.results.map((r) => <div key={r.label} className="card p-6"><dd className="font-heading text-4xl font-semibold text-brand">{r.value}</dd><dt className="mt-1 text-text-2">{r.label}</dt></div>)}</dl></div>}
        {gallery.length > 0 && <ul className="mt-20 grid gap-4 sm:grid-cols-2">{gallery.map((g) => <li key={g.id} className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line"><Image src={g.url} alt={g.alt || `${p.title} screenshot`} fill sizes="(max-width:640px) 100vw, 600px" className="object-cover object-top" /></li>)}</ul>}
        {p.website_url && <p className="mt-12"><a className="btn-ghost" href={p.website_url} target="_blank" rel="noopener noreferrer">Visit live website</a></p>}
      </div></section>
      {others.length > 0 && <section className="section bg-white"><div className="container-x"><SectionHead eyebrow="More work" title="Other projects" /><ul className="mt-10 grid gap-5 md:grid-cols-2">{others.map((o) => <li key={o.id}><Link href={`/work/${o.slug}`} className="card block p-7 transition hover:border-brand/40"><p className="eyebrow">{o.industry}</p><h3 className="mt-2 !text-2xl">{o.title}</h3><p className="mt-2 line-clamp-2 text-text-2">{o.description}</p></Link></li>)}</ul></div></section>}
      <CtaBand />
    </>
  );
}
