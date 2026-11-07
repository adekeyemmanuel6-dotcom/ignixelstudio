"use client";
import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

export const inputCls = "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-base text-text placeholder:text-text-2/60 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10 disabled:bg-paper";
export const btn = "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg px-4 py-2 text-base font-semibold transition disabled:opacity-50";
export const btnPrimary = `${btn} bg-brand text-white hover:bg-[#2a2af0]`;
export const btnGhost = `${btn} border border-line bg-white text-text hover:border-brand hover:text-brand`;
export const btnDanger = `${btn} border border-red-200 bg-white text-red-600 hover:bg-red-50`;

export function PageTitle({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div><h1 className="!text-3xl !tracking-tight">{title}</h1>{description && <p className="mt-1 max-w-2xl text-text-2">{description}</p>}</div>
      <div className="flex flex-wrap gap-2">{actions}</div>
    </div>
  );
}

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k); document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-ink/60 p-3 sm:p-8" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`w-full ${wide ? "max-w-4xl" : "max-w-2xl"} rounded-2xl bg-white shadow-2xl`}>
        <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-7"><h2 className="!text-xl">{title}</h2><button onClick={onClose} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-lg hover:bg-paper"><X className="h-5 w-5" /></button></div>
        <div className="p-5 sm:p-7">{children}</div>
      </div>
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={`relative h-7 w-12 shrink-0 rounded-full transition ${checked ? "bg-brand" : "bg-line"}`}>
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-6" : "left-1"}`} />
    </button>
  );
}

export function Spinner() { return <div className="grid place-items-center py-16 text-text-2" role="status">Loading…</div>; }
export function ErrorBox({ msg }: { msg: string }) { return <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{msg}</div>; }

export function downloadCsv(name: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const cols = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  const esc = (v: unknown) => { let s = v == null ? "" : typeof v === "object" ? JSON.stringify(v) : String(v); if (/^[=+\-@]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };
  const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a"); a.href = url; a.download = `${name}-${new Date().toISOString().slice(0, 10)}.csv`; a.click(); URL.revokeObjectURL(url);
}
