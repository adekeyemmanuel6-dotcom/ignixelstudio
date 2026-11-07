import type { Metadata } from "next";
import { SITE_URL } from "./supabase/env";

/** Absolute URL for a site path. */
export const absoluteUrl = (path = "/") => (path === "/" ? SITE_URL : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`);

/**
 * One place that builds per-page metadata so canonical, og:url, Open Graph and Twitter tags can never drift apart.
 * (Next.js does not deep-merge `openGraph`, so each page must supply its own url.)
 * If `image` is omitted, the site-wide generated image (app/opengraph-image.tsx) is used.
 */
export function pageMeta(o: { title: string; description?: string | null; path: string; image?: string | null; type?: "website" | "article"; absoluteTitle?: boolean; publishedTime?: string | null; modifiedTime?: string | null; noindex?: boolean }): Metadata {
  const description = o.description ?? undefined;
  const images = [o.image || absoluteUrl("/opengraph-image")];
  return {
    title: o.absoluteTitle ? { absolute: o.title } : o.title,
    description,
    alternates: { canonical: o.path },
    robots: o.noindex ? { index: false, follow: true } : undefined,
    openGraph: { type: o.type ?? "website", url: absoluteUrl(o.path), title: o.title, description, siteName: "Ignixel Studio", locale: "en_US", images, ...(o.type === "article" ? { publishedTime: o.publishedTime ?? undefined, modifiedTime: o.modifiedTime ?? undefined } : {}) },
    twitter: { card: "summary_large_image", title: o.title, description, images },
  };
}
