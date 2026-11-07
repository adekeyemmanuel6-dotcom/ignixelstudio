import type { Field } from "@/components/admin/FormFields";
import { TECH_CATEGORIES } from "@/lib/defaults";

export interface Resource {
  key: string; table: string; title: string; singular: string; description: string;
  fields: Field[]; columns: { name: string; label: string; kind?: "image" | "bool" | "list" | "date" }[];
  order: { column: string; ascending?: boolean }; reorder?: boolean; toggle?: string; defaults: Record<string, any>; readOnly?: boolean; search?: string[]; csv?: boolean;
}

const seo: Field[] = [
  { name: "seo_title", label: "SEO title", type: "text", help: "Shown in search results (≈60 characters)." },
  { name: "seo_description", label: "Meta description", type: "textarea", rows: 3, help: "≈155 characters." },
];
const stepShape: Field[] = [{ name: "title", label: "Title", type: "text" }, { name: "description", label: "Description", type: "textarea", rows: 2 }];

export const RESOURCES: Record<string, Resource> = {
  "service-categories": {
    key: "service-categories", table: "service_categories", title: "Service Categories", singular: "category", reorder: true, toggle: "published",
    description: "Main service pages (Web Design, Web Development, eCommerce, AI). Each has its own page at /services/<slug>.",
    order: { column: "sort_order" }, search: ["title"], columns: [{ name: "image_url", label: "", kind: "image" }, { name: "title", label: "Title" }, { name: "slug", label: "URL" }],
    defaults: { title: "", slug: "", icon: "sparkles", faqs: [], process: [], capabilities: [], technology_slugs: [], published: true, sort_order: 99, cta_label: "Start a Project" },
    fields: [
      { name: "title", label: "Title", type: "text", required: true }, { name: "slug", label: "URL slug", type: "slug", slugFrom: "title" },
      { name: "short_description", label: "Short description (cards)", type: "textarea", rows: 2 },
      { name: "hero_headline", label: "Hero headline", type: "text", full: true }, { name: "hero_description", label: "Hero description", type: "textarea", rows: 3 },
      { name: "icon", label: "Icon", type: "select", options: ["palette", "code", "shopping-bag", "sparkles", "compass", "layers", "cpu", "rocket"] }, { name: "cta_label", label: "Hero button label", type: "text" },
      { name: "image_url", label: "Card image", type: "image", folder: "services" },
      { name: "capabilities", label: "Capability", type: "repeater", shape: stepShape },
      { name: "process", label: "Process step", type: "repeater", shape: stepShape },
      { name: "faqs", label: "FAQ", type: "repeater", shape: [{ name: "q", label: "Question", type: "text" }, { name: "a", label: "Answer", type: "textarea", rows: 3 }] },
      { name: "technology_slugs", label: "Technology slugs shown on this page", type: "list", help: "Slugs from Technologies (e.g. react, nextjs). Only visible technologies are displayed." },
      ...seo, { name: "published", label: "Published", type: "bool" },
    ],
  },
  services: {
    key: "services", table: "services", title: "Services", singular: "service", reorder: true, toggle: "published",
    description: "Sub-services listed on each category page, with detailed descriptions.",
    order: { column: "sort_order" }, search: ["title"], columns: [{ name: "title", label: "Service" }, { name: "slug", label: "Anchor" }],
    defaults: { title: "", slug: "", category_id: null, published: true, sort_order: 99 },
    fields: [
      { name: "title", label: "Title", type: "text", required: true }, { name: "slug", label: "Slug", type: "slug", slugFrom: "title" },
      { name: "category_id", label: "Category", type: "relation", rel: { table: "service_categories", label: "title" } },
      { name: "description", label: "Card description", type: "textarea", rows: 2 }, { name: "details", label: "What it includes", type: "textarea" },
      { name: "who_for", label: "Who it's for", type: "textarea", rows: 2 }, { name: "problems_solved", label: "Problems it solves", type: "textarea", rows: 2 },
      { name: "image_url", label: "Image", type: "image", folder: "services" }, ...seo, { name: "published", label: "Published", type: "bool" },
    ],
  },
  projects: {
    key: "projects", table: "case_studies", title: "Projects / Case Studies", singular: "project", reorder: true, toggle: "published",
    description: "Portfolio projects. Placeholder entries are clearly marked until you replace them with real work.",
    order: { column: "sort_order" }, search: ["title", "client_name"], columns: [{ name: "featured_image", label: "", kind: "image" }, { name: "title", label: "Project" }, { name: "client_name", label: "Client" }, { name: "featured", label: "Featured", kind: "bool" }, { name: "is_placeholder", label: "Placeholder", kind: "bool" }],
    defaults: { title: "", slug: "", services: [], technologies: [], results: [], featured: false, published: false, is_placeholder: false, sort_order: 99 },
    fields: [
      { name: "title", label: "Project name", type: "text", required: true }, { name: "slug", label: "URL slug", type: "slug", slugFrom: "title" },
      { name: "client_name", label: "Client name", type: "text" }, { name: "industry", label: "Industry", type: "text" },
      { name: "services", label: "Services delivered", type: "list" }, { name: "technologies", label: "Technologies used", type: "list" },
      { name: "description", label: "Short description", type: "textarea" }, { name: "challenge", label: "Challenge", type: "richtext", help: "Use the toolbar for bold, italic, bullet lists and paragraphs." }, { name: "solution", label: "Solution", type: "richtext", help: "Use the toolbar for bold, italic, bullet lists and paragraphs." },
      { name: "results", label: "Result", type: "repeater", shape: [{ name: "value", label: "Value (e.g. +42%)", type: "text" }, { name: "label", label: "Label", type: "text" }] },
      { name: "featured_image", label: "Featured image", type: "image", folder: "projects" }, { name: "desktop_image", label: "Desktop mockup image", type: "image", folder: "projects" },
      { name: "mobile_image", label: "Mobile mockup image", type: "image", folder: "projects" }, { name: "website_url", label: "Live website URL", type: "text" },
      ...seo, { name: "featured", label: "Featured on homepage", type: "bool" }, { name: "is_placeholder", label: "This is placeholder content", type: "bool" }, { name: "published", label: "Published", type: "bool" },
    ],
  },
  team: {
    key: "team", table: "team_members", title: "Team", singular: "team member", reorder: true, toggle: "active",
    description: "Everyone shown on the About page and homepage. Upload portraits to Supabase Storage.",
    order: { column: "sort_order" }, search: ["full_name", "job_title"], columns: [{ name: "photo_url", label: "", kind: "image" }, { name: "full_name", label: "Name" }, { name: "job_title", label: "Title" }, { name: "category", label: "Team" }],
    defaults: { full_name: "", job_title: "", category: "Leadership", active: true, sort_order: 99 },
    fields: [
      { name: "full_name", label: "Full name", type: "text", required: true }, { name: "job_title", label: "Job title", type: "text", required: true },
      { name: "category", label: "Team category", type: "select", options: ["Leadership", "Design", "Development", "Marketing", "Operations"] },
      { name: "photo_url", label: "Profile photo", type: "image", folder: "team" }, { name: "bio", label: "Short biography", type: "textarea" },
      { name: "linkedin_url", label: "LinkedIn URL", type: "text" }, { name: "twitter_url", label: "X / Twitter URL", type: "text" }, { name: "website_url", label: "Website / other link", type: "text" },
      { name: "active", label: "Active (shown on website)", type: "bool" },
    ],
  },
  testimonials: {
    key: "testimonials", table: "testimonials", title: "Testimonials", singular: "testimonial", reorder: true, toggle: "published",
    description: "Only add verified client quotes. Placeholders are flagged so they can be replaced.",
    order: { column: "sort_order" }, search: ["client_name", "company"], columns: [{ name: "photo_url", label: "", kind: "image" }, { name: "client_name", label: "Client" }, { name: "company", label: "Company" }, { name: "featured", label: "Featured", kind: "bool" }, { name: "is_placeholder", label: "Placeholder", kind: "bool" }],
    defaults: { client_name: "", quote: "", featured: true, published: true, is_placeholder: false, sort_order: 99 },
    fields: [
      { name: "client_name", label: "Client name", type: "text", required: true }, { name: "company", label: "Company", type: "text" }, { name: "position", label: "Position", type: "text" },
      { name: "project_ref", label: "Project reference (optional)", type: "text" }, { name: "photo_url", label: "Client photo", type: "image", folder: "testimonials" },
      { name: "quote", label: "Testimonial", type: "textarea", required: true }, { name: "featured", label: "Featured on homepage", type: "bool" },
      { name: "is_placeholder", label: "This is placeholder content", type: "bool" }, { name: "published", label: "Published", type: "bool" },
    ],
  },
  technologies: {
    key: "technologies", table: "technologies", title: "Technologies", singular: "technology", reorder: true, toggle: "visible",
    description: "Controls the technology grids across the site. Hide anything you don't want to claim.",
    order: { column: "sort_order" }, search: ["name", "category"], columns: [{ name: "name", label: "Technology" }, { name: "category", label: "Category" }, { name: "slug", label: "Slug" }],
    defaults: { name: "", slug: "", category: TECH_CATEGORIES[0], visible: true, sort_order: 99 },
    fields: [
      { name: "name", label: "Name", type: "text", required: true }, { name: "slug", label: "Slug", type: "slug", slugFrom: "name" },
      { name: "category", label: "Category", type: "select", options: TECH_CATEGORIES },
      { name: "icon_slug", label: "Brand icon slug", type: "text", help: "Slug from simpleicons.org (e.g. react). Leave empty and upload a logo instead if unavailable." },
      { name: "color", label: "Brand colour (hex, no #)", type: "text" }, { name: "logo_url", label: "Uploaded logo (overrides icon)", type: "image", folder: "logos" },
      { name: "visible", label: "Visible on website", type: "bool" },
    ],
  },
  "blog-categories": {
    key: "blog-categories", table: "blog_categories", title: "Blog Categories", singular: "category", description: "Categories used to filter blog articles.",
    order: { column: "name" }, search: ["name"], columns: [{ name: "name", label: "Name" }, { name: "slug", label: "Slug" }], defaults: { name: "", slug: "" },
    fields: [{ name: "name", label: "Name", type: "text", required: true }, { name: "slug", label: "Slug", type: "slug", slugFrom: "name" }],
  },
  "blog-tags": {
    key: "blog-tags", table: "blog_tags", title: "Blog Tags", singular: "tag", description: "Tags attached to blog articles.",
    order: { column: "name" }, search: ["name"], columns: [{ name: "name", label: "Name" }, { name: "slug", label: "Slug" }], defaults: { name: "", slug: "" },
    fields: [{ name: "name", label: "Name", type: "text", required: true }, { name: "slug", label: "Slug", type: "slug", slugFrom: "name" }],
  },
  newsletter: {
    key: "newsletter", table: "newsletter_subscribers", title: "Newsletter Subscribers", singular: "subscriber", description: "Email addresses collected from the website. Export for your email tool.",
    order: { column: "created_at", ascending: false }, search: ["email"], csv: true, readOnly: true, columns: [{ name: "email", label: "Email" }, { name: "created_at", label: "Subscribed", kind: "date" }], defaults: {}, fields: [],
  },
};

