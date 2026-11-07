import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "@/components/ui/Ico";
import { PageHero } from "@/components/ui/PageHero";
import { PostCard } from "@/components/Cards";
import { NewsletterForm } from "@/components/NewsletterForm";
import { getBlogCategories, getPosts } from "@/lib/content";

export const metadata: Metadata = { title: "Blog: Insights on Web Design, Development, eCommerce & AI", description: "Practical articles on web design, development, eCommerce and AI to help your business grow online.", alternates: { canonical: "/blog" } };

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string; page?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const [cats, { posts, pages, total }] = await Promise.all([getBlogCategories(), getPosts({ page, perPage: 9, category: sp.category, q: sp.q })]);
  const filtered = Boolean(sp.category || sp.q || page > 1);
  const [first, ...rest] = posts;
  const qs = (over: Record<string, string | undefined>) => { const p = new URLSearchParams(); const m = { category: sp.category, q: sp.q, ...over }; Object.entries(m).forEach(([k, v]) => v && p.set(k, v)); const s = p.toString(); return s ? `/blog?${s}` : "/blog"; };
  const pill = (active: boolean) => `rounded-[5px] border px-4 py-2 text-base font-medium transition ${active ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-brand hover:text-brand"}`;

  return (
    <>
      <PageHero crumbs={[{ name: "Blog" }]} eyebrow="Insights" title="Ideas for Growing a Digital Business." description="Practical thinking on web design, development, eCommerce and AI, written for decision-makers." visual={false} />
      <section className="section bg-white"><div className="container-x">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Categories"><ul className="flex flex-wrap gap-2"><li><Link href={qs({ category: undefined, page: undefined })} className={pill(!sp.category)}>All</Link></li>
            {cats.map((c) => <li key={c.id}><Link href={qs({ category: c.slug, page: undefined })} className={pill(sp.category === c.slug)}>{c.name}</Link></li>)}</ul></nav>
          <form action="/blog" role="search" className="relative w-full lg:w-80">
            {sp.category && <input type="hidden" name="category" value={sp.category} />}
            <label htmlFor="q" className="sr-only">Search articles</label>
            <input id="q" name="q" defaultValue={sp.q} placeholder="Search articles" className="field pr-12" />
            <button aria-label="Search" className="absolute right-1.5 top-1.5 grid h-10 w-10 place-items-center rounded-lg text-text-2 hover:text-brand"><Search className="h-5 w-5" /></button>
          </form>
        </div>

        {total === 0 ? (
          <div className="mt-16 rounded-2xl border border-dashed border-line p-14 text-center"><h2 className="!text-2xl">No articles found</h2><p className="mt-2 text-text-2">Try a different search or category.</p><Link href="/blog" className="btn-ghost mt-6">Clear filters</Link></div>
        ) : (
          <>
            {first && !filtered && <div className="mt-10"><PostCard p={first} featured /></div>}
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{(filtered ? posts : rest).map((p) => <PostCard key={p.id} p={p} />)}</div>
          </>
        )}

        {pages > 1 && (
          <nav aria-label="Pagination" className="mt-14 flex flex-wrap items-center justify-center gap-2">
            {page > 1 && <Link className="btn-ghost" href={qs({ page: String(page - 1) })}>Previous</Link>}
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => <Link key={n} href={qs({ page: String(n) })} aria-current={n === page ? "page" : undefined} className={`grid h-12 w-12 place-items-center rounded-[5px] border font-medium ${n === page ? "border-brand bg-brand text-white" : "border-line hover:border-brand"}`}>{n}</Link>)}
            {page < pages && <Link className="btn-ghost" href={qs({ page: String(page + 1) })}>Next</Link>}
          </nav>
        )}
      </div></section>
      <section className="section bg-white"><div className="container-x grid items-center gap-8 lg:grid-cols-2"><div><h2 className="!text-h3">Get new articles in your inbox</h2><p className="mt-3 text-text-2">Practical insights, no spam. Unsubscribe any time.</p></div><NewsletterForm /></div></section>
    </>
  );
}
