import type { SiteSettings, TeamMember } from "./types";
import { SITE_URL } from "./supabase/env";

export const ORG_ID = `${SITE_URL}/#organization`;
export const SITE_ID = `${SITE_URL}/#website`;

// Topics evidenced by the published portfolio (Webflow, WordPress and Next.js builds). Extend only with verified capabilities.
export const KNOWS_ABOUT = ["Web design", "UI/UX design", "Website development", "Webflow development", "WordPress development", "Custom web application development", "Conversion-focused website design"];

const founderOf = (team: TeamMember[]) => team.filter((m) => /founder/i.test(m.job_title));
export const personId = (m: Pick<TeamMember, "id">) => `${SITE_URL}/about#person-${m.id}`;

/** Organization entity. Only publishes facts present in Admin → Settings; never invents addresses, dates or profiles. */
export function organizationLd(s: SiteSettings, team: TeamMember[]) {
  const sameAs = Object.values(s.socials).filter((u) => /^https?:\/\//.test(u));
  const hq = s.address_locality || s.address_region || s.address_country;
  const founders = founderOf(team);
  return {
    "@context": "https://schema.org", "@type": "Organization", "@id": ORG_ID,
    name: s.site_name, ...(s.legal_name ? { legalName: s.legal_name } : {}), alternateName: "Ignixel", url: SITE_URL,
    logo: { "@type": "ImageObject", url: s.logo_url || `${SITE_URL}/brand/ignixel-mark.svg` },
    description: s.seo_description,
    ...(s.contact_email ? { email: s.contact_email } : {}), ...(s.phone ? { telephone: s.phone } : {}),
    ...(s.founded_year ? { foundingDate: s.founded_year } : {}),
    ...(hq ? { address: { "@type": "PostalAddress", ...(s.address_locality ? { addressLocality: s.address_locality } : {}), ...(s.address_region ? { addressRegion: s.address_region } : {}), ...(s.address_country ? { addressCountry: s.address_country } : {}) } } : {}),
    ...(s.service_countries?.length ? { areaServed: s.service_countries.map((c) => ({ "@type": "Country", name: c })) } : {}),
    knowsAbout: KNOWS_ABOUT,
    ...(founders.length ? { founder: founders.map((m) => ({ "@type": "Person", "@id": personId(m), name: m.full_name, jobTitle: m.job_title })) } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export const websiteLd = (s: SiteSettings) => ({ "@context": "https://schema.org", "@type": "WebSite", "@id": SITE_ID, url: SITE_URL, name: s.site_name, publisher: { "@id": ORG_ID }, inLanguage: "en" });

/** Team members as Person entities (About page). Uses only data entered in the admin. */
export const peopleLd = (team: TeamMember[]) => team.map((m) => ({
  "@context": "https://schema.org", "@type": "Person", "@id": personId(m), name: m.full_name, jobTitle: m.job_title, worksFor: { "@id": ORG_ID },
  ...(m.photo_url ? { image: m.photo_url } : {}), ...(m.bio ? { description: m.bio } : {}),
  ...([m.linkedin_url, m.twitter_url, m.website_url].filter((u) => u && /^https?:\/\//.test(u)).length ? { sameAs: [m.linkedin_url, m.twitter_url, m.website_url].filter((u) => u && /^https?:\/\//.test(u)) } : {}),
}));
