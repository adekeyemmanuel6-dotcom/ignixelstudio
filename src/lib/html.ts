import sanitizeHtml from "sanitize-html";
import { slugify } from "./utils";

export function cleanHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["h1", "h2", "h3", "h4", "img", "figure", "figcaption", "pre", "code"]),
    allowedAttributes: { a: ["href", "name", "target", "rel"], img: ["src", "alt", "width", "height", "loading"], "*": ["id"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: { a: (tag, attribs) => ({ tagName: "a", attribs: { ...attribs, ...(attribs.href?.startsWith("http") ? { rel: "noopener noreferrer", target: "_blank" } : {}) } }), img: (t, a) => ({ tagName: "img", attribs: { ...a, loading: "lazy" } }) },
  });
}

/** Adds ids to h2/h3 and returns a table of contents. */
export function withToc(html: string) {
  const toc: { id: string; text: string; level: number }[] = [];
  const used = new Set<string>();
  const out = html.replace(/<(h[23])(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi, (_m, tag: string, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, "").trim();
    let id = slugify(text) || "section"; let n = 2; const base = id;
    while (used.has(id)) id = `${base}-${n++}`;
    used.add(id); toc.push({ id, text, level: Number(tag[1]) });
    return `<${tag} id="${id}">${inner}</${tag}>`;
  });
  return { html: out, toc };
}
