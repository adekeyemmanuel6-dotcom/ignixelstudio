"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, Plus, X } from "lucide-react";
import { useAdmin, useAsync } from "@/lib/admin/ctx";
import { btnGhost, btnPrimary, ErrorBox, inputCls, Modal, PageTitle, Spinner } from "@/components/admin/ui";
import { FormFields, type Field } from "@/components/admin/FormFields";
import { RichText } from "@/components/admin/RichText";
import { readingTime, slugify, formatDate } from "@/lib/utils";

const blank = { title: "", slug: "", excerpt: "", content: "", featured_image: "", category_id: null as string | null, status: "draft", published_at: null as string | null, author_name: "Ignixel Team", author_title: "", author_image: "", reading_time: 4, seo_title: "", seo_description: "", og_image: "" };

const META: Field[] = [
  { name: "title", label: "Title", type: "text", required: true, full: true }, { name: "slug", label: "URL slug", type: "slug", slugFrom: "title" },
  { name: "category_id", label: "Category", type: "relation", rel: { table: "blog_categories", label: "name" } },
  { name: "excerpt", label: "Excerpt", type: "textarea", rows: 3 }, { name: "featured_image", label: "Featured image", type: "image", folder: "blog" },
];
const SIDE: Field[] = [
  { name: "status", label: "Status", type: "select", options: ["draft", "published", "scheduled"] }, { name: "published_at", label: "Publish date/time", type: "datetime", help: "For scheduled posts the article goes live automatically at this time." },
  { name: "author_name", label: "Author name", type: "text" }, { name: "author_title", label: "Author title", type: "text" }, { name: "author_image", label: "Author photo", type: "image", folder: "authors" },
  { name: "seo_title", label: "SEO title", type: "text" }, { name: "seo_description", label: "Meta description", type: "textarea", rows: 3 }, { name: "og_image", label: "Open Graph image", type: "image", folder: "blog" },
];

