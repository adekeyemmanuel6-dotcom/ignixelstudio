// Technical SEO crawler. Usage: node scripts/seo-audit.mjs http://localhost:3100 [out.json]
// Crawls the sitemap + key routes of a running site and checks rendered HTML. No external dependencies.
import fs from "node:fs";
const base = (process.argv[2] || "http://localhost:3100").replace(/\/$/, "");
const out = process.argv[3] || "seo-audit.json";
const get = async (u, opts = {}) => { try { return await fetch(u, { redirect: "manual", ...opts }); } catch (e) { return { status: 0, error: e.message, headers: new Headers(), text: async () => "" }; } };
const attr = (tag, name) => (tag.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`, "i")) || [])[1];
const metaTags = (html) => [...html.matchAll(/<meta\s[^>]*>/gi)].map((m) => m[0]);
const meta = (html, key) => { for (const t of metaTags(html)) { if (attr(t, "name") === key || attr(t, "property") === key) return attr(t, "content"); } };
const decode = (s = "") => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');

const robots = await (await get(`${base}/robots.txt`)).text?.() ?? "";
const sm = await get(`${base}/sitemap.xml`); const smText = await sm.text();
const sitemapUrls = [...smText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, "") || "/");
const urls = [...new Set(["/", ...sitemapUrls, "/does-not-exist-404"])];
const pages = []; const internal = new Map();

for (const path of urls) {
  const r = await get(base + path); const status = r.status; const html = status === 200 ? await r.text() : "";
  const p = { path, status, redirect: r.headers.get("location") || null };
  if (html) {
    p.title = decode((html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || "");
    p.description = decode(meta(html, "description") || "");
    const canon = html.match(/<link[^>]*rel="canonical"[^>]*>/i)?.[0]; p.canonical = canon ? attr(canon, "href") : null;
    p.ogTitle = meta(html, "og:title"); p.ogUrl = meta(html, "og:url"); p.ogImage = meta(html, "og:image"); p.ogType = meta(html, "og:type");
    p.twitterCard = meta(html, "twitter:card"); p.twitterImage = meta(html, "twitter:image");
    p.robotsMeta = meta(html, "robots") || null; p.viewport = !!meta(html, "viewport"); p.lang = (html.match(/<html[^>]*lang="([^"]+)"/i) || [])[1];
    const body = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, "");
    p.h1 = [...body.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => decode(m[1].replace(/<[^>]+>/g, "").trim()));
    p.h2 = [...body.matchAll(/<h2[\s>]/gi)].length;
    p.words = body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().split(" ").length;
    const imgs = [...body.matchAll(/<img\s[^>]*>/gi)].map((m) => m[0]);
    p.images = imgs.length; p.imgNoAlt = imgs.filter((t) => !/\salt=/i.test(t)).length; p.imgEmptyAlt = imgs.filter((t) => /\salt=""/i.test(t)).length;
    p.jsonld = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => { try { const j = JSON.parse(m[1]); return { ok: true, type: j["@type"] || (j["@graph"] ? "@graph" : "?") }; } catch { return { ok: false }; } });
    for (const m of body.matchAll(/<a\s[^>]*href="(\/[^"#?]*)[^"]*"/gi)) { const h = m[1]; if (!h.startsWith("/_next") && !/\.(png|jpe?g|svg|webp|ico|xml|txt)$/.test(h)) internal.set(h, (internal.get(h) || new Set()).add(path)); }
  }
  pages.push(p);
}
const broken = []; for (const [h, from] of internal) { const s = (await get(base + h)).status; if (s >= 400 || s === 0) broken.push({ href: h, status: s, from: [...from].slice(0, 3) }); }

const issues = [];
const add = (sev, path, msg) => issues.push({ sev, path, msg });
const titles = new Map(), descs = new Map();
for (const p of pages) {
  if (p.path.includes("does-not-exist")) { if (p.status !== 404) add("High", p.path, `Unknown URL returns ${p.status}, expected 404`); continue; }
  if (p.status !== 200) { add("Critical", p.path, `Sitemap URL returns ${p.status}`); continue; }
  if (!p.title) add("Critical", p.path, "Missing <title>"); else { (titles.get(p.title) || titles.set(p.title, []).get(p.title)).push(p.path); if (p.title.length > 65) add("Low", p.path, `Title is ${p.title.length} chars (may truncate)`); if (p.title.length < 25) add("Low", p.path, `Title is short (${p.title.length})`); }
  if (!p.description) add("High", p.path, "Missing meta description"); else { (descs.get(p.description) || descs.set(p.description, []).get(p.description)).push(p.path); if (p.description.length > 165) add("Low", p.path, `Meta description is ${p.description.length} chars`); if (p.description.length < 70) add("Low", p.path, `Meta description is short (${p.description.length})`); }
  const expected = base + (p.path === "/" ? "" : p.path);
  if (!p.canonical) add("High", p.path, "No canonical link");
  else { const c = p.canonical.replace(/\/$/, ""); const e = expected.replace(/\/$/, ""); const cp = c.replace(/^https?:\/\/[^/]+/, "") || "/"; const ep = p.path; if (cp !== ep) add("Critical", p.path, `Canonical points to ${p.canonical} instead of this page`); }
  const ogp = p.ogUrl?.replace(/^https?:\/\/[^/]+/, "") || null; if (!p.ogUrl) add("Medium", p.path, "No og:url"); else if ((ogp || "/") !== p.path) add("High", p.path, `og:url is ${p.ogUrl}, not this page`);
  if (!p.ogImage) add("Medium", p.path, "No og:image"); if (!p.twitterCard) add("Low", p.path, "No twitter:card");
  if (p.h1.length !== 1) add("High", p.path, `${p.h1.length} <h1> elements`);
  if (p.robotsMeta && /noindex/i.test(p.robotsMeta)) add("Critical", p.path, "Page is noindex");
  if (p.imgNoAlt) add("Medium", p.path, `${p.imgNoAlt} <img> without alt attribute`);
  if (!p.jsonld.length) add("Medium", p.path, "No structured data"); if (p.jsonld.some((j) => !j.ok)) add("High", p.path, "Invalid JSON-LD");
  if (p.words < 250 && !/(contact|calculator|privacy|terms)/.test(p.path)) add("Medium", p.path, `Low visible text (${p.words} words)`);
}
for (const [t, ps] of titles) if (ps.length > 1) add("High", ps.join(", "), `Duplicate title: "${t}"`);
for (const [d, ps] of descs) if (ps.length > 1) add("High", ps.join(", "), `Duplicate meta description`);
if (!/Sitemap:/i.test(robots)) add("High", "/robots.txt", "robots.txt has no Sitemap line");
if (/Disallow:\s*\/\s*$/m.test(robots.split(/User-agent:/i).filter((b) => /\*/.test(b.split("\n")[0]))[0] || "")) add("Critical", "/robots.txt", "robots.txt blocks everything for *");
for (const b of broken) add("High", b.from.join(", "), `Broken internal link ${b.href} → ${b.status}`);
const result = { base, crawled: pages.length, sitemapUrls: sitemapUrls.length, robotsTxt: robots, issues, broken, pages };
fs.writeFileSync(out, JSON.stringify(result, null, 2));
const bySev = { Critical: 0, High: 0, Medium: 0, Low: 0 }; issues.forEach((i) => bySev[i.sev]++);
console.log(`Crawled ${pages.length} URLs (${sitemapUrls.length} in sitemap). Issues:`, bySev);
for (const sev of ["Critical", "High", "Medium"]) for (const i of issues.filter((x) => x.sev === sev)) console.log(`[${sev}] ${i.path} — ${i.msg}`);
