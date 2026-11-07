import { defaultCalculator, defaultCalcSettings } from "./defaults";

/** Local estimate used only when Supabase is not configured (demo mode). In production the same formula runs in SQL (submit_calculator). */
export function localEstimate(answers: Record<string, string>) {
  let add = 0, mult = 1, points = 0; let platform: string | null = null;
  const snapshot: { question: string; answer: string }[] = [];
  for (const q of defaultCalculator) {
    const sel = answers[q.key]; if (!sel) continue;
    const idx = Number(sel.split(":")[1]); const o = q.options[idx]; if (!o) continue;
    add += o[2]; mult *= o[3]; points += o[4]; snapshot.push({ question: q.title, answer: o[0] });
    if (q.key === "platform") platform = o[0];
  }
  const total = (1500 + add) * mult, step = 50;
  const min = Math.round((total * 0.85) / step) * step, max = Math.round((total * 1.3) / step) * step;
  return { id: "local", min, max, currency: defaultCalcSettings.currency, symbol: defaultCalcSettings.currency_symbol, complexity: points >= 16 ? "Advanced" : points >= 8 ? "Moderate" : "Focused", platform, answers: snapshot };
}
