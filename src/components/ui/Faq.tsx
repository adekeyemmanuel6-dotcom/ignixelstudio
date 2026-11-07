import { ChevronDown } from "lucide-react";
import type { FAQ } from "@/lib/types";
import { JsonLd } from "./JsonLd";

export function FaqList({ faqs }: { faqs: FAQ[] }) {
  if (!faqs?.length) return null;
  return (
    <>
      <div className="divide-y divide-line rounded-2xl border border-line bg-white">
        {faqs.map((f, i) => (
          <details key={i} className="group px-6 py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-heading text-xl font-semibold [&::-webkit-details-marker]:hidden">
              {f.q}<ChevronDown className="h-5 w-5 shrink-0 text-brand transition group-open:rotate-180" />
            </summary>
            <p className="mt-3 max-w-3xl text-text-2">{f.a}</p>
          </details>
        ))}
      </div>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
    </>
  );
}
