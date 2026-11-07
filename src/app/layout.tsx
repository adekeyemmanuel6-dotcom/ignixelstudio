import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_URL } from "@/lib/supabase/env";
import { getSettings } from "@/lib/content";

export const viewport: Viewport = { themeColor: "#101113", width: "device-width", initialScale: 1 };

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: s.seo_title, template: `%s | ${s.site_name}` },
    description: s.seo_description,
    applicationName: s.site_name,
    icons: s.favicon_url ? { icon: s.favicon_url } : undefined,
    openGraph: { type: "website", siteName: s.site_name, title: s.seo_title, description: s.seo_description, url: SITE_URL, locale: "en_US", images: s.og_image ? [s.og_image] : undefined },
    verification: { google: s.google_site_verification || undefined, other: s.bing_site_verification ? { "msvalidate.01": s.bing_site_verification } : undefined },
    twitter: { card: "summary_large_image", title: s.seo_title, description: s.seo_description, images: s.og_image ? [s.og_image] : undefined },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const craftwork = process.env.NEXT_PUBLIC_CRAFTWORK_FONT === "true";
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js');setTimeout(function(){if(!document.documentElement.dataset.motion)document.documentElement.dataset.motion='off'},5000)" }} />{craftwork && <link rel="stylesheet" href="/fonts/craftwork.css" />}</head>
      <body>{children}</body>
    </html>
  );
}
