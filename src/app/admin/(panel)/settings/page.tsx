"use client";
import { useEffect, useState } from "react";
import { useAdmin, useAsync } from "@/lib/admin/ctx";
import { FormFields } from "@/components/admin/FormFields";
import { btnPrimary, ErrorBox, PageTitle, Spinner } from "@/components/admin/ui";
import { SETTINGS_FIELDS } from "@/lib/admin/resources";
import { defaultSettings } from "@/lib/defaults";

export default function SettingsPage() {
  const { db, role, toast, publish } = useAdmin();
  const { data, loading, error } = useAsync(async () => (await db.from("site_settings").select("value").eq("key", "general").maybeSingle()).data?.value ?? {}, []);
  const [v, setV] = useState<any>(null); const [busy, setBusy] = useState(false);
  useEffect(() => { if (data) setV({ ...defaultSettings, ...data, socials: { ...defaultSettings.socials, ...((data as any).socials ?? {}) } }); }, [data]);
  if (loading || !v) return <Spinner />; if (error) return <ErrorBox msg={error} />;
  async function save() {
    setBusy(true);
    const { error } = await db.from("site_settings").upsert({ key: "general", value: v }, { onConflict: "key" });
    setBusy(false); if (error) return toast("err", role !== "admin" ? "Only admins can change settings." : error.message);
    toast("ok", "Settings saved"); publish();
  }
  return (
    <div><PageTitle title="General Settings" description="Brand, contact details, SEO defaults and tracking." actions={<button className={btnPrimary} disabled={busy} onClick={save}>{busy ? "Saving…" : "Save settings"}</button>} />
      {role !== "admin" && <p className="mb-4 rounded-lg bg-amber-50 p-3 text-amber-800">Only admins can save changes to settings.</p>}
      <div className="rounded-2xl border border-line bg-white p-5 sm:p-8"><FormFields fields={SETTINGS_FIELDS} value={v} onChange={setV} /></div></div>
  );
}
