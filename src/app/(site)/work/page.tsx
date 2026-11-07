import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ProjectShowcase } from "@/components/Cards";
import { CtaBand } from "@/components/ui/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { getCaseStudies } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = { title: "Our Work & Case Studies", description: "Selected website, eCommerce and software projects by Ignixel Studio, with the business outcomes they delivered.", alternates: { canonical: "/work" } };

export default async function WorkPage() {
  const projects = await getCaseStudies();
  return (
    <>
      <PageHero crumbs={[{ name: "Our Work" }]} eyebrow="Case studies" title="Digital Experiences. Real Business Impact." description="A selection of projects, shown with the goals they served and the results they achieved." />
      <section className="section bg-white"><div className="container-x space-y-24 sm:space-y-32">
        {projects.length === 0 && <p className="text-center text-text-2">Projects are coming soon.</p>}
        {projects.map((p, i) => <Reveal key={p.id}><ProjectShowcase p={p} i={i} /></Reveal>)}
      </div></section>
      <CtaBand />
    </>
  );
}
