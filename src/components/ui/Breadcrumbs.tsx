import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { SITE_URL } from "@/lib/supabase/env";

export function Breadcrumbs({ items, dark }: { items: { name: string; href?: string }[]; dark?: boolean }) {
  const all = [{ name: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className={`text-base ${dark ? "text-white/60" : "text-text-2"}`}>
        <ol className="flex flex-wrap items-center gap-2">
          {all.map((it, i) => (
            <li key={i} className="flex items-center gap-2">
              {it.href && i < all.length - 1 ? <Link href={it.href} className="hover:text-brand">{it.name}</Link> : <span aria-current="page" className={dark ? "text-white" : "text-text"}>{it.name}</span>}
              {i < all.length - 1 && <span aria-hidden>/</span>}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: all.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${SITE_URL}${it.href ?? ""}` })) }} />
    </>
  );
}
