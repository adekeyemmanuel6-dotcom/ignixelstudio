"use client";
import { useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, Plus, Trash2 } from "lucide-react";
import { useAdmin, useAsync } from "@/lib/admin/ctx";
import { btnDanger, btnGhost, btnPrimary, ErrorBox, inputCls, PageTitle, Spinner, Toggle } from "@/components/admin/ui";
import { ImageField } from "@/components/admin/FormFields";
import { slugify } from "@/lib/utils";

type Opt = { id: string; question_id: string; label: string; description: string | null; image_url: string | null; price_add: number; multiplier: number; complexity_points: number; enabled: boolean; sort_order: number };
type Q = { id: string; key: string; title: string; description: string | null; display_type: string; enabled: boolean; sort_order: number; options: Opt[] };

const Num = ({ v, on, step = 1, label }: { v: number; on: (n: number) => void; step?: number; label: string }) => <input type="number" step={step} aria-label={label} value={v} onChange={(e) => on(Number(e.target.value))} className={`${inputCls} !py-1.5`} />;

export default function CalculatorAdmin() {
  const { db, role, toast, publish } = useAdmin();
  const { data, loading, error, reload } = useAsync(async () => {
    const [s, q, o] = await Promise.all([db.from("calculator_settings").select("*").eq("id", 1).maybeSingle(), db.from("calculator_questions").select("*").order("sort_order"), db.from("calculator_options").select("*").order("sort_order")]);
    if (s.error) throw s.error; if (q.error) throw q.error;
    return { settings: s.data as Record<string, any> | null, questions: (q.data as any[]).map((x) => ({ ...x, options: ((o.data ?? []) as Opt[]).filter((y) => y.question_id === x.id) })) as Q[] };
  }, []);
  const [open, setOpen] = useState<string | null>(null);
  const [st, setSt] = useState<Record<string, any> | null>(null);
  const settings = st ?? data?.settings ?? null;
  if (loading && !data) return <Spinner />; if (error) return <ErrorBox msg={error} />;
  const qs = data?.questions ?? [];

  const done = (msg = "Saved") => (r: { error: any }) => { if (r.error) toast("err", r.error.message); else { toast("ok", msg); publish(); } reload(); };
  const saveSettings = async () => { const { id, updated_at, ...rest } = settings!; void id; void updated_at; done("Settings saved")(await db.from("calculator_settings").update(rest).eq("id", 1)); setSt(null); };
  const addQuestion = async () => { const title = window.prompt("Question text"); if (!title) return; done("Question added")(await db.from("calculator_questions").insert({ key: `${slugify(title).slice(0, 24)}-${Date.now().toString(36)}`, title, sort_order: qs.length + 1 })); };
  const upQ = async (q: Q, patch: Partial<Q>) => done()(await db.from("calculator_questions").update(patch).eq("id", q.id));
  const delQ = async (q: Q) => { if (window.confirm("Delete this question and all its options?")) done("Deleted")(await db.from("calculator_questions").delete().eq("id", q.id)); };
  const moveQ = async (i: number, d: number) => { const j = i + d; if (j < 0 || j >= qs.length) return; const a = [...qs]; [a[i], a[j]] = [a[j], a[i]]; const r = await Promise.all(a.map((x, k) => db.from("calculator_questions").update({ sort_order: k + 1 }).eq("id", x.id))); done("Reordered")({ error: r.find((x) => x.error)?.error }); };
  const addOpt = async (q: Q) => done("Option added")(await db.from("calculator_options").insert({ question_id: q.id, label: "New option", sort_order: q.options.length + 1 }));
  const upOpt = async (o: Opt, patch: Partial<Opt>) => { const r = await db.from("calculator_options").update(patch).eq("id", o.id); if (r.error) toast("err", r.error.message); else publish(); };
  const delOpt = async (o: Opt) => { if (window.confirm("Delete this option?")) done("Deleted")(await db.from("calculator_options").delete().eq("id", o.id)); };

  return (
    <div>
      <PageTitle title="Calculator Manager" description="Estimate = (base price + sum of option prices) × product of option multipliers, widened by the min/max margins. Weights stay server-side and are never sent to visitors." />
      {role !== "admin" && <p className="mb-4 rounded-lg bg-amber-50 p-3 text-amber-800">Settings can only be changed by admins. You can still review questions.</p>}
      {settings && (
        <section className="mb-8 rounded-2xl border border-line bg-white p-5 sm:p-7">
          <h2 className="mb-4 !text-xl">Estimate settings</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {([["currency", "Currency code (USD, EUR…)"], ["currency_symbol", "Currency symbol"]] as const).map(([k, l]) => <div key={k}><label className="mb-1 block font-medium">{l}</label><input value={settings[k] ?? ""} onChange={(e) => setSt({ ...settings, [k]: e.target.value })} className={inputCls} /></div>)}
            <div><label className="mb-1 block font-medium">Base project price</label><Num label="Base price" v={settings.base_price} on={(n) => setSt({ ...settings, base_price: n })} /></div>
            <div><label className="mb-1 block font-medium">Minimum margin (0.15 = −15%)</label><Num label="Min margin" step={0.01} v={settings.min_margin} on={(n) => setSt({ ...settings, min_margin: n })} /></div>
            <div><label className="mb-1 block font-medium">Maximum margin (0.30 = +30%)</label><Num label="Max margin" step={0.01} v={settings.max_margin} on={(n) => setSt({ ...settings, max_margin: n })} /></div>
            <div><label className="mb-1 block font-medium">Round to nearest</label><Num label="Rounding" v={settings.rounding} on={(n) => setSt({ ...settings, rounding: n })} /></div>
            <div><label className="mb-1 block font-medium">“Moderate” from points</label><Num label="Moderate threshold" v={settings.complexity_medium} on={(n) => setSt({ ...settings, complexity_medium: n })} /></div>
            <div><label className="mb-1 block font-medium">“Advanced” from points</label><Num label="Advanced threshold" v={settings.complexity_high} on={(n) => setSt({ ...settings, complexity_high: n })} /></div>
            {([["welcome_title", "Welcome headline"], ["welcome_cta", "Welcome button"], ["contact_title", "Contact step headline"]] as const).map(([k, l]) => <div key={k} className={k === "welcome_title" ? "sm:col-span-3" : ""}><label className="mb-1 block font-medium">{l}</label><input value={settings[k] ?? ""} onChange={(e) => setSt({ ...settings, [k]: e.target.value })} className={inputCls} /></div>)}
            <div className="sm:col-span-3"><label className="mb-1 block font-medium">Welcome description</label><textarea rows={2} value={settings.welcome_description ?? ""} onChange={(e) => setSt({ ...settings, welcome_description: e.target.value })} className={inputCls} /></div>
            <div className="sm:col-span-3"><label className="mb-1 block font-medium">Disclaimer shown with results</label><textarea rows={2} value={settings.disclaimer ?? ""} onChange={(e) => setSt({ ...settings, disclaimer: e.target.value })} className={inputCls} /></div>
          </div>
          <div className="mt-5 flex justify-end"><button className={btnPrimary} onClick={saveSettings} disabled={!st}>Save settings</button></div>
        </section>
      )}

      <div className="mb-3 flex items-center justify-between"><h2 className="!text-xl">Questions ({qs.length})</h2><button className={btnPrimary} onClick={addQuestion}><Plus className="h-4 w-4" /> Add question</button></div>
      <ul className="space-y-3">
        {qs.length === 0 && <li className="rounded-xl border border-dashed border-line bg-white p-8 text-center text-text-2">No questions yet. Install starter content from the Dashboard or add one.</li>}
        {qs.map((q, i) => (
          <li key={q.id} className="rounded-2xl border border-line bg-white">
            <div className="flex flex-wrap items-center gap-3 p-4">
              <button className="flex min-w-[200px] flex-1 items-center gap-3 text-left" aria-expanded={open === q.id} onClick={() => setOpen(open === q.id ? null : q.id)}><span className="grid h-9 w-9 place-items-center rounded-lg bg-paper font-semibold">{i + 1}</span><span className="font-semibold">{q.title}</span><ChevronDown className={`h-5 w-5 transition ${open === q.id ? "rotate-180" : ""}`} /></button>
              <span className="text-text-2">{q.options.length} options</span><Toggle checked={q.enabled} onChange={(v) => upQ(q, { enabled: v })} label="Enable question" />
              <button aria-label="Move up" onClick={() => moveQ(i, -1)} className="grid h-10 w-10 place-items-center rounded-lg hover:bg-paper"><ArrowUp className="h-4 w-4" /></button><button aria-label="Move down" onClick={() => moveQ(i, 1)} className="grid h-10 w-10 place-items-center rounded-lg hover:bg-paper"><ArrowDown className="h-4 w-4" /></button>
            </div>
            {open === q.id && (
              <div className="space-y-5 border-t border-line p-4 sm:p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2"><label className="mb-1 block font-medium">Question</label><input defaultValue={q.title} onBlur={(e) => e.target.value !== q.title && upQ(q, { title: e.target.value })} className={inputCls} /></div>
                  <div><label className="mb-1 block font-medium">Helper text</label><input defaultValue={q.description ?? ""} onBlur={(e) => upQ(q, { description: e.target.value })} className={inputCls} /></div>
                  <div><label className="mb-1 block font-medium">Display</label><select defaultValue={q.display_type} onChange={(e) => upQ(q, { display_type: e.target.value })} className={inputCls}><option value="cards">Text cards</option><option value="image_cards">Image cards</option></select></div>
                </div>
                <div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left"><thead><tr className="text-text-2">{["Option", "Price added", "Multiplier", "Complexity pts", "On", ""].map((h) => <th key={h} className="px-2 pb-2 font-medium">{h}</th>)}</tr></thead>
                  <tbody>{q.options.map((o) => (
                    <tr key={o.id} className="border-t border-line align-top">
                      <td className="px-2 py-2"><input defaultValue={o.label} aria-label="Option label" onBlur={(e) => e.target.value !== o.label && upOpt(o, { label: e.target.value })} className={`${inputCls} !py-1.5`} /><input defaultValue={o.description ?? ""} placeholder="Description (optional)" aria-label="Option description" onBlur={(e) => upOpt(o, { description: e.target.value })} className={`${inputCls} mt-1 !py-1.5`} />
                        {q.display_type === "image_cards" && <div className="mt-2"><ImageField label={`${o.label} image`} value={o.image_url} folder="calculator" onChange={(v) => { upOpt(o, { image_url: v || null }); reload(); }} /></div>}</td>
                      <td className="px-2 py-2"><Num label="Price added" v={o.price_add} on={(n) => upOpt(o, { price_add: n })} /></td>
                      <td className="px-2 py-2"><Num label="Multiplier" step={0.01} v={o.multiplier} on={(n) => upOpt(o, { multiplier: n })} /></td>
                      <td className="px-2 py-2"><Num label="Complexity points" v={o.complexity_points} on={(n) => upOpt(o, { complexity_points: n })} /></td>
                      <td className="px-2 py-3"><Toggle checked={o.enabled} onChange={(v) => { upOpt(o, { enabled: v }); reload(); }} label="Enable option" /></td>
                      <td className="px-2 py-2"><button aria-label="Delete option" onClick={() => delOpt(o)} className="grid h-10 w-10 place-items-center rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></td></tr>))}</tbody></table></div>
                <div className="flex justify-between"><button className={btnGhost} onClick={() => addOpt(q)}><Plus className="h-4 w-4" /> Add option</button><button className={btnDanger} onClick={() => delQ(q)}><Trash2 className="h-4 w-4" /> Delete question</button></div>
              </div>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-text-2">Tip: give your platform question the key <code>platform</code> so the selected platform is recorded on submissions.</p>
    </div>
  );
}
