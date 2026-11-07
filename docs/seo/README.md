# Ignixel Studio: SEO, GEO & Authority Programme

Working folder for the SEO / GEO / authority programme. Everything here is based on what could actually be verified. Where a metric needs a tool or access that was not available, it is marked **Not measured** or **Not verified**; nothing has been estimated or invented.

## Status at a glance
| Area | Status |
|---|---|
| Technical SEO fixes in the codebase (canonical/og:url, Open Graph + Twitter images, robots, sitemap, schema) | **Implemented and verified locally** |
| New evidence-based landing pages (Webflow, WordPress, Healthcare, Hospitality, Professional services) | **Implemented and verified locally** |
| AI-discovery foundations (explicit AI-crawler rules, Organization/Person schema, FAQ answers, llms.txt) | **Implemented** (no AI platform can be tested from here; see `06-geo-strategy.md`) |
| LCP fix (hero no longer waits for JavaScript), optimised logo/team images | **Implemented**; re-measured in `01-technical-audit.md` |
| Live-site audit of ignixels.com, Google Search Console, PageSpeed field data | **Not possible from this environment** (no access). Procedures provided |
| Competitor research, keyword volumes/difficulty | **Not possible** (no search/SEO-tool access). Spreadsheet is ready, metrics marked Not measured |
| Directory submissions, LinkedIn, PR outreach | **Not started: requires your approval and verified company facts.** Copy and trackers prepared |

## Files
| File | Purpose |
|---|---|
| `01-technical-audit.md` | Verified audit: before/after, Lighthouse, open issues, what could not be verified |
| `02-competitor-and-keyword-research.md` | Research method, what was not possible, keyword strategy |
| `03-keyword-research.csv` | 64 keywords mapped to pages (volume/KD columns marked Not measured) |
| `04-architecture-and-keyword-mapping.md` | Site architecture decisions, pages created vs held back, keyword→URL map |
| `05-ai-crawler-accessibility.md` | robots.txt rules, what each AI crawler does, how to verify |
| `06-geo-strategy.md` | Entity, schema, answer content, monthly AI-discovery test protocol |
| `geo-monitoring-template.csv` | Monthly AI-answer testing log |
| `07-content-strategy-90-day.md` | Clusters and a 90-day editorial calendar |
| `08-directory-tracker.csv` | 20 platforms with eligibility, status, blockers |
| `09-profile-copy-and-linkedin.md` | Clutch / GoodFirms / DesignRush copy, LinkedIn company + founder content |
| `10-digital-pr-and-backlinks.md` + `11-backlink-tracker.csv` | PR strategy and tracker |
| `12-case-study-seo-template.md` | Template for each portfolio project |
| `13-analytics-and-reporting.md` | Tracking setup and the monthly report |
| `14-90-day-plan.md` | Day-by-day execution plan with owners |
| `15-implementation-report.md` | What was done, verified, and what needs your decisions |
| `data/` | Raw crawler output (before/after) |

## Re-run the technical audit any time
```bash
node scripts/seo-audit.mjs https://ignixels.com docs/seo/data/audit-live.json
```
It crawls the sitemap and checks status codes, titles, descriptions, canonicals, og:url/og:image, headings, image alt, JSON-LD validity, broken internal links and robots.txt.
