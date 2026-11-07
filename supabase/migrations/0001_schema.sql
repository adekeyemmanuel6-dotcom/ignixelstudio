-- Ignixel Studio — core schema, RLS, storage, calculator function
-- Run via `supabase db push` or paste into the Supabase SQL editor.

create extension if not exists pgcrypto;

-- ───────────────────────── helpers ─────────────────────────
create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ───────────────────────── profiles / roles ─────────────────────────
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'editor' check (role in ('admin','editor')),
  created_at timestamptz not null default now()
);

-- Role helpers. SECURITY DEFINER so RLS policies can call them without recursion.
create or replace function public.is_staff() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','editor'));
$$;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin');
$$;

-- ───────────────────────── site settings & homepage ─────────────────────────
create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.homepage_sections (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text not null,
  enabled boolean not null default true,
  sort_order int not null default 0,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ───────────────────────── services ─────────────────────────
create table public.service_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_description text,
  hero_headline text,
  hero_description text,
  image_url text,
  icon text,
  cta_label text default 'Start a Project',
  faqs jsonb not null default '[]'::jsonb,          -- [{q,a}]
  process jsonb not null default '[]'::jsonb,       -- [{title,description}]
  capabilities jsonb not null default '[]'::jsonb,  -- [{title,description}]
  technology_slugs text[] not null default '{}',
  seo_title text,
  seo_description text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.service_categories(id) on delete cascade,
  slug text not null unique,
  title text not null,
  description text,
  details text,
  who_for text,
  problems_solved text,
  image_url text,
  seo_title text,
  seo_description text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.services (category_id, sort_order);

-- ───────────────────────── case studies ─────────────────────────
create table public.case_studies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  client_name text,
  industry text,
  services text[] not null default '{}',
  description text,
  challenge text,
  solution text,
  featured_image text,
  desktop_image text,
  mobile_image text,
  technologies text[] not null default '{}',
  results jsonb not null default '[]'::jsonb,       -- [{label,value}]
  website_url text,
  featured boolean not null default false,
  published boolean not null default false,
  is_placeholder boolean not null default false,
  seo_title text,
  seo_description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.case_studies (published, featured, sort_order);

create table public.case_study_images (
  id uuid primary key default gen_random_uuid(),
  case_study_id uuid not null references public.case_studies(id) on delete cascade,
  url text not null,
  alt text,
  sort_order int not null default 0
);
create index on public.case_study_images (case_study_id, sort_order);

-- ───────────────────────── team, testimonials, technologies ─────────────────────────
create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  job_title text not null,
  bio text,
  photo_url text,
  linkedin_url text,
  twitter_url text,
  website_url text,
  category text not null default 'Leadership' check (category in ('Leadership','Design','Development','Marketing','Operations')),
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  company text,
  position text,
  quote text not null,
  photo_url text,
  project_ref text,
  featured boolean not null default true,
  published boolean not null default true,
  is_placeholder boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.technologies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null,
  icon_slug text,            -- simple-icons slug, used when no logo is uploaded
  logo_url text,             -- uploaded official logo (overrides icon_slug)
  color text,                -- hex without '#'
  sort_order int not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ───────────────────────── blog ─────────────────────────
create table public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);
create table public.blog_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);
create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null default '',
  featured_image text,
  category_id uuid references public.blog_categories(id) on delete set null,
  status text not null default 'draft' check (status in ('draft','published','scheduled')),
  published_at timestamptz,
  author_name text default 'Ignixel Team',
  author_title text,
  author_image text,
  reading_time int not null default 4,
  seo_title text,
  seo_description text,
  og_image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.blog_posts (status, published_at desc);
create table public.post_tags (
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  tag_id uuid not null references public.blog_tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

-- ───────────────────────── calculator ─────────────────────────
create table public.calculator_settings (
  id int primary key default 1 check (id = 1),
  currency text not null default 'USD',
  currency_symbol text not null default '$',
  base_price numeric not null default 1500,
  min_margin numeric not null default 0.15,   -- estimate * (1 - min_margin)
  max_margin numeric not null default 0.30,   -- estimate * (1 + max_margin)
  rounding int not null default 50,
  complexity_medium int not null default 8,   -- points at/above => "Moderate"
  complexity_high int not null default 16,    -- points at/above => "Advanced"
  welcome_title text not null default 'Let''s Estimate Your Website Project Cost.',
  welcome_description text not null default 'Answer a few simple questions about your project and get an estimated investment range tailored to your requirements.',
  welcome_cta text not null default 'Get Started',
  contact_title text not null default 'Where Should We Send Your Estimate?',
  disclaimer text not null default 'This estimate is indicative only and subject to a detailed consultation. Final pricing depends on scope, content, integrations and timeline.',
  updated_at timestamptz not null default now()
);
insert into public.calculator_settings (id) values (1);

create table public.calculator_questions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text not null,
  description text,
  display_type text not null default 'cards' check (display_type in ('cards','image_cards')),
  enabled boolean not null default true,
  sort_order int not null default 0
);
create table public.calculator_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.calculator_questions(id) on delete cascade,
  label text not null,
  description text,
  image_url text,
  price_add numeric not null default 0,       -- flat amount added to base
  multiplier numeric not null default 1,      -- multiplies running total
  complexity_points int not null default 0,
  enabled boolean not null default true,
  sort_order int not null default 0
);
create index on public.calculator_options (question_id, sort_order);

