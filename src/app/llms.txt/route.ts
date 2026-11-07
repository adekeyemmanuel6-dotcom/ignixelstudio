import { getCaseStudies, getCategories, getSettings } from "@/lib/content";
import { SITE_URL } from "@/lib/supabase/env";
import { LANDING_PAGES } from "@/lib/landing";

export const revalidate = 3600;

/**
 * /llms.txt: a plain-text summary of the site for language-model tools.
 * It is a convenience, not a ranking factor, and no AI vendor guarantees it is read. Facts come from the site's own data only.
 */
export async function GET() {
  const [s, cats, cases] = await Promise.all([getSettings(), getCategories(), getCaseStudies()]);
  const lines = [
    `# ${s.site_name}`, "",
    `> ${s.seo_description}`, "",
    s.address_locality ? `Headquarters: ${[s.address_locality, s.address_region, s.address_country].filter(Boolean).join(", ")}.` : "",
    s.service_countries?.length ? `Service countries: ${s.service_countries.join(", ")}.` : "",
    s.contact_email ? `Contact: ${s.contact_email}` : "", "",
    "## Services", ...cats.map((c) => `- [${c.title}](${SITE_URL}/services/${c.slug}): ${c.short_description ?? ""}`),
    ...LANDING_PAGES.filter((p) => p.kind === "platform").map((p) => `- [${p.navLabel}](${SITE_URL}${p.path}): ${p.metaDescription}`), "",
    "## Industries", ...LANDING_PAGES.filter((p) => p.kind === "industry").map((p) => `- [${p.navLabel}](${SITE_URL}${p.path})`), "",
    "## Portfolio", ...cases.map((c) => `- [${c.title}](${SITE_URL}/work/${c.slug}): ${(c.description ?? "").slice(0, 140)}`), "",
    "## Company", `- [About](${SITE_URL}/about)`, `- [Contact](${SITE_URL}/contact)`, `- [Website cost calculator](${SITE_URL}/website-cost-calculator)`, `- [Blog](${SITE_URL}/blog)`,
  ].filter((l, i, a) => !(l === "" && a[i - 1] === ""));
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
