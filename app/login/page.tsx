import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "ログイン",
  description:
    "SENPAI LINKと同じメールアドレスでログイン。添削・採点・質問の返答をマイページで確認。",
  path: "/login",
});

export default function LoginPage() {
  return (
    <main className="px-4 py-10">
      <div className="mx-auto max-w-lg">
        <Link href="/" className="text-sm font-bold text-[var(--accent)]">
          ← トップ
        </Link>
        <div className="mt-6">
        <Suspense fallback={<p className="text-sm text-[var(--muted)]">読み込み中…</p>}>
          <LoginForm />
        </Suspense>
        </div>
      </div>
    </main>
  );
}
