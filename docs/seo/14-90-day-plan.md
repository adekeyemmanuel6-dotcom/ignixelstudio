# 90-Day Execution Plan

Status key: **Done** (in code, verified locally) · **Ready** (prepared, needs you) · **Needs approval** · **Blocked** (needs access/facts) · **Planned**

## Days 1–15: Foundation
| Task | Status | Owner / note |
|---|---|---|
| Technical audit (local build) + crawler script | **Done** | `01-technical-audit.md` |
| Fix canonical/og:url, OG images, robots, sitemap, schema | **Done** | |
| Confirm `NEXT_PUBLIC_SITE_URL=https://ignixels.com` on Vercel; redeploy | **Ready** | You (5 min) |
| Verify live: HTTPS, www redirect, 404s, bot access (`curl` loop in `05-…`) | **Blocked** (needs live access) | You / re-run `seo-audit.mjs` on live URL |
| Connect GA4, Search Console, Bing; submit sitemap | **Ready** | You: add IDs/codes in Admin → Settings |
| Verify brand facts (HQ, founded, team size, countries, full founder names) and enter in Settings | **Ready** | You |
| Fix title typo "Healtcare…", shorten project SEO titles, shorten home description | **Ready** | You in Admin |
| Keyword research with tool data | **Blocked** (tool access) | `03-keyword-research.csv` ready to fill |

## Days 16–30: Website optimisation
| Task | Status |
|---|---|
| Homepage positioning/metadata | **Done** (metadata + schema); owner to refine the description |
| Web Design / Web Development / Webflow / WordPress pages | **Done** (category pages existing; Webflow + WordPress new) |
| Shopify / Framer pages | **Held**: no portfolio evidence |
| Industry pages: healthcare, hospitality, professional services | **Done** |
| Internal linking (footer, tiles, sub-service links, case-study cross-links) | **Done** |
| Structured data | **Done**; validate with Rich Results Test + Schema.org Validator on live URLs (**Ready**) |
| Portfolio pages | **Done** (CreativeWork schema, related links); fill missing results with client-approved facts |
| Submit updated sitemap | **Ready** (after Search Console is connected) |

## Days 31–45: Business authority (all need your approval)
| Task | Status |
|---|---|
| LinkedIn company page + founder profile | **Ready**: copy in `09-…`; **Needs approval** to create/publish |
| Clutch, GoodFirms, DesignRush profiles | **Ready**: copy drafted with `[CONFIRM]` fields; **Needs approval** (account creation, declarations) |
| The Manifest / Sortlist | Researching |
| Behance / Dribbble | Planned: needs client permission + project imagery |
| Review acquisition from 5 existing real clients | **Ready**: process in `09-…` |
| Complete team bios | **Ready**: Admin → Team (bios currently empty, which also weakens Person schema) |

## Days 46–60: Content authority
Publish the first two flagship articles (healthcare trust; Webflow vs WordPress), rewrite or draft the 3 starter posts, publish 2 detailed case studies (template in `12-…`), start PR outreach (`10-…`).

## Days 61–75: GEO expansion
Run the first monthly AI-discovery test (`geo-monitoring-template.csv`) across ChatGPT, Gemini, Claude, Perplexity, Google AI features, Copilot; record inaccuracies; fix at the source; strengthen independent mentions; review firewall/CDN for AI-crawler access.

## Days 76–90: Optimise and grow
Review Search Console (queries, pages, CTR); improve pages with high impressions and low CTR (titles/descriptions); expand the best cluster; review directory outcomes and links; analyse conversion paths and form completion; write the next 90-day plan.

## Approval gates (nothing proceeds without your OK)
Creating accounts · publishing any profile · legal declarations · payments/subscriptions/ads/sponsorships · claims about locations or credentials · enabling Google Business Profile.
