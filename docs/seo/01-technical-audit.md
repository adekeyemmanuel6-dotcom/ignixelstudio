# Technical SEO Audit (verified)

**Scope & method.** The live site (https://ignixels.com) could not be reached from this environment, so the audit was run on a **production build of the same codebase served locally**, using a crawler written for this project (`scripts/seo-audit.mjs`; raw output in `data/`) and Lighthouse 13. Only findings measured this way are stated as fact. Re-run the crawler against the live URL to confirm (command in `README.md`). In this local run the site URL variable points to localhost; on production it must be `https://ignixels.com` (see open item 1).

## Before → after (crawler results, 30 → 36 URLs)
| Severity | Before | After |
|---|---|---|
| Critical | 0 | 0 |
| High | 16 | **0** |
| Medium | 20 | **0** |
| Low | 10 | 7 |

### What was found and fixed (all verified in the rendered HTML)
| Sev. | Finding (evidence) | Fix |
|---|---|---|
| High | **`og:url` pointed to the homepage on 15 pages** (Open Graph does not inherit page URLs; every page without its own block advertised "/") | New `pageMeta()` helper sets canonical, og:url, Open Graph and Twitter tags together on every page |
| Medium | **No `og:image`/`twitter:image` on 20 pages** → plain link previews when shared | Generated default social image (`/opengraph-image`, 1200×630) referenced by every page; posts and case studies use their own image |
| High | **Duplicate meta description** on `/`, `/privacy-policy`, `/terms` (inherited from the homepage) | Unique descriptions on both legal pages |
| Medium | Minimal `Organization` schema only (name/url/logo/email) | Full entity graph: Organization (+ImageObject logo, founders from Team data, `knowsAbout`, `sameAs`), WebSite, Person (About), Service+FAQPage (service/landing pages), Article with `dateModified`, CreativeWork (case studies). Address, founding year, service countries publish only when entered in Settings |
| Low | `robots.txt` carried a deprecated `Host:` line and no explicit rules for AI crawlers | Rewritten with explicit allow rules (see `05-ai-crawler-accessibility.md`) |
| Low | Sitemap gave every URL `lastModified = now` (a false freshness signal) | `lastmod` only where a real date exists (posts) |
| Low | Blog title 74 chars | Shortened |
| Medium | Several below-the-fold images had empty `alt` though they convey content (hero band, services, industries) | Descriptive alt text |
| Medium | **LCP gated on JavaScript**: the hero headline/paragraph/form were hidden (`visibility:hidden` / `opacity:0`) until GSAP initialised | Hero now reveals with CSS only; verified that with **all JavaScript blocked** the headline is visible. Element render delay fell ~980 ms → ~97 ms (lab) |
| Medium | Uploaded logo/team/service images were served as multi-MB originals via plain `<img>` (logo 163 KB for a 36 px slot; team PNGs 1.5–1.9 MB) | Logo and team photos now use `next/image` (resized, WebP/AVIF on Vercel; plain `<img>` fallback for non-allow-listed hosts). **Admin uploads are now auto-resized and converted to WebP in the browser** (test: 4.1 MB → 50–203 KB) |

### Verified as already healthy
Every audited page has exactly one `<h1>`; every `<img>` has an `alt` attribute; all JSON-LD blocks parse; unknown URLs return a real 404; no `noindex` anywhere in the public site; no broken internal links among the crawled URLs; canonical present and self-referencing on all 35 sitemap URLs; breadcrumbs (visible + `BreadcrumbList`) on all inner pages; `lang="en"`, viewport meta present; no hreflang (correct: one language, no regional variants).

## Core Web Vitals / Lighthouse (lab, not field data)
Lighthouse 13, local production build. Mobile = default emulation (Slow-4G, 4× CPU slowdown). Images were served **unoptimised** in this sandbox (the Next.js image optimiser cannot fetch remote images here), so mobile lab numbers overstate real-world payload.

| Run | Perf | A11y | Best practices | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| Home, mobile, before | 58 | 100 | 100 | 100 | 5.5 s | 950 ms | 0 |
| Home, mobile, after | 71 | 100 | 100 | 100 | 4.8 s | 460 ms | 0 |
| About, mobile, before → after | 69 → 78 | 100 | 100 | 100 | 5.6 → 4.3 s | 430 → 330 ms | 0 |
| **Home, desktop, after** | **94** | 100 | 100 | 100 | **0.3 s** | 200 ms | 0 |

**Honest read:** SEO, accessibility and best-practices are 100. Desktop is excellent. Mobile lab LCP is still above Google's 2.5 s target in this sandbox; the remaining cost is dominated by unoptimised original images and ~1.1 s of style/layout work from a long page with many animated sections. **Measure the real number with PageSpeed Insights on the deployed URL** (images will be resized by Vercel). If mobile LCP is still > 2.5 s there, next steps: dynamic-import GSAP (≈125 KB) so it loads after first paint, and limit the animated hero band on small screens.

## Open items (need your action or access)
| # | Sev. | Item | Evidence / how to verify | Action |
|---|---|---|---|---|
| 1 | **High (verify)** | `NEXT_PUBLIC_SITE_URL` must be `https://ignixels.com` in Vercel; canonicals, og:url, sitemap, robots and schema all derive from it | Local run shows localhost; production value not visible from here | Check Vercel → Settings → Environment Variables; redeploy |
| 2 | High | Analytics not connected: `ga_id` and `meta_pixel_id` are empty in site settings (read from the database) | DB `site_settings.general` | Add GA4 ID in Admin → Settings; forms now send `generate_lead` events |
| 3 | High | Google Search Console / Bing Webmaster not set up (cannot be verified from here) | n/a | Add the verification codes in Admin → Settings (new fields) and submit `/sitemap.xml` |
| 4 | Medium | Typo in a project title: **"Healtcare Webflow Website Development"** (public H1 and title tag) | DB `case_studies` | Fix in Admin → Projects |
| 5 | Low | Case-study title tags 86–104 chars (will truncate) | Crawler | Shorten the SEO title field per project |
| 6 | Low | Homepage meta description is 174 chars | Crawler | Proposed (≈150): "Ignixel Studio is a web design and development agency building Webflow, WordPress and custom websites for healthcare, hospitality and service businesses." |
| 7 | Medium | 3 starter blog posts are short and generic | ~400–470 words each | Rewrite from experience or draft them (`07-…`) |
| 8 | Low | Favicon file is a 163 KB, 1667 px JPG (same file as the logo) | Lighthouse | Re-upload a small square image (auto-compressed now) |
| 9 | Low | Service sub-card images are ~1.5 MB PNGs (6 on `/services/web-design`) | Lighthouse | Fine on Vercel (resized) but re-upload to shrink storage |
| 10 | Note | FAQ markup: Google now shows FAQ rich results only for a limited set of sites. Kept for structured answers/AI, **do not expect rich snippets** | n/a | none |

## Not verified (cannot be done from here)
HTTP→HTTPS and www/non-www redirect chains on the live domain · live robots/sitemap indexation counts · Search Console coverage and Core Web Vitals field data (CrUX) · Rich Results Test / Schema.org Validator (JSON-LD was validated structurally and parsed; run both tools on the live URLs) · broken **external** links · live server response codes and CDN/firewall behaviour toward crawlers · backlink profile · reviews · competitor data · AI-answer visibility.
