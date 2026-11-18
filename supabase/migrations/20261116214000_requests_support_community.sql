-- StudyX Milestone 6: requests, support, community, and notifications.

create type public.community_post_status as enum ('published', 'hidden', 'removed');
create type public.community_report_status as enum ('open', 'reviewing', 'resolved', 'dismissed');

create table public.community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  title text not null check (char_length(trim(title)) between 5 and 160),
  body text not null check (char_length(trim(body)) between 10 and 5000),
  status public.community_post_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.community_replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 3000),
  status public.community_post_status not null default 'published',
  created_at timestamptz not null default now()
);

create table public.community_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.community_posts(id) on delete cascade,
  reply_id uuid references public.community_replies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reason text not null,
  details text,
  status public.community_report_status not null default 'open',
  created_at timestamptz not null default now(),
  check ((post_id is not null) <> (reply_id is not null))
);

create index community_posts_created_idx on public.community_posts (created_at desc);
create index community_replies_post_idx on public.community_replies (post_id, created_at);
create index community_reports_status_idx on public.community_reports (status, created_at desc);
create index notifications_user_created_idx on public.notifications (user_id, created_at desc);

create trigger community_posts_set_updated_at before update on public.community_posts
for each row execute function public.set_updated_at();

alter table public.community_posts enable row level security;
alter table public.community_replies enable row level security;
alter table public.community_reports enable row level security;

drop policy if exists "users manage own resource requests" on public.resource_requests;
create policy "users read own resource requests"
on public.resource_requests for select to authenticated
using (user_id = auth.uid() or public.is_super_admin());
create policy "users create own resource requests"
on public.resource_requests for insert to authenticated
with check (user_id = auth.uid());
create policy "users update own request message"
on public.resource_requests for update to authenticated
using (user_id = auth.uid() and status = 'pending')
with check (user_id = auth.uid() and status = 'pending');
create policy "admins manage resource requests"
on public.resource_requests for all to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

create policy "users read own support tickets"
on public.support_tickets for select to authenticated
using (user_id = auth.uid() or public.is_super_admin());
create policy "users create support tickets"
on public.support_tickets for insert to authenticated
with check (user_id = auth.uid());
create policy "admins manage support tickets"
on public.support_tickets for update to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

create policy "published community posts readable"
on public.community_posts for select to authenticated
using (status = 'published' or user_id = auth.uid() or public.is_super_admin());
create policy "users create community posts"
on public.community_posts for insert to authenticated
with check (user_id = auth.uid());
create policy "users update own published posts"
on public.community_posts for update to authenticated
using (user_id = auth.uid() and status = 'published')
with check (user_id = auth.uid() and status = 'published');
create policy "admins moderate community posts"
on public.community_posts for all to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

create policy "published replies readable"
on public.community_replies for select to authenticated
using (
  status = 'published'
  or user_id = auth.uid()
  or public.is_super_admin()
);
create policy "users create replies"
on public.community_replies for insert to authenticated
with check (
  user_id = auth.uid()
  and exists (select 1 from public.community_posts where id = post_id and status = 'published')
);
create policy "users update own replies"
on public.community_replies for update to authenticated
using (user_id = auth.uid() and status = 'published')
with check (user_id = auth.uid() and status = 'published');
create policy "admins moderate replies"
on public.community_replies for all to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

create policy "users create community reports"
on public.community_reports for insert to authenticated
with check (user_id = auth.uid());
create policy "users read own community reports"
on public.community_reports for select to authenticated
using (user_id = auth.uid() or public.is_super_admin());
create policy "admins manage community reports"
on public.community_reports for all to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());
