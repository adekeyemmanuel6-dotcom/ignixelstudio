export type FAQ = { q: string; a: string };
export type Step = { title: string; description: string };
export type Result = { label: string; value: string };

export interface ServiceCategory {
  id: string; slug: string; title: string; short_description: string | null; hero_headline: string | null;
  hero_description: string | null; image_url: string | null; icon: string | null; cta_label: string | null;
  faqs: FAQ[]; process: Step[]; capabilities: Step[]; technology_slugs: string[];
  seo_title: string | null; seo_description: string | null; sort_order: number; published: boolean;
}
export interface Service {
  id: string; category_id: string; slug: string; title: string; description: string | null; details: string | null;
  who_for: string | null; problems_solved: string | null; image_url: string | null;
  seo_title: string | null; seo_description: string | null; sort_order: number; published: boolean;
}
export interface CaseStudy {
  id: string; slug: string; title: string; client_name: string | null; industry: string | null; services: string[];
  description: string | null; challenge: string | null; solution: string | null; featured_image: string | null;
  desktop_image: string | null; mobile_image: string | null; technologies: string[]; results: Result[];
  website_url: string | null; featured: boolean; published: boolean; is_placeholder: boolean;
  seo_title: string | null; seo_description: string | null; sort_order: number;
}
export interface TeamMember {
  id: string; full_name: string; job_title: string; bio: string | null; photo_url: string | null;
  linkedin_url: string | null; twitter_url: string | null; website_url: string | null;
  category: "Leadership" | "Design" | "Development" | "Marketing" | "Operations"; sort_order: number; active: boolean;
}
export interface Testimonial {
  id: string; client_name: string; company: string | null; position: string | null; quote: string;
  photo_url: string | null; project_ref: string | null; featured: boolean; published: boolean;
  is_placeholder: boolean; sort_order: number;
}
export interface Technology {
  id: string; name: string; slug: string; category: string; icon_slug: string | null; logo_url: string | null;
  color: string | null; sort_order: number; visible: boolean;
}
export interface BlogCategory { id: string; name: string; slug: string }
export interface BlogPost {
  id: string; slug: string; title: string; excerpt: string | null; content: string; featured_image: string | null;
  category_id: string | null; status: "draft" | "published" | "scheduled"; published_at: string | null;
  author_name: string | null; author_title: string | null; author_image: string | null; reading_time: number;
  seo_title: string | null; seo_description: string | null; og_image: string | null;
  category?: BlogCategory | null; tags?: { id: string; name: string; slug: string }[];
}
export interface HomepageSection { id: string; key: string; title: string; enabled: boolean; sort_order: number; content: Record<string, any> }
export interface CalcQuestion {
  id: string; key: string; title: string; description: string | null; display_type: "cards" | "image_cards";
  enabled: boolean; sort_order: number; options: CalcOption[];
}
export interface CalcOption { id: string; question_id: string; label: string; description: string | null; image_url: string | null; sort_order: number }
export interface CalcSettings {
  currency: string; currency_symbol: string; welcome_title: string; welcome_description: string; welcome_cta: string;
  contact_title: string; disclaimer: string;
}
export interface SiteSettings {
  site_name: string; tagline: string; logo_url: string; favicon_url: string; contact_email: string; phone: string;
  address: string; footer_description: string; copyright: string; seo_title: string; seo_description: string;
  og_image: string; ga_id: string; meta_pixel_id: string; brand_primary: string;
  socials: { linkedin: string; x: string; instagram: string; github: string; dribbble: string; facebook: string };
  content_seeded: boolean; content_version?: number;
}
