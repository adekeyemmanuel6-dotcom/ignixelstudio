"use client";
import { useState } from "react";
import { Check } from "@/components/ui/Ico";
import { trackLead } from "@/lib/track";

export function NewsletterForm({ dark }: { dark?: boolean }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget; const email = new FormData(form).get("email");
    setState("loading");
    try {
      const r = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Something went wrong");
      setState("done"); setMsg(j.message); form.reset(); trackLead("newsletter");
    } catch (err) { setState("error"); setMsg((err as Error).message); }
  }
  if (state === "done") return <p role="status" className="flex items-center gap-2 font-medium"><Check className="h-5 w-5 text-emerald-500" /> {msg}</p>;
  return (
    <form onSubmit={onSubmit} noValidate className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor={`nl-${dark ? "d" : "l"}`}>Email address</label>
        <input id={`nl-${dark ? "d" : "l"}`} name="email" type="email" required autoComplete="email" placeholder="you@company.com" className={dark ? "dark-field" : "field"} />
        <button className={`${dark ? "btn-primary" : "btn-dark"} w-full shrink-0 sm:w-auto`} disabled={state === "loading"}>{state === "loading" ? "Subscribing…" : "Subscribe"}</button>
      </div>
      {state === "error" && <p role="alert" className="mt-2 text-red-500">{msg}</p>}
    </form>
  );
}
