-- StudyX authorization foundation.
-- This migration defines database authorization; frontend route guards are UX only.

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role = 'super_admin'
  );
$$;

revoke all on function public.is_super_admin() from public;
grant execute on function public.is_super_admin() to authenticated;

alter table public.colleges enable row level security;
alter table public.branches enable row level security;
alter table public.semesters enable row level security;
alter table public.subjects enable row level security;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.resource_categories enable row level security;
alter table public.resources enable row level security;
alter table public.resource_keywords enable row level security;
alter table public.bookmarks enable row level security;
alter table public.resource_ratings enable row level security;
alter table public.resource_requests enable row level security;
alter table public.support_tickets enable row level security;
alter table public.support_replies enable row level security;
alter table public.notifications enable row level security;
alter table public.admin_audit_logs enable row level security;
alter table public.platform_settings enable row level security;

create policy "authenticated users read active colleges"
on public.colleges for select to authenticated using (is_active or public.is_super_admin());
create policy "authenticated users read active branches"
on public.branches for select to authenticated using (is_active or public.is_super_admin());
create policy "authenticated users read semesters"
on public.semesters for select to authenticated using (is_active or public.is_super_admin());
create policy "authenticated users read active subjects"
on public.subjects for select to authenticated using (is_active or public.is_super_admin());
create policy "admins manage academic catalog"
on public.colleges for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "admins manage branches"
on public.branches for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "admins manage semesters"
on public.semesters for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "admins manage subjects"
on public.subjects for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

create policy "users read own profile"
on public.profiles for select to authenticated using (id = auth.uid() or public.is_super_admin());
create policy "users update own profile"
on public.profiles for update to authenticated
using (id = auth.uid() and not is_suspended)
with check (id = auth.uid() and not is_suspended);
create policy "admins manage profiles"
on public.profiles for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

create policy "users read own role"
on public.user_roles for select to authenticated using (user_id = auth.uid() or public.is_super_admin());
create policy "admins manage roles"
on public.user_roles for all to authenticated
using (public.is_super_admin()) with check (public.is_super_admin());

create policy "users read approved or owned resources"
on public.resources for select to authenticated
using (status = 'approved' or created_by = auth.uid() or public.is_super_admin());
create policy "users submit resources"
on public.resources for insert to authenticated
with check (created_by = auth.uid() and status = 'pending');
create policy "admins manage resources"
on public.resources for all to authenticated
using (public.is_super_admin()) with check (public.is_super_admin());

create policy "approved resource keywords are readable"
on public.resource_keywords for select to authenticated
using (exists (select 1 from public.resources r where r.id = resource_id and (r.status = 'approved' or r.created_by = auth.uid() or public.is_super_admin())));
create policy "admins manage resource keywords"
on public.resource_keywords for all to authenticated
using (public.is_super_admin()) with check (public.is_super_admin());

create policy "users manage own bookmarks"
on public.bookmarks for all to authenticated
using (user_id = auth.uid() and not public.is_super_admin())
with check (user_id = auth.uid());
create policy "admins read bookmarks"
on public.bookmarks for select to authenticated using (public.is_super_admin());

create policy "users manage own ratings"
on public.resource_ratings for all to authenticated
using (user_id = auth.uid() and not public.is_super_admin())
with check (user_id = auth.uid());
create policy "admins read ratings"
on public.resource_ratings for select to authenticated using (public.is_super_admin());

create policy "users manage own resource requests"
on public.resource_requests for all to authenticated
using (user_id = auth.uid() or public.is_super_admin())
with check (user_id = auth.uid() and not public.is_super_admin());

create policy "users read own tickets"
on public.support_tickets for select to authenticated using (user_id = auth.uid() or public.is_super_admin());
create policy "users create own tickets"
on public.support_tickets for insert to authenticated with check (user_id = auth.uid());
create policy "admins manage tickets"
on public.support_tickets for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

create policy "ticket participants read replies"
on public.support_replies for select to authenticated
using (
  sender_user_id = auth.uid()
  or public.is_super_admin()
  or exists (select 1 from public.support_tickets t where t.id = ticket_id and t.user_id = auth.uid())
);
create policy "ticket owner replies"
on public.support_replies for insert to authenticated
with check (
  sender_user_id = auth.uid()
  and (public.is_super_admin() or exists (select 1 from public.support_tickets t where t.id = ticket_id and t.user_id = auth.uid()))
);

create policy "users manage own notifications"
on public.notifications for select to authenticated using (user_id = auth.uid() or public.is_super_admin());
create policy "users mark own notifications read"
on public.notifications for update to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "admins read audit logs"
on public.admin_audit_logs for select to authenticated using (public.is_super_admin());
create policy "admins insert audit logs"
on public.admin_audit_logs for insert to authenticated
with check (admin_user_id = auth.uid() and public.is_super_admin());

create policy "admins manage platform settings"
on public.platform_settings for all to authenticated
using (public.is_super_admin()) with check (public.is_super_admin());
