import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { CtaBand } from "@/components/ui/CtaBand";
import { ArrowUpRight } from "@/components/ui/Ico";
import { LANDING_PAGES } from "@/lib/landing";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ title: "Industries We Build Websites For", description: "Website design and development for healthcare practices, hospitality and vacation-rental businesses, and professional and local service companies.", path: "/industries" });

export default function IndustriesPage() {
  const items = LANDING_PAGES.filter((p) => p.kind === "industry");
  return (
    <>
      <PageHero crumbs={[{ name: "Industries" }]} eyebrow="Industries" title="Websites Built for the Way Your Industry Decides" description="Sector context shapes good digital decisions. These are the industries where we have done the work." />
      <section className="section bg-white"><div className="container-x">
        <ul className="grid auto-rows-fr gap-card md:grid-cols-3">
          {items.map((p) => (
            <li key={p.slug}><Link href={p.path} className="group card-pad flex h-full flex-col rounded-xl border border-line bg-white transition-shadow duration-300 hover:shadow-card">
              <p className="eyebrow">{p.eyebrow}</p>
              <h2 className="mt-3 !text-2xl">{p.h1}</h2>
              <p className="mt-3 flex-1 text-text-2">{p.lead}</p>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-brand">View {p.navLabel} <ArrowUpRight className="h-5 w-5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
            </Link></li>
          ))}
        </ul>
      </div></section>
      <CtaBand />
    </>
  );
}
