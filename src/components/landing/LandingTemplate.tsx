import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHead } from "@/components/ui/Heading";
import { FaqList } from "@/components/ui/Faq";
import { CtaBand } from "@/components/ui/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { ArrowRight, Check, Quote } from "@/components/ui/Ico";
import { ProjectLink } from "./ProjectLink";
import { ORG_ID } from "@/lib/schema";
import { absoluteUrl } from "@/lib/seo";
import { LANDING_PAGES, matchProjects, type Landing } from "@/lib/landing";
import type { CaseStudy, Testimonial } from "@/lib/types";

/** Shared template for platform and industry landing pages (each page supplies its own copy; see lib/landing.ts). */
export function LandingTemplate({ l, cases, testimonials }: { l: Landing; cases: CaseStudy[]; testimonials: Testimonial[] }) {
  const projects = matchProjects(l, cases);
  const quote = testimonials.find((t) => l.testimonialCompanies.some((c) => t.company?.toLowerCase().includes(c.toLowerCase())));
  const related = LANDING_PAGES.filter((x) => l.related.includes(x.slug));
  const crumbs = l.kind === "platform" ? [{ name: "Services", href: "/services" }, { name: l.navLabel }] : [{ name: "Industries", href: "/industries" }, { name: l.navLabel }];
  return (
    <>
      <PageHero crumbs={crumbs} eyebrow={l.eyebrow} title={l.h1} description={l.lead} ctas={[{ label: "Start a Project", href: "/contact" }, { label: "Calculate Project Cost", href: "/website-cost-calculator", secondary: true }]} />

      <section className="section bg-white">
        <div className="container-x grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div className="max-w-3xl">
            <SectionHead eyebrow="Overview" title={l.kind === "platform" ? `Why teams choose ${l.navLabel.replace(" Development", "")}` : `How we approach ${l.navLabel.toLowerCase()} websites`} />
            <div className="mt-6 space-y-4 text-lg text-text-2" data-reveal>{l.intro.map((p) => <p key={p}>{p}</p>)}</div>
          </div>
          <div className="rounded-xl border border-line bg-paper p-[var(--card-pad)]" data-reveal>
            <h2 className="!text-2xl">Who this is for</h2>
            <ul className="mt-5 space-y-3">{l.forWho.map((w) => <li key={w} className="flex gap-3"><Check className="mt-1 h-5 w-5 shrink-0 text-brand" /><span>{w}</span></li>)}</ul>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x">
          <SectionHead eyebrow="What you get" title={l.buildHeading} />
          <ul className="mt-sect grid auto-rows-fr gap-card sm:grid-cols-2 lg:grid-cols-3" data-stagger>
            {l.build.map((b) => <li key={b.title} className="card-pad rounded-xl border border-line bg-white"><h3 className="!text-xl">{b.title}</h3><p className="mt-2 text-text-2">{b.description}</p></li>)}
          </ul>
        </div>
      </section>

      {projects.length > 0 && (
        <section data-spotlight className="dark-surface section relative overflow-hidden">
          <div className="container-x relative">
            <SectionHead eyebrow="Real work" title={`${l.kind === "platform" ? l.navLabel.replace(" Development", "") : l.navLabel} projects`} description="Projects we designed and built. Open a case study for the challenge, solution and technology." />
            <ul className="mt-sect grid auto-rows-fr gap-card md:grid-cols-2 lg:grid-cols-3" data-stagger>
              {projects.map((p) => <li key={p.id}><ProjectLink p={p} /></li>)}
            </ul>
          </div>
        </section>
      )}

      <section className="section bg-white">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <SectionHead eyebrow="How we work" title="A clear process" />
            <ol className="mt-sect space-y-5">{l.approach.map((a, i) => <li key={a.title} className="flex gap-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-brand font-heading font-bold text-brand">{i + 1}</span><div><h3 className="!text-xl">{a.title}</h3><p className="mt-1 text-text-2">{a.description}</p></div></li>)}</ol>
          </div>
          {quote && (
            <Reveal><figure className="self-center rounded-xl border border-line bg-paper p-[var(--card-pad)]">
              <Quote className="h-8 w-8 text-brand" />
              <blockquote className="mt-3 text-lg text-text">{quote.quote}</blockquote>
              <figcaption className="mt-4 text-text-2"><span className="font-semibold text-text">{quote.client_name}</span>, {[quote.position, quote.company].filter(Boolean).join(", ")}</figcaption>
            </figure></Reveal>
          )}
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div><SectionHead eyebrow="FAQs" title="Questions we hear most" />
            {related.length > 0 && <p className="mt-6 text-text-2">Related: {related.map((r, i) => <span key={r.slug}>{i > 0 && ", "}<Link href={r.path} className="font-medium text-brand underline-offset-4 hover:underline">{r.navLabel}</Link></span>)}</p>}</div>
          <FaqList faqs={l.faqs} />
        </div>
      </section>

      <CtaBand title={`Ready to talk about your ${l.kind === "platform" ? l.navLabel.toLowerCase().replace(" development", "") + " project" : l.navLabel.toLowerCase().split(" ")[0] + " website"}?`} description="Tell us what you need. We'll reply with honest advice and clear next steps." />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Service", name: l.h1, serviceType: l.serviceType, description: l.metaDescription, url: absoluteUrl(l.path), provider: { "@id": ORG_ID } }} />
    </>
  );
}
