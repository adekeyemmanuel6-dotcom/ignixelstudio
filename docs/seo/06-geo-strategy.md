# Generative Engine Optimisation (GEO) & Entity Strategy

> No one can guarantee inclusion in AI answers. This plan makes Ignixel Studio *easy to understand, verify and cite*, and gives a repeatable way to measure what actually happens.

## 1. Entity: one consistent description of the company
**Implemented in code**
- `Organization` JSON-LD with a stable `@id`, name, alternate name, logo (ImageObject), description, email, `knowsAbout`, founders (from the Team data), and `sameAs` from the official social URLs in Settings.
- `WebSite` JSON-LD linked to the organisation. `Person` JSON-LD for team members (About page). `Service` + `FAQPage` + `BreadcrumbList` on service/landing pages. `Article` (with `dateModified`) on posts. `CreativeWork` on each case study.
- Address, founding year, legal name and service countries are published **only if you enter them** in Admin → Settings → (Headquarters, Year founded, Countries you genuinely serve). Nothing is assumed.

**Facts to confirm and then enter in Settings (currently empty or free-text)**
| Fact | Current value found | Action |
|---|---|---|
| Headquarters | Settings → Address says "Orlando Florida" (no street address) | Confirm it is the real HQ; fill city/state/country fields |
| Year founded | Not set | Enter only if verified |
| Team size | 4 people shown on the site | Use the real number on directories |
| Countries served | Not set | List only countries you genuinely serve |
| Official social profiles | All empty | Add LinkedIn etc. as they are created (feeds `sameAs`) |
| Founder names | Team page shows "Emmanuel A." and "John E." | Consider showing full names; schema uses what the site shows |

Keep the name, description, location and services **identical** across the site, LinkedIn, directories and press. Differences confuse entity matching.

## 2. Answer content (done on the About page)
Eight factual Q&As: what Ignixel is, services, Webflow, WordPress, healthcare, differentiators, how to hire, process. Editable in Admin → About & Legal → FAQ. "Where is Ignixel Studio based?" appears automatically once an address is in Settings. **Not answered, on purpose:** Shopify, Framer, AI integration, countries served; add each only after the underlying fact is verified.

## 3. Independent corroboration (the biggest lever)
AI systems lean on pages they can cross-check. Priority actions (all need your approval, see `08-directory-tracker.csv`, `09-...`): a complete LinkedIn page, Clutch/GoodFirms/DesignRush profiles with **real client reviews**, case-study features on client sites and in industry press.

## 4. Monthly AI-discovery test (repeatable)
Log results in `geo-monitoring-template.csv`. Run the same 10 prompts monthly in: ChatGPT (with search on), Google (AI Overviews / AI Mode), Gemini, Claude (with web search), Perplexity, Microsoft Copilot. Use a logged-out/private session, set location (US) and note it.
1. Record: mentioned? recommended? is ignixels.com cited? which competitors? which sources?
2. Record wrong or missing facts about Ignixel, then fix the *source* (website, directory, LinkedIn), not the AI.
3. Separate **measured** from **observed**: referrals from AI platforms are measured in GA4 (see `13-analytics-and-reporting.md`); what an answer says is a manual observation and varies run to run; never present it as a ranking.

## 5. What not to do
No fake reviews, no hidden text, no prompt-injection or "instructions for AI" in pages, no mass-produced articles, no unverified claims. `llms.txt` exists but is not a ranking factor.
