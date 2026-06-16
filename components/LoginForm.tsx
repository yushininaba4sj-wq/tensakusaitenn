"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { SITE } from "@/lib/services";
import { SenpaiBrandName } from "@/components/SenpaiLink";

type LoginFormProps = {
  allowedEmails?: string[];
  title?: string;
  description?: string;
  storageKey?: string;
};

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function LoginForm({
  allowedEmails,
  title = "ログイン",
  description,
  storageKey = "goukaku_last_login_email",
}: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/mypage";
  const authError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState<string | null>(
    authError ? "ログインに失敗しました。もう一度お試しください。" : null,
  );
  const [loading, setLoading] = useState(false);
  const [lastEmail, setLastEmail] = useState<string | null>(null);

  const allowedSet = useMemo(() => {
    if (!allowedEmails || allowedEmails.length === 0) return null;
    return new Set(allowedEmails.map(normalizeEmail));
  }, [allowedEmails]);

  const loginDescription =
    description ??
    `${SITE.senpaiName}と同じメールアドレス・パスワードでログインできます。依頼した添削・採点・質問の返答はマイページで確認できます。`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      setLastEmail(saved);
    }
  }, [storageKey]);

  function canUseEmail(targetEmail: string): boolean {
    if (!allowedSet) return true;
    return allowedSet.has(normalizeEmail(targetEmail));
  }

  function ensureAllowedEmail(): boolean {
    if (canUseEmail(email)) return true;
    setMessage("このメールアドレスではログインできません（運営用アカウントのみ）。");
    setLoading(false);
    return false;
  }

  function rememberEmail(targetEmail: string) {
    const normalized = normalizeEmail(targetEmail);
    if (!normalized) return;
    setLastEmail(normalized);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, normalized);
    }
  }

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
    if (!ensureAllowedEmail()) return;
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    rememberEmail(email);
    router.push(next);
    router.refresh();
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    if (!ensureAllowedEmail()) return;
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    rememberEmail(email);
    setOtpSent(true);
    setOtpCode("");
    setMessage(
      "メールを送信しました。届いた6桁のコードを入力するか、メール内のリンクを開いてログインしてください。",
    );
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    if (!ensureAllowedEmail()) return;
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otpCode.trim(),
      type: "email",
    });
    setLoading(false);
    if (error) {
      setMessage("コードが正しくないか、期限切れです。もう一度お試しください。");
      return;
    }
    rememberEmail(email);
    router.push(next);
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm">
      <h1 className="text-xl font-bold">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
        {loginDescription}
      </p>
      {allowedSet && (
        <p className="mt-2 rounded-xl bg-[#fff7f8] px-3 py-2 text-xs font-bold text-[var(--accent)]">
          運営で許可されたメールアドレスのみログインできます。
        </p>
      )}
      {lastEmail && (
        <button
          type="button"
          onClick={() => setEmail(lastEmail)}
          className="mt-3 rounded-lg border border-[var(--line)] px-3 py-2 text-xs font-bold text-[var(--senpai-dark)]"
        >
          前回のメールで入力する（{lastEmail}）
        </button>
      )}

      <div className="mt-4 flex rounded-xl border border-[var(--line)] bg-[var(--bg)] p-1">
        <button
          type="button"
          onClick={() => {
            setMode("password");
            setOtpSent(false);
            setOtpCode("");
            setMessage(null);
          }}
          className={`flex-1 rounded-lg py-2 text-xs font-bold ${
            mode === "password" ? "bg-white shadow-sm" : "text-[var(--muted)]"
          }`}
        >
          メール＋パスワード
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("magic");
            setOtpSent(false);
            setOtpCode("");
            setMessage(null);
          }}
          className={`flex-1 rounded-lg py-2 text-xs font-bold ${
            mode === "magic" ? "bg-white shadow-sm" : "text-[var(--muted)]"
          }`}
        >
          メール認証
        </button>
      </div>

      <form
        className="mt-5 space-y-4"
        onSubmit={
          mode === "password"
            ? handlePasswordLogin
            : otpSent
              ? handleVerifyOtp
              : handleMagicLink
        }
      >
        <label className="block">
          <span className="text-sm font-semibold">メールアドレス</span>
          <input
            required
            type="email"
            autoComplete="username email"
            readOnly={mode === "magic" && otpSent}
            className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2.5 text-sm disabled:opacity-70"
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

        {mode === "magic" && otpSent && (
          <label className="block">
            <span className="text-sm font-semibold">6桁の認証コード</span>
            <input
              required
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2.5 text-center text-lg tracking-[0.3em] font-bold"
              placeholder="000000"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />
          </label>
        )}

        {message && (
          <p
            className={`text-sm ${message.includes("送信") || message.includes("コード") ? "text-[var(--senpai-dark)]" : "text-[var(--accent)]"}`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[var(--accent)] py-3.5 text-sm font-bold text-white disabled:opacity-60"
        >
          {loading
            ? "送信中…"
            : mode === "password"
              ? "ログイン"
              : otpSent
                ? "コードでログイン"
                : "認証コードを送る"}
        </button>

        {mode === "magic" && otpSent && (
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setOtpSent(false);
              setOtpCode("");
              setMessage(null);
            }}
            className="w-full text-xs font-bold text-[var(--muted)]"
          >
            メールアドレスを変更 / コードを再送する
          </button>
        )}
      </form>

      <p className="mt-4 text-center text-xs text-[var(--muted)]">
        この端末でパスワードを保存すると、Face ID / Touch ID などですばやくログインできます。
      </p>

      <p className="mt-2 text-center text-xs text-[var(--muted)]">
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