create table public.calculator_submissions (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  company text,
  phone text,
  project_description text,
  answers jsonb not null default '[]'::jsonb,   -- [{question,answer}] snapshot
  estimate_min numeric not null,
  estimate_max numeric not null,
  currency text not null default 'USD',
  complexity text,
  platform text,
  created_at timestamptz not null default now()
);

-- ───────────────────────── leads & forms ─────────────────────────
create table public.project_inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 200),
  company text check (char_length(company) <= 160),
  website text check (char_length(website) <= 300),
  service text check (char_length(service) <= 120),
  budget text check (char_length(budget) <= 120),
  message text check (char_length(message) <= 4000),
  source text not null default 'contact' check (source in ('hero','contact')),
  created_at timestamptz not null default now()
);
create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 200),
  created_at timestamptz not null default now()
);
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('inquiry','calculator')),
  source_id uuid not null,
  name text not null,
  email text not null,
  company text,
  phone text,
  summary text,
  status text not null default 'New' check (status in ('New','Contacted','Qualified','Proposal Sent','Won','Lost')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.leads (status, created_at desc);

-- Leads are created by triggers so anonymous visitors never need write access to `leads`.
create or replace function public.lead_from_inquiry() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.leads (source, source_id, name, email, company, summary)
  values ('inquiry', new.id, new.full_name, new.email, new.company,
          concat_ws(' · ', new.service, new.budget, left(new.message, 200)));
  return new;
end $$;
create trigger trg_lead_inquiry after insert on public.project_inquiries for each row execute function public.lead_from_inquiry();

create or replace function public.lead_from_calc() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.leads (source, source_id, name, email, company, phone, summary)
  values ('calculator', new.id, new.first_name || ' ' || new.last_name, new.email, new.company, new.phone,
          concat_ws(' · ', 'Estimate ' || new.currency || ' ' || new.estimate_min::bigint || '–' || new.estimate_max::bigint, new.platform, new.complexity));
  return new;
end $$;
create trigger trg_lead_calc after insert on public.calculator_submissions for each row execute function public.lead_from_calc();

-- ───────────────────────── media ─────────────────────────
create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'media',
  path text not null,
  url text not null,
  alt text,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- updated_at triggers
do $$ declare t text; begin
  foreach t in array array['site_settings','homepage_sections','service_categories','services','case_studies','team_members','testimonials','technologies','blog_posts','calculator_settings','leads'] loop
    execute format('create trigger trg_%1$s_updated before update on public.%1$s for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- ───────────────────────── calculator engine (server side) ─────────────────────────
-- Public visitors get option labels via this view; pricing weights are NOT exposed.
create view public.calculator_options_public as
  select o.id, o.question_id, o.label, o.description, o.image_url, o.sort_order
  from public.calculator_options o
  join public.calculator_questions q on q.id = o.question_id
  where o.enabled and q.enabled;
grant select on public.calculator_options_public to anon, authenticated;

-- estimate = (base_price + Σ price_add) × Π multiplier, widened by the configured margins.
create or replace function public.submit_calculator(p_contact jsonb, p_answers jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  s public.calculator_settings;
  total numeric; points int := 0; mult numeric := 1; add_sum numeric := 0;
  r record; snapshot jsonb := '[]'::jsonb; platform_label text; level text;
  v_min numeric; v_max numeric; sub_id uuid; step int;
  v_email text := lower(trim(p_contact->>'email'));
begin
  select * into s from public.calculator_settings where id = 1;
  step := greatest(coalesce(s.rounding,50),1);
  if coalesce(trim(p_contact->>'first_name'),'') = '' or coalesce(trim(p_contact->>'last_name'),'') = '' then
    raise exception 'Name is required' using errcode = '22023'; end if;
  if v_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'Valid email is required' using errcode = '22023'; end if;

  for r in
    select q.key, q.title, q.sort_order as qs, o.label, o.price_add, o.multiplier, o.complexity_points
    from jsonb_each_text(p_answers) a
    join public.calculator_options o on o.id = a.value::uuid and o.question_id = a.key::uuid and o.enabled
    join public.calculator_questions q on q.id = o.question_id and q.enabled
    order by q.sort_order
  loop
    add_sum := add_sum + r.price_add; mult := mult * r.multiplier; points := points + r.complexity_points;
    snapshot := snapshot || jsonb_build_object('question', r.title, 'answer', r.label);
    if r.key = 'platform' then platform_label := r.label; end if;
  end loop;

  total := (s.base_price + add_sum) * mult;
  v_min := round(total * (1 - s.min_margin) / step) * step;
  v_max := round(total * (1 + s.max_margin) / step) * step;
  level := case when points >= s.complexity_high then 'Advanced' when points >= s.complexity_medium then 'Moderate' else 'Focused' end;

  insert into public.calculator_submissions (first_name,last_name,email,company,phone,project_description,answers,estimate_min,estimate_max,currency,complexity,platform)
  values (trim(p_contact->>'first_name'), trim(p_contact->>'last_name'), v_email, left(p_contact->>'company',160), left(p_contact->>'phone',60),
          left(p_contact->>'project_description',4000), snapshot, v_min, v_max, s.currency, level, platform_label)
  returning id into sub_id;

  return jsonb_build_object('id', sub_id, 'min', v_min, 'max', v_max, 'currency', s.currency, 'symbol', s.currency_symbol,
                            'complexity', level, 'platform', platform_label, 'answers', snapshot);
end $$;
revoke all on function public.submit_calculator(jsonb, jsonb) from public;
grant execute on function public.submit_calculator(jsonb, jsonb) to anon, authenticated;

-- ───────────────────────── Row Level Security ─────────────────────────
do $$ declare t text; begin
  foreach t in array array['profiles','site_settings','homepage_sections','service_categories','services','case_studies','case_study_images','team_members','testimonials','technologies','blog_categories','blog_tags','blog_posts','post_tags','calculator_settings','calculator_questions','calculator_options','calculator_submissions','project_inquiries','newsletter_subscribers','leads','media_assets'] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- Staff (admin + editor) can do everything on content tables.
do $$ declare t text; begin
  foreach t in array array['homepage_sections','service_categories','services','case_studies','case_study_images','team_members','testimonials','technologies','blog_categories','blog_tags','blog_posts','post_tags','calculator_questions','calculator_options','media_assets','leads','project_inquiries','calculator_submissions','newsletter_subscribers'] loop
    execute format('create policy "staff all %1$s" on public.%1$I for all to authenticated using (public.is_staff()) with check (public.is_staff())', t);
  end loop;
end $$;

-- Admin-only: settings + calculator config + profiles.
create policy "admin all site_settings" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin all calculator_settings" on public.calculator_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "own profile read" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "admin manage profiles" on public.profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Public read of published content.
create policy "public read settings" on public.site_settings for select to anon, authenticated using (true);
create policy "public read sections" on public.homepage_sections for select to anon, authenticated using (enabled);
create policy "public read categories" on public.service_categories for select to anon, authenticated using (published);
create policy "public read services" on public.services for select to anon, authenticated using (published);
create policy "public read case studies" on public.case_studies for select to anon, authenticated using (published);
create policy "public read case images" on public.case_study_images for select to anon, authenticated
  using (exists (select 1 from public.case_studies c where c.id = case_study_id and c.published));
create policy "public read team" on public.team_members for select to anon, authenticated using (active);
create policy "public read testimonials" on public.testimonials for select to anon, authenticated using (published);
create policy "public read technologies" on public.technologies for select to anon, authenticated using (visible);
create policy "public read blog categories" on public.blog_categories for select to anon, authenticated using (true);
create policy "public read blog tags" on public.blog_tags for select to anon, authenticated using (true);
create policy "public read posts" on public.blog_posts for select to anon, authenticated
  using (status = 'published' or (status = 'scheduled' and published_at <= now()));
create policy "public read post tags" on public.post_tags for select to anon, authenticated
  using (exists (select 1 from public.blog_posts p where p.id = post_id and (p.status = 'published' or (p.status = 'scheduled' and p.published_at <= now()))));
create policy "public read calc settings" on public.calculator_settings for select to anon, authenticated using (true);
create policy "public read calc questions" on public.calculator_questions for select to anon, authenticated using (enabled);
-- calculator_options: NO public policy (weights stay private; use calculator_options_public view).

-- Public write: forms only, insert-only (no select/update/delete).
create policy "anon submit inquiry" on public.project_inquiries for insert to anon, authenticated with check (true);
create policy "anon subscribe" on public.newsletter_subscribers for insert to anon, authenticated with check (true);
-- calculator_submissions are written exclusively through submit_calculator().

-- ───────────────────────── Storage ─────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media','media', true, 8388608, array['image/jpeg','image/png','image/webp','image/avif','image/svg+xml','image/gif'])
on conflict (id) do nothing;

create policy "media public read" on storage.objects for select to anon, authenticated using (bucket_id = 'media');
create policy "media staff insert" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_staff());
create policy "media staff update" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_staff());
create policy "media staff delete" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_staff());
