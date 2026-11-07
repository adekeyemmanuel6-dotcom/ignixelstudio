"use client";
import { useState } from "react";
import Link from "next/link";
import { browserClient } from "@/lib/supabase/browser";
import { Logo } from "@/components/Logo";

export default function ForgotPassword() {
  const [email, setEmail] = useState(""); const [done, setDone] = useState(false); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    await browserClient().auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/admin/reset-password` });
    setBusy(false); setDone(true); // always show success: don't reveal which emails exist
  }
  return (
    <main className="dark-surface grid min-h-screen place-items-center px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-white/10 bg-ink-2 p-8">
        <Logo dark className="mb-8 h-10" /><h1 className="!text-3xl">Reset password</h1>
        {done ? <p role="status" className="mt-4 text-white/80">If an account exists for {email}, a reset link is on its way.</p> : <>
          <p className="mt-3 text-white/65">Enter your admin email and we&apos;ll send a reset link.</p>
          <label htmlFor="e" className="label mt-6 text-white/90">Email</label><input id="e" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="dark-field" />
          <button className="btn-primary mt-6 w-full" disabled={busy}>{busy ? "Sending…" : "Send reset link"}</button></>}
        <p className="mt-5 text-center"><Link href="/admin/login" className="text-[#9a9aff] underline-offset-4 hover:underline">Back to sign in</Link></p>
      </form>
    </main>
  );
}
