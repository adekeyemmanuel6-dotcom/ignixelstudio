import type { SupabaseClient } from "@supabase/supabase-js";
import * as D from "@/lib/defaults";

const strip = <T extends Record<string, any>>(o: T) => { const { id, ...r } = o; void id; return r; };

/** Inserts starter content into any EMPTY table, then flags the site as seeded. Idempotent; admin only. */
export async function installStarterContent(db: SupabaseClient) {
  const log: string[] = [];
  const empty = async (table: string) => { const { count, error } = await db.from(table).select("*", { count: "exact", head: true }); if (error) throw new Error(`${table}: ${error.message}`); return (count ?? 0) === 0; };
  const ins = async (table: string, rows: any[]) => { const { data, error } = await db.from(table).insert(rows).select(); if (error) throw new Error(`${table}: ${error.message}`); log.push(`${table}: ${rows.length}`); return data as any[]; };

  if (await empty("service_categories")) {
    const cats = await ins("service_categories", D.defaultCategories.map(strip));
    const bySlug = Object.fromEntries(cats.map((c) => [c.slug, c.id]));
    if (await empty("services")) await ins("services", D.defaultServices.map((s) => ({ ...strip(s), category_id: bySlug[D.defaultCategories.find((c) => c.id === s.category_id)!.slug] })));
  }
  if (await empty("technologies")) await ins("technologies", D.defaultTechnologies.map(strip));
  if (await empty("case_studies")) await ins("case_studies", D.defaultCaseStudies.map(strip));
  if (await empty("testimonials")) await ins("testimonials", D.defaultTestimonials.map(strip));
  if (await empty("team_members")) await ins("team_members", D.defaultTeam.map(strip));
  if (await empty("homepage_sections")) await ins("homepage_sections", D.defaultHomepageSections.map(strip));
  if (await empty("blog_categories")) {
    const cats = await ins("blog_categories", D.defaultBlogCategories.map(strip));
    if (await empty("blog_posts")) await ins("blog_posts", D.defaultPosts.map((p, i) => ({
      slug: p.slug, title: p.title, excerpt: p.excerpt, content: p.content, reading_time: p.reading_time, status: "published",
      published_at: new Date(Date.UTC(2026, 8 - i, 15)).toISOString(), category_id: cats.find((c) => c.slug === p.category)?.id, author_name: "Ignixel Team",
    })));
  }
  if (await empty("calculator_questions")) {
    for (const [qi, q] of D.defaultCalculator.entries()) {
      const { data, error } = await db.from("calculator_questions").insert({ key: q.key, title: q.title, description: q.description, display_type: q.display_type, sort_order: qi + 1 }).select().single();
      if (error) throw new Error(error.message);
      const { error: e2 } = await db.from("calculator_options").insert(q.options.map((o, oi) => ({ question_id: data.id, label: o[0], description: o[1] || null, price_add: o[2], multiplier: o[3], complexity_points: o[4], sort_order: oi + 1 })));
      if (e2) throw new Error(e2.message);
    }
    log.push(`calculator: ${D.defaultCalculator.length} questions`);
  }
  const up = async (key: string, value: any) => { const { error } = await db.from("site_settings").upsert({ key, value }, { onConflict: "key" }); if (error) throw new Error(`site_settings: ${error.message}`); };
  const { data: existing } = await db.from("site_settings").select("key").in("key", ["about", "legal"]);
  const have = new Set((existing ?? []).map((r) => r.key));
  if (!have.has("about")) await up("about", D.defaultAbout);
  if (!have.has("legal")) await up("legal", D.defaultLegal);
  const { data: gen } = await db.from("site_settings").select("value").eq("key", "general").maybeSingle();
  await up("general", { ...D.defaultSettings, ...(gen?.value ?? {}), content_seeded: true });
  return log;
}
