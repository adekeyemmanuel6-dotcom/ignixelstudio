// Starter content. Used (a) as a fallback until the database is seeded, and (b) by the admin
// "Install starter content" action. Everything here is editable in /admin afterwards.
// Nothing here invents clients, awards, statistics or testimonials: placeholders are flagged `is_placeholder`.
import { photo } from "./images";
import type { BlogCategory, CaseStudy, ServiceCategory, Service, SiteSettings, TeamMember, Technology, Testimonial, HomepageSection } from "./types";

export const defaultSettings: SiteSettings = {
  site_name: "Ignixel Studio",
  tagline: "Digital experiences built to move your business forward.",
  logo_url: "", favicon_url: "",
  contact_email: "hello@ignixel.studio", phone: "", address: "",
  footer_description: "Ignixel Studio designs and builds high-performance websites, web applications, eCommerce platforms and AI-powered solutions that help businesses build authority and grow.",
  copyright: "Ignixel Studio. All rights reserved.",
  seo_title: "Ignixel Studio — Web Design, Development & AI Solutions",
  seo_description: "Ignixel Studio designs and builds high-performance websites, web applications, eCommerce platforms and AI-powered solutions that help businesses establish authority and grow.",
  og_image: "", ga_id: "", meta_pixel_id: "", brand_primary: "#010BCC",
  socials: { linkedin: "", x: "", instagram: "", github: "", dribbble: "", facebook: "" },
  content_seeded: false,
};

/** Bump when default copy/images change; the admin dashboard then offers "Apply latest default content". */
export const CONTENT_VERSION = 2;

const faq = (q: string, a: string) => ({ q, a });
const st = (title: string, description: string) => ({ title, description });

const id = (s: string) => `default-${s}`;

