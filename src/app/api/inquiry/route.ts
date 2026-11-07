import { NextResponse } from "next/server";
import { z } from "zod";
import { publicClient } from "@/lib/supabase/public";
import { notifyLead } from "@/lib/email";

const schema = z.object({
  full_name: z.string().trim().min(2).max(120), email: z.string().trim().email().max(200),
  company: z.string().trim().max(160).optional().or(z.literal("")), website: z.string().trim().max(300).optional().or(z.literal("")),
  service: z.string().trim().max(120).optional().or(z.literal("")), budget: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(4000), source: z.enum(["hero", "contact"]).default("contact"), hp: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  const { hp, ...d } = parsed.data;
  if (hp) return NextResponse.json({ ok: true }); // honeypot: pretend success
  const db = publicClient();
  if (!db) return NextResponse.json({ error: "Inquiries are not available right now. Please email us directly." }, { status: 503 });
  const row = Object.fromEntries(Object.entries(d).map(([k, v]) => [k, v === "" ? null : v]));
  const { error } = await db.from("project_inquiries").insert(row);
  if (error) return NextResponse.json({ error: "We couldn't save your inquiry. Please try again." }, { status: 500 });
  await notifyLead({ subject: `New project inquiry: ${d.full_name}${d.company ? ` (${d.company})` : ""}`, replyTo: d.email, rows: [["Name", d.full_name], ["Email", d.email], ["Company", d.company], ["Website", d.website], ["Service", d.service], ["Budget", d.budget], ["Message", d.message], ["Source", d.source === "hero" ? "Homepage form" : "Contact page"]] });
  return NextResponse.json({ ok: true });
}
