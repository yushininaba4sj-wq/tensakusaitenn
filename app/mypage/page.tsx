import Link from "next/link";
import { MyPageClient } from "@/components/MyPageClient";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "マイページ",
  description: "添削・採点・質問の依頼状況と返答結果を確認。",
  path: "/mypage",
});

export default function MyPage() {
  return (
    <main className="px-4 py-10 pb-24">
      <div className="mx-auto max-w-lg">
        <Link href="/" className="text-sm font-bold text-[var(--accent)]">
          ← トップ
        </Link>
        <div className="mt-6">
          <MyPageClient />
        </div>
      </div>
    </main>
  );
}
