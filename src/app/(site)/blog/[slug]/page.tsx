import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail } from "@/components/ui/Ico";
import { Social } from "@/components/ui/Social";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PostCard } from "@/components/Cards";
import { Avatar } from "@/components/ui/Visuals";
import { NewsletterForm } from "@/components/NewsletterForm";
import { CtaBand } from "@/components/ui/CtaBand";
import { JsonLd } from "@/components/ui/JsonLd";
import { getLatestPosts, getPost, getPosts, getSettings } from "@/lib/content";
import { cleanHtml, withToc } from "@/lib/html";
import { formatDate } from "@/lib/utils";
import { SITE_URL } from "@/lib/supabase/env";

export const revalidate = 60;
export async function generateStaticParams() { return (await getPosts({ perPage: 1000 })).posts.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getPost((await params).slug); if (!p) return {};
  const title = p.seo_title || p.title, description = p.seo_description || p.excerpt || undefined, img = p.og_image || p.featured_image || undefined;
  return { title: { absolute: `${title} | Ignixel Studio` }, description, alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { type: "article", title, description, url: `${SITE_URL}/blog/${p.slug}`, publishedTime: p.published_at ?? undefined, images: img ? [img] : undefined },
    twitter: { card: "summary_large_image", title, description, images: img ? [img] : undefined } };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getPost((await params).slug);
  if (!p) notFound();
  const [related, settings] = await Promise.all([getLatestPosts(3, p.slug, p.category_id), getSettings()]);
  const { html, toc } = withToc(cleanHtml(p.content));
  const url = `${SITE_URL}/blog/${p.slug}`, enc = encodeURIComponent;
  const share = [["LinkedIn", "linkedin", `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`], ["X", "x", `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(p.title)}`], ["Facebook", "facebook", `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`], ["Email", "mail", `mailto:?subject=${enc(p.title)}&body=${enc(url)}`]] as const;

  return (
    <>
      <article className="pt-hero">
        <header className="container-x max-w-4xl">
          <Breadcrumbs items={[{ name: "Blog", href: "/blog" }, { name: p.title }]} />
          {p.category && <Link href={`/blog?category=${p.category.slug}`} className="eyebrow mt-8">{p.category.name}</Link>}
          <h1 className="mt-4 !text-h2">{p.title}</h1>
          {p.excerpt && <p className="lead mt-5">{p.excerpt}</p>}
          <div className="mt-7 flex flex-wrap items-center gap-4 border-y border-line py-5">
            <Avatar name={p.author_name || "Ignixel Team"} src={p.author_image} className="h-12 w-12 rounded-full" />
            <div><p className="font-semibold text-text">{p.author_name}</p><p className="text-text-2">{p.author_title}</p></div>
            <p className="ml-auto text-text-2"><time dateTime={p.published_at ?? undefined}>{formatDate(p.published_at)}</time> · {p.reading_time} min read</p>
          </div>
        </header>
        {p.featured_image && <div className="container-x mt-10 max-w-5xl"><div className="relative aspect-[16/8] overflow-hidden rounded-3xl"><Image src={p.featured_image} alt={p.title} fill priority sizes="1024px" className="object-cover" /></div></div>}
        <div className="container-x mt-12 grid max-w-6xl gap-12 lg:grid-cols-[1fr_260px]">
          <div className="min-w-0"><div className="prose-ig" dangerouslySetInnerHTML={{ __html: html }} />
            {p.tags && p.tags.length > 0 && <ul className="mt-10 flex flex-wrap gap-2" aria-label="Tags">{p.tags.map((t) => <li key={t.id} className="rounded-full bg-paper px-3 py-1">#{t.name}</li>)}</ul>}
          </div>
          <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
            {toc.length > 0 && <nav aria-label="Table of contents"><h2 className="!text-lg">On this page</h2><ol className="mt-3 space-y-2 border-l border-line">{toc.map((t) => <li key={t.id} className={t.level === 3 ? "pl-7" : "pl-4"}><a href={`#${t.id}`} className="text-text-2 hover:text-brand">{t.text}</a></li>)}</ol></nav>}
            <div><h2 className="!text-lg">Share</h2><ul className="mt-3 flex gap-2">{share.map(([n, k, h]) => <li key={n}><a href={h} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${n}`} className="grid h-11 w-11 place-items-center rounded-full border border-line hover:border-brand hover:text-brand">{k === "mail" ? <Mail className="h-5 w-5" /> : <Social name={k} />}</a></li>)}</ul></div>
          </aside>
        </div>
      </article>

      {related.length > 0 && <section className="section mt-12 bg-white"><div className="container-x"><h2 className="!text-h3">Related articles</h2><div className="mt-8 grid gap-card md:grid-cols-2 lg:grid-cols-3">{related.map((r) => <PostCard key={r.id} p={r} />)}</div></div></section>}
      <section className="section bg-white"><div className="container-x grid items-center gap-8 lg:grid-cols-2"><div><h2 className="!text-h3">Enjoyed this? Get the next one by email.</h2></div><NewsletterForm /></div></section>
      <CtaBand title="Want to put this into practice?" description="Talk to our team about your website, store or AI project." />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: p.title, description: p.excerpt, image: p.og_image || p.featured_image || undefined, datePublished: p.published_at, author: { "@type": "Person", name: p.author_name }, publisher: { "@type": "Organization", name: settings.site_name, url: SITE_URL }, mainEntityOfPage: url }} />
    </>
  );
}
