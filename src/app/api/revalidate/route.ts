import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { serverClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

// Called by the admin after saving so public pages refresh immediately. Staff only.
export async function POST() {
  if (!isSupabaseConfigured) return NextResponse.json({ ok: false }, { status: 503 });
  const db = await serverClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data } = await db.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!data) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
