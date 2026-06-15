-- GOUKAKU LINK: SENPAI 共有バケット service-request-attachments への Storage RLS
-- バケット自体は SENPAI LINK 側で既存。GOUKAKU ユーザーが自分のフォルダに upload/read できるようにする。
-- パス形式: {auth.uid()}/...

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Goukakulink users upload service request attachments'
  ) then
    create policy "Goukakulink users upload service request attachments"
      on storage.objects for insert
      to authenticated
      with check (
        bucket_id = 'service-request-attachments'
        and (storage.foldername(name))[1] = auth.uid()::text
      );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Goukakulink users read service request attachments'
  ) then
    create policy "Goukakulink users read service request attachments"
      on storage.objects for select
      to authenticated
      using (
        bucket_id = 'service-request-attachments'
        and (storage.foldername(name))[1] = auth.uid()::text
      );
  end if;
end $$;
