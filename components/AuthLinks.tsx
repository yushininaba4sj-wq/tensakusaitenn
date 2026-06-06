"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function AuthLinks() {
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setReady(true);
      return;
    }
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? null);
      setReady(true);
    });
  }, []);

  if (!ready) return null;

  if (email) {
    return (
      <Link
        href="/mypage"
        className="rounded-full border border-[var(--line)] px-3 py-2 text-[11px] font-bold"
      >
        マイページ
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="rounded-full border border-[var(--line)] px-3 py-2 text-[11px] font-bold text-[var(--muted)]"
    >
      ログイン
    </Link>
  );
}