export const defaultCategories: ServiceCategory[] = [
  {
    id: id("web-design"), slug: "web-design", title: "Web Design", image_url: photo("wireframe", 1200, 900), icon: "palette", sort_order: 1, published: true, cta_label: "Start a Design Project",
    short_description: "Strategic, user-focused interfaces that turn first impressions into lasting connections.",
    hero_headline: "Web Design That Turns First Impressions Into Lasting Connections.",
    hero_description: "We create strategic, user-focused digital experiences that combine beautiful interfaces, intuitive navigation, and conversion-driven design.",
    seo_title: "Web Design Services | Ignixel Studio", seo_description: "Figma UI/UX, WordPress, Webflow, Shopify and Framer website design, redesigns, landing pages and migrations from Ignixel Studio.",
    technology_slugs: ["figma", "webflow", "framer", "wordpress", "shopify"],
    capabilities: [
      st("Research & Messaging", "We clarify who the site is for and what it needs to say before a single pixel is drawn."),
      st("UX Architecture", "Sitemaps, user journeys and wireframes that make the path to enquiry obvious."),
      st("Visual Design Systems", "Typography, colour, components and motion rules that keep every page consistent."),
      st("Conversion Design", "Clear hierarchy, calls to action and trust signals placed where decisions are made."),
      st("Responsive & Accessible", "Layouts designed for phones first and built to meet accessibility best practice."),
      st("Handover & Documentation", "Design files, component libraries and guidelines your team can keep using."),
    ],
    process: [st("Discover", "Goals, audience, competitors and existing performance."), st("Structure", "Sitemap, content hierarchy and wireframes."), st("Design", "High-fidelity UI, prototypes and design system."), st("Refine", "Feedback rounds, accessibility review and hand-off.")],
    faqs: [
      faq("Which platform should my website be designed for?", "It depends on your content, your team and how often the site changes. WordPress suits content-heavy sites, Webflow and Framer suit design-led marketing sites, Shopify suits stores. We recommend one during discovery and explain why."),
      faq("Do you design in Figma before building?", "Yes. Key pages and the component system are designed and approved in Figma first, so development starts with decisions already made."),
      faq("Can you redesign my existing site without losing search rankings?", "That is the goal of our redesign process: we audit what currently performs, preserve URLs and content that earn traffic, and set up redirects before launch."),
      faq("How many revision rounds are included?", "Scope and revision rounds are agreed in your proposal. We structure feedback into defined review stages so projects stay on schedule."),
    ],
  },
  {
    id: id("web-development"), slug: "web-development", title: "Web Development", image_url: photo("webdev", 1200, 900), icon: "code", sort_order: 2, published: true, cta_label: "Discuss Your Build",
    short_description: "Reliable, scalable websites, web apps and integrations engineered for performance.",
    hero_headline: "Web Development Built for Performance, Scale and Possibility.",
    hero_description: "We engineer reliable, scalable digital solutions that help businesses streamline operations, improve user experiences, and turn complex ideas into functional products.",
    seo_title: "Web Development Services | Ignixel Studio", seo_description: "Website development, web apps, dashboards, custom software and API integrations built with modern, scalable technology.",
    technology_slugs: ["react", "nextjs", "typescript", "nodejs", "php", "laravel", "python", "postgresql", "supabase", "docker", "aws", "vercel"],
    capabilities: [
      st("Frontend Development", "Fast, accessible interfaces built with component-driven architecture."),
      st("Backend Development", "Secure server logic, authentication and business rules that stay maintainable."),
      st("Custom Application Development", "Purpose-built tools that match how your business actually works."),
      st("API Integrations", "Payments, CRMs, ERPs and third-party services connected reliably."),
      st("Database Architecture", "Relational schemas, indexing and access policies designed for growth."),
      st("Performance Optimisation", "Core Web Vitals, caching, image strategy and lean JavaScript."),
      st("Security", "Row-level security, input validation, secure secrets handling and safe defaults."),
      st("Scalability", "Infrastructure and code structure that handle growth without rewrites."),
      st("Accessibility", "Semantic markup, keyboard support and contrast that works for everyone."),
    ],
    process: [st("Scope", "Requirements, technical discovery and architecture decisions."), st("Build", "Iterative development with regular demos."), st("Test", "Automated and manual QA, performance and security checks."), st("Deploy & Support", "Production release, monitoring and ongoing improvement.")],
    faqs: [
      faq("Do you build on a specific stack?", "We default to React, Next.js, TypeScript, Node and Supabase/PostgreSQL for custom work, and choose the right tool where another fits better, such as Laravel or Python."),
      faq("Can you take over or extend an existing codebase?", "Yes. We start with a code and infrastructure review, then agree what to keep, refactor or replace."),
      faq("Who owns the code?", "You do. Source code, repositories and infrastructure accounts are handed over as agreed in your contract."),
      faq("How do you handle security?", "Authentication, role-based access, row-level security, input validation and secret management are part of the build, not an add-on."),
    ],
  },
  {
    id: id("ecommerce-applications"), slug: "ecommerce-applications", title: "Ecommerce & Applications", image_url: photo("ecommerce", 1200, 900), icon: "shopping-bag", sort_order: 3, published: true, cta_label: "Plan Your Store",
    short_description: "Online stores and commerce experiences that make buying easier and growth measurable.",
    hero_headline: "eCommerce Experiences Designed to Sell More.",
    hero_description: "We create high-performing online stores and digital commerce experiences that make shopping easier, improve customer journeys, and support business growth.",
    seo_title: "Ecommerce Development & Shopify Services | Ignixel Studio", seo_description: "Shopify and WooCommerce development, store design and eCommerce website builds focused on conversion and growth.",
    technology_slugs: ["shopify", "woocommerce", "wordpress", "nextjs", "react", "nodejs"],
    capabilities: [
      st("Store Strategy", "Positioning, catalogue structure and the commercial model behind the store."),
      st("eCommerce UI/UX", "Product discovery, listing and product pages designed for confident buying."),
      st("Product Catalogue Setup", "Collections, variants, metadata and bulk import done properly."),
      st("Payment Gateway Integration", "Secure, locally relevant payment methods configured and tested."),
      st("Shipping & Fulfilment", "Rates, carriers, labels and fulfilment workflows connected."),
      st("Inventory Management", "Stock sync across channels, warehouses and your back-office tools."),
      st("Checkout Optimisation", "Fewer steps, clearer costs and fewer abandoned baskets."),
      st("Third-Party Applications", "Reviews, subscriptions, loyalty, email and analytics integrated cleanly."),
      st("Mobile Shopping", "Thumb-friendly navigation, fast loading and simple mobile checkout."),
      st("eCommerce SEO", "Structured data, category architecture and technical foundations for organic sales."),
      st("Ongoing Maintenance", "Updates, monitoring and improvements after launch."),
    ],
    process: [st("Plan", "Products, customers, channels and success metrics."), st("Design", "Store experience, templates and checkout flow."), st("Build", "Theme or custom build, integrations and data migration."), st("Launch & Optimise", "Go-live, tracking and continuous improvement.")],
    faqs: [
      faq("Shopify or WooCommerce?", "Shopify is usually faster to launch and easier to run. WooCommerce suits teams that need deep WordPress integration or full code-level control. We help you decide based on your catalogue, team and budget."),
      faq("Can you migrate my existing store?", "Yes. Products, customers, orders and URLs can be migrated with redirects so search visibility is protected."),
      faq("Do you integrate with my shipping and accounting tools?", "Most mainstream carriers, payment providers and accounting tools can be integrated; we confirm feasibility during scoping."),
      faq("Will you support the store after launch?", "Yes. Maintenance and improvement retainers are available."),
    ],
  },
  {
    id: id("ai-services"), slug: "ai-services", title: "AI Services", image_url: photo("ai", 1200, 900), icon: "sparkles", sort_order: 4, published: true, cta_label: "Explore AI for Your Business",
    short_description: "AI strategy, automation, agents and integrations that remove busywork and improve visibility.",
    hero_headline: "Turn Artificial Intelligence Into a Competitive Advantage.",
    hero_description: "We help businesses integrate intelligent technologies, automate repetitive tasks, improve digital visibility, and build AI-powered experiences.",
    seo_title: "AI Services: Consulting, Agents & Integration | Ignixel Studio", seo_description: "AI consulting, AI agent development, GPT integration, ChatGPT optimisation and AI marketing services from Ignixel Studio.",
    technology_slugs: ["openai", "claude", "gemini", "n8n", "make", "langchain"],
    capabilities: [
      st("AI Strategy & Consulting", "Find the use cases worth pursuing and a realistic roadmap to deliver them."),
      st("Business Process Automation", "Remove repetitive manual work across sales, operations and support."),
      st("AI-Powered Customer Support", "Assistants grounded in your own content that hand off to humans when needed."),
      st("AI Agent Workflows", "Agents that plan, use tools and complete multi-step tasks under clear guardrails."),
      st("Custom GPT Integrations", "Language models connected to your data, products and internal systems."),
      st("AI Search Visibility", "Content and technical structure that helps you be cited in AI-generated answers."),
      st("Marketing Automation", "Faster content operations, personalisation and reporting with human review."),
      st("AI-Powered Business Applications", "Internal tools and customer-facing products with intelligence built in."),
    ],
    process: [st("Assess", "Opportunities, data readiness and risk."), st("Prototype", "A small, testable version against real tasks."), st("Integrate", "Connect to your systems with security and oversight."), st("Measure", "Track quality, cost and outcomes, then iterate.")],
    faqs: [
      faq("Do we need a lot of data to start?", "No. Many valuable use cases work with your existing documents, product information and processes. We assess data readiness first."),
      faq("Is my data safe?", "We design for least-privilege access, avoid sending sensitive data where it is not needed, and document how data flows through every integration."),
      faq("Which AI models do you work with?", "We are model-agnostic and select from providers such as OpenAI, Anthropic, and Google based on task, cost and privacy needs."),
      faq("Can AI replace our team?", "Our focus is removing repetitive work and improving speed and quality, with people kept in control of decisions that matter."),
    ],
  },
];

