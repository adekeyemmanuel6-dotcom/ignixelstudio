import type { Technology } from "@/lib/types";
import { TechLogo } from "./ui/TechLogo";

export function TechCard({ t }: { t: Technology }) {
  return (
    <li className="group flex flex-col items-center gap-3 rounded-2xl border border-line bg-white px-4 py-6 text-center transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-card">
      <span className="transition duration-300 group-hover:scale-110"><TechLogo tech={t} size={44} /></span>
      <span className="font-medium text-text">{t.name}</span>
    </li>
  );
}

export function TechGrid({ items, grouped = true }: { items: Technology[]; grouped?: boolean }) {
  if (!items.length) return null;
  if (!grouped) return <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">{items.map((t) => <TechCard key={t.id} t={t} />)}</ul>;
  const cats = [...new Set(items.map((i) => i.category))];
  return (
    <div className="space-y-12">
      {cats.map((c) => (
        <div key={c}>
          <h3 className="mb-5 !text-xl">{c}</h3>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">{items.filter((i) => i.category === c).map((t) => <TechCard key={t.id} t={t} />)}</ul>
        </div>
      ))}
    </div>
  );
}

/** Looping logo strip for the "Trusted by / platforms" band. */
export function TechMarquee({ items }: { items: Technology[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <ul className="flex w-max animate-marquee items-center gap-12 py-2 motion-reduce:animate-none">
        {row.map((t, i) => (
          <li key={t.id + i} aria-hidden={i >= items.length} className="flex items-center gap-3 opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0">
            <TechLogo tech={t} size={28} /><span className="font-heading text-lg font-semibold text-text">{t.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
