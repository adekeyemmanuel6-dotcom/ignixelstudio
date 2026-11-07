import { NextResponse } from "next/server";
import { z } from "zod";
import { publicClient } from "@/lib/supabase/public";
import { localEstimate } from "@/lib/calc";
import { notifyLead } from "@/lib/email";

const schema = z.object({
  answers: z.record(z.string(), z.string()),
  contact: z.object({ first_name: z.string().trim().min(1).max(80), last_name: z.string().trim().min(1).max(80), email: z.string().trim().email().max(200),
    company: z.string().trim().max(160).optional(), phone: z.string().trim().max(60).optional(), project_description: z.string().trim().max(4000).optional() }),
  hp: z.string().optional(),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please complete the required fields." }, { status: 400 });
  const { answers, contact, hp } = parsed.data;
  if (hp) return NextResponse.json({ error: "Rejected." }, { status: 400 });
  const db = publicClient();
  if (!db) return NextResponse.json({ ...localEstimate(answers), demo: true });
  // Estimate is computed and stored server-side in SQL so pricing weights are never exposed to the browser.
  const { data, error } = await db.rpc("submit_calculator", { p_contact: contact, p_answers: answers });
  if (error || !data) return NextResponse.json({ error: "We couldn't calculate your estimate. Please try again." }, { status: 500 });
  const r = data as { min: number; max: number; currency: string; complexity: string; platform: string | null; answers: { question: string; answer: string }[] };
  await notifyLead({ subject: `Calculator estimate: ${contact.first_name} ${contact.last_name} (${r.currency} ${r.min}–${r.max})`, replyTo: contact.email,
    rows: [["Name", `${contact.first_name} ${contact.last_name}`], ["Email", contact.email], ["Company", contact.company], ["Phone", contact.phone], ["Estimate", `${r.currency} ${r.min} – ${r.max}`], ["Complexity", r.complexity], ["Platform", r.platform], ["Project", contact.project_description], ...r.answers.map((a): [string, unknown] => [a.question, a.answer])] });
  return NextResponse.json(data);
}
