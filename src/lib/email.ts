// Resend (https://resend.com) notifications via REST — no extra dependency.
// Env: RESEND_API_KEY (required to send), LEAD_NOTIFY_EMAIL (recipient), RESEND_FROM (optional sender).
// Failures are logged but never block form submission: the lead is already saved in Supabase.
const esc = (v: unknown) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

export async function notifyLead(opts: { subject: string; replyTo?: string; rows: [string, unknown][] }) {
  const key = process.env.RESEND_API_KEY, to = process.env.LEAD_NOTIFY_EMAIL;
  if (!key || !to) return { sent: false, reason: "RESEND_API_KEY or LEAD_NOTIFY_EMAIL not set" };
  const html = `<div style="font-family:Inter,Arial,sans-serif;max-width:620px;margin:auto;color:#151A29">
    <h2 style="margin:0 0 16px;color:#010BCC">${esc(opts.subject)}</h2>
    <table style="width:100%;border-collapse:collapse">${opts.rows.filter(([, v]) => v !== undefined && v !== null && v !== "").map(([k, v]) =>
      `<tr><td style="padding:10px 12px;border-bottom:1px solid #E5E8F0;color:#697386;width:170px;vertical-align:top">${esc(k)}</td><td style="padding:10px 12px;border-bottom:1px solid #E5E8F0;white-space:pre-wrap">${esc(v)}</td></tr>`).join("")}</table>
    <p style="color:#697386;font-size:14px;margin-top:20px">Also saved in your Ignixel admin → Leads.</p></div>`;
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.RESEND_FROM || "Ignixel Studio <onboarding@resend.dev>", to: to.split(",").map((s) => s.trim()), subject: opts.subject, html, reply_to: opts.replyTo }),
    });
    if (!r.ok) { console.error("Resend error", r.status, await r.text()); return { sent: false, reason: `Resend ${r.status}` }; }
    return { sent: true };
  } catch (e) { console.error("Resend failed", e); return { sent: false, reason: "network" }; }
}