type S = Omit<Service, "id" | "category_id" | "seo_title" | "seo_description"> & { cat: string };
const svc = (cat: string, order: number, slug: string, title: string, description: string, details: string, who_for: string, problems_solved: string): S => ({
  cat, slug, title, description, details, who_for, problems_solved, image_url: null, sort_order: order, published: true,
});

const svcRows: S[] = [
  svc("web-design", 1, "figma-ui-ux-design", "Figma UI/UX Design", "User journeys, wireframes and high-fidelity interfaces designed and prototyped in Figma.",
    "Includes stakeholder discovery, sitemap and flow mapping, wireframes, a documented component library, high-fidelity screens for key templates and clickable prototypes ready for development hand-off.",
    "Teams building a new website or product who want decisions validated visually before development starts.", "Unclear structure, inconsistent visuals and costly changes discovered mid-build."),
  svc("web-design", 2, "wordpress-website-design", "WordPress Website Design", "Flexible, content-friendly WordPress sites your team can update without a developer.",
    "Custom theme design, reusable page blocks, editor-friendly layouts, performance-minded plugin choices and a training handover.",
    "Businesses with regular content updates, blogs or multiple editors.", "Dated templates, plugin clutter and slow sites that are hard to manage."),
  svc("web-design", 3, "webflow-website-design", "Webflow Website Design", "Design-led marketing websites with rich interactions and a clean visual CMS.",
    "Custom layouts, CMS collections, interaction design, SEO setup and a client-friendly editing experience.",
    "Brands that want pixel-accurate design and fast iteration without heavy engineering.", "Marketing teams blocked by developer queues for every page change."),
  svc("web-design", 4, "shopify-website-design", "Shopify Website Design", "Storefront design that makes products easy to find and simple to buy.",
    "Theme customisation or bespoke design, collection and product page systems, navigation, merchandising sections and mobile-first checkout flows.",
    "Retail and direct-to-consumer brands launching or refreshing a Shopify store.", "Low product-page conversion and confusing navigation."),
  svc("web-design", 5, "framer-website-design", "Framer Website Design", "Fast, expressive websites with polished motion, built to launch quickly.",
    "Design system, responsive layouts, animation, CMS setup and SEO configuration inside Framer.",
    "Startups and design-conscious teams who need to ship a striking site quickly.", "Slow launches and sites that feel generic or static."),
  svc("web-design", 6, "website-redesign", "Website Redesign", "A structured redesign that improves clarity and performance without throwing away what already works.",
    "Analytics and content audit, UX review, new information architecture, visual redesign, redirect mapping and launch support.",
    "Businesses whose website no longer reflects their brand or underperforms.", "Outdated design, poor conversion and fear of losing existing rankings."),
  svc("web-design", 7, "landing-page-design", "Landing Page Design", "Focused landing pages built around a single message and a single action.",
    "Offer and message definition, page structure, persuasive copy direction, form design and test-ready variants.",
    "Campaigns, product launches and lead-generation programmes.", "Traffic that arrives and leaves without enquiring."),
  svc("web-design", 8, "website-migration", "Website Migration", "Move to a new platform or host with content, URLs and SEO intact.",
    "Content inventory, URL mapping and redirects, platform setup, content transfer, QA and post-launch monitoring.",
    "Teams changing CMS, replatforming or consolidating websites.", "Broken links, lost rankings and downtime during platform changes."),

  svc("web-development", 1, "website-development", "Website Development", "Fast, secure, maintainable websites built to your design and business needs.",
    "Component-based front end, CMS integration, SEO and analytics foundations, performance optimisation and deployment.",
    "Businesses that need a high-performing marketing or corporate website.", "Slow pages, brittle templates and sites that are costly to change."),
  svc("web-development", 2, "web-apps-dashboards", "Web Apps & Dashboards", "Interactive applications and dashboards that put your data to work.",
    "Authentication, role-based access, data visualisation, reporting, admin tooling and secure APIs.",
    "Operations, finance and product teams who need visibility and control.", "Spreadsheet-driven workflows and data scattered across tools."),
  svc("web-development", 3, "custom-software-development", "Custom Software Development", "Bespoke software that fits the way your organisation actually operates.",
    "Discovery, architecture, iterative delivery, testing, documentation and long-term support options.",
    "Organisations whose process does not fit off-the-shelf software.", "Workarounds, manual effort and tools that cannot scale."),
  svc("web-development", 4, "custom-web-applications", "Custom Web Applications", "Customer-facing web applications with polished UX and solid engineering.",
    "Product scoping, UX design, front-end and back-end development, payments, notifications and observability.",
    "Founders and businesses launching a digital product.", "Turning an idea into a reliable, usable product."),
  svc("web-development", 5, "api-third-party-integrations", "API & Third-Party Integrations", "Connect your website and systems to CRMs, payments, ERPs and more.",
    "API design, webhooks, data synchronisation, error handling, rate-limit management and monitoring.",
    "Teams running multiple tools that should work as one system.", "Duplicate data entry and out-of-sync systems."),

  svc("ecommerce-applications", 1, "shopify-development", "Shopify Development", "Custom Shopify builds, themes, apps and integrations.",
    "Theme development, custom sections, metafields, app integration, checkout extensions where available, and data migration.",
    "Merchants who have outgrown stock themes or need custom functionality.", "Template limitations and manual operational work."),
  svc("ecommerce-applications", 2, "ecommerce-website-development", "eCommerce Website Development", "Tailor-made commerce websites on the platform that suits your model.",
    "Platform selection, catalogue modelling, payments, shipping, tax configuration, analytics and performance work.",
    "Brands that need flexibility beyond a standard storefront.", "Complex catalogues, B2B pricing and unique buying journeys."),
  svc("ecommerce-applications", 3, "shopify-store-design", "Shopify Store Design", "Conversion-focused store design from homepage to checkout.",
    "Brand-led storefront design, product page systems, merchandising layouts and mobile optimisation.",
    "New stores and established brands refreshing their storefront.", "Stores that look generic and fail to build trust."),
  svc("ecommerce-applications", 4, "woocommerce-development", "WooCommerce Development", "Flexible WooCommerce stores with custom features and integrations.",
    "Theme and plugin development, product and subscription setups, payment and shipping integration, and performance tuning.",
    "Businesses on WordPress who want full control over their store.", "Plugin conflicts, slow stores and limited customisation."),

  svc("ai-services", 1, "ai-consulting", "AI Consulting", "A practical roadmap for where AI can improve your business and where it should not.",
    "Use-case discovery, data and risk assessment, vendor and model selection, prioritised roadmap and proof-of-concept plan.",
    "Leadership teams exploring AI without a clear starting point.", "Hype, unclear value and fear of investing in the wrong thing."),
  svc("ai-services", 2, "ai-digital-marketing", "AI Digital Marketing Services", "Faster, smarter marketing operations with human quality control.",
    "AI-assisted content workflows, audience insight, campaign analysis, personalisation and reporting automation.",
    "Marketing teams who want to produce more without losing quality.", "Slow content production and reporting overhead."),
  svc("ai-services", 3, "chatgpt-optimization", "ChatGPT Optimization", "Improve how your brand and content appear in AI-generated answers.",
    "AI-visibility audit, entity and content structuring, supporting information, technical discoverability and monitoring.",
    "Brands that want to be recommended in AI search and chat results.", "Competitors being cited while your brand is absent."),
  svc("ai-services", 4, "ai-agent-development", "AI Agent Development", "Agents that plan, use your tools and complete multi-step work with oversight.",
    "Workflow design, tool and data access, guardrails, evaluation, human-in-the-loop controls and monitoring.",
    "Operations and support teams with repeatable, rules-bound processes.", "Manual triage, follow-ups and data entry across systems."),
  svc("ai-services", 5, "ai-gpt-integration", "AI & GPT Integration", "Add language-model capability to your product or internal tools.",
    "Model selection, retrieval over your content, prompt and evaluation design, security review and production deployment.",
    "Product teams and businesses adding AI features to existing software.", "Disconnected AI experiments that never reach production."),
];

