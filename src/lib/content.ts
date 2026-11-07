import { cache } from "react";
import { publicClient } from "./supabase/public";
import * as D from "./defaults";
import type { BlogPost, CalcQuestion, CaseStudy, HomepageSection, Service, ServiceCategory, SiteSettings, TeamMember, Technology, Testimonial, BlogCategory } from "./types";

type Row = Record<string, any>;

/** Raw single key from site_settings (or null). */
const rawSetting = cache(async (key: string): Promise<Row | null> => {
  const c = publicClient();
  if (!c) return null;
  try {
    const { data } = await c.from("site_settings").select("value").eq("key", key).maybeSingle();
    return (data?.value as Row) ?? null;
  } catch { return null; }
});

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const v = (await rawSetting("general")) ?? {};
  return { ...D.defaultSettings, ...v, socials: { ...D.defaultSettings.socials, ...(v.socials ?? {}) } } as SiteSettings;
});

/** Database rows are used once the admin has installed (or created) content; until then the starter defaults show. */
async function load<T>(fallback: T, fn: (c: NonNullable<ReturnType<typeof publicClient>>) => PromiseLike<{ data: any; error: any }>): Promise<T> {
  const c = publicClient();
  if (!c) return fallback;
  if (!(await getSettings()).content_seeded) return fallback;
  try {
    const { data, error } = await fn(c);
    if (error || !data) return fallback;
    return data as T;
  } catch { return fallback; }
}

export async function getJsonSetting<T extends Row>(key: string, fallback: T): Promise<T> {
  const v = await rawSetting(key);
  return { ...fallback, ...(v ?? {}) } as T;
}
export const getAbout = () => getJsonSetting("about", D.defaultAbout);
export const getLegal = () => getJsonSetting("legal", D.defaultLegal);

export const getSections = cache(async (): Promise<HomepageSection[]> => {
  const rows = await load<HomepageSection[]>(D.defaultHomepageSections, (c) => c.from("homepage_sections").select("*").order("sort_order"));
  return rows.filter((s) => s.enabled).sort((a, b) => a.sort_order - b.sort_order);
});
export async function getSection(key: string) {
  const all = await load<HomepageSection[]>(D.defaultHomepageSections, (c) => c.from("homepage_sections").select("*"));
  const row = all.find((s) => s.key === key) ?? D.defaultHomepageSections.find((s) => s.key === key)!;
  return { ...D.defaultHomepageSections.find((s) => s.key === key)?.content, ...(row?.content ?? {}) } as Row;
}

export const getCategories = cache(async () =>
  (await load<ServiceCategory[]>(D.defaultCategories, (c) => c.from("service_categories").select("*").eq("published", true).order("sort_order"))).sort((a, b) => a.sort_order - b.sort_order));

export const getAllServices = cache(async () =>
  (await load<Service[]>(D.defaultServices, (c) => c.from("services").select("*").eq("published", true).order("sort_order"))).sort((a, b) => a.sort_order - b.sort_order));

export async function getCategory(slug: string) {
  const cats = await getCategories();
  const category = cats.find((c) => c.slug === slug);
  if (!category) return null;
  const services = (await getAllServices()).filter((s) => s.category_id === category.id);
  return { category, services };
}
export async function getServiceBySlug(slug: string) {
  const s = (await getAllServices()).find((x) => x.slug === slug);
  if (!s) return null;
  const category = (await getCategories()).find((c) => c.id === s.category_id) ?? null;
  return { service: s, category };
}

export const getTechnologies = cache(async () =>
  (await load<Technology[]>(D.defaultTechnologies, (c) => c.from("technologies").select("*").eq("visible", true).order("sort_order"))).sort((a, b) => a.sort_order - b.sort_order));

export const getCaseStudies = cache(async () =>
  (await load<CaseStudy[]>(D.defaultCaseStudies, (c) => c.from("case_studies").select("*").eq("published", true).order("sort_order"))).sort((a, b) => a.sort_order - b.sort_order));
export const getCaseStudy = async (slug: string) => (await getCaseStudies()).find((c) => c.slug === slug) ?? null;

export const getTestimonials = cache(async () =>
  (await load<Testimonial[]>(D.defaultTestimonials, (c) => c.from("testimonials").select("*").eq("published", true).order("sort_order"))).sort((a, b) => a.sort_order - b.sort_order));
