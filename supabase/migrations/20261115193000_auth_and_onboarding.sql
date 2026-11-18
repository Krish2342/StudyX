-- StudyX Milestone 2: authenticated student bootstrap and onboarding requests.

create table public.college_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  college_name text not null,
  city text,
  state text,
  message text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists college_requests_set_updated_at on public.college_requests;
create trigger college_requests_set_updated_at
before update on public.college_requests
for each row execute function public.set_updated_at();

alter table public.college_requests enable row level security;

drop policy if exists "users read own college requests" on public.college_requests;
create policy "users read own college requests"
on public.college_requests for select to authenticated
using (user_id = auth.uid() or public.is_super_admin());

drop policy if exists "users create own college requests" on public.college_requests;
create policy "users create own college requests"
on public.college_requests for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "admins manage college requests" on public.college_requests;
create policy "admins manage college requests"
on public.college_requests for all to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.email,
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'student')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

drop policy if exists "users create own profile" on public.profiles;
create policy "users create own profile"
on public.profiles for insert to authenticated
with check (id = auth.uid());
