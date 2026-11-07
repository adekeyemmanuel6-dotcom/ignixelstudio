// next/image only accepts hosts listed in next.config.mjs. Anything else (e.g. a URL pasted in the admin) must fall back to a plain <img>.
export const canOptimize = (url?: string | null) => { try { const h = new URL(url ?? "", "http://x").hostname; return h.endsWith(".supabase.co") || h === "images.unsplash.com" || (url ?? "").startsWith("/"); } catch { return false; } };
