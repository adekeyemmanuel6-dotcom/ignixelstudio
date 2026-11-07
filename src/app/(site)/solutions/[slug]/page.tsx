import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHead } from "@/components/ui/Heading";
import { CtaBand } from "@/components/ui/CtaBand";
import { getSection } from "@/lib/content";

export const revalidate = 60;
type Item = { slug: string; problem: string; cta: string; summary: string; issues: string[]; approach: string };
const find = async (slug: string) => ((await getSection("solutions")).items as Item[] | undefined)?.find((s) => s.slug === slug);

export async function generateStaticParams() { return (((await getSection("solutions")).items as Item[]) ?? []).map((s) => ({ slug: s.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = await find((await params).slug); if (!s) return {};
  return { title: s.problem, description: s.summary, alternates: { canonical: `/solutions/${s.slug}` } };
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const s = await find((await params).slug);
  if (!s) notFound();
  const all = ((await getSection("solutions")).items as Item[]).filter((x) => x.slug !== s.slug);
  return (
    <>
      <PageHero crumbs={[{ name: "Solutions", href: "/solutions" }, { name: s.problem }]} eyebrow="Challenge" title={<>&ldquo;{s.problem}&rdquo;</>} description={s.summary} ctas={[{ label: s.cta, href: "/contact" }, { label: "Calculate Project Cost", href: "/website-cost-calculator", secondary: true }]} />
      <section className="section bg-white">
        <div className="container-x grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHead eyebrow="Why it happens" title="Common causes" />
            <ul className="mt-8 space-y-3">{s.issues.map((x) => <li key={x} className="flex items-center gap-3 rounded-xl border border-line p-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand"><Check className="h-5 w-5" /></span><span className="font-medium text-text">{x}</span></li>)}</ul>
          </div>
          <div>
            <SectionHead eyebrow="How we approach it" title="Our approach" />
            <p className="mt-6 text-lg text-text-2">{s.approach}</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/contact" className="btn-primary">{s.cta}</Link><Link href="/services" className="btn-ghost">Explore services</Link></div>
          </div>
        </div>
      </section>
      <section className="section bg-white">
        <div className="container-x"><SectionHead eyebrow="Related" title="Other challenges we solve" />
          <ul className="mt-10 grid gap-4 md:grid-cols-2">{all.map((x) => <li key={x.slug}><Link href={`/solutions/${x.slug}`} className="card block p-6 font-heading text-xl font-semibold transition hover:border-brand/40 hover:text-brand">&ldquo;{x.problem}&rdquo; →</Link></li>)}</ul></div>
      </section>
      <CtaBand />
    </>
  );
}
