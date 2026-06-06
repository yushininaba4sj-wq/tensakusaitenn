"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { SITE } from "@/lib/services";
import { SenpaiBrandName } from "@/components/SenpaiLink";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/mypage";
  const authError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [message, setMessage] = useState<string | null>(
    authError ? "ログインに失敗しました。もう一度お試しください。" : null,
  );
  const [loading, setLoading] = useState(false);

  if (!isSupabaseConfigured()) {
    return (
      <div className="rounded-2xl border border-[var(--line)] bg-white p-6">
        <p className="font-bold">ログイン準備中</p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          SENPAI LINK と同じメールアドレスでログインするには、Supabase
          の設定が必要です。管理者が環境変数を設定すると、同じアカウントで使えます。
        </p>
        <a
          href={`${SITE.senpaiLink}/student/login`}
          className="mt-4 block text-center text-sm font-bold text-[var(--senpai)]"
        >
          <SenpaiBrandName /> でログイン →
        </a>
      </div>
    );
  }

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("メールを送信しました。届いたリンクからログインしてください。");
  }

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm">
      <h1 className="text-xl font-bold">ログイン</h1>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
        <SenpaiBrandName />
        と同じメールアドレス・パスワードでログインできます。依頼した添削・採点・質問の返答はマイページで確認できます。
      </p>

      <div className="mt-4 flex rounded-xl border border-[var(--line)] bg-[var(--bg)] p-1">
        <button
          type="button"
          onClick={() => setMode("password")}
          className={`flex-1 rounded-lg py-2 text-xs font-bold ${
            mode === "password" ? "bg-white shadow-sm" : "text-[var(--muted)]"
          }`}
        >
          メール＋パスワード
        </button>
        <button
          type="button"
          onClick={() => setMode("magic")}
          className={`flex-1 rounded-lg py-2 text-xs font-bold ${
            mode === "magic" ? "bg-white shadow-sm" : "text-[var(--muted)]"
          }`}
        >
          メールリンク
        </button>
      </div>

      <form
        className="mt-5 space-y-4"
        onSubmit={mode === "password" ? handlePasswordLogin : handleMagicLink}
      >
        <label className="block">
          <span className="text-sm font-semibold">メールアドレス</span>
          <input
            required
            type="email"
            autoComplete="email"
            className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2.5 text-sm"
            placeholder="SENPAI LINKと同じメール"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        {mode === "password" && (
          <label className="block">
            <span className="text-sm font-semibold">パスワード</span>
            <input
              required
              type="password"
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2.5 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        )}

        {message && (
          <p
            className={`text-sm ${message.includes("送信") ? "text-[var(--senpai-dark)]" : "text-[var(--accent)]"}`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[var(--accent)] py-3.5 text-sm font-bold text-white disabled:opacity-60"
        >
          {loading ? "送信中…" : mode === "password" ? "ログイン" : "ログインリンクを送る"}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-[var(--muted)]">
        アカウントがない場合は{" "}
        <a
          href={`${SITE.senpaiLink}/student/login`}
          className="font-bold text-[var(--senpai)]"
        >
          SENPAI LINK
        </a>
        で登録
      </p>
    </div>
  );
}
