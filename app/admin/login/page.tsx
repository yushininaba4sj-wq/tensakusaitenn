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
});

export default function AdminLoginPage() {
  return (
    <main className="px-4 py-10">
      <div className="mx-auto max-w-lg">
        <Link href="/" className="text-sm font-bold text-[var(--accent)]">
          ← トップ
        </Link>
        <div className="mt-6">
          <Suspense fallback={<p className="text-sm text-[var(--muted)]">読み込み中…</p>}>
            <LoginForm
              allowedEmails={allowedEmails}
              title="運営ログイン"
              description="運営用の許可メールアドレスだけログインできます。端末のパスワード保存を使うと生体認証でもすぐ入れます。"
              storageKey="goukaku_operator_last_email"
            />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