export const defaultServices: Service[] = svcRows.map((s) => {
  const { cat, ...rest } = s;
  return { ...rest, id: id(s.slug), category_id: id(cat), seo_title: null, seo_description: null };
});

const T = (name: string, slug: string, category: string, icon_slug: string | null, color: string | null, order: number, visible = true): Technology =>
  ({ id: id(slug), name, slug, category, icon_slug, logo_url: null, color, sort_order: order, visible });

export const TECH_CATEGORIES = ["Design & Frontend", "CMS & Website Platforms", "Backend & Development", "Databases & Infrastructure", "AI & Automation"];
export const defaultTechnologies: Technology[] = [
  T("Figma", "figma", TECH_CATEGORIES[0], "figma", "F24E1E", 1), T("HTML5", "html5", TECH_CATEGORIES[0], "html5", "E34F26", 2),
  T("CSS3", "css3", TECH_CATEGORIES[0], "css", "1572B6", 3), T("JavaScript", "javascript", TECH_CATEGORIES[0], "javascript", "F7DF1E", 4),
  T("TypeScript", "typescript", TECH_CATEGORIES[0], "typescript", "3178C6", 5), T("React", "react", TECH_CATEGORIES[0], "react", "61DAFB", 6),
  T("Next.js", "nextjs", TECH_CATEGORIES[0], "nextdotjs", "000000", 7), T("Vue.js", "vuejs", TECH_CATEGORIES[0], "vuedotjs", "4FC08D", 8),
  T("Tailwind CSS", "tailwind", TECH_CATEGORIES[0], "tailwindcss", "06B6D4", 9),
  T("WordPress", "wordpress", TECH_CATEGORIES[1], "wordpress", "21759B", 10), T("Webflow", "webflow", TECH_CATEGORIES[1], "webflow", "146EF5", 11),
  T("Framer", "framer", TECH_CATEGORIES[1], "framer", "0055FF", 12), T("Shopify", "shopify", TECH_CATEGORIES[1], "shopify", "7AB55C", 13),
  T("WooCommerce", "woocommerce", TECH_CATEGORIES[1], "woocommerce", "96588A", 14),
  T("Node.js", "nodejs", TECH_CATEGORIES[2], "nodedotjs", "5FA04E", 15), T("Express", "express", TECH_CATEGORIES[2], "express", "000000", 16),
  T("PHP", "php", TECH_CATEGORIES[2], "php", "777BB4", 17), T("Laravel", "laravel", TECH_CATEGORIES[2], "laravel", "FF2D20", 18),
  T("Python", "python", TECH_CATEGORIES[2], "python", "3776AB", 19),
  T("Supabase", "supabase", TECH_CATEGORIES[3], "supabase", "3FCF8E", 20), T("PostgreSQL", "postgresql", TECH_CATEGORIES[3], "postgresql", "4169E1", 21),
  T("MongoDB", "mongodb", TECH_CATEGORIES[3], "mongodb", "47A248", 22), T("Firebase", "firebase", TECH_CATEGORIES[3], "firebase", "FFCA28", 23),
  T("Redis", "redis", TECH_CATEGORIES[3], "redis", "FF4438", 24), T("Docker", "docker", TECH_CATEGORIES[3], "docker", "2496ED", 25),
  T("AWS", "aws", TECH_CATEGORIES[3], null, "FF9900", 26), T("Vercel", "vercel", TECH_CATEGORIES[3], "vercel", "000000", 27),
  T("OpenAI", "openai", TECH_CATEGORIES[4], null, "412991", 28), T("Claude", "claude", TECH_CATEGORIES[4], "claude", "D97757", 29),
  T("Gemini", "gemini", TECH_CATEGORIES[4], "googlegemini", "8E75B2", 30), T("n8n", "n8n", TECH_CATEGORIES[4], "n8n", "EA4B71", 31),
  T("Make", "make", TECH_CATEGORIES[4], "make", "6D00CC", 32), T("LangChain", "langchain", TECH_CATEGORIES[4], "langchain", "1C3C3C", 33),
];

