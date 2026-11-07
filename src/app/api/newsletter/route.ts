import { NextResponse } from "next/server";
import { z } from "zod";
import { publicClient } from "@/lib/supabase/public";

export async function POST(req: Request) {
  const parsed = z.object({ email: z.string().trim().toLowerCase().email().max(200) }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  const db = publicClient();
  if (!db) return NextResponse.json({ error: "Subscriptions are not available right now." }, { status: 503 });
  const { error } = await db.from("newsletter_subscribers").insert({ email: parsed.data.email });
  if (error && error.code !== "23505") return NextResponse.json({ error: "Could not subscribe. Please try again." }, { status: 500 });
  return NextResponse.json({ ok: true, message: "Thanks, you're subscribed." });
}
