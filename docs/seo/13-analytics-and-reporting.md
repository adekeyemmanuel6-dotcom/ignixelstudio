# Analytics, Dashboards & Monthly Reporting

## Setup checklist (nothing below is claimed as done: none of it can be verified from here)
| Tool | How | Verify |
|---|---|---|
| **GA4** | Create a property → copy the `G-…` ID → Admin → Settings → Google Analytics ID. The site loads it automatically | GA4 → Realtime shows your visit |
| **Conversion events** | Already wired in code: `generate_lead` (hero form, contact form, calculator; calculator also sends the mid-range value) and `sign_up` (newsletter). Mark `generate_lead` as a **key event** in GA4 | Submit a test form; see the event in Realtime/DebugView |
| **Google Search Console** | Add property `https://ignixels.com` (URL-prefix) → HTML-tag method → paste the `content` value in Admin → Settings → "Google Search Console verification code" → Verify → submit `https://ignixels.com/sitemap.xml` | Property verified; sitemap "Success" |
| **Bing Webmaster Tools** | Import from Search Console, or paste the verification code in Settings | Site verified |
| **PageSpeed Insights** | Run monthly on `/`, a service page, a case study | Record LCP/INP/CLS (field data when available) |
| **Microsoft Clarity** *(optional)* | Add via Tag Manager only if you want session replays; mind privacy notice | n/a |
| **Meta Pixel** | Settings → Meta Pixel ID (only if you run Meta ads); fires `Lead` | n/a |

## Dashboards (build in Looker Studio from GA4 + Search Console)
**SEO:** impressions · clicks · CTR · average position · indexed pages · branded vs non-branded clicks (filter query contains "ignixel") · rankings for the P1 keywords · traffic by country · organic **inquiries** and qualified leads (from Admin → Leads, status Qualified+).
**GEO:** sessions from `chatgpt.com`, `perplexity.ai`, `gemini.google.com`, `claude.ai`, `copilot.microsoft.com` (GA4 → Acquisition → Traffic acquisition, filter Session source; **referrer is not always passed, so treat as a floor**) · manual brand-mention log (`geo-monitoring-template.csv`) · cited URLs · accuracy of facts. *Do not claim access to AI models' training data or invent "visibility scores".*
**Authority:** published directory profiles (with live URLs) · verified client reviews · referring domains · editorial links · case studies published · award submissions/results.

## Monthly report template (copy each month)
```
Month: ____   Prepared by: ____
1. Headline: 3 sentences on what changed and why.
2. Search: impressions | clicks | CTR | avg position | indexed pages | top 10 queries | pages gaining/losing
3. Inquiries: total | from organic | qualified (Leads status) | won | source of each win
4. Technical: Core Web Vitals (PSI) | crawl errors | new issues from `node scripts/seo-audit.mjs`
5. Content: published | updated | top performers | planned next month
6. Authority: new profiles (live URLs) | new reviews | new links (domain, relevance) | PR in progress
7. GEO: prompts tested | mentioned/recommended/cited counts | wrong facts found + fix | AI referral sessions
8. Decisions needed from the owner.
```
Success is measured in **qualified enquiries**, not rankings or traffic alone.