export const defaultCaseStudies: CaseStudy[] = [1, 2, 3].map((n) => ({
  id: id(`project-${n}`), slug: `sample-project-${n}`, title: `Sample Project ${n} (placeholder)`,
  client_name: "Client name", industry: ["SaaS & Technology", "eCommerce & Retail", "Professional Services"][n - 1],
  services: [["Web Design", "Web Development"], ["Shopify Development", "Store Design"], ["Website Redesign", "SEO"]][n - 1],
  description: "Placeholder project. Replace this description with a short summary of the client, the goal and what Ignixel delivered.",
  challenge: "Describe the business challenge this project addressed.", solution: "Describe the approach, design decisions and build.",
  featured_image: [photo("digital", 900, 1200), photo("ecommerce", 900, 1200), photo("services", 900, 1200)][n - 1], desktop_image: null, mobile_image: null, technologies: [["Next.js", "Supabase"], ["Shopify"], ["Webflow"]][n - 1],
  results: [], website_url: null, featured: true, published: true, is_placeholder: true, seo_title: null, seo_description: null, sort_order: n,
}));

export const defaultTestimonials: Testimonial[] = [1, 2, 3].map((n) => ({
  id: id(`testimonial-${n}`), client_name: "Client Name", company: "Company", position: "Position",
  quote: "Placeholder testimonial. Replace with a verified client quote in Admin → Testimonials.",
  photo_url: null, project_ref: null, featured: true, published: true, is_placeholder: true, sort_order: n,
}));

const tm = (n: number, cat: TeamMember["category"], title: string): TeamMember => ({
  id: id(`team-${n}`), full_name: "Team Member Name", job_title: title, category: cat, sort_order: n, active: true,
  bio: "Placeholder biography. Add a short bio in Admin → Team.", photo_url: null, linkedin_url: null, twitter_url: null, website_url: null,
});
export const defaultTeam: TeamMember[] = [
  tm(1, "Leadership", "Founder & Creative Director"), tm(2, "Design", "Lead UI/UX Designer"), tm(3, "Development", "Lead Full-Stack Developer"),
  tm(4, "Development", "Frontend Developer"), tm(5, "Marketing", "SEO & Content Strategist"), tm(6, "Operations", "Project Manager"),
];

export const defaultBlogCategories: BlogCategory[] = [
  { id: id("cat-web-design"), name: "Web Design", slug: "web-design" },
  { id: id("cat-development"), name: "Development", slug: "development" },
  { id: id("cat-ecommerce"), name: "eCommerce", slug: "ecommerce" },
  { id: id("cat-ai"), name: "AI & Automation", slug: "ai-automation" },
];

export const defaultPosts = [
  {
    slug: "what-makes-a-business-website-convert", title: "What Actually Makes a Business Website Convert", category: "web-design",
    excerpt: "Traffic is only useful if visitors know what to do next. Here are the structural decisions that turn visits into enquiries.", reading_time: 5,
    featured_image: photo("analytics", 1200, 800),
    content: `<h2>Start with one clear job for every page</h2><p>Pages that try to do everything convert poorly. Decide whether a page exists to inform, qualify or capture an enquiry, then remove anything that competes with that purpose.</p><h2>Say what you do in the first screen</h2><p>A visitor should understand who you help, what you offer and what to do next without scrolling. Specific, plain language outperforms clever slogans.</p><h2>Put trust where doubt appears</h2><p>Place proof such as client logos, case studies and process explanations next to the calls to action, where hesitation actually happens.</p><h2>Make the next step small</h2><p>A short form with clear expectations beats a long one. Tell people what happens after they submit.</p><h2>Measure, then improve</h2><p>Track form starts, completions and drop-off. Small, evidence-led changes compound over time.</p>`,
  },
  {
    slug: "shopify-vs-woocommerce-choosing-a-platform", title: "Shopify vs WooCommerce: Choosing the Right Platform", category: "ecommerce",
    excerpt: "Both can power a great store. The right answer depends on your team, catalogue and growth plans.", reading_time: 6,
    featured_image: photo("ecommerce", 1200, 800),
    content: `<h2>Choose Shopify when speed and simplicity matter</h2><p>Shopify handles hosting, security and checkout for you, which lets small teams focus on products and marketing.</p><h2>Choose WooCommerce when you need control</h2><p>WooCommerce runs on WordPress and can be customised at code level. It suits content-led stores and unusual requirements, with more responsibility for maintenance.</p><h2>Questions to ask</h2><ul><li>Who will manage the store day to day?</li><li>How complex is the catalogue and pricing?</li><li>Which integrations are essential?</li><li>What is the long-term running cost?</li></ul><p>If you are unsure, <a href="/contact">talk to us</a> and we will recommend an option based on your situation.</p>`,
  },
  {
    slug: "preparing-your-website-for-ai-search", title: "Preparing Your Website for AI Search", category: "ai-automation",
    excerpt: "AI assistants summarise and cite the web. These are the content and technical foundations that make you easier to cite.", reading_time: 5,
    featured_image: photo("ai", 1200, 800),
    content: `<h2>Be the clearest source on your topic</h2><p>AI systems favour pages that answer a question directly and completely. Structure content with descriptive headings, concise definitions and supporting detail.</p><h2>Make facts easy to extract</h2><p>Use semantic HTML, structured data and consistent naming for your company, services and people.</p><h2>Build topical depth</h2><p>A cluster of related, well-linked articles signals expertise more reliably than one isolated page.</p><h2>Keep it technically accessible</h2><p>Fast, crawlable pages with clean markup and an up-to-date sitemap are the baseline for any search visibility.</p>`,
  },
];

