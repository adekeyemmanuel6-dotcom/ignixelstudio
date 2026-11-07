"use client";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Download, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useAdmin, useAsync } from "@/lib/admin/ctx";
import type { Resource } from "@/lib/admin/resources";
import { FormFields } from "./FormFields";
import { CaseGallery } from "./CaseGallery";
import { btnDanger, btnGhost, btnPrimary, downloadCsv, ErrorBox, inputCls, Modal, PageTitle, Spinner, Toggle } from "./ui";
import { formatDate } from "@/lib/utils";

type Row = Record<string, any>;

export function ResourceManager({ res }: { res: Resource }) {
  const { db, toast, publish } = useAdmin();
  const { data, loading, error, reload, setData } = useAsync<Row[]>(async () => {
    const { data, error } = await db.from(res.table).select("*").order(res.order.column, { ascending: res.order.ascending ?? true });
    if (error) throw error; return data as Row[];
  }, [res.table]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [q, setQ] = useState("");
  const [saving, setSaving] = useState(false);

  const rows = useMemo(() => (data ?? []).filter((r) => !q || (res.search ?? []).some((k) => String(r[k] ?? "").toLowerCase().includes(q.toLowerCase()))), [data, q, res.search]);

  async function save() {
    if (!editing) return;
    for (const f of res.fields) if (f.required && !String(editing[f.name] ?? "").trim()) return toast("err", `${f.label} is required.`);
    setSaving(true);
    const payload: Row = {}; res.fields.forEach((f) => (payload[f.name] = editing[f.name] === "" ? null : editing[f.name]));
    if (res.reorder) payload.sort_order = editing.sort_order ?? 99;
    for (const f of res.fields) if (f.type === "slug" && !payload[f.name]) { setSaving(false); return toast("err", "A URL slug is required."); }
    const { error } = editing.id ? await db.from(res.table).update(payload).eq("id", editing.id) : await db.from(res.table).insert(payload);
    setSaving(false);
    if (error) return toast("err", error.code === "23505" ? "That slug is already in use. Choose another." : error.message);
    toast("ok", "Saved"); setEditing(null); reload(); publish();
  }

  async function remove(r: Row) {
    if (!window.confirm(`Delete this ${res.singular}? This cannot be undone.`)) return;
    const { error } = await db.from(res.table).delete().eq("id", r.id);
    if (error) return toast("err", error.message);
    toast("ok", "Deleted"); reload(); publish();
  }
  async function toggle(r: Row, v: boolean) {
    setData((d) => (d ?? []).map((x) => (x.id === r.id ? { ...x, [res.toggle!]: v } : x)));
    const { error } = await db.from(res.table).update({ [res.toggle!]: v }).eq("id", r.id);
    if (error) { toast("err", error.message); reload(); } else publish();
  }
  async function move(r: Row, d: number) {
    const list = [...(data ?? [])]; const i = list.findIndex((x) => x.id === r.id); const j = i + d;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    setData(list.map((x, k) => ({ ...x, sort_order: k + 1 })));
    const results = await Promise.all(list.map((x, k) => db.from(res.table).update({ sort_order: k + 1 }).eq("id", x.id)));
    const failed = results.find((x) => x.error); if (failed) { toast("err", failed.error!.message); reload(); } else publish();
  }

  return (
    <div>
      <PageTitle title={res.title} description={res.description} actions={<>
        {res.csv && <button className={btnGhost} onClick={() => downloadCsv(res.key, data ?? [])}><Download className="h-4 w-4" /> Export CSV</button>}
        {!res.readOnly && <button className={btnPrimary} onClick={() => setEditing({ ...res.defaults, sort_order: (data?.length ?? 0) + 1 })}><Plus className="h-4 w-4" /> Add {res.singular}</button>}
      </>} />
      <div className="relative mb-4 max-w-sm"><Search className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-text-2" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${res.title.toLowerCase()}`} aria-label="Search" className={`${inputCls} pl-10`} /></div>

      {loading && !data ? <Spinner /> : error ? <ErrorBox msg={error} /> : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[640px] text-left">
            <thead className="border-b border-line bg-paper/70"><tr>
              {res.columns.map((c) => <th key={c.name} scope="col" className="px-4 py-3 font-semibold">{c.label}</th>)}
              {res.toggle && <th scope="col" className="px-4 py-3 font-semibold">{res.toggle === "published" ? "Published" : res.toggle === "active" ? "Active" : "Visible"}</th>}
              <th scope="col" className="px-4 py-3 text-right font-semibold">Actions</th></tr></thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={9} className="px-4 py-12 text-center text-text-2">Nothing here yet.</td></tr>}
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-line last:border-0 hover:bg-paper/40">
                  {res.columns.map((c) => (
                    <td key={c.name} className="px-4 py-3">
                      {c.kind === "image" ? (r[c.name] ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={r[c.name]} alt="" className="h-10 w-10 rounded-lg object-cover" /> : <span className="grid h-10 w-10 place-items-center rounded-lg bg-paper text-text-2">–</span>)
                        : c.kind === "bool" ? (r[c.name] ? <span className="rounded-full bg-brand-soft px-2.5 py-0.5 font-medium text-brand-deep">Yes</span> : <span className="text-text-2">No</span>)
                        : c.kind === "date" ? formatDate(r[c.name]) : <span className="font-medium text-text">{String(r[c.name] ?? "")}</span>}
                    </td>
                  ))}
                  {res.toggle && <td className="px-4 py-3"><Toggle checked={!!r[res.toggle]} onChange={(v) => toggle(r, v)} label={`Toggle ${res.singular}`} /></td>}
                  <td className="px-4 py-3"><div className="flex justify-end gap-1">
                    {res.reorder && !q && <><button aria-label="Move up" onClick={() => move(r, -1)} className="grid h-10 w-10 place-items-center rounded-lg hover:bg-paper"><ArrowUp className="h-4 w-4" /></button><button aria-label="Move down" onClick={() => move(r, 1)} className="grid h-10 w-10 place-items-center rounded-lg hover:bg-paper"><ArrowDown className="h-4 w-4" /></button></>}
                    {!res.readOnly && <button aria-label={`Edit ${res.singular}`} onClick={() => setEditing(r)} className="grid h-10 w-10 place-items-center rounded-lg hover:bg-paper"><Pencil className="h-4 w-4" /></button>}
                    <button aria-label={`Delete ${res.singular}`} onClick={() => remove(r)} className="grid h-10 w-10 place-items-center rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <Modal title={`${editing.id ? "Edit" : "Add"} ${res.singular}`} onClose={() => setEditing(null)} wide>
          <FormFields fields={res.fields} value={editing} onChange={setEditing} />
          {res.key === "projects" && (editing.id ? <CaseGallery caseId={editing.id} /> : <p className="mt-6 text-text-2">Save the project first to add gallery images.</p>)}
          <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-line pt-5">
            {editing.id ? <button className={btnDanger} onClick={() => { remove(editing); setEditing(null); }}><Trash2 className="h-4 w-4" /> Delete</button> : <span />}
            <div className="flex gap-2"><button className={btnGhost} onClick={() => setEditing(null)}>Cancel</button><button className={btnPrimary} disabled={saving} onClick={save}>{saving ? "Saving…" : "Save"}</button></div>
          </div>
        </Modal>
      )}
    </div>
  );
}
