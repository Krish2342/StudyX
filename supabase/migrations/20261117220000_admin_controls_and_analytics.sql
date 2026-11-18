-- StudyX Milestone 8: admin controls, settings, moderation and analytics.

create index if not exists profiles_admin_search_idx
  on public.profiles (is_suspended, college_id, branch_id, semester_id, created_at desc);
create index if not exists admin_audit_logs_created_idx
  on public.admin_audit_logs (created_at desc);
create index if not exists ai_history_created_idx
  on public.ai_history (created_at desc);

create type public.referral_event_status as enum ('pending', 'qualified', 'rejected', 'rewarded');

create table public.referral_events (
  id uuid primary key default gen_random_uuid(),
  referrer_user_id uuid not null references auth.users(id) on delete cascade,
  referred_user_id uuid references auth.users(id) on delete set null,
  referral_code text not null,
  status public.referral_event_status not null default 'pending',
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index referral_events_status_idx on public.referral_events (status, created_at desc);
alter table public.referral_events enable row level security;
create policy "users read own referral events"
on public.referral_events for select to authenticated
using (referrer_user_id = auth.uid() or referred_user_id = auth.uid() or public.is_super_admin());
create policy "admins manage referral events"
on public.referral_events for all to authenticated
using (public.is_super_admin()) with check (public.is_super_admin());
create trigger referral_events_set_updated_at before update on public.referral_events
for each row execute function public.set_updated_at();

create policy "admins manage resource categories"
on public.resource_categories for all to authenticated
using (public.is_super_admin()) with check (public.is_super_admin());

create or replace function public.admin_set_user_suspension(
  p_user_id uuid,
  p_suspended boolean
)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  previous_row public.profiles;
  updated_row public.profiles;
begin
  if not public.is_super_admin() then
    raise exception 'Only the Super Admin can manage users';
  end if;
  if p_user_id = auth.uid() then
    raise exception 'You cannot suspend your own account';
  end if;

  select * into previous_row from public.profiles where id = p_user_id for update;
  if previous_row.id is null then raise exception 'Profile not found'; end if;

  update public.profiles
  set is_suspended = p_suspended
  where id = p_user_id
  returning * into updated_row;

  insert into public.admin_audit_logs
    (admin_user_id, action, entity_type, entity_id, before_data, after_data)
  values
    (auth.uid(), case when p_suspended then 'user_suspended' else 'user_restored' end,
     'profile', p_user_id, to_jsonb(previous_row), to_jsonb(updated_row));
  return updated_row;
end;
$$;

revoke all on function public.admin_set_user_suspension(uuid, boolean) from public;
grant execute on function public.admin_set_user_suspension(uuid, boolean) to authenticated;

create or replace function public.admin_upsert_setting(
  p_key text,
  p_value jsonb
)
returns public.platform_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  previous_row public.platform_settings;
  updated_row public.platform_settings;
begin
  if not public.is_super_admin() then
    raise exception 'Only the Super Admin can update settings';
  end if;
  if p_key is null or length(trim(p_key)) = 0 or length(p_key) > 100 then
    raise exception 'Invalid setting key';
  end if;

  select * into previous_row from public.platform_settings where key = trim(p_key) for update;
  insert into public.platform_settings (key, value, updated_by)
  values (trim(p_key), p_value, auth.uid())
  on conflict (key) do update
    set value = excluded.value, updated_by = excluded.updated_by, updated_at = now()
  returning * into updated_row;

  insert into public.admin_audit_logs
    (admin_user_id, action, entity_type, entity_id, before_data, after_data)
  values
    (auth.uid(), 'setting_updated', 'platform_setting', null,
     case when previous_row.key is null then null else to_jsonb(previous_row) end,
     to_jsonb(updated_row));
  return updated_row;
end;
$$;

revoke all on function public.admin_upsert_setting(text, jsonb) from public;
grant execute on function public.admin_upsert_setting(text, jsonb) to authenticated;
