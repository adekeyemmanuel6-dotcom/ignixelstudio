"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { browserClient } from "@/lib/supabase/browser";
import { Logo } from "@/components/Logo";

export default function ResetPassword() {
  const router = useRouter(); const [pw, setPw] = useState(""); const [pw2, setPw2] = useState(""); const [err, setErr] = useState(""); const [ready, setReady] = useState(false); const [busy, setBusy] = useState(false);
  useEffect(() => {
    const db = browserClient();
    db.auth.getSession().then(({ data }: { data: { session: unknown } }) => setReady(!!data.session));
    const { data: sub } = db.auth.onAuthStateChange((ev: string, s: unknown) => { if (ev === "PASSWORD_RECOVERY" || s) setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    if (pw.length < 10) return setErr("Use at least 10 characters.");
    if (pw !== pw2) return setErr("Passwords do not match.");
    setBusy(true); const { error } = await browserClient().auth.updateUser({ password: pw }); setBusy(false);
    if (error) return setErr(error.message);
    router.replace("/admin"); router.refresh();
  }
  return (
    <main className="dark-surface grid min-h-screen place-items-center px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-white/10 bg-ink-2 p-8">
        <Logo dark className="mb-8 h-10" /><h1 className="!text-3xl">Choose a new password</h1>
        {!ready ? <p className="mt-4 text-white/70">Open this page from the link in your reset email.</p> : <>
          <label htmlFor="p1" className="label mt-6 text-white/90">New password</label><input id="p1" type="password" autoComplete="new-password" required value={pw} onChange={(e) => setPw(e.target.value)} className="dark-field" />
          <label htmlFor="p2" className="label mt-4 text-white/90">Confirm password</label><input id="p2" type="password" autoComplete="new-password" required value={pw2} onChange={(e) => setPw2(e.target.value)} className="dark-field" />
          {err && <p role="alert" className="mt-3 text-red-400">{err}</p>}<button className="btn-primary mt-6 w-full" disabled={busy}>{busy ? "Saving…" : "Update password"}</button></>}
      </form>
    </main>
  );
}
