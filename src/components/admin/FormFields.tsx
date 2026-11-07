"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2, X } from "lucide-react";
import { useAdmin } from "@/lib/admin/ctx";
import { RichText } from "./RichText";
import { uploadImage } from "./upload";
import { btnGhost, inputCls, Toggle } from "./ui";
import { slugify } from "@/lib/utils";

export type Field = {
  name: string; label: string;
  type: "text" | "textarea" | "number" | "bool" | "select" | "image" | "list" | "repeater" | "richtext" | "relation" | "color" | "datetime" | "slug";
  options?: string[]; rel?: { table: string; label: string }; shape?: Field[]; help?: string; required?: boolean; rows?: number;
  slugFrom?: string; folder?: string; placeholder?: string; full?: boolean;
};

export const getPath = (o: any, p: string) => p.split(".").reduce((a, k) => (a == null ? undefined : a[k]), o);
export const setPath = (o: any, p: string, v: any) => {
  const keys = p.split("."); const out = Array.isArray(o) ? [...o] : { ...o }; let cur = out;
  keys.forEach((k, i) => { if (i === keys.length - 1) cur[k] = v; else { cur[k] = { ...(cur[k] ?? {}) }; cur = cur[k]; } });
  return out;
};

export function ImageField({ value, onChange, folder = "misc", label }: { value?: string | null; onChange: (v: string) => void; folder?: string; label: string }) {
  const { db, toast } = useAdmin();
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  async function pick(f?: File) {
    if (!f) return; setBusy(true);
    try { onChange(await uploadImage(db, f, folder)); toast("ok", "Image uploaded"); } catch (e) { toast("err", (e as Error).message); } finally { setBusy(false); if (ref.current) ref.current.value = ""; }
  }
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-xl border border-dashed border-line bg-paper">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {value ? <img src={value} alt={`${label} preview`} className="h-full w-full object-cover" /> : <ImagePlus className="h-7 w-7 text-text-2" />}
      </div>
      <div className="flex flex-col gap-2">
        <input ref={ref} type="file" accept="image/*" className="sr-only" id={`img-${label}`} onChange={(e) => pick(e.target.files?.[0])} />
        <div className="flex gap-2">
          <label htmlFor={`img-${label}`} className={`${btnGhost} cursor-pointer ${busy ? "pointer-events-none opacity-50" : ""}`}>{busy ? "Uploading…" : value ? "Replace" : "Upload"}</label>
          {value && <button type="button" className={btnGhost} onClick={() => onChange("")}><X className="h-4 w-4" /> Remove</button>}
        </div>
        <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="…or paste an image URL" aria-label={`${label} URL`} className={`${inputCls} !py-1.5`} />
      </div>
    </div>
  );
}

function RelationSelect({ field, value, onChange }: { field: Field; value: any; onChange: (v: any) => void }) {
  const { db } = useAdmin();
  const [rows, setRows] = useState<{ id: string; label: string }[]>([]);
  useEffect(() => { db.from(field.rel!.table).select(`id, ${field.rel!.label}`).order(field.rel!.label).then(({ data }) => setRows((data ?? []).map((r: any) => ({ id: r.id, label: r[field.rel!.label] })))); }, [db, field]);
  return <select id={field.name} value={value ?? ""} onChange={(e) => onChange(e.target.value || null)} className={inputCls}><option value="">— None —</option>{rows.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</select>;
}

export function Repeater({ shape, value, onChange, label }: { shape: Field[]; value: any[]; onChange: (v: any[]) => void; label: string }) {
  const items = Array.isArray(value) ? value : [];
  const upd = (i: number, k: string, v: any) => onChange(items.map((it, j) => (j === i ? { ...it, [k]: v } : it)));
  const move = (i: number, d: number) => { const a = [...items]; const j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; onChange(a); };
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="rounded-xl border border-line bg-paper/50 p-4">
          <div className="mb-3 flex items-center justify-between"><span className="font-semibold">{label} {i + 1}</span>
            <div className="flex gap-1">
              <button type="button" aria-label="Move up" onClick={() => move(i, -1)} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-white"><ArrowUp className="h-4 w-4" /></button>
              <button type="button" aria-label="Move down" onClick={() => move(i, 1)} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-white"><ArrowDown className="h-4 w-4" /></button>
              <button type="button" aria-label="Remove" onClick={() => onChange(items.filter((_, j) => j !== i))} className="grid h-9 w-9 place-items-center rounded-lg text-red-600 hover:bg-white"><Trash2 className="h-4 w-4" /></button></div></div>
          <div className="grid gap-3 sm:grid-cols-2">{shape.map((f) => <div key={f.name} className={f.type === "textarea" || f.type === "list" ? "sm:col-span-2" : ""}><label className="mb-1 block font-medium">{f.label}</label><Input field={f} value={it[f.name]} onChange={(v) => upd(i, f.name, v)} idPrefix={`${label}-${i}-`} /></div>)}</div>
        </div>
      ))}
      <button type="button" className={btnGhost} onClick={() => onChange([...items, Object.fromEntries(shape.map((f) => [f.name, f.type === "list" ? [] : ""]))])}><Plus className="h-4 w-4" /> Add {label.toLowerCase()}</button>
    </div>
  );
}

