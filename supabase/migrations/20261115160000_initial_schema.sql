-- StudyX Milestone 1 foundation schema.
-- Apply only through the Supabase migration workflow after review.

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create type public.app_role as enum ('student', 'super_admin');
create type public.resource_status as enum ('pending', 'approved', 'rejected', 'removed');
create type public.drive_access_status as enum ('unchecked', 'accessible', 'permission_required', 'broken', 'unknown');
create type public.request_status as enum ('pending', 'added', 'not_available');
create type public.ticket_status as enum ('open', 'in_progress', 'resolved');
create type public.discussion_status as enum ('published', 'hidden', 'removed');

create table public.colleges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  city text,
  state text,
  country text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.branches (
  id uuid primary key default gen_random_uuid(),
  college_id uuid not null references public.colleges(id) on delete restrict,
  name text not null,
  code text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (college_id, name)
);

create table public.semesters (
  id uuid primary key default gen_random_uuid(),
  number smallint not null unique check (number between 1 and 12),
  label text not null,
  is_active boolean not null default true
);

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  college_id uuid not null references public.colleges(id) on delete restrict,
  branch_id uuid not null references public.branches(id) on delete restrict,
  semester_id uuid not null references public.semesters(id) on delete restrict,
  name text not null,
  code text,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (college_id, branch_id, semester_id, name)
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  college_id uuid references public.colleges(id) on delete restrict,
  branch_id uuid references public.branches(id) on delete restrict,
  semester_id uuid references public.semesters(id) on delete restrict,
  bio text,
  preferred_language text not null default 'English',
  preferred_answer_style text,
  is_suspended boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'student',
  created_at timestamptz not null default now()
);

create unique index one_super_admin_only
  on public.user_roles (role)
  where role = 'super_admin';

create table public.resource_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  is_active boolean not null default true,
  sort_order integer not null default 0
);

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  resource_type text not null references public.resource_categories(slug) on delete restrict,
  college_id uuid not null references public.colleges(id) on delete restrict,
  branch_id uuid not null references public.branches(id) on delete restrict,
  semester_id uuid not null references public.semesters(id) on delete restrict,
  subject_id uuid references public.subjects(id) on delete restrict,
  google_drive_url text not null,
  drive_access_status public.drive_access_status not null default 'unchecked',
  cover_image_url text,
  created_by uuid not null references auth.users(id) on delete restrict,
  status public.resource_status not null default 'pending',
  admin_note text,
  approved_by uuid references auth.users(id) on delete restrict,
  approved_at timestamptz,
  view_count bigint not null default 0 check (view_count >= 0),
  share_count bigint not null default 0 check (share_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index resources_search_idx on public.resources
  using gin (to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(description, '')));
create index resources_title_trgm_idx on public.resources using gin (title gin_trgm_ops);
create index resources_status_idx on public.resources (status);

create table public.resource_keywords (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.resources(id) on delete cascade,
  keyword text not null,
  normalized_keyword text not null,
  source text not null check (source in ('auto', 'admin')),
  created_at timestamptz not null default now(),
  unique (resource_id, normalized_keyword)
);

create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resource_id uuid not null references public.resources(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, resource_id)
);

create table public.resource_ratings (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.resources(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (resource_id, user_id)
);

create table public.resource_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  college_id uuid references public.colleges(id) on delete restrict,
  branch_id uuid references public.branches(id) on delete restrict,
  semester_id uuid references public.semesters(id) on delete restrict,
  subject_id uuid references public.subjects(id) on delete restrict,
  resource_type text not null,
  request_description text not null,
  additional_message text,
  status public.request_status not null default 'pending',
  admin_note text,
  fulfilled_resource_id uuid references public.resources(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_number text not null unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  subject text not null,
  message text not null,
  status public.ticket_status not null default 'open',
  assigned_admin_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.support_replies (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  sender_user_id uuid not null references auth.users(id) on delete restrict,
  message text not null,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  target_url text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references auth.users(id) on delete restrict,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create table public.platform_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references auth.users(id) on delete restrict,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger resources_set_updated_at before update on public.resources
for each row execute function public.set_updated_at();
create trigger resource_ratings_set_updated_at before update on public.resource_ratings
for each row execute function public.set_updated_at();
create trigger resource_requests_set_updated_at before update on public.resource_requests
for each row execute function public.set_updated_at();
create trigger support_tickets_set_updated_at before update on public.support_tickets
for each row execute function public.set_updated_at();

insert into public.semesters (number, label)
values
  (1, 'Semester 1'),
  (2, 'Semester 2'),
  (3, 'Semester 3'),
  (4, 'Semester 4'),
  (5, 'Semester 5'),
  (6, 'Semester 6'),
  (7, 'Semester 7'),
  (8, 'Semester 8')
on conflict (number) do nothing;

insert into public.resource_categories (name, slug, sort_order)
values
  ('Notes', 'notes', 1),
  ('Books', 'books', 2),
  ('Assignments', 'assignments', 3),
  ('Previous Year Papers', 'previous-year-papers', 4),
  ('Question Banks', 'question-banks', 5),
  ('Lab Manuals', 'lab-manuals', 6),
  ('PPTs', 'ppts', 7),
  ('Important Questions', 'important-questions', 8),
  ('Study Material', 'study-material', 9),
  ('Other', 'other', 10)
on conflict (slug) do nothing;
