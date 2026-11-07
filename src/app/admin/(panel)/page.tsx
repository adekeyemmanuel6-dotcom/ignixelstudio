"use client";
import Link from "next/link";
import { useState } from "react";
import { BookOpen, Briefcase, Calculator, Edit3, FileEdit, Inbox, Sparkles, Users, Wand2 } from "lucide-react";
import { useAdmin, useAsync } from "@/lib/admin/ctx";
import { btnPrimary, ErrorBox, PageTitle, Spinner } from "@/components/admin/ui";
import { installStarterContent } from "@/lib/admin/seed";
import { formatDate } from "@/lib/utils";

export default function Dashboard() {
  const { db, role, toast, publish } = useAdmin();
  const [busy, setBusy] = useState(false);
  const { data, loading, error, reload } = useAsync(async () => {
    const c = (t: string, f?: (q: any) => any) => { let q = db.from(t).select("*", { count: "exact", head: true }); if (f) q = f(q); return q.then((r) => r.count ?? 0); };
    const [inq, newLeads, calc, pub, draft, cases, team, recent, general] = await Promise.all([
      c("project_inquiries"), c("leads", (q) => q.eq("status", "New")), c("calculator_submissions"), c("blog_posts", (q) => q.eq("status", "published")),
      c("blog_posts", (q) => q.neq("status", "published")), c("case_studies"), c("team_members"),
      db.from("leads").select("id,name,email,source,status,summary,created_at").order("created_at", { ascending: false }).limit(6).then((r) => r.data ?? []),
      db.from("site_settings").select("value").eq("key", "general").maybeSingle().then((r) => r.data?.value),
    ]);
    return { inq, newLeads, calc, pub, draft, cases, team, recent, seeded: !!general?.content_seeded };
  }, []);

  async function seed() {
    setBusy(true);
    try { const log = await installStarterContent(db); toast("ok", `Starter content installed (${log.length} groups)`); publish(); reload(); }
    catch (e) { toast("err", (e as Error).message + (role !== "admin" ? " (only admins can install starter content)" : "")); }
    setBusy(false);
  }
  if (loading && !data) return <Spinner />;
  if (error) return <ErrorBox msg={`${error}. Have you run the database migration?`} />;
  const d = data!;
  const stats = [["Project inquiries", d.inq, Inbox], ["New leads", d.newLeads, Sparkles], ["Calculator submissions", d.calc, Calculator], ["Published posts", d.pub, BookOpen], ["Draft articles", d.draft, FileEdit], ["Case studies", d.cases, Briefcase], ["Team members", d.team, Users]] as const;
  return (
    <div>
      <PageTitle title="Dashboard" description="An overview of leads and content." />
      {!d.seeded && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-brand/30 bg-brand-soft p-5">
          <div><h2 className="!text-xl">Install starter content</h2><p className="mt-1 max-w-2xl text-text-2">Your database is empty, so the website is showing built-in defaults. Install them into the database to edit everything from this dashboard. Existing data is never overwritten.</p></div>
          <button onClick={seed} disabled={busy} className={btnPrimary}><Wand2 className="h-4 w-4" />{busy ? "Installing…" : "Install starter content"}</button>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(([l, v, Ic]) => <div key={l} className="rounded-2xl border border-line bg-white p-5"><Ic className="h-5 w-5 text-brand" /><p className="mt-3 font-heading text-4xl font-semibold">{v}</p><p className="text-text-2">{l}</p></div>)}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-2xl border border-line bg-white">
          <div className="flex items-center justify-between border-b border-line p-5"><h2 className="!text-xl">Recent inquiries</h2><Link href="/admin/leads" className="font-semibold text-brand">View all</Link></div>
          <ul className="divide-y divide-line">{d.recent.length === 0 && <li className="p-8 text-center text-text-2">No inquiries yet.</li>}
            {d.recent.map((r: any) => <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 p-4"><div className="min-w-0"><p className="font-semibold">{r.name} <span className="font-normal text-text-2">· {r.email}</span></p><p className="truncate text-text-2">{r.summary}</p></div><div className="text-right"><span className="rounded-full bg-brand-soft px-2.5 py-0.5 font-medium text-brand-deep">{r.status}</span><p className="text-text-2">{formatDate(r.created_at)} · {r.source}</p></div></li>)}</ul>
        </section>
        <section className="rounded-2xl border border-line bg-white p-5"><h2 className="!text-xl">Quick actions</h2>
          <ul className="mt-4 space-y-2">{[["/admin/blog/new", "Write a new article", Edit3], ["/admin/projects", "Add a project", Briefcase], ["/admin/team", "Manage team", Users], ["/admin/leads", "Review leads", Inbox], ["/admin/calculator", "Edit calculator pricing", Calculator]].map(([h, l, Ic]: any) => <li key={h}><Link href={h} className="flex min-h-[48px] items-center gap-3 rounded-xl border border-line px-4 font-medium hover:border-brand hover:text-brand"><Ic className="h-5 w-5" />{l}</Link></li>)}</ul></section>
      </div>
    </div>
  );
}
