"use client";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { browserClient } from "@/lib/supabase/browser";

type Toast = { id: number; kind: "ok" | "err"; text: string };
interface Ctx { db: SupabaseClient; role: "admin" | "editor"; email: string; toast: (kind: Toast["kind"], text: string) => void; publish: () => void }
const AdminCtx = createContext<Ctx | null>(null);
export const useAdmin = () => { const c = useContext(AdminCtx); if (!c) throw new Error("AdminProvider missing"); return c; };

export function AdminProvider({ role, email, children }: { role: "admin" | "editor"; email: string; children: ReactNode }) {
  const db = browserClient();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toast = useCallback((kind: Toast["kind"], text: string) => {
    const id = Date.now() + Math.random(); setToasts((t) => [...t, { id, kind, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
  }, []);
  // Ask the server to refresh public pages so edits go live immediately.
  const publish = useCallback(() => { fetch("/api/revalidate", { method: "POST" }).catch(() => {}); }, []);
  return (
    <AdminCtx.Provider value={{ db, role, email, toast, publish }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[90] flex max-w-sm flex-col gap-2" aria-live="polite">
        {toasts.map((t) => <div key={t.id} role="status" className={`rounded-xl px-4 py-3 text-base font-medium text-white shadow-lg ${t.kind === "ok" ? "bg-emerald-600" : "bg-red-600"}`}>{t.text}</div>)}
      </div>
    </AdminCtx.Provider>
  );
}

export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let live = true; setLoading(true);
    fn().then((d) => { if (live) { setData(d); setError(null); } }).catch((e) => live && setError(e.message)).finally(() => live && setLoading(false));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);
  return { data, loading, error, reload: () => setTick((t) => t + 1), setData };
}
