import type { Metadata } from "next";
import { getSections, getSettings } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { SECTION_MAP } from "@/components/home/Sections";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return pageMeta({ title: s.seo_title, description: s.seo_description, path: "/", absoluteTitle: true, image: s.og_image || undefined });
}

export default async function HomePage() {
  const [sections, s] = await Promise.all([getSections(), getSettings()]);
  void s;
  return (
    <>
      {sections.map((sec) => {
        const Comp = SECTION_MAP[sec.key];
        return Comp ? <Comp key={sec.key} c={sec.content} /> : null;
      })}
    </>
  );
}
