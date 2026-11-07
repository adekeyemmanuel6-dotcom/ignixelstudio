import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/supabase/env";

// Search/answer crawlers and user-triggered fetchers are explicitly allowed so the site can be discovered and cited.
// Training crawlers are allowed by default; to opt out of model training only, move them to the `training` group's disallow list.
// Names follow each vendor's published crawler documentation at the time of writing: re-verify periodically (see docs/seo/05-ai-crawler-accessibility.md).
const PRIVATE = ["/admin", "/api"];
const SEARCH_AND_USER = ["Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Applebot"];
const TRAINING = ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: SEARCH_AND_USER, allow: "/", disallow: PRIVATE },
      { userAgent: TRAINING, allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
