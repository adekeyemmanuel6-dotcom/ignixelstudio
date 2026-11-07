"use client";
import { useState } from "react";
import { CheckCircle2, ArrowRight } from "@/components/ui/Ico";
import { trackLead } from "@/lib/track";
import Link from "next/link";

const BUDGETS = ["Under $5,000", "$5,000 – $10,000", "$10,000 – $25,000", "$25,000 – $50,000", "$50,000+", "Not sure yet"];

type Errors = Record<string, string>;

export function InquiryForm({ services, variant = "hero" }: { services: string[]; variant?: "hero" | "contact" }) {
  const dark = variant === "hero";
  const f = dark ? "dark-field" : "field";
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const errs: Errors = {};
    if (!data.full_name?.trim() || data.full_name.trim().length < 2) errs.full_name = "Please enter your full name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email ?? "")) errs.email = "Please enter a valid work email.";
    if (!data.message?.trim() || data.message.trim().length < 10) errs.message = "Tell us a little about your project (10+ characters).";
    if (data.website && !/^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/.test(data.website)) errs.website = "Enter a valid website address.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setState("loading"); setServerError("");
    try {
      const r = await fetch("/api/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, source: variant }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || "Something went wrong. Please try again.");
      setState("done"); form.reset(); trackLead(variant === "hero" ? "hero_form" : "contact_form", { service: data.service || undefined });
    } catch (err) { setState("error"); setServerError((err as Error).message); }
  }

  if (state === "done") {
    return (
      <div role="status" className={`flex min-h-[420px] flex-col items-center justify-center text-center ${dark ? "" : "rounded-3xl border border-line bg-white p-10 shadow-card"}`}>
        <CheckCircle2 className="h-14 w-14 text-emerald-500" />
        <h3 className={`mt-5 ${dark ? "!text-white" : ""}`}>Thank you. Your inquiry is in.</h3>
        <p className={`mt-3 max-w-sm ${dark ? "text-white/70" : "text-text-2"}`}>We&apos;ll review your project details and reply by email shortly. While you wait, you can estimate your investment.</p>
        <Link href="/website-cost-calculator" className={`mt-6 ${dark ? "btn-primary" : "btn-dark"}`}>Calculate Project Cost <ArrowRight /></Link>
      </div>
    );
  }

  const err = (k: string) => errors[k] && <p id={`${variant}-${k}-err`} role="alert" className="mt-1 text-base text-red-500">{errors[k]}</p>;
  const lbl = `label ${dark ? "text-white/90" : ""}`;
  const id = (k: string) => `${variant}-${k}`;
  const common = (k: string) => ({ id: id(k), name: k, "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${id(k)}-err` : undefined });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={lbl} htmlFor={id("full_name")}>Full name</label><input {...common("full_name")} className={f} autoComplete="name" placeholder="Jane Doe" />{err("full_name")}</div>
        <div><label className={lbl} htmlFor={id("email")}>Work email</label><input {...common("email")} type="email" className={f} autoComplete="email" placeholder="jane@company.com" />{err("email")}</div>
        <div><label className={lbl} htmlFor={id("company")}>Company name</label><input {...common("company")} className={f} autoComplete="organization" placeholder="Company" /></div>
        {variant === "contact" && <div><label className={lbl} htmlFor={id("website")}>Website URL</label><input {...common("website")} className={f} inputMode="url" placeholder="https://" />{err("website")}</div>}
        <div><label className={lbl} htmlFor={id("service")}>Service required</label>
          <select {...common("service")} className={f} defaultValue=""><option value="" disabled>Select a service</option>{services.map((s) => <option key={s}>{s}</option>)}<option>Not sure yet</option></select></div>
        <div><label className={lbl} htmlFor={id("budget")}>Estimated budget</label>
          <select {...common("budget")} className={f} defaultValue=""><option value="" disabled>Select a range</option>{BUDGETS.map((b) => <option key={b}>{b}</option>)}</select></div>
      </div>
      <div><label className={lbl} htmlFor={id("message")}>Project description</label><textarea {...common("message")} rows={dark ? 3 : 5} className={f} placeholder="What are you looking to build or improve?" />{err("message")}</div>
      <div className="hidden" aria-hidden="true"><label>Leave empty<input name="hp" tabIndex={-1} autoComplete="off" /></label></div>
      {state === "error" && <p role="alert" className="text-red-500">{serverError}</p>}
      <button className="btn-primary w-full" disabled={state === "loading"}>{state === "loading" ? "Sending…" : variant === "hero" ? "Start My Project" : "Send Project Inquiry"} <ArrowRight /></button>
      <p className={`text-base ${dark ? "text-white/55" : "text-text-2"}`}>No spam. Your details are used only to respond to your inquiry.</p>
    </form>
  );
}
