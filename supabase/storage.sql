-- GOUKAKU LINK: 画像アップロード用 Storage（SENPAI LINK 管理者画面と共有）
-- 共有 Supabase に追加のみ実行すること。
-- student_service_requests.attachments と同じ bucket を使い、管理者画面で画像が見えるようにする。

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'service-attachments',
  'service-attachments',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic']
)
on conflict (id) do nothing;

-- ログインユーザーは自分のフォルダ（先頭が auth.uid()）にのみアップロード可
create policy "Users upload own service attachments"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'service-attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users read own service attachments"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'service-attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- 管理者（SENPAI LINK 側）は service_role / 管理者ポリシーで全件参照する想定
