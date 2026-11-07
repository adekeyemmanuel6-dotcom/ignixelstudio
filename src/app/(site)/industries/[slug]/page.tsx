import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingTemplate } from "@/components/landing/LandingTemplate";
import { LANDING_PAGES, landingBySlug } from "@/lib/landing";
import { getCaseStudies, getTestimonials } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const revalidate = 60;
export function generateStaticParams() { return LANDING_PAGES.filter((p) => p.kind === "industry").map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const l = landingBySlug((await params).slug, "industry"); if (!l) return {};
  return pageMeta({ title: l.metaTitle, description: l.metaDescription, path: l.path });
}
export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const l = landingBySlug((await params).slug, "industry"); if (!l) notFound();
  const [cases, testimonials] = await Promise.all([getCaseStudies(), getTestimonials()]);
  return <LandingTemplate l={l} cases={cases} testimonials={testimonials} />;
}
