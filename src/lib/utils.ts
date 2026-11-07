import clsx, { type ClassValue } from "clsx";
export const cn = (...i: ClassValue[]) => clsx(i);
export const slugify = (s: string) => s.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
export const formatDate = (iso?: string | null) => iso ? new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }) : "";
export const readingTime = (html: string) => Math.max(1, Math.round(html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length / 220));
export const initials = (name: string) => name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();

/** Returns the value only if it is a usable image URL (https://… or /path); anything else (e.g. pasted text) becomes null so pages never crash on it. */
export const imgUrl = (v?: string | null) => (v && /^(https?:\/\/|\/)\S+$/i.test(v.trim()) ? v.trim() : null);

const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/**
 * Rich-text fields may hold HTML (from the editor) or older plain text. Returns HTML either way:
 * blank lines → paragraphs, single newlines → <br>, lines starting with - * • or "1." → real lists.
 */
export function toRichHtml(v?: string | null): string {
  const t = (v ?? "").trim();
  if (!t) return "";
  if (/<(p|ul|ol|li|h[1-6]|strong|em|b|i|br|blockquote)[\s>/]/i.test(t)) return t;
  const out: string[] = []; let list: { type: "ul" | "ol"; items: string[] } | null = null; let para: string[] = [];
  const flushPara = () => { if (para.length) { out.push(`<p>${para.map(esc).join("<br>")}</p>`); para = []; } };
  const flushList = () => { if (list) { out.push(`<${list.type}>${list.items.map((i) => `<li>${esc(i)}</li>`).join("")}</${list.type}>`); list = null; } };
  for (const raw of t.split(/\r?\n/)) {
    const line = raw.trim();
    const ul = line.match(/^[-*•–·]\s+(.*)$/), ol = line.match(/^\d+[.)]\s+(.*)$/);
    if (!line) { flushPara(); flushList(); }
    else if (ul || ol) { flushPara(); const type = ul ? "ul" : "ol"; if (!list || list.type !== type) { flushList(); list = { type, items: [] }; } list.items.push((ul ?? ol)![1]); }
    else { flushList(); para.push(line); }
  }
  flushPara(); flushList();
  return out.join("");
}
