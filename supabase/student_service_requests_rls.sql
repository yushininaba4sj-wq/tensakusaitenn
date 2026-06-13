-- GOUKAKU LINK → SENPAI LINK 管理者画面連携用 RLS
-- 共有 Supabase SQL Editor で実行すること。
-- 症状: 「管理者画面への連携に失敗しました」+ RLS policy violation

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'student_service_requests'
      and policyname = 'Users insert own service requests'
  ) then
    create policy "Users insert own service requests"
      on public.student_service_requests for insert
      to authenticated
      with check (auth.uid() = user_id);
  end if;
end $$;
