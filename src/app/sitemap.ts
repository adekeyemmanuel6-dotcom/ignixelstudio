import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/supabase/env";
import { getCaseStudies, getCategories, getPosts, getSection } from "@/lib/content";
import { LANDING_PAGES } from "@/lib/landing";

// lastModified is included only where a real date exists (blog posts); omitted otherwise rather than faked.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cats, cases, { posts }, sol] = await Promise.all([getCategories(), getCaseStudies(), getPosts({ perPage: 1000 }), getSection("solutions")]);
  const u = (p: string) => `${SITE_URL}${p}`;
  return [
    { url: SITE_URL, priority: 1 },
    { url: u("/services"), priority: 0.9 }, ...cats.map((c) => ({ url: u(`/services/${c.slug}`), priority: 0.8 })),
    ...LANDING_PAGES.filter((l) => l.kind === "platform").map((l) => ({ url: u(l.path), priority: 0.8 })),
    { url: u("/industries"), priority: 0.8 }, ...LANDING_PAGES.filter((l) => l.kind === "industry").map((l) => ({ url: u(l.path), priority: 0.7 })),
    { url: u("/work"), priority: 0.8 }, ...cases.map((c) => ({ url: u(`/work/${c.slug}`), priority: 0.6 })),
    { url: u("/about"), priority: 0.7 }, { url: u("/contact"), priority: 0.7 }, { url: u("/website-cost-calculator"), priority: 0.6 },
    { url: u("/solutions"), priority: 0.6 }, ...((sol.items ?? []) as { slug: string }[]).map((s) => ({ url: u(`/solutions/${s.slug}`), priority: 0.5 })),
    { url: u("/blog"), priority: 0.6 }, ...posts.map((p) => ({ url: u(`/blog/${p.slug}`), lastModified: new Date(p.updated_at || p.published_at || Date.now()), priority: 0.5 })),
    { url: u("/privacy-policy"), priority: 0.2 }, { url: u("/terms"), priority: 0.2 },
  ];
}
