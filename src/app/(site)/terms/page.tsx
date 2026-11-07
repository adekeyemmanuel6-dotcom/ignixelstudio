import type { Metadata } from "next";
import sanitizeHtml from "sanitize-html";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getLegal } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = { title: "Terms & Conditions", alternates: { canonical: "/terms" }, robots: { index: true, follow: true } };

export default async function Page() {
  const html = sanitizeHtml((await getLegal()).terms, { allowedTags: sanitizeHtml.defaults.allowedTags.concat(["h1", "h2", "h3"]) });
  return (
    <section className="pb-sect pt-hero"><div className="container-x"><Breadcrumbs items={[{ name: "Terms & Conditions" }]} />
      <h1 className="mt-6 !text-h2">Terms & Conditions</h1><div className="prose-ig mt-8" dangerouslySetInnerHTML={{ __html: html }} /></div></section>
  );
}
