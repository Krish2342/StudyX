-- StudyX Milestone 4: resource submission, review, discovery, bookmarks and ratings.
-- Apply through the Supabase migration workflow after review.

create index if not exists resources_catalog_idx
  on public.resources (college_id, branch_id, semester_id, subject_id, status);
create index if not exists resources_created_by_idx
  on public.resources (created_by, status, created_at desc);
create index if not exists resource_ratings_resource_idx
  on public.resource_ratings (resource_id);
create index if not exists bookmarks_user_created_idx
  on public.bookmarks (user_id, created_at desc);

create policy "users update own resource submissions"
on public.resources for update to authenticated
using (
  created_by = auth.uid()
  and status in ('pending', 'rejected')
  and not public.is_super_admin()
)
with check (
  created_by = auth.uid()
  and status = 'pending'
  and not public.is_super_admin()
);

create policy "users delete own pending resources"
on public.resources for delete to authenticated
using (
  created_by = auth.uid()
  and status = 'pending'
  and not public.is_super_admin()
);

create or replace function public.admin_review_resource(
  p_resource_id uuid,
  next_status public.resource_status,
  review_note text default null
)
returns public.resources
language plpgsql
security definer
set search_path = public
as $$
declare
  previous_row public.resources;
  updated_row public.resources;
begin
  if not public.is_super_admin() then
    raise exception 'Only the Super Admin can review resources';
  end if;

  if next_status not in ('approved', 'rejected', 'removed') then
    raise exception 'Invalid resource review status';
  end if;

  select * into previous_row
  from public.resources
  where id = p_resource_id
  for update;

  if previous_row.id is null then
    raise exception 'Resource not found';
  end if;

  update public.resources
  set
    status = next_status,
    admin_note = nullif(trim(review_note), ''),
    approved_by = case when next_status = 'approved' then auth.uid() else null end,
    approved_at = case when next_status = 'approved' then now() else null end
  where id = p_resource_id
  returning * into updated_row;

  insert into public.admin_audit_logs (
    admin_user_id, action, entity_type, entity_id, before_data, after_data
  )
  values (
    auth.uid(),
    'resource_reviewed',
    'resource',
    p_resource_id,
    to_jsonb(previous_row),
    to_jsonb(updated_row)
  );

  insert into public.notifications (user_id, type, title, body, target_url)
  values (
    previous_row.created_by,
    'resource_review',
    case next_status
      when 'approved' then 'Resource approved'
      when 'rejected' then 'Resource needs changes'
      else 'Resource removed'
    end,
    case next_status
      when 'approved' then 'Your resource is now available in the StudyX library.'
      when 'rejected' then coalesce(nullif(trim(review_note), ''), 'Please review the admin feedback and submit an updated version.')
      else coalesce(nullif(trim(review_note), ''), 'This resource is no longer available in the StudyX library.')
    end,
    '/app/study-space'
  );

  return updated_row;
end;
$$;

revoke all on function public.admin_review_resource(uuid, public.resource_status, text) from public;
grant execute on function public.admin_review_resource(uuid, public.resource_status, text) to authenticated;
