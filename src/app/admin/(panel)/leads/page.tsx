"use client";
import { useMemo, useState } from "react";
import { Download, Search, Trash2 } from "lucide-react";
import { useAdmin, useAsync } from "@/lib/admin/ctx";
import { btnDanger, btnGhost, btnPrimary, downloadCsv, ErrorBox, inputCls, Modal, PageTitle, Spinner } from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";

const STATUSES = ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"];
const TONE: Record<string, string> = { New: "bg-blue-100 text-blue-800", Contacted: "bg-amber-100 text-amber-800", Qualified: "bg-violet-100 text-violet-800", "Proposal Sent": "bg-cyan-100 text-cyan-800", Won: "bg-emerald-100 text-emerald-800", Lost: "bg-zinc-200 text-zinc-700" };
type Lead = { id: string; source: "inquiry" | "calculator"; source_id: string; name: string; email: string; company: string | null; phone: string | null; summary: string | null; status: string; notes: string | null; created_at: string };

function Detail({ lead }: { lead: Lead }) {
  const { db } = useAdmin();
  const { data, loading } = useAsync(async () => (await db.from(lead.source === "inquiry" ? "project_inquiries" : "calculator_submissions").select("*").eq("id", lead.source_id).maybeSingle()).data as Record<string, any> | null, [lead.id]);
  if (loading) return <p className="text-text-2">Loading details…</p>; if (!data) return <p className="text-text-2">Original submission no longer available.</p>;
  const skip = new Set(["id", "created_at", "answers"]);
  return (
    <div className="space-y-4">
      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">{Object.entries(data).filter(([k, v]) => !skip.has(k) && v != null && v !== "").map(([k, v]) => <div key={k} className={k === "message" || k === "project_description" ? "sm:col-span-2" : ""}><dt className="text-text-2">{k.replace(/_/g, " ")}</dt><dd className="whitespace-pre-wrap break-words font-medium">{String(v)}</dd></div>)}</dl>
      {Array.isArray(data.answers) && data.answers.length > 0 && <div><h4 className="mb-2 !text-base font-semibold">Calculator answers</h4><dl className="divide-y divide-line rounded-xl border border-line">{data.answers.map((a: any, i: number) => <div key={i} className="grid gap-1 p-3 sm:grid-cols-2"><dt className="text-text-2">{a.question}</dt><dd className="font-medium">{a.answer}</dd></div>)}</dl></div>}
    </div>
  );
}

export default function LeadsPage() {
  const { db, toast } = useAdmin();
  const { data, loading, error, reload } = useAsync<Lead[]>(async () => { const { data, error } = await db.from("leads").select("*").order("created_at", { ascending: false }); if (error) throw error; return data as Lead[]; }, []);
  const [status, setStatus] = useState(""); const [source, setSource] = useState(""); const [q, setQ] = useState(""); const [sel, setSel] = useState<Lead | null>(null); const [busy, setBusy] = useState(false);
  const rows = useMemo(() => (data ?? []).filter((l) => (!status || l.status === status) && (!source || l.source === source) && (!q || `${l.name} ${l.email} ${l.company ?? ""} ${l.summary ?? ""}`.toLowerCase().includes(q.toLowerCase()))), [data, status, source, q]);

  async function save() {
    if (!sel) return; setBusy(true);
    const { error } = await db.from("leads").update({ status: sel.status, notes: sel.notes }).eq("id", sel.id); setBusy(false);
    if (error) return toast("err", error.message); toast("ok", "Lead updated"); setSel(null); reload();
  }
  async function del() { if (!sel || !window.confirm("Delete this lead record?")) return; const { error } = await db.from("leads").delete().eq("id", sel.id); if (error) return toast("err", error.message); setSel(null); reload(); }
  async function exportAll(table: string, name: string) { const { data, error } = await db.from(table).select("*").order("created_at", { ascending: false }); if (error) return toast("err", error.message); if (!data?.length) return toast("err", "Nothing to export yet."); downloadCsv(name, data); }

  return (
    <div>
      <PageTitle title="Leads" description="Project inquiries and calculator submissions in one pipeline." actions={<>
        <button className={btnGhost} onClick={() => downloadCsv("leads", rows)}><Download className="h-4 w-4" /> Export leads</button>
        <button className={btnGhost} onClick={() => exportAll("calculator_submissions", "calculator-submissions")}><Download className="h-4 w-4" /> Calculator CSV</button>
        <button className={btnGhost} onClick={() => exportAll("project_inquiries", "project-inquiries")}><Download className="h-4 w-4" /> Inquiries CSV</button></>} />
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1"><Search className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-text-2" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search leads" aria-label="Search leads" className={`${inputCls} pl-10`} /></div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status" className={`${inputCls} !w-auto`}><option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        <select value={source} onChange={(e) => setSource(e.target.value)} aria-label="Filter by source" className={`${inputCls} !w-auto`}><option value="">All sources</option><option value="inquiry">Inquiries</option><option value="calculator">Calculator</option></select>
      </div>
      {loading && !data ? <Spinner /> : error ? <ErrorBox msg={error} /> : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white"><table className="w-full min-w-[720px] text-left"><thead className="border-b border-line bg-paper/70"><tr>{["Lead", "Source", "Summary", "Status", "Received"].map((h) => <th key={h} scope="col" className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead>
          <tbody>{rows.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-text-2">No leads match.</td></tr>}
            {rows.map((l) => <tr key={l.id} className="cursor-pointer border-b border-line last:border-0 hover:bg-paper/50" onClick={() => setSel(l)}>
              <td className="px-4 py-3"><button className="text-left" onClick={() => setSel(l)}><span className="block font-semibold text-text">{l.name}</span><span className="text-text-2">{l.email}</span></button></td>
              <td className="px-4 py-3 capitalize">{l.source}</td><td className="max-w-xs truncate px-4 py-3 text-text-2">{l.summary}</td>
              <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 font-medium ${TONE[l.status]}`}>{l.status}</span></td><td className="whitespace-nowrap px-4 py-3 text-text-2">{formatDate(l.created_at)}</td></tr>)}</tbody></table></div>
      )}
      {sel && (
        <Modal title={sel.name} onClose={() => setSel(null)} wide>
          <p className="mb-5 text-text-2"><a className="text-brand underline" href={`mailto:${sel.email}`}>{sel.email}</a>{sel.company ? ` · ${sel.company}` : ""}{sel.phone ? ` · ${sel.phone}` : ""}</p>
          <Detail lead={sel} />
          <div className="mt-8 grid gap-5 border-t border-line pt-6 sm:grid-cols-[220px_1fr]">
            <div><label htmlFor="st" className="mb-1.5 block font-medium">Status</label><select id="st" value={sel.status} onChange={(e) => setSel({ ...sel, status: e.target.value })} className={inputCls}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
            <div><label htmlFor="nt" className="mb-1.5 block font-medium">Internal notes</label><textarea id="nt" rows={4} value={sel.notes ?? ""} onChange={(e) => setSel({ ...sel, notes: e.target.value })} className={inputCls} placeholder="Only visible to your team" /></div>
          </div>
          <div className="mt-6 flex justify-between gap-2"><button className={btnDanger} onClick={del}><Trash2 className="h-4 w-4" /> Delete</button><div className="flex gap-2"><button className={btnGhost} onClick={() => setSel(null)}>Cancel</button><button className={btnPrimary} disabled={busy} onClick={save}>{busy ? "Saving…" : "Save"}</button></div></div>
        </Modal>
      )}
    </div>
  );
}