// ───────── homepage section content schemas ─────────
const cta = (p = ""): Field[] => [{ name: `${p}primary_label`, label: "Primary button label", type: "text" }, { name: `${p}primary_href`, label: "Primary button link", type: "text" }, { name: `${p}secondary_label`, label: "Secondary button label", type: "text" }, { name: `${p}secondary_href`, label: "Secondary button link", type: "text" }];
export const SECTION_SCHEMAS: Record<string, Field[]> = {
  hero: [{ name: "label", label: "Intro label", type: "text" }, { name: "headline", label: "Headline", type: "text", full: true }, { name: "description", label: "Supporting paragraph", type: "textarea" }, ...cta(), { name: "trust", label: "Credibility statement", type: "text", full: true }],
  trusted: [{ name: "heading", label: "Strip heading", type: "text", full: true }],
  services: [{ name: "heading", label: "Heading", type: "text", full: true }, { name: "description", label: "Description", type: "textarea", rows: 2 }],
  solutions: [{ name: "heading", label: "Heading", type: "text", full: true }, { name: "description", label: "Description", type: "textarea", rows: 2 },
    { name: "items", label: "Problem", type: "repeater", shape: [{ name: "slug", label: "URL slug", type: "text" }, { name: "problem", label: "Problem (customer's words)", type: "text" }, { name: "cta", label: "Button label", type: "text" }, { name: "summary", label: "Summary", type: "textarea", rows: 2 }, { name: "issues", label: "Possible causes", type: "list" }, { name: "approach", label: "Our approach", type: "textarea", rows: 3 }] }],
  projects: [{ name: "heading", label: "Heading", type: "text", full: true }, { name: "description", label: "Description", type: "textarea", rows: 2 }, { name: "cta_label", label: "Button label", type: "text" }],
  why: [{ name: "heading", label: "Heading", type: "text", full: true }, { name: "items", label: "Benefit", type: "repeater", shape: [{ name: "title", label: "Title", type: "text" }, { name: "icon", label: "Icon", type: "select", options: ["compass", "mouse-pointer-click", "layers", "cpu", "message-square", "handshake", "lightbulb", "award", "shield-check", "rocket", "users", "trending-up"] }, { name: "description", label: "Description", type: "textarea", rows: 2 }] }],
  process: [{ name: "heading", label: "Heading", type: "text" }, { name: "description", label: "Description", type: "textarea", rows: 2 }, { name: "items", label: "Stage", type: "repeater", shape: stepShape }],
  stack: [{ name: "heading", label: "Heading", type: "text", full: true }, { name: "description", label: "Description", type: "textarea", rows: 2 }],
  industries: [{ name: "heading", label: "Heading", type: "text" }, { name: "description", label: "Description", type: "textarea", rows: 2 }, { name: "items", label: "Industry", type: "repeater", shape: [{ name: "name", label: "Name", type: "text" }, { name: "description", label: "Description", type: "text" }, { name: "href", label: "Link", type: "text" }, { name: "tone", label: "Card colour", type: "color" }] }],
  testimonials: [{ name: "heading", label: "Heading", type: "text" }, { name: "description", label: "Description", type: "textarea", rows: 2 }],
  team: [{ name: "heading", label: "Heading", type: "text" }, { name: "description", label: "Description", type: "textarea", rows: 2 }, { name: "cta_label", label: "Button label", type: "text" }],
  blog: [{ name: "heading", label: "Heading", type: "text" }, { name: "description", label: "Description", type: "textarea", rows: 2 }, { name: "cta_label", label: "Button label", type: "text" }],
  cta: [{ name: "heading", label: "Heading", type: "text", full: true }, { name: "description", label: "Description", type: "textarea", rows: 2 }, ...cta()],
};

