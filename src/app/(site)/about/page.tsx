import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHead } from "@/components/ui/Heading";
import { TeamCard } from "@/components/Cards";
import { CtaBand } from "@/components/ui/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { getAbout, getTeam } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = { title: "About Ignixel Studio", description: "Meet the strategists, designers and engineers behind Ignixel Studio, a digital agency building websites, applications and AI solutions that move businesses forward.", alternates: { canonical: "/about" } };
const CATS = ["Leadership", "Design", "Development", "Marketing", "Operations"] as const;

export default async function AboutPage() {
  const [a, team] = await Promise.all([getAbout(), getTeam()]);
  return (
    <>
      <PageHero crumbs={[{ name: "About" }]} eyebrow="About Ignixel" title={a.hero_headline} description={a.hero_intro} ctas={[{ label: "Start a Project", href: "/contact" }, { label: "Meet the Team", href: "#team", secondary: true }]} />

      {a.brand_note && <section className="bg-white pt-16"><div className="container-x"><p className="max-w-4xl font-heading text-[clamp(1.5rem,3vw,2.4rem)] font-medium leading-snug" data-reveal>{a.brand_note}</p></div></section>}

      <section className="section bg-white"><div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <SectionHead eyebrow="Our story" title={a.story_heading} />
        <Reveal><div className="prose-ig whitespace-pre-line text-lg text-text-2">{a.story}</div></Reveal>
      </div></section>

      <section className="dark-surface section relative overflow-hidden"><div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
        <div className="container-x relative grid gap-card md:grid-cols-2">
          {[["Our Mission", a.mission], ["Our Vision", a.vision]].map(([t, b]) => (
            <Reveal key={t}><div className="h-full rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-12"><p className="eyebrow mb-4">{t}</p><p className="font-heading text-2xl font-medium leading-snug text-white sm:text-3xl">{b}</p></div></Reveal>
          ))}
        </div></section>

      <section className="section bg-white"><div className="container-x">
        <SectionHead eyebrow="What makes us different" title="Thinking, craft and care in equal measure" />
        <ul className="mt-sect grid gap-card sm:grid-cols-2 lg:grid-cols-3">{(a.different as any[]).map((d, i) => <Reveal key={d.title} delay={i * 0.05}><li className="h-full rounded-2xl border border-line p-7 transition hover:border-brand/40 hover:shadow-card"><span className="font-heading text-3xl font-bold text-brand/30">0{i + 1}</span><h3 className="mt-2 !text-2xl">{d.title}</h3><p className="mt-2 text-text-2">{d.description}</p></li></Reveal>)}</ul>
      </div></section>

      <section id="team" className="section scroll-mt-20 bg-white"><div className="container-x">
        <SectionHead eyebrow="Our team" title="The people behind your project" description="Strategists, designers and engineers who care about getting the details right." />
        {CATS.map((cat) => { const m = team.filter((t) => t.category === cat); return m.length ? (
          <div key={cat} className="mt-14"><h3 className="mb-6 border-b border-line pb-3 !text-2xl">{cat}</h3>
            <div className="team-list">{m.map((x) => <TeamCard key={x.id} m={x} />)}</div></div>) : null; })}
      </div></section>

      <section className="section bg-white"><div className="container-x">
        <SectionHead eyebrow="Values" title="What we stand for" />
        <ul className="mt-sect grid gap-card sm:grid-cols-2 lg:grid-cols-3">{(a.values as any[]).map((v, i) => <Reveal key={v.title} delay={i * 0.05}><li className="h-full rounded-2xl bg-paper p-7"><span className="grid h-12 w-12 place-items-center rounded-xl bg-brand text-white"><Icon name={v.icon} /></span><h3 className="mt-5 !text-2xl">{v.title}</h3><p className="mt-2 text-text-2">{v.description}</p></li></Reveal>)}</ul>
      </div></section>

      <section className="section bg-white"><div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <SectionHead eyebrow="Our approach" title="From discovery to launch, and beyond" /><p className="text-lg text-text-2">{a.approach}</p>
      </div></section>

      <CtaBand title="Let's Create Something Exceptional Together." description="Tell us what you're building and we'll show you how we'd approach it." secondary={null} />
    </>
  );
}
