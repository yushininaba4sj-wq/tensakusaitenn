お疲れさま。goukakulink（添削サイト）用に、共有 Supabase にテーブルを1つ追加してほしいです。

**やってほしいこと**
Supabase Dashboard → SQL Editor で、下の SQL をそのまま実行してください。

**注意（共有DBなので）**
- 新規追加だけ（既存テーブルや `auth.users` は触らない想定）
- テーブル名は `goukakulink_` プレフィックス付き（既存テーブルと被らないように）
- RLS 有効化＋ポリシー付き
- INSERT データは不要（DDL だけでOK）

**このテーブルでやること**
ユーザーが依頼を送る → 管理者（あなた）が Dashboard から返答を入れる、という運用です。
一般ユーザーは「自分の依頼を見る」「新規で送る」だけで、編集・削除はできない設定にしてあります。

```sql
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
```

**実行後にできていると嬉しいもの**
- テーブル: `public.goukakulink_submissions`
- RLS: 有効
- ポリシー: SELECT（自分の行のみ）/ INSERT（自分の行のみ）

実行できたら教えてもらえると助かります。衝突やRLSで気になるところがあれば、そのまま指摘してもらって大丈夫です。
