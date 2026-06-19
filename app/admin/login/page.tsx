import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";
import { buildPageMetadata } from "@/lib/seo";

const allowedEmails = (process.env.OPERATOR_ALLOWED_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim())
  .filter(Boolean);

export const metadata = buildPageMetadata({
  title: "運営ログイン",
  description: "運営用メールアドレスのみログインできる管理者向けログイン画面。",
  path: "/admin/login",
  privatePage: true,
});

export default function AdminLoginPage() {
  const isConfigured = allowedEmails.length > 0;

  return (
    <main className="px-4 py-10">
      <div className="mx-auto max-w-lg">
        <Link href="/" className="text-sm font-bold text-[var(--accent)]">
          ← トップ
        </Link>
        <div className="mt-6">
          {!isConfigured ? (
            <div className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm">
              <h1 className="text-xl font-bold">運営ログイン（未設定）</h1>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                Vercel の環境変数 <code className="text-xs">OPERATOR_ALLOWED_EMAILS</code>{" "}
                が未設定のため、運営ログインは停止しています（誰でも入れない状態）。
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                許可するメールをカンマ区切りで設定し、再デプロイしてください。最大5件まで推奨。
              </p>
              <pre className="mt-4 overflow-x-auto rounded-xl bg-[var(--bg)] p-3 text-xs">
                OPERATOR_ALLOWED_EMAILS=admin1@example.com,admin2@example.com
              </pre>
            </div>
          ) : (
            <Suspense fallback={<p className="text-sm text-[var(--muted)]">読み込み中…</p>}>
              <LoginForm
                allowedEmails={allowedEmails}
                requireAllowedList
                title="運営ログイン"
                description="運営用の許可メールアドレスだけログインできます。端末のパスワード保存を使うと生体認証でもすぐ入れます。"
                storageKey="goukaku_operator_last_email"
              />
              <p className="mt-4 text-center text-xs text-[var(--muted)]">
                許可中: {allowedEmails.length}件（変更は Vercel の OPERATOR_ALLOWED_EMAILS）
              </p>
            </Suspense>
          )}
        </div>
      </div>
    </main>
  );
}
