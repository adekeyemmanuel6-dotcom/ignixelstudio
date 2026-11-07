# AI & Search Crawler Accessibility

## What the site serves now (verified in the production build)
`/robots.txt` allows every crawler below to fetch public pages and blocks only `/admin` and `/api`. The sitemap is declared. No page carries a `noindex`. See `src/app/robots.ts`.

| Crawler (user-agent) | Operator | Purpose | Rule now |
|---|---|---|---|
| Googlebot | Google | Search indexing (also what AI Overviews / AI Mode draw on) | Allow |
| Bingbot | Microsoft | Bing index (feeds Copilot and several AI products) | Allow |
| OAI-SearchBot | OpenAI | Inclusion in ChatGPT search results | **Allow** |
| ChatGPT-User | OpenAI | Fetches a page when a ChatGPT user asks it to | Allow |
| GPTBot | OpenAI | Collects content that may be used to train models; **separate from search inclusion** | Allow (your choice, see below) |
| Claude-SearchBot / Claude-User | Anthropic | Search quality and user-requested fetches | Allow |
| ClaudeBot | Anthropic | Model-training crawler | Allow (your choice) |
| PerplexityBot / Perplexity-User | Perplexity | Perplexity search index / user-requested fetches | Allow |
| Google-Extended | Google | Controls use for Gemini training/grounding; does not affect Search ranking | Allow (your choice) |
| Applebot / Applebot-Extended | Apple | Apple search / Apple AI training control | Allow |

> **Verify before relying on this table.** Crawler names and behaviour were written from the vendors' documentation as known at the time and could not be re-fetched from this environment. Before launch, confirm each name and purpose against the current official pages: OpenAI (platform.openai.com/docs/bots), Anthropic (support.anthropic.com, "Does Anthropic crawl data from the web"), Perplexity (docs.perplexity.ai/guides/bots), Google (developers.google.com/search/docs/crawling-indexing/overview-google-crawlers), Bing (bing.com/webmasters), Apple (support.apple.com, "About Applebot"). Do not add user-agents that are not in those documents.

## Decision for you: training crawlers
Search/answer discovery and model training are separate switches. Today everything is allowed because the goal is maximum discoverability. If you prefer to stay out of model training but remain in AI search, move `GPTBot`, `ClaudeBot`, `Google-Extended` and `Applebot-Extended` into a `disallow: "/"` rule in `src/app/robots.ts` (the `TRAINING` group). Blocking `GPTBot` does **not** remove the site from ChatGPT search; that is governed by `OAI-SearchBot`.

## Things that can block crawlers even when robots.txt allows them (check on the live host)
1. **Vercel Firewall / Attack Challenge Mode / bot protection**: ensure verified search bots are not challenged.
2. **Cloudflare or another CDN in front of Vercel**: "Block AI bots" or "Bot Fight Mode" toggles can silently block OAI-SearchBot, Claude-SearchBot, PerplexityBot.
3. **Vercel Deployment Protection**: preview URLs are protected by default; production must be public.
4. **Login walls / geo-blocking**: none present in the code.

### Verification procedure (run against the live site)
```bash
for ua in "Googlebot" "OAI-SearchBot" "Claude-SearchBot" "PerplexityBot" "Bingbot"; do
  printf "%-18s" "$ua"; curl -s -o /dev/null -w "%{http_code}\n" -A "$ua" https://ignixels.com/
done
```
Expect `200` for each. Note that a spoofed user-agent can still differ from the real crawler when a firewall verifies IP ranges; confirm in server/CDN logs after the first real visits.

## llms.txt
`/llms.txt` summarises the company, services, industries and portfolio in plain text, generated from the site's own data. It is a convenience. **No AI vendor guarantees it is read and it is not a ranking factor.** Keep it accurate or remove it.
