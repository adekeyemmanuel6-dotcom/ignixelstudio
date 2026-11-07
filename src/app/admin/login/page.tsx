"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { browserClient } from "@/lib/supabase/browser";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { Logo } from "@/components/Logo";

function LoginForm() {
  const router = useRouter(); const sp = useSearchParams();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [err, setErr] = useState(sp.get("error") === "unauthorized" ? "This account is not authorised for the admin dashboard." : ""); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr("");
    const { error } = await browserClient().auth.signInWithPassword({ email, password });
    if (error) { setBusy(false); return setErr("Invalid email or password."); }
    router.replace("/admin"); router.refresh();
  }
  return (
    <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-white/10 bg-ink-2 p-8 shadow-glow">
      <Logo dark className="mb-8 h-10" />
      <h1 className="!text-3xl">Admin sign in</h1>
      {!isSupabaseConfigured && <p role="alert" className="mt-4 rounded-lg bg-amber-500/15 p-3 text-amber-200">Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment.</p>}
      <div className="mt-6 space-y-4">
        <div><label htmlFor="email" className="label text-white/90">Email</label><input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="dark-field" /></div>
        <div><label htmlFor="password" className="label text-white/90">Password</label><input id="password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="dark-field" /></div>
      </div>
      {err && <p role="alert" className="mt-4 text-red-400">{err}</p>}
      <button className="btn-primary mt-6 w-full" disabled={busy || !isSupabaseConfigured}>{busy ? "Signing in…" : "Sign in"}</button>
      <p className="mt-5 text-center"><Link href="/admin/forgot-password" className="text-[#9a9aff] underline-offset-4 hover:underline">Forgot your password?</Link></p>
    </form>
  );
}
export default function LoginPage() {
  return <main className="dark-surface grid min-h-screen place-items-center px-4"><Suspense><LoginForm /></Suspense></main>;
}
