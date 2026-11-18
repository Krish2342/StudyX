-- StudyX Milestone 5: student resource experience.

create type public.resource_report_status as enum ('open', 'reviewing', 'resolved', 'dismissed');

create table public.resource_reports (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.resources(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reason text not null check (reason in ('broken_link', 'incorrect_content', 'copyright', 'other')),
  details text,
  status public.resource_report_status not null default 'open',
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (resource_id, user_id)
);

create index resource_reports_status_idx
  on public.resource_reports (status, created_at desc);

create trigger resource_reports_set_updated_at
before update on public.resource_reports
for each row execute function public.set_updated_at();

alter table public.resource_reports enable row level security;

create policy "users create own resource reports"
on public.resource_reports for insert to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.resources
    where id = resource_id and status = 'approved'
  )
);

create policy "users read own resource reports"
on public.resource_reports for select to authenticated
using (user_id = auth.uid() or public.is_super_admin());

create policy "admins manage resource reports"
on public.resource_reports for all to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

create or replace function public.track_resource_event(
  p_resource_id uuid,
  p_event text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if p_event not in ('view', 'share') then
    raise exception 'Invalid resource event';
  end if;

  update public.resources
  set
    view_count = case when p_event = 'view' then view_count + 1 else view_count end,
    share_count = case when p_event = 'share' then share_count + 1 else share_count end
  where id = p_resource_id and status = 'approved';

  if not found then
    raise exception 'Approved resource not found';
  end if;
end;
$$;

revoke all on function public.track_resource_event(uuid, text) from public;
grant execute on function public.track_resource_event(uuid, text) to authenticated;
