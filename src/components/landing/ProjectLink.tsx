import Link from "next/link";
import Image from "next/image";
import type { CaseStudy } from "@/lib/types";
import { ArrowUpRight } from "@/components/ui/Ico";

export function ProjectLink({ p }: { p: CaseStudy }) {
  const img = p.featured_image || p.desktop_image;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] transition-colors duration-300 hover:border-white/30">
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-2">
        {img ? <Image src={img} alt={`${p.title}: website screenshot`} fill sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" /> : <div aria-hidden className="grid h-full place-items-center bg-gradient-to-br from-brand to-brand-deep font-heading text-6xl font-bold text-white/25">{p.title.slice(0, 2).toUpperCase()}</div>}
      </div>
      <div className="card-pad flex flex-1 flex-col">
        <p className="eyebrow">{p.industry}</p>
        <h3 className="mt-3 !text-xl !text-white">{p.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-white/70">{p.description}</p>
        <Link href={`/work/${p.slug}`} className="mt-5 inline-flex items-center gap-2 font-semibold text-white after:absolute after:inset-0">View case study <ArrowUpRight className="h-5 w-5" /></Link>
      </div>
    </article>
  );
}