export const defaultHomepageSections: HomepageSection[] = [
  { id: id("s-hero"), key: "hero", title: "Hero", enabled: true, sort_order: 1, content: {
    label: "Design and Development agency for scaling and regulated companies", headline: "Ignite every dead pixel and start generating real results.",
    description: "We combine experienced product, design, development and AI technologies to help companies define, build, and scale complex digital products.",
    primary_label: "Start a Project", primary_href: "/contact", secondary_label: "Explore Our Work", secondary_href: "/work",
    trust: "Strategy, design, engineering and AI under one accountable team.",
  } },
  { id: id("s-trusted"), key: "trusted", title: "Platforms & technology strip", enabled: true, sort_order: 2, content: { heading: "Platforms and technologies we build with" } },
  { id: id("s-services"), key: "services", title: "Services overview", enabled: true, sort_order: 3, content: { heading: "Everything You Need to Build, Launch and Grow.", description: "Four connected disciplines, one accountable team." } },
  { id: id("s-solutions"), key: "solutions", title: "Challenges we solve", enabled: true, sort_order: 7, content: {
    heading: "Having a Digital Problem? Let's Find the Right Solution.", description: "Start with the problem you are facing. We will show you where to look and how we would fix it.",
    items: [
      { slug: "website-doesnt-drive-leads", problem: "My Website Doesn't Drive Leads", cta: "Improve My Website Leads",
        summary: "Visitors arrive but few become enquiries. The cause is usually in how the site communicates and guides.",
        issues: ["Poor user experience", "Weak messaging", "Unclear calls to action", "Poor landing page structure", "Lack of trust signals", "Weak lead capture"],
        approach: "We review how visitors move through your site, tighten the message for each audience, rebuild the key pages around a single clear action, and add proof and lead capture where decisions are made." },
      { slug: "website-traffic-going-down", problem: "My Website Traffic Is Going Down", cta: "Improve My Website Traffic",
        summary: "A drop in visits is a symptom. We trace it to technical, content or visibility causes.",
        issues: ["Technical SEO issues", "Poor content structure", "Search visibility problems", "Website performance", "Content relevance"],
        approach: "We audit crawlability, performance and content against search intent, fix technical blockers first, then restructure and refresh the pages that should be earning traffic." },
      { slug: "website-doesnt-convert", problem: "My Website Doesn't Convert", cta: "Improve My Conversion Rate",
        summary: "You have the visitors, but they do not take the next step. Friction and doubt are usually the reason.",
        issues: ["Poor conversion journeys", "Weak page hierarchy", "Confusing navigation", "Lack of credibility", "Poor mobile experience"],
        approach: "We map the journeys that matter, simplify navigation and page hierarchy, strengthen credibility, and design a mobile experience that makes the next step effortless." },
      { slug: "website-not-appearing-in-ai-search", problem: "My Website Isn't Appearing in AI Search", cta: "Improve My AI Search Visibility",
        summary: "AI assistants answer questions by drawing on sources they can understand and trust. If you are absent, the content or structure needs work.",
        issues: ["Weak topical authority", "Poor content structure", "Lack of relevant supporting information", "Technical discoverability issues", "Limited brand visibility in AI-generated answers"],
        approach: "We structure content for clarity, build supporting topical depth, add structured data and clean markup, and strengthen how your brand is described across the web." },
      { slug: "agency-isnt-driving-results", problem: "My Agency Isn't Driving Results", cta: "Let's Discuss Your Project",
        summary: "When work is happening but nothing is improving, the issue is often communication and clarity rather than effort.",
        issues: ["Poor communication", "Unclear deliverables", "Lack of strategy", "Weak execution", "No measurable progress"],
        approach: "We start with a transparent review of goals and current work, define deliverables and measures, and run projects with regular, plain-language reporting." },
      { slug: "website-is-slow-and-hard-to-update", problem: "My Website Is Slow and Hard to Update", cta: "Speed Up My Website",
        summary: "Pages crawl, every change needs a developer, and the platform feels fragile. That cost shows up in rankings, conversions and team time.",
        issues: ["Heavy pages and unoptimised images", "Plugin or template bloat", "Outdated platform or codebase", "No editor-friendly CMS", "Security and maintenance gaps"],
        approach: "We profile real-world performance, remove what slows the site down, and rebuild or replatform where needed, so pages load fast and your team can update content without a developer." },
    ],
  } },
  { id: id("s-projects"), key: "projects", title: "Featured projects", enabled: true, sort_order: 4, content: { heading: "Digital Experiences. Real Business Impact.", description: "Selected projects, shown with the outcomes that matter to each client.", cta_label: "View All Projects" } },
  { id: id("s-why"), key: "why", title: "Why choose Ignixel", enabled: true, sort_order: 5, content: {
    heading: "A strong digital presence starts with a smart strategy.",
    items: [
      { title: "Strategy Before Execution", description: "We define goals, audience and scope first so every design and build decision has a reason.", icon: "compass" },
      { title: "Design That Drives Action", description: "Interfaces shaped around how people read, decide and act, not just how they look.", icon: "mouse-pointer-click" },
      { title: "Development Built to Scale", description: "Clean architecture and modern tooling that keep sites fast and easy to extend.", icon: "layers" },
      { title: "Technology That Works for You", description: "Platforms and automation chosen for your team and budget, never for novelty.", icon: "cpu" },
      { title: "Clear Communication", description: "Plain-language updates, defined milestones and no surprises.", icon: "message-square" },
      { title: "Long-Term Partnership", description: "Support and improvement after launch, so your site keeps earning its place.", icon: "handshake" },
    ],
  } },
  { id: id("s-process"), key: "process", title: "How we work", enabled: true, sort_order: 6, content: {
    heading: "How We Work", description: "A clear five-stage process from first conversation to continuous improvement.",
    items: [
      { title: "Discover", description: "Understand the business, audience, objectives, and challenges." },
      { title: "Strategize", description: "Develop the project direction, scope, architecture, and execution plan." },
      { title: "Design", description: "Create wireframes, user journeys, and high-fidelity UI designs." },
      { title: "Develop", description: "Build, integrate, optimize, and test the solution." },
      { title: "Launch & Grow", description: "Deploy, hand over, support, and continuously improve the product." },
    ],
  } },
  { id: id("s-stack"), key: "stack", title: "Technology stack", enabled: true, sort_order: 8, content: {
    heading: "Powered by the Right Technology. Built for What's Next.",
    description: "We combine modern frameworks, reliable platforms, and powerful integrations to deliver digital products that perform.",
  } },
  { id: id("s-industries"), key: "industries", title: "Industries", enabled: true, sort_order: 9, content: {
    heading: "Industries We Serve", description: "Sector context shapes good digital decisions. These are the environments we work in most.",
    items: [
      { name: "Healthcare", image: photo("healthcare", 900, 900), description: "Clear, accessible patient and provider experiences.", href: "/services/web-design", tone: "#0e7490" },
      { name: "SaaS & Technology", image: photo("saas", 900, 900), description: "Product sites, web apps and dashboards built to scale.", href: "/services/web-development", tone: "#010BCC" },
      { name: "Professional Services", image: photo("services", 900, 900), description: "Authority-building sites that generate qualified enquiries.", href: "/solutions/website-doesnt-drive-leads", tone: "#334155" },
      { name: "Real Estate", image: photo("realestate", 900, 900), description: "Listings, search and lead capture that feel effortless.", href: "/services/web-development", tone: "#9a3412" },
      { name: "eCommerce & Retail", image: photo("retail", 900, 900), description: "Stores designed around browsing, trust and checkout.", href: "/services/ecommerce-applications", tone: "#be185d" },
      { name: "Logistics", image: photo("logistics", 900, 900), description: "Portals and tracking tools that simplify operations.", href: "/services/web-development", tone: "#0f766e" },
      { name: "Education", image: photo("education", 900, 900), description: "Learning platforms and institutional sites people can navigate.", href: "/services/web-design", tone: "#6d28d9" },
      { name: "Finance", image: photo("finance", 900, 900), description: "Credible, secure digital experiences for regulated environments.", href: "/services/web-development", tone: "#1e3a8a" },
      { name: "Hospitality", image: photo("hospitality", 900, 900), description: "Booking-led sites that reflect the guest experience.", href: "/services/web-design", tone: "#b45309" },
      { name: "Manufacturing", image: photo("manufacturing", 900, 900), description: "Catalogues, quoting and B2B portals that support sales.", href: "/services/ai-services", tone: "#475569" },
    ],
  } },
  { id: id("s-testimonials"), key: "testimonials", title: "Testimonials", enabled: true, sort_order: 10, content: { heading: "What Clients Say", description: "Verified client feedback appears here once added in the admin." } },
  { id: id("s-team"), key: "team", title: "Team preview", enabled: true, sort_order: 11, content: { heading: "The People Behind Your Project", description: "Designers, engineers and strategists working as one team.", cta_label: "Meet Our Team" } },
  { id: id("s-blog"), key: "blog", title: "Blog preview", enabled: true, sort_order: 12, content: { heading: "Insights for Growing Businesses", description: "Practical advice on design, development, eCommerce and AI.", cta_label: "View All Articles" } },
  { id: id("s-cta"), key: "cta", title: "Final CTA", enabled: true, sort_order: 13, content: {
    heading: "Let's Build Something That Moves Your Business Forward.", description: "Have an idea, a challenge, or a digital product in mind? Let's discuss what's possible.",
    primary_label: "Start a Project", primary_href: "/contact", secondary_label: "Calculate Project Cost", secondary_href: "/website-cost-calculator",
  } },
];

