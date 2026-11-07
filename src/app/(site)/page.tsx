import { getSections, getSettings } from "@/lib/content";
import { SECTION_MAP } from "@/components/home/Sections";

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
