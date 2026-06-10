-- 既存の goukakulink_submissions に image_urls カラムを追加（本番にテーブルがある場合）
alter table public.goukakulink_submissions
  add column if not exists image_urls text[] not null default '{}';
