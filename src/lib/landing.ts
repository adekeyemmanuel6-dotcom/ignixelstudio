// SEO landing pages. Every claim here is grounded in the published portfolio (Admin → Projects) and real testimonials.
// Pages exist ONLY where there is portfolio evidence. Not created (no verified work yet): Shopify, WooCommerce, Framer, AI integration,
// and the SaaS, eCommerce, real-estate and logistics industry pages. Add them once you have real projects to show.
import type { CaseStudy } from "./types";

export interface Landing {
  kind: "platform" | "industry"; slug: string; path: string; navLabel: string;
  metaTitle: string; metaDescription: string; eyebrow: string; h1: string; lead: string; serviceType: string;
  intro: string[]; forWho: string[]; buildHeading: string; build: { title: string; description: string }[];
  approach: { title: string; description: string }[];
  match: { tech?: RegExp; industry?: RegExp };
  testimonialCompanies: string[]; faqs: { q: string; a: string }[]; related: string[];
}

export const LANDING_PAGES: Landing[] = [
  {
    kind: "platform", slug: "webflow-development", path: "/services/webflow-development", navLabel: "Webflow Development",
    metaTitle: "Webflow Development Agency", metaDescription: "Ignixel Studio designs and builds Webflow websites with CMS, integrations and conversion-focused UX. See our healthcare and professional-services Webflow projects.",
    eyebrow: "Webflow development", h1: "Webflow Design & Development for Businesses That Need a Clear, Editable Website",
    lead: "We combine UX strategy, interface design and Webflow engineering so your site explains what you do, earns trust and is easy for your team to keep current.",
    serviceType: "Webflow website design and development",
    intro: [
      "Webflow suits businesses that want a design-led website without the maintenance weight of a plugin-heavy stack. We use it when a site needs precise layout control, a flexible CMS and clean, fast pages.",
      "Our Webflow projects so far include a direct primary care practice, a telehealth practice and an immigration and education network. In each case the work started with how visitors decide, then moved into structure, design and build.",
    ],
    forWho: ["Clinics and practices that need patients to understand an offer and enrol or enquire", "Service and consulting businesses with several audiences and a lot to explain", "Teams that want to update content themselves through a CMS"],
    buildHeading: "What a Webflow project with us includes",
    build: [
      { title: "UX strategy and site structure", description: "We map the questions visitors have and organize pages and navigation around the decisions they need to make." },
      { title: "UI design", description: "Brand-aligned interface design for every key template, with responsive behavior designed rather than left to chance." },
      { title: "Webflow build", description: "A structured build using Client-First conventions so the project stays organized and maintainable." },
      { title: "CMS setup", description: "Collections and forms configured so routine content updates do not need a developer." },
      { title: "Third-party integrations", description: "Enrollment and patient-intake platforms, forms and analytics (including Google Tag Manager) connected where the project calls for them." },
      { title: "SEO and conversion review", description: "Structure, metadata and calls to action reviewed against how the site is meant to generate inquiries." },
    ],
    approach: [
      { title: "Understand", description: "We learn the audience, the offer and what the current site is failing to do." },
      { title: "Design", description: "Wireframes and high-fidelity designs reviewed with you before any build starts." },
      { title: "Build and connect", description: "Webflow build, CMS and integrations, tested across devices." },
    ],
    match: { tech: /webflow/i }, testimonialCompanies: ["Richardson Direct Primary Care"], related: ["healthcare", "professional-services"],
    faqs: [
      { q: "Is Webflow the right platform for my business?", a: "Webflow works well for design-led marketing sites with a CMS. WordPress can suit sites that rely on a large plugin ecosystem. We recommend a platform after understanding your content, team and integrations, not before." },
      { q: "Can my team edit the site after launch?", a: "Yes. We set up CMS collections and editing so routine updates, such as new pages, posts and team changes, do not need a developer." },
      { q: "Can you connect third-party tools?", a: "Yes. Our Webflow projects have included a membership enrollment platform, a patient intake platform and Google Tag Manager. We confirm feasibility for your tools during scoping." },
      { q: "How much does a Webflow website cost?", a: "It depends on the number of pages, the CMS structure and the integrations. Our website cost calculator gives an indicative range, and a short conversation gives a firm one." },
      { q: "Can you move my existing site to Webflow?", a: "Yes. We handle website migration, including restructuring content and keeping search-relevant URLs and redirects where needed." },
    ],
  },
  {
    kind: "platform", slug: "wordpress-development", path: "/services/wordpress-development", navLabel: "WordPress Development",
    metaTitle: "WordPress Development Agency", metaDescription: "Ignixel Studio designs and develops WordPress websites, including custom plugins and booking integrations, built around conversion. See our WordPress projects.",
    eyebrow: "WordPress development", h1: "WordPress Design & Development Built Around Inquiries and Bookings",
    lead: "From conversion-led page design to custom plugin development, we build WordPress sites that do a specific commercial job.",
    serviceType: "WordPress website design and development",
    intro: [
      "WordPress is a strong fit when a site needs a mature ecosystem, flexible content editing or custom functionality that off-the-shelf themes cannot provide.",
      "Our WordPress work includes a vacation-rental management site with a custom booking plugin connected to a property management system, and a restoration and remodeling site designed for people who need help urgently.",
    ],
    forWho: ["Businesses that need custom functionality, such as booking or quoting workflows", "Local and regional service companies that depend on phone calls and form inquiries", "Teams already invested in WordPress who need a redesign or a better build"],
    buildHeading: "What a WordPress project with us includes",
    build: [
      { title: "UX and UI design", description: "Page structure and design focused on the action you want visitors to take." },
      { title: "WordPress build", description: "Theme and page-builder development (we have used Elementor) with clean, consistent components." },
      { title: "Custom plugin development", description: "Purpose-built functionality, for example a booking plugin integrated with a property management system." },
      { title: "Third-party integrations", description: "Property management, analytics and other systems connected, including Google Tag Manager tracking." },
      { title: "Conversion strategy", description: "Calls to action, forms and trust signals placed where people make decisions." },
    ],
    approach: [
      { title: "Scope the job", description: "We define what the site must do, for whom, and what it needs to connect to." },
      { title: "Design and review", description: "Designs agreed before development begins, so build time goes into the right things." },
      { title: "Build and test", description: "Development, integration and testing across devices before launch." },
    ],
    match: { tech: /wordpress/i }, testimonialCompanies: ["Vacation Rental Business"], related: ["hospitality", "professional-services"],
    faqs: [
      { q: "When should I choose WordPress instead of Webflow?", a: "WordPress is often the better fit for custom functionality, a large plugin ecosystem or very flexible content editing. Webflow is often better for design-led sites with a clean CMS. We advise on this during discovery." },
      { q: "Can you build custom WordPress plugins?", a: "Yes. For a vacation-rental client we built a custom booking plugin connected to their property management system." },
      { q: "Can you redesign my existing WordPress site?", a: "Yes. We review what currently works, redesign around your goals, and keep important URLs and content so search visibility is protected." },
      { q: "How much does a WordPress website cost?", a: "It depends on scope, functionality and integrations. Use our website cost calculator for an indicative range, then talk to us for a precise quote." },
    ],
  },
  {
    kind: "industry", slug: "healthcare", path: "/industries/healthcare", navLabel: "Healthcare",
    metaTitle: "Healthcare Website Design & Development", metaDescription: "Website design and development for clinics, direct primary care and telehealth practices, from patient-focused UX to enrollment and intake integrations.",
    eyebrow: "Healthcare", h1: "Healthcare Website Design for Clinics and Telehealth Practices",
    lead: "Patients decide quickly whether a practice feels credible and easy to join. We design and build sites that explain the offer clearly and move people into enrollment or intake.",
    serviceType: "Website design and development for healthcare practices",
    intro: [
      "Healthcare websites carry two jobs at once: they must reassure a cautious visitor and they must make the next step simple. We have built sites for a direct primary care practice and a physician-owned telehealth practice.",
      "Both projects began with the patient's questions: what is included, what does it cost, how do I start. The site structure, copy and design follow from those answers.",
    ],
    forWho: ["Direct primary care and membership practices", "Telehealth and virtual-care providers", "Independent clinics that want more patient inquiries from their website"],
    buildHeading: "What we build for healthcare practices",
    build: [
      { title: "Clear explanations of services and membership", description: "Pages that answer what is included, who it is for and how to begin, without jargon." },
      { title: "Enrollment and intake journeys", description: "Websites connected to enrollment and patient-intake platforms so the path from interest to sign-up is short." },
      { title: "Trust and credibility", description: "Provider information, patient-focused language and clear contact options placed where hesitation happens." },
      { title: "Compliance and policy pages", description: "Structured, easy-to-find policy and disclosure pages that your own advisers can review." },
      { title: "Measurement", description: "Google Tag Manager set up so you can see which pages and calls to action produce inquiries." },
    ],
    approach: [
      { title: "Map the patient journey", description: "From first search to enrollment, we identify what patients need to know at each step." },
      { title: "Design for clarity", description: "Layouts and content that make services, pricing and next steps obvious." },
      { title: "Build, connect, measure", description: "Development, platform integrations and tracking, tested before launch." },
    ],
    match: { industry: /health|telehealth|medical/i }, testimonialCompanies: ["Richardson Direct Primary Care"], related: ["webflow-development"],
    faqs: [
      { q: "Do you build HIPAA-compliant websites?", a: "We build the website and integrate it with the intake, membership or records platforms you choose. Compliance obligations depend on how patient information is collected and stored. In our telehealth work, intake runs on an external patient-intake platform. We recommend confirming requirements with your own compliance adviser; we do not provide legal advice." },
      { q: "Do you work with direct primary care and telehealth practices?", a: "Yes. Our healthcare portfolio includes a direct primary care practice in North Carolina and a physician-owned telehealth practice serving patients across the US." },
      { q: "Can the website connect to our enrollment or intake system?", a: "Often, yes. We have integrated membership enrollment and patient-intake platforms. We confirm what is possible with your specific systems during scoping." },
      { q: "How long does a healthcare website take to build?", a: "It depends on the number of pages, integrations and content readiness. We agree a timeline in your proposal after scoping." },
    ],
  },
  {
    kind: "industry", slug: "hospitality", path: "/industries/hospitality", navLabel: "Hospitality & Vacation Rentals",
    metaTitle: "Hospitality & Vacation Rental Websites", metaDescription: "Direct-booking website design and development for holiday-home and vacation-rental businesses, including property-management integrations and multilingual builds.",
    eyebrow: "Hospitality", h1: "Hospitality and Vacation-Rental Websites That Win Direct Bookings",
    lead: "Listing platforms reduce every property to a photo grid and a price. We build brand-led websites that tell the story of a stay and connect directly to your booking systems.",
    serviceType: "Website design and development for hospitality and vacation-rental businesses",
    intro: [
      "Direct bookings protect margin and relationships, but only if the website feels at least as trustworthy as the marketplaces guests already use.",
      "We have built a bilingual direct-booking site for a luxury holiday-home operator in the UAE and a WordPress site with a custom booking plugin for a vacation-rental manager in British Columbia.",
    ],
    forWho: ["Holiday-home and vacation-rental operators", "Property managers who want more direct bookings", "Hospitality brands with a story that listing sites cannot tell"],
    buildHeading: "What we build for hospitality businesses",
    build: [
      { title: "Brand-led property presentation", description: "Pages that lead with the story and character of each property, then the specifications." },
      { title: "Booking and PMS integrations", description: "Websites connected to property management systems such as Guesty for availability and rates." },
      { title: "Payments", description: "Payment gateway integration appropriate to your market, for example PayTabs in the UAE." },
      { title: "Multilingual builds", description: "Right-to-left and bilingual layouts, including Arabic localization." },
      { title: "Content your team can manage", description: "A CMS (Sanity or WordPress, depending on the project) so new properties and copy can be published without developers." },
    ],
    approach: [
      { title: "Define the booking journey", description: "How guests discover, compare and book, and which systems must stay in sync." },
      { title: "Design the experience", description: "A design language that reflects the brand rather than a generic template." },
      { title: "Integrate and launch", description: "Booking, payment and content systems connected and tested end to end." },
    ],
    match: { industry: /hospitality|property|rental/i }, testimonialCompanies: ["Vacation Rental Business"], related: ["wordpress-development"],
    faqs: [
      { q: "Can you integrate with Guesty?", a: "Yes. We have connected Guesty to both a Next.js and a WordPress website. We confirm exact capabilities for your account during scoping." },
      { q: "Can the website take payments directly?", a: "Yes, with a gateway suited to your market. Our UAE booking site uses PayTabs." },
      { q: "Do you build multilingual or Arabic websites?", a: "Yes. Our UAE holiday-homes project is bilingual with Arabic localization and right-to-left layouts." },
      { q: "Do you build on WordPress or custom code for rental websites?", a: "Both. We chose WordPress with a custom booking plugin for one client and Next.js with a headless CMS for another. The right choice depends on your needs and team." },
    ],
  },
  {
    kind: "industry", slug: "professional-services", path: "/industries/professional-services", navLabel: "Professional & Local Services",
    metaTitle: "Professional & Service Business Websites", metaDescription: "Website design for consultancies, immigration and education advisers and local service businesses, built to explain complex offers and generate inquiries.",
    eyebrow: "Professional services", h1: "Websites for Professional and Local Service Businesses That Need More Inquiries",
    lead: "When the decision is complex or urgent, the website has to guide people to the right next step quickly. We design for that moment.",
    serviceType: "Website design and development for professional and local service businesses",
    intro: [
      "Advisory and service businesses often have a lot to explain and visitors who are anxious or short of time. A clear path through the site matters more than visual flourish.",
      "We have built a Webflow site that guides people through study, work and settlement options for an immigration and education network, and a WordPress site for a restoration company designed around the moment someone needs help.",
    ],
    forWho: ["Consultancies and advisory firms with complex offers", "Immigration, education and similar guidance services", "Local service companies that depend on calls and forms"],
    buildHeading: "What we build for professional and service businesses",
    build: [
      { title: "Guided journeys", description: "Structures that help visitors find the right service or pathway without reading everything." },
      { title: "Conversion-focused pages", description: "Clear calls to action, click-to-call and short forms placed where urgency is highest." },
      { title: "CMS for ongoing content", description: "Content structures for programmes, services and guides that grow over time." },
      { title: "Lead tracking", description: "Analytics set up to show which pages produce inquiries." },
    ],
    approach: [
      { title: "Understand the decision", description: "What visitors worry about, what they compare, and what makes them act." },
      { title: "Design the path", description: "Page structures and content that lead to the enquiry." },
      { title: "Build and measure", description: "Development, integrations and tracking so results are visible." },
    ],
    match: { industry: /immigration|professional|home services|consult/i }, testimonialCompanies: ["Consulting Company"], related: ["webflow-development", "wordpress-development"],
    faqs: [
      { q: "Can you build a website that explains a complex service?", a: "Yes. Our work for an immigration and education network turns a complex decision into a guided path, using clear structure and a CMS for ongoing programme content." },
      { q: "Do you design for local lead generation?", a: "Yes. Our work for a Dallas-Fort Worth restoration company was designed around calls and form inquiries from people who need help quickly." },
      { q: "Which platform will you use?", a: "We have built professional-services sites on both Webflow and WordPress. We recommend one after learning how your team will manage the content." },
    ],
  },
];

export const landingBySlug = (slug: string, kind?: Landing["kind"]) => LANDING_PAGES.find((p) => p.slug === slug && (!kind || p.kind === kind));
export const matchProjects = (l: Landing, cases: CaseStudy[]) => cases.filter((c) => {
  const tech = [...(c.technologies ?? []), ...(c.services ?? [])].join(" "); const ind = c.industry ?? "";
  return (l.match.tech && l.match.tech.test(tech)) || (l.match.industry && l.match.industry.test(ind));
});
export const relatedLandings = (c: CaseStudy) => LANDING_PAGES.filter((l) => matchProjects(l, [c]).length > 0);
/** Homepage industry tile name → industry page, only where a page exists. */
export const INDUSTRY_PATH: Record<string, string> = { Healthcare: "/industries/healthcare", Hospitality: "/industries/hospitality", "Professional Services": "/industries/professional-services" };
export const SUBSERVICE_PATH: Record<string, string> = { "webflow-website-design": "/services/webflow-development", "wordpress-website-design": "/services/wordpress-development" };
