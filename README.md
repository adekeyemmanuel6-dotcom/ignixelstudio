# Ignixel Studio — website + Supabase CMS

Next.js 15 (App Router) · TypeScript · Tailwind · Framer Motion · Supabase (Postgres, Auth, Storage). Vercel-ready.

## Quick start
```bash
npm install
cp .env.example .env.local      # fill in the Supabase values
npm run dev
```
Without Supabase env vars the public site runs in **demo mode** on built-in starter content (forms return a clear "not available" message; the calculator computes locally and does not save).

## 1. Supabase setup
1. Create a Supabase project. Copy **Project URL** and the **anon/publishable key** into `.env.local`.
2. Apply the schema: `supabase db push`, or paste `supabase/migrations/0001_schema.sql` into the SQL editor.
   It creates all tables, RLS policies, the `media` storage bucket + policies, lead triggers and the `submit_calculator()` function.
3. Auth → URL Configuration: add `https://YOUR-DOMAIN/admin/reset-password` (and the localhost equivalent) to Redirect URLs.

## 2. Create the first admin
Run locally (the service-role key is used only here, never in the app):
```bash
SUPABASE_SERVICE_ROLE_KEY=... NEXT_PUBLIC_SUPABASE_URL=... npm run create-admin -- you@company.com 'a-strong-password' admin
```
Roles: `admin` (everything incl. settings & calculator pricing) and `editor` (content + leads).

## 3. Install content
Sign in at `/admin` → Dashboard → **Install starter content**. This copies the defaults in `src/lib/defaults.ts` into the database (empty tables only). All of it is then editable. Replace the flagged placeholders (projects, testimonials, team) with real information.

## Environment variables
| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | public | Canonical URLs, sitemap, schema |
| `NEXT_PUBLIC_SUPABASE_URL` | public | Supabase API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | Anon key (RLS-protected) |
| `NEXT_PUBLIC_CRAFTWORK_FONT` | public | `true` once font files are added |
| `SUPABASE_SERVICE_ROLE_KEY` | **local script only** | `npm run create-admin`. Never set in Vercel/frontend. |

## Brand assets (action needed)
- **Logo:** the logo files were not attached to the build request, so a placeholder wordmark is used. Upload the official logo in Admin → Settings (rendered untouched).
- **Craftwork Grotesk** is a licensed font. Put the `.woff2` files in `public/fonts/` (names in `public/fonts/craftwork.css`) and set `NEXT_PUBLIC_CRAFTWORK_FONT=true`. Until then headings use Space Grotesk. Body is Inter.

## Deploy (Vercel)
Import the repo, set the three public env vars, deploy. Admin edits call `/api/revalidate` so public pages refresh immediately (otherwise ISR refreshes every 60 s).

## Architecture notes
- `src/lib/content.ts` — all public reads (anon client, RLS-limited); falls back to defaults until content is installed.
- Admin (`/admin`) uses the browser Supabase client; **RLS is the real security boundary**, with middleware + server layout as additional guards.
- Generic CRUD: `src/lib/admin/resources.ts` (schemas) + `ResourceManager`. Dedicated screens: homepage, blog (Tiptap), leads, calculator, settings, About & Legal.
- Forms: inquiries insert via RLS-limited anon policy; leads are created by DB triggers. The calculator runs in SQL (`submit_calculator`), so pricing weights are never exposed (`calculator_options` has no public policy).
- Estimate = (base price + Σ option price) × Π multipliers, widened by min/max margins, rounded.
- Scheduled posts go live automatically (RLS compares `published_at` with `now()`).

## Database tables
profiles, site_settings (`general`, `about`, `legal`), homepage_sections, service_categories, services, case_studies, case_study_images, team_members, testimonials, technologies, blog_categories, blog_tags, blog_posts, post_tags, calculator_settings/questions/options/submissions, project_inquiries, newsletter_subscribers, leads, media_assets.

## Known gaps
- AWS and OpenAI have no glyph in the bundled icon set (shown as monograms) — upload official logos in Admin → Technologies.
- `case_study_images` (gallery) table exists but has no admin UI yet.
- Legal pages are templates; have them reviewed.
- Not verified against a live Supabase project in this build; run the migration and test the admin flows after setup.
