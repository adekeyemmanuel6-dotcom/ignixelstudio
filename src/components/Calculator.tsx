"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Download } from "@/components/ui/Ico";
import type { CalcQuestion, CalcSettings } from "@/lib/types";

type Result = { min: number; max: number; currency: string; symbol: string; complexity: string; platform: string | null; answers: { question: string; answer: string }[]; demo?: boolean };
const fmt = (n: number, cur: string) => new Intl.NumberFormat("en-US", { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(n);

export function Calculator({ settings, questions, icons }: { settings: CalcSettings; questions: CalcQuestion[]; icons: Record<string, { path: string; hex: string }> }) {
  const reduce = useReducedMotion();
  const total = questions.length + 2; // welcome counted separately → questions + contact
  const [step, setStep] = useState(0); // 0 welcome, 1..n questions, n+1 contact, n+2 result
  const [dir, setDir] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [contact, setContact] = useState({ first_name: "", last_name: "", email: "", company: "", phone: "", project_description: "", hp: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const n = questions.length, isContact = step === n + 1, isResult = step === n + 2, q = step >= 1 && step <= n ? questions[step - 1] : null;
  const go = (d: number) => { setDir(d); setStep((s) => s + d); window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); };
  const progress = Math.round((Math.min(step, n + 1) / (n + 1)) * 100);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!contact.first_name.trim()) er.first_name = "First name is required.";
    if (!contact.last_name.trim()) er.last_name = "Last name is required.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact.email)) er.email = "Enter a valid work email.";
    if (!contact.company.trim()) er.company = "Company name is required.";
    setErrors(er); if (Object.keys(er).length) return;
    setBusy(true); setErr("");
    try {
      const r = await fetch("/api/calculator", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers, contact: { ...contact, hp: undefined }, hp: contact.hp }) });
      const j = await r.json(); if (!r.ok) throw new Error(j.error || "Something went wrong.");
      setResult(j); go(1);
    } catch (x) { setErr((x as Error).message); } finally { setBusy(false); }
  }

  const exportSummary = () => {
    if (!result) return;
    const text = [`Ignixel Studio: project estimate`, `Estimated investment: ${fmt(result.min, result.currency)} – ${fmt(result.max, result.currency)}`, `Complexity: ${result.complexity}`, ``, ...result.answers.map((a) => `${a.question}\n  → ${a.answer}`), ``, settings.disclaimer].join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" })); const a = document.createElement("a"); a.href = url; a.download = "ignixel-project-estimate.txt"; a.click(); URL.revokeObjectURL(url);
  };

  const variants = useMemo(() => reduce ? { initial: {}, animate: {}, exit: {} } : { initial: (d: number) => ({ opacity: 0, x: 40 * d }), animate: { opacity: 1, x: 0 }, exit: (d: number) => ({ opacity: 0, x: -40 * d }) }, [reduce]);

  return (
    <div className="mx-auto max-w-4xl">
      {step > 0 && !isResult && (
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-base text-white/70"><span>Step {Math.min(step, total - 1)} of {total - 1}</span><span>{progress}%</span></div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Calculator progress"><div className="h-full rounded-full bg-gradient-to-r from-brand to-[#8b8bff] transition-all duration-500" style={{ width: `${progress}%` }} /></div>
        </div>
      )}
      <AnimatePresence mode="wait" custom={dir} initial={false}>
        <motion.div key={step} custom={dir} variants={variants as any} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
          {step === 0 && (
            <div className="py-10 text-center sm:py-20">
              <p className="eyebrow mb-5">Website cost calculator</p>
              <h1 className="mx-auto max-w-3xl !text-h2">{settings.welcome_title}</h1>
              <p className="lead mx-auto mt-4 max-w-2xl">{settings.welcome_description}</p>
              <button onClick={() => go(1)} className="btn-primary cta-gap">{settings.welcome_cta} <ArrowRight /></button>
              <p className="mt-5 text-white/55">Takes about two minutes.</p>
            </div>
          )}

          {q && (
            <fieldset>
              <legend className="mb-2 font-heading text-3xl font-semibold text-white sm:text-4xl">{q.title}</legend>
              {q.description && <p className="mb-8 text-white/65">{q.description}</p>}
              <div className={`grid gap-3 ${q.display_type === "image_cards" ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"}`}>
                {q.options.map((o) => {
                  const sel = answers[q.id] === o.id; const ic = icons[o.label];
                  return (
                    <label key={o.id} className={`group relative flex cursor-pointer flex-col rounded-2xl border p-5 transition focus-within:ring-4 focus-within:ring-brand/40 ${sel ? "border-brand bg-brand/20 shadow-glow" : "border-white/15 bg-white/5 hover:border-white/40"} ${q.display_type === "image_cards" ? "items-center py-8 text-center" : ""}`}>
                      <input type="radio" name={q.id} value={o.id} checked={sel} onChange={() => setAnswers((a) => ({ ...a, [q.id]: o.id }))} className="sr-only" />
                      {q.display_type === "image_cards" && (o.image_url ? <Image src={o.image_url} alt="" width={56} height={56} className="mb-3 h-14 w-14 object-contain" /> : ic ? <svg viewBox="0 0 24 24" className="mb-3 h-14 w-14" fill={`#${ic.hex === "000000" ? "ffffff" : ic.hex}`} aria-hidden><path d={ic.path} /></svg> : <span aria-hidden className="mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-white/10 font-heading text-xl font-bold text-white">{o.label.slice(0, 2)}</span>)}
                      <span className="flex w-full items-start justify-between gap-3"><span className={`font-semibold text-white ${q.display_type === "image_cards" ? "mx-auto" : ""}`}>{o.label}</span>
                        {q.display_type !== "image_cards" && <span aria-hidden className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border ${sel ? "border-brand bg-brand" : "border-white/30"}`}>{sel && <Check className="h-4 w-4 text-white" />}</span>}</span>
                      {o.description && <span className="mt-1.5 text-white/60">{o.description}</span>}
                      {q.display_type === "image_cards" && sel && <span aria-hidden className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-brand"><Check className="h-4 w-4 text-white" /></span>}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          {isContact && (
            <form onSubmit={submit} noValidate>
              <h2 className="mb-6 !text-h3">{settings.contact_title}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {([["first_name", "First name", "given-name"], ["last_name", "Last name", "family-name"], ["email", "Work email", "email"], ["company", "Company name", "organization"], ["phone", "Phone number (optional)", "tel"]] as const).map(([k, l, ac]) => (
                  <div key={k}><label htmlFor={`c-${k}`} className="label text-white/90">{l}</label>
                    <input id={`c-${k}`} value={(contact as any)[k]} onChange={(e) => setContact((c) => ({ ...c, [k]: e.target.value }))} type={k === "email" ? "email" : k === "phone" ? "tel" : "text"} autoComplete={ac} className="dark-field" aria-invalid={!!errors[k]} />
                    {errors[k] && <p role="alert" className="mt-1 text-red-400">{errors[k]}</p>}</div>
                ))}
                <div className="sm:col-span-2"><label htmlFor="c-desc" className="label text-white/90">Project description (optional)</label><textarea id="c-desc" rows={4} value={contact.project_description} onChange={(e) => setContact((c) => ({ ...c, project_description: e.target.value }))} className="dark-field" /></div>
                <div className="hidden" aria-hidden><input tabIndex={-1} autoComplete="off" value={contact.hp} onChange={(e) => setContact((c) => ({ ...c, hp: e.target.value }))} /></div>
              </div>
              {err && <p role="alert" className="mt-4 text-red-400">{err}</p>}
              <div className="cta-pair cta-pair--full mt-8"><button type="button" onClick={() => go(-1)} className="btn-secondary-dark"><ArrowLeft /> Back</button><button className="btn-primary" disabled={busy}>{busy ? "Calculating…" : "Get My Estimate"} <ArrowRight /></button></div>
            </form>
          )}

          {isResult && result && (
            <div>
              <p className="eyebrow mb-4">Your estimate</p>
              <h2 className="!text-h2">Your estimated website investment is between <span className="text-[#8b8bff]">{fmt(result.min, result.currency)}</span> and <span className="text-[#8b8bff]">{fmt(result.max, result.currency)}</span>.</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-white/60">Estimated minimum</p><p className="font-heading text-3xl font-semibold text-white">{fmt(result.min, result.currency)}</p></div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-white/60">Estimated maximum</p><p className="font-heading text-3xl font-semibold text-white">{fmt(result.max, result.currency)}</p></div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-white/60">Project complexity</p><p className="font-heading text-3xl font-semibold text-white">{result.complexity}</p></div>
              </div>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="!text-xl">Project summary{result.platform ? ` · ${result.platform}` : ""}</h3>
                <dl className="mt-4 divide-y divide-white/10">{result.answers.map((a) => <div key={a.question} className="grid gap-1 py-3 sm:grid-cols-[1.6fr_1fr]"><dt className="text-white/65">{a.question}</dt><dd className="font-semibold text-white">{a.answer}</dd></div>)}</dl>
              </div>
              <p className="mt-5 rounded-xl border border-white/10 p-4 text-white/65">{settings.disclaimer}</p>
              {result.demo && <p className="mt-3 text-amber-300">Demo mode: Supabase isn&apos;t configured, so this submission was not saved.</p>}
              <div className="cta-pair mt-8"><Link href="/contact" className="btn-primary">Book a Consultation</Link><button onClick={exportSummary} className="btn-secondary-dark"><Download /> Send My Project Details</button></div>
              <p className="mt-3 text-white/55">We&apos;ve also saved your details so our team can follow up with you.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {q && (
        <div className="cta-pair cta-pair--full mt-8">
          <button onClick={() => go(-1)} className="btn-secondary-dark"><ArrowLeft /> Back</button>
          <button onClick={() => go(1)} disabled={!answers[q.id]} className="btn-primary">Next <ArrowRight /></button>
        </div>
      )}
    </div>
  );
}
