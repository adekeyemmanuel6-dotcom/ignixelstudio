import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceCategoryCard } from "@/components/Cards";
import { SectionHead } from "@/components/ui/Heading";
import { CtaBand } from "@/components/ui/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Ico";
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
        <div className="container-x grid auto-rows-fr gap-card sm:grid-cols-2 lg:grid-cols-4">
          {cats.map((c, i) => <Reveal key={c.id} className="h-full"><ServiceCategoryCard c={c} subs={subs.filter((s) => s.category_id === c.id)} i={i} /></Reveal>)}
        </div>
      </section>
      <section className="section bg-white">
        <div className="container-x">
          <SectionHead eyebrow="Every service" title="All the ways we can help" description="Choose a category to see every service, what it includes and who it is for." />
          <div className="mt-sect grid auto-rows-fr items-stretch gap-card md:grid-cols-2" data-stagger>
            {cats.map((c, i) => {
              const list = subs.filter((s) => s.category_id === c.id);
              return (
                <article key={c.id} className="group/card flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white transition-shadow duration-300 hover:shadow-card">
                  <header className="card-pad flex items-center gap-4 border-b border-line bg-gradient-to-r from-brand-soft/60 to-white">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-brand text-white"><Icon name={c.icon} /></span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium uppercase tracking-[0.1em] text-text-2">Category 0{i + 1}</p>
                      <h3 className="!text-xl sm:!text-2xl"><Link href={`/services/${c.slug}`} className="hover:text-brand">{c.title}</Link></h3>
                    </div>
                    <span className="hidden shrink-0 rounded-[5px] border border-line bg-white px-3 py-1 text-base font-medium text-text-2 sm:block">{list.length} services</span>
                  </header>
                  <ul className="flex-1 divide-y divide-line">
                    {list.map((s) => (
                      <li key={s.id}>
                        <Link href={`/services/${c.slug}#${s.slug}`} className="group/row flex min-h-[56px] items-center justify-between gap-4 px-[var(--card-pad)] py-3 font-medium text-text transition-colors hover:bg-brand-soft/50 hover:text-brand">
                          <span>{s.title}</span>
                          <ArrowUpRight className="h-5 w-5 shrink-0 text-text-2 transition duration-300 group-hover/row:-translate-y-0.5 group-hover/row:translate-x-0.5 group-hover/row:text-brand" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <footer className="card-pad border-t border-line bg-paper/60">
                    <Link href={`/services/${c.slug}`} className="btn-secondary w-full sm:w-auto">Explore {c.title} <ArrowRight /></Link>
                  </footer>
                </article>
              );
            })}
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
