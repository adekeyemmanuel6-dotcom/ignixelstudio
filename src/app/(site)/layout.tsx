import Script from "next/script";
import { Motion } from "@/components/Motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/ui/JsonLd";
import { getCategories, getSettings } from "@/lib/content";
import { SITE_URL } from "@/lib/supabase/env";

export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [s, cats] = await Promise.all([getSettings(), getCategories()]);
  const sameAs = Object.values(s.socials).filter(Boolean);
  return (
    <>
      <Header logoUrl={s.logo_url || undefined} categories={cats.map((c) => ({ slug: c.slug, title: c.title }))} />
      <Motion />
      <main id="main">{children}</main>
      <Footer />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Organization", name: s.site_name, url: SITE_URL, logo: s.logo_url || undefined, email: s.contact_email || undefined, telephone: s.phone || undefined, description: s.seo_description, sameAs }} />
      {/^G-[A-Z0-9]+$/i.test(s.ga_id) && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${s.ga_id}`} strategy="afterInteractive" />
          <Script id="ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${s.ga_id}');`}</Script>
        </>
      )}
      {/^\d{8,20}$/.test(s.meta_pixel_id) && (
        <Script id="fbq" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${s.meta_pixel_id}');fbq('track','PageView');`}</Script>
      )}
    </>
  );
}
