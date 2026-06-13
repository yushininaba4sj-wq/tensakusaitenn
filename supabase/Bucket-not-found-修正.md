# Bucket not found 修正（本番 Supabase・管理者向け）

GOUKAKU LINK 本番で添削・英作文の画像アップロードが **`Bucket not found`** で失敗する場合、  
本番 Supabase に Storage バケット `service-attachments` がありません。

## やること

Supabase Dashboard → **SQL Editor** → **New query** で、下の SQL を**そのまま**実行してください。

```sql
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'service-attachments',
  'service-attachments',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic']
)
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Users upload own service attachments'
  ) then
    create policy "Users upload own service attachments"
      on storage.objects for insert
      to authenticated
      with check (
        bucket_id = 'service-attachments'
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
      and policyname = 'Users read own service attachments'
  ) then
    create policy "Users read own service attachments"
      on storage.objects for select
      to authenticated
      using (
        bucket_id = 'service-attachments'
        and (storage.foldername(name))[1] = auth.uid()::text
      );
  end if;
end $$;
```

## 確認

1. Supabase Dashboard → **Storage** に `service-attachments` バケットが表示される
2. https://goukakulink.vercel.app でログイン後、添削フォームから画像付きで送信
3. **Bucket not found** が出なくなる

## 補足

- 同じ内容は `supabase/storage.sql` にもあります（再実行しても安全な idempotent 版）
- 既存の SENPAI LINK テーブル・Auth 設定は触りません
