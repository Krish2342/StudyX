-- StudyX Storage design. The bucket remains private; public resources use
-- controlled signed URLs or a server-generated public representation.

insert into storage.buckets (id, name, public)
values ('resource-covers', 'resource-covers', false)
on conflict (id) do nothing;

create policy "authenticated users upload own resource covers"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'resource-covers'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "users read own covers and admins read all"
on storage.objects for select to authenticated
using (
  bucket_id = 'resource-covers'
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_super_admin())
);

create policy "users update own covers"
on storage.objects for update to authenticated
using (
  bucket_id = 'resource-covers'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'resource-covers'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "admins delete covers"
on storage.objects for delete to authenticated
using (bucket_id = 'resource-covers' and public.is_super_admin());