export const defaultAbout = {
  hero_headline: "Building Digital Experiences That Move Businesses Forward.",
  hero_intro: "Ignixel Studio is a digital agency that designs and builds websites, web applications, eCommerce platforms and AI-powered solutions. We work with ambitious businesses that want their digital presence to establish authority, improve customer experience and support growth. What sets us apart is that strategy, design and engineering sit in one team, so what is promised in a proposal is what is built.",
  brand_note: "Ignixel = Ignite + Pixels. Our name is our approach: we light up every pixel of your digital presence so it does real work for your business.",
  story_heading: "Our Story",
  story: "Add the story of how Ignixel Studio began, what you believe about digital work and how the studio has grown. Edit this text in Admin → About & Legal.",
  mission: "To help ambitious businesses transform ideas into meaningful digital experiences through strategy, design, technology, and innovation.",
  vision: "To become a trusted digital technology partner for businesses building the future.",
  different: [
    { title: "Strategic thinking", description: "Every project starts with the business goal, not a template." },
    { title: "Creative problem-solving", description: "We look for the simplest design that solves the real problem." },
    { title: "Technical expertise", description: "Modern engineering practices behind every interface." },
    { title: "Business-focused execution", description: "Decisions are measured against outcomes that matter to you." },
    { title: "Transparent collaboration", description: "You see progress, trade-offs and costs as they happen." },
    { title: "Long-term support", description: "We stay available after launch as your needs evolve." },
  ],
  values: [
    { title: "Creativity", description: "Original thinking applied to practical problems.", icon: "lightbulb" },
    { title: "Excellence", description: "Craft and detail in everything we ship.", icon: "award" },
    { title: "Integrity", description: "Honest advice, realistic estimates, clear commitments.", icon: "shield-check" },
    { title: "Innovation", description: "Using new technology where it genuinely helps.", icon: "rocket" },
    { title: "Collaboration", description: "Working as an extension of your team.", icon: "users" },
    { title: "Growth", description: "Building for our clients' future, and our own.", icon: "trending-up" },
  ],
  approach: "We work with clients from first conversation to long after launch: discovery to understand the business, strategy to agree scope and architecture, design to validate the experience, development to build and test it, then support and iteration once it is live.",
};

