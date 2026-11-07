// Conversion events. No-ops unless Google Analytics / Meta Pixel IDs are set in Admin → Settings (the site layout then loads them).
type W = Window & { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void };
export function trackLead(source: "hero_form" | "contact_form" | "calculator" | "newsletter", extra: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as W;
  try {
    w.gtag?.("event", source === "newsletter" ? "sign_up" : "generate_lead", { lead_source: source, ...extra });
    if (source !== "newsletter") w.fbq?.("track", "Lead");
  } catch { /* analytics must never break the form */ }
}
