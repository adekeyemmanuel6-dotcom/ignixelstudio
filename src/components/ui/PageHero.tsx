import Link from "next/link";
import type { ReactNode } from "react";
import { Breadcrumbs } from "./Breadcrumbs";
import { AbstractGraphic } from "./Visuals";
import { CtaPair } from "./CtaPair";

export function PageHero({ crumbs, eyebrow, title, description, ctas, visual = true, children }: {
  crumbs: { name: string; href?: string }[]; eyebrow?: string; title: ReactNode; description?: ReactNode;
  ctas?: { label: string; href: string; secondary?: boolean }[]; visual?: boolean; children?: ReactNode;
}) {
  return (
    <section data-spotlight className="dark-surface relative overflow-hidden hero-pad">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-brand/25 blur-[120px]" aria-hidden />
      <div className="container-x relative">
        <Breadcrumbs items={crumbs} dark />
        <div className={`mt-8 grid items-center gap-12 ${visual ? "lg:grid-cols-[1.3fr_1fr]" : ""}`}>
          <div>
            {eyebrow && <p className="eyebrow mb-5" data-hero-item>{eyebrow}</p>}
            <h1 className="max-w-4xl" data-split data-hero-title>{title}</h1>
            {description && <p className="lead mt-4 max-w-2xl" data-hero-item>{description}</p>}
            {ctas && ctas.length >= 2 && <CtaPair heroItem primary={ctas[0]} secondary={ctas[1]} />}
            {ctas && ctas.length === 1 && <div className="cta-gap" data-hero-item><Link href={ctas[0].href} data-magnetic className="btn-primary">{ctas[0].label}</Link></div>}
            {children}
          </div>
          {visual && <div className="hidden justify-center lg:flex"><AbstractGraphic /></div>}
        </div>
      </div>
    </section>
  );
}
