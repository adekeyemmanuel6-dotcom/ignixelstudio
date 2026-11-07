# Information Architecture & Keyword → URL Mapping

## Principle
Each URL targets one distinct search intent. A page exists only where there is real portfolio evidence. Existing URLs were preserved; nothing was moved, so **no redirects were needed**.

## Current architecture (after this work)
```
/                                   Home (brand + agency positioning)
/services/                          Services hub
  /services/web-design/             (existing category page)
  /services/web-development/        (existing)
  /services/ecommerce-applications/ (existing)
  /services/ai-services/            (existing)
  /services/webflow-development/    NEW, 3 Webflow projects as evidence
  /services/wordpress-development/  NEW, 2 WordPress projects as evidence
/industries/                        NEW hub
  /industries/healthcare/           NEW, 2 healthcare projects + real testimonial
  /industries/hospitality/          NEW, 2 projects (vacation rental / holiday homes)
  /industries/professional-services/ NEW, 2 projects
/work/ + /work/<project>            (existing; now with CreativeWork schema and cross-links)
/solutions/ + 6 problem pages       (existing)
/about/                             (existing; now with factual FAQs + Person schema)
/blog/ + /blog/<post>               (existing)
/website-cost-calculator/, /contact/, /privacy-policy/, /terms/
```

## Proposed pages NOT created yet, and why
| Proposed URL | Decision | Reason / what unlocks it |
|---|---|---|
| /services/shopify-development, /services/woocommerce-development, /services/ecommerce-development | **Hold** | No Shopify/WooCommerce project in the portfolio (one "eCommerce Startup" testimonial exists but its platform is unconfirmed). Publish after 1–2 real projects, or confirm which existing client used which platform |
| /services/framer-development | **Hold** | No Framer project in the portfolio |
| /services/ai-integration, /services/ai-services (exists as category) | **Hold dedicated page** | The category page exists, but no AI project is in the portfolio. Do not make capability claims in new content until one is documented |
| /services/ui-ux-design, /services/website-redesign, /services/landing-page-design, /services/website-migration, /services/api-integrations, /services/custom-web-applications | **Later** | Currently sub-sections of the category pages. Split out only when each can carry unique proof (project, process, FAQs) and a distinct keyword target; otherwise they would be thin and compete with the category page |
| /industries/saas, /industries/ecommerce, /industries/real-estate, /industries/logistics | **Hold** | No portfolio evidence in these industries |
| /about/our-team, /about/our-process | **Not needed** | Team and process are already on /about and the homepage; separate URLs would duplicate content |
| Country/city pages (US-TX, US-FL, UK, CA, AU, NG) | **Not created** | See `06-geo-strategy.md`. No location page without real coverage, unique proof and a reason to exist |

## Keyword → URL map (primary targets; full list in `03-keyword-research.csv`)
| Page | Primary keyword | Secondary / supporting | Intent |
|---|---|---|---|
| / | Ignixel Studio (brand) + web design & development agency | digital design agency | Brand / commercial |
| /services/web-design | web design agency | UI/UX design agency, website redesign agency, responsive website design | Commercial |
| /services/web-development | web development agency | custom website development, custom web application development | Commercial |
| /services/webflow-development | Webflow development agency | Webflow agency, Webflow website designer | Commercial |
| /services/wordpress-development | WordPress development agency | WordPress web design company | Commercial |
| /industries/healthcare | healthcare web design agency | direct primary care website design, telehealth website design, medical website design | Commercial |
| /industries/hospitality | vacation rental website design | direct booking website, hospitality web design agency | Commercial |
| /industries/professional-services | professional services website design | lead generation website design | Commercial |
| /work/* | (project name + industry + platform) | | Proof / long tail |
| /about | what is Ignixel Studio | brand questions | Informational |
| /blog/* | see `07-content-strategy-90-day.md` | | Informational |

## Cannibalisation guardrails
- Category pages own broad service intent; platform pages own "<platform> agency" intent; industry pages own "<industry> website" intent. Case studies must not target those head terms.
- Each new blog post gets one primary query and links up to its service/industry page (see content strategy).
