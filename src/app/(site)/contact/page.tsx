import type { Metadata } from "next";
import { Mail, Phone, MapPin, CheckCircle2, Quote } from "@/components/ui/Ico";
import { InquiryForm } from "@/components/InquiryForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getCategories, getSettings, getTestimonials } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = { title: "Contact: Start a Project", description: "Tell Ignixel Studio about your website, application, eCommerce or AI project and get a considered response.", alternates: { canonical: "/contact" } };

export default async function ContactPage() {
  const [cats, s, ts] = await Promise.all([getCategories(), getSettings(), getTestimonials()]);
  const t = ts.find((x) => !x.is_placeholder);
  return (
    <section className="dark-surface relative overflow-hidden pt-32 sm:pt-40">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
      <div className="container-x relative pb-20"><Breadcrumbs items={[{ name: "Contact" }]} dark />
        <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="eyebrow mb-5">Contact</p>
            <h1>Let&apos;s Build Something Together.</h1>
            <p className="lead mt-6">Share what you&apos;re working on and where you want to get to. We&apos;ll come back with honest advice and clear next steps.</p>
            <ul className="mt-8 space-y-3">{["A considered reply from a senior team member", "Practical recommendations, not a generic pitch", "A clear scope, timeline and investment range"].map((b) => <li key={b} className="flex gap-3"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#8b8bff]" />{b}</li>)}</ul>
            {t && <figure className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6"><Quote className="h-6 w-6 text-[#8b8bff]" /><blockquote className="mt-3 text-lg text-white">{t.quote}</blockquote><figcaption className="mt-3 text-white/60">{t.client_name}, {t.company}</figcaption></figure>}
            <ul className="mt-10 space-y-3 border-t border-white/10 pt-8">
              {s.contact_email && <li className="flex gap-3"><Mail className="mt-1 h-5 w-5 text-[#8b8bff]" /><a className="hover:text-white" href={`mailto:${s.contact_email}`}>{s.contact_email}</a></li>}
              {s.phone && <li className="flex gap-3"><Phone className="mt-1 h-5 w-5 text-[#8b8bff]" /><a className="hover:text-white" href={`tel:${s.phone}`}>{s.phone}</a></li>}
              {s.address && <li className="flex gap-3"><MapPin className="mt-1 h-5 w-5 text-[#8b8bff]" />{s.address}</li>}
            </ul>
          </div>
          <div className="relative"><div className="rounded-[2rem] bg-white p-6 text-text shadow-glow sm:p-9"><h2 className="mb-6 !text-3xl">Project inquiry</h2><InquiryForm services={cats.map((c) => c.title)} variant="contact" /></div></div>
        </div>
      </div>
    </section>
  );
}
