import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/supabase/env";
import { getCaseStudies, getCategories, getPosts, getSection } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cats, cases, { posts }, sol] = await Promise.all([getCategories(), getCaseStudies(), getPosts({ perPage: 1000 }), getSection("solutions")]);
  const now = new Date();
  const fixed = ["", "/services", "/work", "/about", "/blog", "/solutions", "/website-cost-calculator", "/contact", "/privacy-policy", "/terms"].map((p) => ({ url: `${SITE_URL}${p}`, lastModified: now, priority: p === "" ? 1 : 0.7 }));
  return [
    ...fixed,
    ...cats.map((c) => ({ url: `${SITE_URL}/services/${c.slug}`, lastModified: now, priority: 0.8 })),
    ...cases.map((c) => ({ url: `${SITE_URL}/work/${c.slug}`, lastModified: now, priority: 0.6 })),
    ...posts.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p.published_at ? new Date(p.published_at) : now, priority: 0.6 })),
    ...((sol.items ?? []) as { slug: string }[]).map((s) => ({ url: `${SITE_URL}/solutions/${s.slug}`, lastModified: now, priority: 0.6 })),
  ];
}
