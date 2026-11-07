import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "@/components/ui/Ico";
import { PageHero } from "@/components/ui/PageHero";
import { CtaBand } from "@/components/ui/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { getSection } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = { title: "Solutions: Fix Your Website's Biggest Problems", description: "Website not generating leads, traffic dropping, low conversions or missing from AI search? Find the right Ignixel solution.", alternates: { canonical: "/solutions" } };

export default async function SolutionsPage() {
  const c = await getSection("solutions");
  return (
    <>
      <PageHero crumbs={[{ name: "Solutions" }]} eyebrow="Challenges we solve" title={c.heading} description={c.description} ctas={[{ label: "Talk to Us", href: "/contact" }]} />
      <section className="section bg-white">
        <div className="container-x space-y-6">
          {(c.items ?? []).map((s: any, i: number) => (
            <Reveal key={s.slug}>
              <article className="group relative grid gap-8 rounded-3xl border border-line bg-white p-7 transition duration-300 hover:border-brand/40 hover:shadow-card sm:p-10 lg:grid-cols-[1.1fr_1fr]">
                <div>
                  <span className="font-heading text-5xl font-bold text-brand/15">0{i + 1}</span>
                  <h2 className="mt-1 !text-h3">&ldquo;{s.problem}&rdquo;</h2>
                  <p className="mt-4 text-text-2">{s.summary}</p>
                  <Link href={`/solutions/${s.slug}`} className="btn-primary mt-7 after:absolute after:inset-0">{s.cta} <ArrowUpRight /></Link>
                </div>
                <div><h3 className="!text-lg font-semibold uppercase tracking-wider text-text-2">Possible causes</h3>
                  <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">{s.issues.map((x: string) => <li key={x} className="flex gap-2"><Check className="mt-1 h-5 w-5 shrink-0 text-brand" />{x}</li>)}</ul></div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