export const defaultLegal = {
  privacy: `<h2>Overview</h2><p>This is a template Privacy Policy. Replace it with text reviewed by your legal adviser in Admin → About & Legal.</p><h2>Information we collect</h2><p>Details you submit through our forms (name, email, company, project information) and basic analytics data.</p><h2>How we use it</h2><p>To respond to enquiries, provide estimates and improve our website.</p><h2>Your rights</h2><p>Contact us to access, correct or delete your personal data.</p>`,
  terms: `<h2>Overview</h2><p>This is a template Terms &amp; Conditions page. Replace it with text reviewed by your legal adviser in Admin → About & Legal.</p><h2>Use of this website</h2><p>Content is provided for general information and may change without notice.</p><h2>Estimates</h2><p>Calculator results are indicative only and not a binding quotation.</p>`,
};

// ───────── calculator ─────────
type O = [label: string, description: string, price_add: number, multiplier: number, points: number];
export const defaultCalculator: { key: string; title: string; description: string; display_type: "cards" | "image_cards"; options: O[] }[] = [
  { key: "timeline", title: "How soon do you need your website completed?", description: "Shorter timelines require more concentrated resources.", display_type: "cards",
    options: [["Less than 1 month", "Rapid delivery", 0, 1.25, 0], ["1–3 months", "Standard timeline", 0, 1, 0], ["3–6 months", "Comfortable schedule", 0, 1, 0], ["Flexible timeline", "No fixed deadline", 0, 0.97, 0]] },
  { key: "pages", title: "How many pages will your website need?", description: "An approximate count is fine.", display_type: "cards",
    options: [["1–5 pages", "", 0, 1, 1], ["6–10 pages", "", 1500, 1, 2], ["11–20 pages", "", 3500, 1, 3], ["21–50 pages", "", 7000, 1, 5], ["50+ pages", "", 12000, 1, 7], ["Not sure yet", "We will help you scope it", 2500, 1, 2]] },
  { key: "complexity", title: "What level of functionality does your website require?", description: "Choose the closest match.", display_type: "cards",
    options: [["Simple and effective", "Informational pages and contact forms", 0, 1, 1], ["Interactive business website", "CMS, blog, forms and integrations", 2000, 1.1, 3], ["Advanced functionality", "Accounts, bookings, payments or dashboards", 8000, 1.3, 6], ["Custom digital experience", "Bespoke application logic or product features", 18000, 1.5, 9]] },
  { key: "copywriting", title: "Do you need help creating your website content?", description: "Strong copy is a major part of performance.", display_type: "cards",
    options: [["Yes, complete copywriting", "", 2500, 1, 1], ["Yes, some content assistance", "", 1000, 1, 0], ["No, content is ready", "", 0, 1, 0]] },
  { key: "seo", title: "Would you like SEO optimization included?", description: "", display_type: "cards",
    options: [["Basic technical SEO", "", 500, 1, 0], ["Comprehensive SEO setup", "", 2000, 1, 1], ["Ongoing SEO strategy", "", 3500, 1, 2], ["Not required", "", 0, 1, 0]] },
  { key: "languages", title: "Will your website support multiple languages?", description: "", display_type: "cards",
    options: [["One language", "", 0, 1, 0], ["Two languages", "", 1500, 1.1, 1], ["Three or more languages", "", 3500, 1.2, 2], ["Not sure", "", 1000, 1.05, 1]] },
  { key: "dynamic", title: "Does your website need content or functionality that changes based on the visitor?", description: "For example personalisation, gated content or user accounts.", display_type: "cards",
    options: [["No, standard content", "", 0, 1, 0], ["Some personalized content", "", 2000, 1.1, 2], ["Advanced dynamic experiences", "", 6000, 1.25, 4], ["Not sure", "", 1500, 1.05, 1]] },
  { key: "platform", title: "Which platform would you prefer?", description: "Not sure? Choose advice and we will recommend one.", display_type: "image_cards",
    options: [["WordPress", "", 0, 1, 0], ["Webflow", "", 500, 1, 0], ["Shopify", "", 1500, 1.1, 1], ["Framer", "", 0, 0.95, 0], ["Custom Development", "", 5000, 1.3, 4], ["Not Sure / Need Advice", "", 1000, 1.05, 1]] },
];

export const defaultCalcSettings = {
  currency: "USD", currency_symbol: "$",
  welcome_title: "Let's Estimate Your Website Project Cost.",
  welcome_description: "Answer a few simple questions about your project and get an estimated investment range tailored to your requirements.",
  welcome_cta: "Get Started", contact_title: "Where Should We Send Your Estimate?",
  disclaimer: "This estimate is indicative only and subject to a detailed consultation. Final pricing depends on scope, content, integrations and timeline.",
};
