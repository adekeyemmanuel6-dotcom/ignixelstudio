"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ExternalLink, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useAdmin, useAsync } from "@/lib/admin/ctx";
import { btnPrimary, ErrorBox, inputCls, PageTitle, Spinner } from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";

type P = { id: string; slug: string; title: string; status: "draft" | "published" | "scheduled"; published_at: string | null; featured_image: string | null; category: { name: string } | null };
const TONE = { draft: "bg-zinc-200 text-zinc-700", published: "bg-emerald-100 text-emerald-800", scheduled: "bg-amber-100 text-amber-800" };

export default function BlogAdmin() {
  const { db, toast, publish } = useAdmin();
  const { data, loading, error, reload } = useAsync<P[]>(async () => { const { data, error } = await db.from("blog_posts").select("id,slug,title,status,published_at,featured_image,category:blog_categories(name)").order("created_at", { ascending: false }); if (error) throw error; return data as any; }, []);
  const [q, setQ] = useState(""); const [st, setSt] = useState("");
  const rows = useMemo(() => (data ?? []).filter((p) => (!st || p.status === st) && (!q || p.title.toLowerCase().includes(q.toLowerCase()))), [data, q, st]);
  async function del(p: P) { if (!window.confirm(`Delete “${p.title}”?`)) return; const { error } = await db.from("blog_posts").delete().eq("id", p.id); if (error) return toast("err", error.message); toast("ok", "Deleted"); reload(); publish(); }
  return (
    <div><PageTitle title="Blog Articles" description="Create, schedule and publish articles." actions={<Link href="/admin/blog/new" className={btnPrimary}><Plus className="h-4 w-4" /> New article</Link>} />
      <div className="mb-4 flex flex-wrap gap-3"><div className="relative min-w-[220px] flex-1"><Search className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-text-2" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles" aria-label="Search articles" className={`${inputCls} pl-10`} /></div>
        <select value={st} onChange={(e) => setSt(e.target.value)} aria-label="Filter by status" className={`${inputCls} !w-auto`}><option value="">All statuses</option><option value="published">Published</option><option value="draft">Draft</option><option value="scheduled">Scheduled</option></select></div>
      {loading && !data ? <Spinner /> : error ? <ErrorBox msg={error} /> : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white"><table className="w-full min-w-[640px] text-left"><thead className="border-b border-line bg-paper/70"><tr>{["Title", "Category", "Status", "Date", ""].map((h) => <th key={h} scope="col" className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead>
          <tbody>{rows.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-text-2">No articles yet.</td></tr>}
            {rows.map((p) => <tr key={p.id} className="border-b border-line last:border-0 hover:bg-paper/40"><td className="px-4 py-3"><Link href={`/admin/blog/${p.id}`} className="font-semibold hover:text-brand">{p.title}</Link></td><td className="px-4 py-3 text-text-2">{p.category?.name ?? "—"}</td>
              <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 font-medium capitalize ${TONE[p.status]}`}>{p.status}</span></td><td className="px-4 py-3 text-text-2">{formatDate(p.published_at)}</td>
              <td className="px-4 py-3"><div className="flex justify-end gap-1"><Link aria-label="Edit" href={`/admin/blog/${p.id}`} className="grid h-10 w-10 place-items-center rounded-lg hover:bg-paper"><Pencil className="h-4 w-4" /></Link>
                {p.status === "published" && <a aria-label="View live" target="_blank" href={`/blog/${p.slug}`} className="grid h-10 w-10 place-items-center rounded-lg hover:bg-paper"><ExternalLink className="h-4 w-4" /></a>}
                <button aria-label="Delete" onClick={() => del(p)} className="grid h-10 w-10 place-items-center rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></div></td></tr>)}</tbody></table></div>)}
    </div>
  );
}
