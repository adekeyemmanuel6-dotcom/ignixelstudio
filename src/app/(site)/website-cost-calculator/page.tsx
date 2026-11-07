import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import * as icons from "simple-icons";
import { Calculator } from "@/components/Calculator";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getCalculator } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = pageMeta({ title: "Website Cost Calculator", description: "Answer a few questions and get an estimated investment range for your website project from Ignixel Studio.", path: "/website-cost-calculator" });

const PLATFORM_ICONS: Record<string, string> = { wordpress: "wordpress", webflow: "webflow", shopify: "shopify", framer: "framer" };

export default async function CalculatorPage() {
  const { settings, questions } = await getCalculator();
  const iconMap: Record<string, { path: string; hex: string }> = {};
  const all = Object.values(icons).filter((v: any) => v && v.slug) as any[];
  for (const [label, slug] of Object.entries(PLATFORM_ICONS)) { const i = all.find((x) => x.slug === slug); if (i) iconMap[label] = { path: i.path, hex: i.hex }; }
  return (
    <section className="dark-surface relative min-h-screen overflow-hidden pb-sect pt-hero">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-brand/25 blur-[130px]" aria-hidden />
      <div className="container-x relative"><Breadcrumbs items={[{ name: "Website Cost Calculator" }]} dark /><div className="mt-8"><Calculator settings={settings} questions={questions} icons={iconMap} /></div></div>
    </section>
  );
}