export const SETTINGS_FIELDS: Field[] = [
  { name: "site_name", label: "Website name", type: "text" }, { name: "tagline", label: "Tagline", type: "text" },
  { name: "logo_url", label: "Logo (use the official Ignixel logo)", type: "image", folder: "brand", help: "Images are automatically resized and converted to WebP on upload." }, { name: "favicon_url", label: "Favicon (square)", type: "image", folder: "brand", help: "Re-upload a square image to replace the current large favicon file." },
  { name: "contact_email", label: "Contact email", type: "text" }, { name: "phone", label: "Phone number", type: "text" }, { name: "address", label: "Address", type: "text", full: true },
  { name: "footer_description", label: "Footer description", type: "textarea", rows: 3 }, { name: "copyright", label: "Copyright text", type: "text", help: "Year is added automatically." },
  { name: "seo_title", label: "Default SEO title", type: "text", full: true }, { name: "seo_description", label: "Default meta description", type: "textarea", rows: 3 }, { name: "og_image", label: "Default Open Graph image", type: "image", folder: "brand" },
  { name: "ga_id", label: "Google Analytics ID", type: "text", placeholder: "G-XXXXXXXXXX" }, { name: "meta_pixel_id", label: "Meta Pixel ID", type: "text", placeholder: "1234567890" },
  { name: "legal_name", label: "Legal company name (for structured data)", type: "text", help: "Only if different from the website name." },
  { name: "founded_year", label: "Year founded", type: "text", help: "Leave empty unless verified. Published in structured data." },
  { name: "address_locality", label: "Headquarters city", type: "text", help: "Publishes your real HQ in structured data. Leave empty if you do not want it published." }, { name: "address_region", label: "Headquarters state / region", type: "text" },
  { name: "address_country", label: "Headquarters country (2-letter code, e.g. US)", type: "text" },
  { name: "service_countries", label: "Countries you genuinely serve", type: "list", help: "One per line, e.g. United States. Published as service area. Only list countries you actually serve." },
  { name: "google_site_verification", label: "Google Search Console verification code", type: "text", help: "The content value from the HTML-tag method." }, { name: "bing_site_verification", label: "Bing Webmaster verification code", type: "text" },
  { name: "socials.linkedin", label: "LinkedIn URL", type: "text" }, { name: "socials.x", label: "X / Twitter URL", type: "text" }, { name: "socials.instagram", label: "Instagram URL", type: "text" },
  { name: "socials.github", label: "GitHub URL", type: "text" }, { name: "socials.dribbble", label: "Dribbble URL", type: "text" }, { name: "socials.facebook", label: "Facebook URL", type: "text" },
];

export const ABOUT_FIELDS: Field[] = [
  { name: "hero_headline", label: "Hero headline", type: "text", full: true }, { name: "hero_intro", label: "Hero introduction", type: "textarea", rows: 5 },
  { name: "story_heading", label: "Story heading", type: "text" }, { name: "story", label: "Our story", type: "textarea", rows: 8, help: "Use real history only. Blank lines create paragraphs." },
  { name: "mission", label: "Mission", type: "textarea", rows: 3 }, { name: "vision", label: "Vision", type: "textarea", rows: 3 },
  { name: "different", label: "Differentiator", type: "repeater", shape: stepShape },
  { name: "values", label: "Value", type: "repeater", shape: [...stepShape, { name: "icon", label: "Icon", type: "select", options: ["lightbulb", "award", "shield-check", "rocket", "users", "trending-up", "compass", "handshake"] }] },
  { name: "approach", label: "Our approach", type: "textarea", rows: 5 },
  { name: "faqs", label: "FAQ (answers shown on About and used for search/AI answers: keep them factual)", type: "repeater", shape: [{ name: "q", label: "Question", type: "text" }, { name: "a", label: "Answer", type: "textarea", rows: 3 }] },
];