function Input({ field, value, onChange, idPrefix = "" }: { field: Field; value: any; onChange: (v: any) => void; idPrefix?: string }) {
  const id = idPrefix + field.name;
  switch (field.type) {
    case "textarea": return <textarea id={id} rows={field.rows ?? 4} value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={inputCls} placeholder={field.placeholder} />;
    case "number": return <input id={id} type="number" value={value ?? 0} onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))} className={inputCls} />;
    case "bool": return <Toggle checked={!!value} onChange={onChange} label={field.label} />;
    case "select": return <select id={id} value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={inputCls}>{field.options!.map((o) => <option key={o}>{o}</option>)}</select>;
    case "image": return <ImageField value={value} onChange={onChange} folder={field.folder} label={field.label} />;
    case "list": return <textarea id={id} rows={field.rows ?? 3} value={(value ?? []).join("\n")} onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))} className={inputCls} placeholder={field.placeholder ?? "One item per line"} />;
    case "richtext": return <RichText value={value ?? ""} onChange={onChange} />;
    case "relation": return <RelationSelect field={field} value={value} onChange={onChange} />;
    case "color": return <div className="flex gap-2"><input type="color" aria-label={field.label} value={value || "#1010E8"} onChange={(e) => onChange(e.target.value)} className="h-11 w-14 rounded-lg border border-line" /><input value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={inputCls} /></div>;
    case "datetime": return <input id={id} type="datetime-local" value={value ? new Date(new Date(value).getTime() - new Date(value).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""} onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : null)} className={inputCls} />;
    case "repeater": return <Repeater shape={field.shape!} value={value} onChange={onChange} label={field.label} />;
    default: return <input id={id} value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={inputCls} placeholder={field.placeholder} required={field.required} />;
  }
}

/** Renders a schema-driven form over a plain object (supports dot-paths for nested values). */
export function FormFields({ fields, value, onChange }: { fields: Field[]; value: any; onChange: (v: any) => void }) {
  const [slugTouched, setSlugTouched] = useState(Boolean(value?.slug));
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {fields.map((f) => {
        const v = getPath(value, f.name);
        const wide = f.full || ["textarea", "richtext", "repeater", "image", "list"].includes(f.type);
        const set = (nv: any) => {
          let next = setPath(value, f.name, nv);
          const slugField = fields.find((x) => x.type === "slug" && x.slugFrom === f.name);
          if (slugField && !slugTouched) next = setPath(next, slugField.name, slugify(String(nv)));
          onChange(next);
        };
        return (
          <div key={f.name} className={wide ? "sm:col-span-2" : ""}>
            <label htmlFor={f.name} className="mb-1.5 block font-medium">{f.label}{f.required && <span className="text-red-500"> *</span>}</label>
            {f.type === "slug" ? <input id={f.name} value={v ?? ""} onChange={(e) => { setSlugTouched(true); onChange(setPath(value, f.name, slugify(e.target.value))); }} className={inputCls} required /> : <Input field={f} value={v} onChange={set} />}
            {f.help && <p className="mt-1 text-text-2">{f.help}</p>}
          </div>
        );
      })}
    </div>
  );
}