export const getTeam = cache(async () =>
  (await load<TeamMember[]>(D.defaultTeam, (c) => c.from("team_members").select("*").eq("active", true).order("sort_order"))).sort((a, b) => a.sort_order - b.sort_order));

// ───────── blog ─────────
const defaultPostsFull = (): BlogPost[] =>
  D.defaultPosts.map((p, i) => ({
    id: `default-post-${i}`, slug: p.slug, title: p.title, excerpt: p.excerpt, content: p.content, featured_image: null,
    category_id: D.defaultBlogCategories.find((c) => c.slug === p.category)?.id ?? null, status: "published" as const,
    published_at: new Date(Date.UTC(2026, 8 - i, 15)).toISOString(), author_name: "Ignixel Team", author_title: "Studio", author_image: null,
    reading_time: p.reading_time, seo_title: null, seo_description: null, og_image: null,
    category: D.defaultBlogCategories.find((c) => c.slug === p.category) ?? null, tags: [],
  }));

const normalizePost = (r: Row): BlogPost => ({
  ...(r as BlogPost), category: r.category ?? null,
  tags: (r.post_tags ?? []).map((pt: Row) => pt.tag).filter(Boolean),
});
const POST_SELECT = "*, category:blog_categories(*), post_tags(tag:blog_tags(*))";

export const getBlogCategories = cache(async () => load<BlogCategory[]>(D.defaultBlogCategories, (c) => c.from("blog_categories").select("*").order("name")));

export async function getPosts(opts: { page?: number; perPage?: number; category?: string; q?: string } = {}) {
  const { page = 1, perPage = 9, category, q } = opts;
  const all = await load<BlogPost[] | null>(null, async (c) => {
    const r = await c.from("blog_posts").select(POST_SELECT).order("published_at", { ascending: false });
    return { data: r.data ? r.data.map(normalizePost) : null, error: r.error };
  });
  let rows = all ?? defaultPostsFull();
  const query = q?.trim().toLowerCase();
  if (category) rows = rows.filter((p) => p.category?.slug === category);
  if (query) rows = rows.filter((p) => `${p.title} ${p.excerpt ?? ""}`.toLowerCase().includes(query));
  const total = rows.length;
  return { posts: rows.slice((page - 1) * perPage, page * perPage), total, pages: Math.max(1, Math.ceil(total / perPage)) };
}
export async function getPost(slug: string) {
  const { posts } = await getPosts({ perPage: 1000 });
  return posts.find((p) => p.slug === slug) ?? null;
}
export async function getLatestPosts(n: number, excludeSlug?: string, categoryId?: string | null) {
  const { posts } = await getPosts({ perPage: 1000 });
  const f = posts.filter((p) => p.slug !== excludeSlug);
  const same = categoryId ? f.filter((p) => p.category_id === categoryId) : [];
  return [...same, ...f.filter((p) => !same.includes(p))].slice(0, n);
}

// ───────── calculator ─────────
export async function getCalculator() {
  const c = publicClient();
  const fallback = () => ({
    settings: D.defaultCalcSettings,
    questions: D.defaultCalculator.map((q, qi): CalcQuestion => ({
      id: q.key, key: q.key, title: q.title, description: q.description, display_type: q.display_type, enabled: true, sort_order: qi,
      options: q.options.map((o, oi) => ({ id: `${q.key}:${oi}`, question_id: q.key, label: o[0], description: o[1] || null, image_url: null, sort_order: oi })),
    })),
    live: false,
  });
  if (!c) return fallback();
  try {
    const [s, q, o] = await Promise.all([
      c.from("calculator_settings").select("*").eq("id", 1).maybeSingle(),
      c.from("calculator_questions").select("*").eq("enabled", true).order("sort_order"),
      c.from("calculator_options_public").select("*").order("sort_order"),
    ]);
    if (!s.data || !q.data?.length) return fallback();
    const questions = (q.data as Row[]).map((qq) => ({ ...qq, options: ((o.data ?? []) as Row[]).filter((x) => x.question_id === qq.id) })).filter((x) => x.options.length) as CalcQuestion[];
    return { settings: s.data as Row as typeof D.defaultCalcSettings, questions, live: true };
  } catch { return fallback(); }
}

export async function getCaseImages(caseId: string): Promise<{ id: string; url: string; alt: string | null }[]> {
  const c = publicClient();
  if (!c || caseId.startsWith("default-")) return [];
  const { data } = await c.from("case_study_images").select("id,url,alt").eq("case_study_id", caseId).order("sort_order");
  return data ?? [];
}