export default function PostEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); const isNew = id === "new";
  const { db, toast, publish } = useAdmin(); const router = useRouter();
  const { data, loading, error } = useAsync(async () => {
    const [tags, post] = await Promise.all([db.from("blog_tags").select("*").order("name"), isNew ? Promise.resolve({ data: null }) : db.from("blog_posts").select("*, post_tags(tag_id)").eq("id", id).maybeSingle()]);
    return { tags: (tags.data ?? []) as { id: string; name: string; slug: string }[], post: post.data as any };
  }, [id]);
  const [v, setV] = useState<any>(null); const [tagIds, setTagIds] = useState<string[]>([]); const [allTags, setAllTags] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [busy, setBusy] = useState(false); const [preview, setPreview] = useState(false); const [newTag, setNewTag] = useState("");
  useEffect(() => { if (!data) return; setAllTags(data.tags); if (data.post) { const { post_tags, ...p } = data.post; setV(p); setTagIds((post_tags ?? []).map((t: any) => t.tag_id)); } else setV(blank); }, [data]);
  if (loading || !v) return <Spinner />; if (error) return <ErrorBox msg={error} />;
  if (!isNew && !data?.post) return <ErrorBox msg="Article not found." />;

  async function addTag() {
    const name = newTag.trim(); if (!name) return;
    const { data: t, error } = await db.from("blog_tags").insert({ name, slug: slugify(name) }).select().single();
    if (error) return toast("err", error.code === "23505" ? "Tag already exists." : error.message);
    setAllTags((a) => [...a, t]); setTagIds((s) => [...s, t.id]); setNewTag("");
  }

  async function save(forceStatus?: string) {
    if (!v.title.trim() || !v.slug.trim()) return toast("err", "Title and slug are required.");
    const status = forceStatus ?? v.status;
    if (status === "scheduled" && (!v.published_at || new Date(v.published_at) <= new Date())) return toast("err", "Choose a future publish date for scheduled posts.");
    setBusy(true);
    const payload = { title: v.title, slug: v.slug, excerpt: v.excerpt || null, content: v.content, featured_image: v.featured_image || null, category_id: v.category_id || null,
      status, published_at: status === "published" ? (v.published_at && !isNew && v.status === "published" ? v.published_at : new Date().toISOString()) : v.published_at,
      author_name: v.author_name || null, author_title: v.author_title || null, author_image: v.author_image || null, reading_time: readingTime(v.content),
      seo_title: v.seo_title || null, seo_description: v.seo_description || null, og_image: v.og_image || null };
    const res = isNew ? await db.from("blog_posts").insert(payload).select("id").single() : await db.from("blog_posts").update(payload).eq("id", id).select("id").single();
    if (res.error) { setBusy(false); return toast("err", res.error.code === "23505" ? "That slug is already used by another article." : res.error.message); }
    const pid = res.data!.id;
    await db.from("post_tags").delete().eq("post_id", pid);
    if (tagIds.length) await db.from("post_tags").insert(tagIds.map((t) => ({ post_id: pid, tag_id: t })));
    setBusy(false); toast("ok", status === "published" ? "Published" : "Saved"); publish();
    if (isNew) router.replace(`/admin/blog/${pid}`); else setV({ ...v, status, published_at: payload.published_at });
  }

  return (
    <div>
      <Link href="/admin/blog" className="mb-3 inline-flex items-center gap-1 text-text-2 hover:text-brand"><ArrowLeft className="h-4 w-4" /> All articles</Link>
      <PageTitle title={isNew ? "New article" : "Edit article"} actions={<>
        <button className={btnGhost} onClick={() => setPreview(true)}><Eye className="h-4 w-4" /> Preview</button>
        <button className={btnGhost} disabled={busy} onClick={() => save("draft")}>Save draft</button>
        <button className={btnPrimary} disabled={busy} onClick={() => save(v.status === "scheduled" ? "scheduled" : "published")}>{busy ? "Saving…" : v.status === "scheduled" ? "Schedule" : "Publish"}</button></>} />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-line bg-white p-5 sm:p-7"><FormFields fields={META} value={v} onChange={setV} /></section>
          <section className="rounded-2xl border border-line bg-white p-5 sm:p-7"><h2 className="mb-3 !text-xl">Content</h2><RichText value={v.content} onChange={(c) => setV((p: any) => ({ ...p, content: c }))} /></section>
        </div>
        <div className="space-y-6">
          <section className="rounded-2xl border border-line bg-white p-5"><div className="grid gap-4"><FormFields fields={SIDE} value={v} onChange={setV} /></div></section>
          <section className="rounded-2xl border border-line bg-white p-5"><h2 className="mb-3 !text-xl">Tags</h2>
            <ul className="flex flex-wrap gap-2">{allTags.map((t) => { const on = tagIds.includes(t.id); return <li key={t.id}><button type="button" aria-pressed={on} onClick={() => setTagIds((s) => on ? s.filter((x) => x !== t.id) : [...s, t.id])} className={`rounded-full border px-3 py-1 ${on ? "border-brand bg-brand text-white" : "border-line"}`}>{t.name}{on && <X className="ml-1 inline h-3 w-3" />}</button></li>; })}</ul>
            <div className="mt-3 flex gap-2"><input value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="New tag" aria-label="New tag" className={inputCls} /><button type="button" onClick={addTag} className={btnGhost} aria-label="Add tag"><Plus className="h-4 w-4" /></button></div></section>
        </div>
      </div>
      {preview && <Modal title="Preview (draft appearance)" onClose={() => setPreview(false)} wide>
        <article>{v.featured_image && /* eslint-disable-next-line @next/next/no-img-element */ <img src={v.featured_image} alt="" className="mb-6 aspect-[16/8] w-full rounded-2xl object-cover" />}
          <p className="text-text-2">{v.author_name} · {formatDate(v.published_at ?? new Date().toISOString())} · {readingTime(v.content)} min read</p><h1 className="mt-2 !text-4xl">{v.title || "Untitled"}</h1>{v.excerpt && <p className="lead mt-3">{v.excerpt}</p>}
          <div className="prose-ig mt-6" dangerouslySetInnerHTML={{ __html: v.content }} /></article></Modal>}
    </div>
  );
}
