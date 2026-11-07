import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceCategoryCard } from "@/components/Cards";
import { SectionHead } from "@/components/ui/Heading";
import { CtaBand } from "@/components/ui/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { getAllServices, getCategories, getSection } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Services", description: "Web design, web development, eCommerce and AI services from Ignixel Studio: strategy, design and engineering for businesses that want to grow.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const [cats, subs, proc] = await Promise.all([getCategories(), getAllServices(), getSection("process")]);
  return (
    <>
      <PageHero crumbs={[{ name: "Services" }]} eyebrow="Services" title="Design, Engineering and AI Under One Roof."
        description="Four connected service areas that cover everything from first concept to a measurable, growing digital product."
        ctas={[{ label: "Start a Project", href: "/contact" }, { label: "Calculate Project Cost", href: "/website-cost-calculator", secondary: true }]} />
      <section className="section bg-white">
        <div className="container-x grid gap-card md:grid-cols-2">
          {cats.map((c, i) => <Reveal key={c.id}><ServiceCategoryCard c={c} subs={subs.filter((s) => s.category_id === c.id)} i={i} /></Reveal>)}
        </div>
      </section>
      <section className="section bg-white">
        <div className="container-x">
          <SectionHead eyebrow="Every service" title="All the ways we can help" />
          <div className="mt-sect grid gap-8 md:grid-cols-2">
            {cats.map((c) => (
              <div key={c.id}>
                <h3 className="!text-2xl"><Link href={`/services/${c.slug}`} className="hover:text-brand">{c.title}</Link></h3>
                <ul className="mt-4 divide-y divide-line rounded-2xl border border-line bg-white">
                  {subs.filter((s) => s.category_id === c.id).map((s) => <li key={s.id}><Link href={`/services/${c.slug}#${s.slug}`} className="flex items-center justify-between px-5 py-4 font-medium hover:text-brand">{s.title}<span aria-hidden>→</span></Link></li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-white">
        <div className="container-x">
          <SectionHead eyebrow="How we work" title={proc.heading} description={proc.description} />
          <ol className="mt-sect grid gap-card sm:grid-cols-2 lg:grid-cols-5">
            {(proc.items ?? []).map((it: any, i: number) => <li key={it.title} className="card p-6"><span className="font-heading text-4xl font-bold text-brand/25">0{i + 1}</span><h3 className="mt-2 !text-xl">{it.title}</h3><p className="mt-2 text-text-2">{it.description}</p></li>)}
          </ol>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
