"use client";
import { useEffect, useState } from "react";
import { useAdmin, useAsync } from "@/lib/admin/ctx";
import { FormFields, type Field } from "@/components/admin/FormFields";
import { btnPrimary, ErrorBox, PageTitle, Spinner } from "@/components/admin/ui";
import { ABOUT_FIELDS } from "@/lib/admin/resources";
import { defaultAbout, defaultLegal } from "@/lib/defaults";

const LEGAL: Field[] = [{ name: "privacy", label: "Privacy Policy", type: "richtext" }, { name: "terms", label: "Terms & Conditions", type: "richtext" }];

export default function PagesAdmin() {
  const { db, toast, publish } = useAdmin();
  const { data, loading, error } = useAsync(async () => {
    const { data } = await db.from("site_settings").select("key,value").in("key", ["about", "legal"]);
    const m = Object.fromEntries((data ?? []).map((r) => [r.key, r.value])); return { about: { ...defaultAbout, ...(m.about ?? {}) }, legal: { ...defaultLegal, ...(m.legal ?? {}) } };
  }, []);
  const [about, setAbout] = useState<any>(null); const [legal, setLegal] = useState<any>(null); const [tab, setTab] = useState<"about" | "legal">("about"); const [busy, setBusy] = useState(false);
  useEffect(() => { if (data) { setAbout(data.about); setLegal(data.legal); } }, [data]);
  if (loading || !about) return <Spinner />; if (error) return <ErrorBox msg={error} />;
  async function save() {
    setBusy(true);
    const { error } = await db.from("site_settings").upsert([{ key: "about", value: about }, { key: "legal", value: legal }], { onConflict: "key" });
    setBusy(false); if (error) return toast("err", error.message); toast("ok", "Saved"); publish();
  }
  return (
    <div><PageTitle title="About & Legal" description="Company story, mission, values, and legal pages." actions={<button className={btnPrimary} disabled={busy} onClick={save}>{busy ? "Saving…" : "Save changes"}</button>} />
      <div role="tablist" className="mb-5 flex gap-2">{(["about", "legal"] as const).map((t) => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`rounded-full px-5 py-2 font-semibold ${tab === t ? "bg-brand text-white" : "bg-white border border-line"}`}>{t === "about" ? "About page" : "Privacy & Terms"}</button>)}</div>
      <div className="rounded-2xl border border-line bg-white p-5 sm:p-8">{tab === "about" ? <FormFields fields={ABOUT_FIELDS} value={about} onChange={setAbout} /> : <FormFields fields={LEGAL} value={legal} onChange={setLegal} />}</div>
      <p className="mt-3 text-text-2">Team members are managed under <a className="text-brand underline" href="/admin/team">Team</a>.</p></div>
  );
}
