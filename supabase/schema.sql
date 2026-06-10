-- goukakulink: 依頼・返答テーブル
-- 共有 Supabase プロジェクト（SENPAI LINK 本番）に追加のみ実行すること。
-- 既存テーブル・RLS・Auth 設定は変更しない。
-- service_role は使わず、anon + RLS で完結。

create table if not exists public.goukakulink_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  service text not null check (service in ('tensaku', 'kakomon', 'qa', 'plan')),
  title text,
  content text not null,
  image_urls text[] not null default '{}',
  status text not null default 'pending' check (status in ('pending', 'answered')),
  response text,
  response_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists goukakulink_submissions_user_id_idx
  on public.goukakulink_submissions (user_id, created_at desc);

alter table public.goukakulink_submissions enable row level security;

create policy "Users read own submissions"
  on public.goukakulink_submissions for select
  using (auth.uid() = user_id);

create policy "Users insert own submissions"
  on public.goukakulink_submissions for insert
  with check (auth.uid() = user_id);

-- UPDATE / DELETE ポリシーなし → 一般ユーザーは自分の行を変更・削除不可
-- 返答の更新は Supabase Dashboard（管理者）からのみ
