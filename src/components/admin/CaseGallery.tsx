"use client";
import { Trash2 } from "lucide-react";
import { useAdmin, useAsync } from "@/lib/admin/ctx";
import { ImageField } from "./FormFields";
import { inputCls } from "./ui";

type Img = { id: string; url: string; alt: string | null; sort_order: number };

/** Extra screenshots for a project (case_study_images). Saved immediately, independent of the project form. */
export function CaseGallery({ caseId }: { caseId: string }) {
  const { db, toast, publish } = useAdmin();
  const { data, reload } = useAsync<Img[]>(async () => (await db.from("case_study_images").select("*").eq("case_study_id", caseId).order("sort_order")).data as Img[] ?? [], [caseId]);
  const add = async (url: string) => {
    if (!url) return;
    const { error } = await db.from("case_study_images").insert({ case_study_id: caseId, url, sort_order: (data?.length ?? 0) + 1 });
    if (error) toast("err", error.message); else { reload(); publish(); }
  };
  const alt = async (i: Img, v: string) => { await db.from("case_study_images").update({ alt: v }).eq("id", i.id); publish(); };
  const del = async (i: Img) => { await db.from("case_study_images").delete().eq("id", i.id); reload(); publish(); };
  return (
    <div className="mt-8 border-t border-line pt-6">
      <h3 className="mb-3 !text-lg">Gallery images</h3>
      <ul className="mb-4 grid gap-3 sm:grid-cols-2">
        {(data ?? []).map((i) => (
          <li key={i.id} className="flex gap-3 rounded-xl border border-line p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={i.url} alt="" className="h-16 w-16 rounded-lg object-cover" />
            <div className="flex-1"><input defaultValue={i.alt ?? ""} placeholder="Alt text" aria-label="Alt text" onBlur={(e) => alt(i, e.target.value)} className={`${inputCls} !py-1.5`} /></div>
            <button aria-label="Remove image" onClick={() => del(i)} className="grid h-10 w-10 place-items-center rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
          </li>
        ))}
      </ul>
      <ImageField label="Add gallery image" value="" folder="projects" onChange={add} />
    </div>
  );
}
