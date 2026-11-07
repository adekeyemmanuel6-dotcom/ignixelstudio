"use client";
import { useState } from "react";
import { ArrowDown, ArrowUp, Pencil } from "lucide-react";
import { useAdmin, useAsync } from "@/lib/admin/ctx";
import { FormFields } from "@/components/admin/FormFields";
import { btnGhost, btnPrimary, ErrorBox, Modal, PageTitle, Spinner, Toggle } from "@/components/admin/ui";
import { SECTION_SCHEMAS } from "@/lib/admin/resources";

type Sec = { id: string; key: string; title: string; enabled: boolean; sort_order: number; content: Record<string, any> };

export default function HomepageManager() {
  const { db, toast, publish } = useAdmin();
  const { data, loading, error, reload, setData } = useAsync<Sec[]>(async () => { const { data, error } = await db.from("homepage_sections").select("*").order("sort_order"); if (error) throw error; return data as Sec[]; }, []);
  const [edit, setEdit] = useState<Sec | null>(null); const [busy, setBusy] = useState(false);
  if (loading && !data) return <Spinner />; if (error) return <ErrorBox msg={error} />;
  const rows = data ?? [];
  async function toggle(s: Sec, v: boolean) { setData(rows.map((x) => x.id === s.id ? { ...x, enabled: v } : x)); const { error } = await db.from("homepage_sections").update({ enabled: v }).eq("id", s.id); if (error) { toast("err", error.message); reload(); } else publish(); }
  async function move(i: number, d: number) {
    const a = [...rows]; const j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; setData(a.map((x, k) => ({ ...x, sort_order: k + 1 })));
    const r = await Promise.all(a.map((x, k) => db.from("homepage_sections").update({ sort_order: k + 1 }).eq("id", x.id))); const f = r.find((x) => x.error); if (f) { toast("err", f.error!.message); reload(); } else publish();
  }
  async function save() {
    if (!edit) return; setBusy(true);
    const { error } = await db.from("homepage_sections").update({ content: edit.content, title: edit.title }).eq("id", edit.id); setBusy(false);
    if (error) return toast("err", error.message); toast("ok", "Section saved"); setEdit(null); reload(); publish();
  }
  return (
    <div><PageTitle title="Homepage Manager" description="Reorder, enable or disable sections, and edit their content. Hero images are abstract by design; project and team images come from their own modules." />
      {rows.length === 0 && <p className="rounded-xl border border-dashed border-line bg-white p-8 text-center text-text-2">No sections yet. Install starter content from the Dashboard.</p>}
      <ul className="divide-y divide-line rounded-2xl border border-line bg-white">
        {rows.map((s, i) => (
          <li key={s.id} className="flex flex-wrap items-center gap-3 p-4">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-paper font-semibold">{i + 1}</span>
            <div className="min-w-[160px] flex-1"><p className="font-semibold">{s.title}</p><p className="text-text-2">{s.key}</p></div>
            <Toggle checked={s.enabled} onChange={(v) => toggle(s, v)} label={`Show ${s.title}`} />
            <button aria-label="Move up" onClick={() => move(i, -1)} className="grid h-10 w-10 place-items-center rounded-lg hover:bg-paper"><ArrowUp className="h-4 w-4" /></button>
            <button aria-label="Move down" onClick={() => move(i, 1)} className="grid h-10 w-10 place-items-center rounded-lg hover:bg-paper"><ArrowDown className="h-4 w-4" /></button>
            {SECTION_SCHEMAS[s.key] && <button className={btnGhost} onClick={() => setEdit(s)}><Pencil className="h-4 w-4" /> Edit content</button>}
          </li>
        ))}
      </ul>
      {edit && <Modal title={`Edit: ${edit.title}`} onClose={() => setEdit(null)} wide>
        <FormFields fields={SECTION_SCHEMAS[edit.key]} value={edit.content} onChange={(c) => setEdit({ ...edit, content: c })} />
        <div className="mt-8 flex justify-end gap-2 border-t border-line pt-5"><button className={btnGhost} onClick={() => setEdit(null)}>Cancel</button><button className={btnPrimary} disabled={busy} onClick={save}>{busy ? "Saving…" : "Save"}</button></div></Modal>}
    </div>
  );
}
