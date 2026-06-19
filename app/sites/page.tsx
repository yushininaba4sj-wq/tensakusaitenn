import Link from "next/link";
import { NEW_SITE_CONTACT_EMAIL, RELATED_SITES } from "@/lib/relatedSites";
import { SITE } from "@/lib/services";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "関連サービス・新しいサイト",
  description:
    "GOUKAKU LINK と連携する SENPAI LINK、StudyStyle診断などの関連サービス一覧。新しい受験サービスサイトの追加・相談もこちら。",
  path: "/sites",
  keywords: ["関連サービス", "受験 サービス", "新しいサイト"],
});

export default function SitesPage() {
  return (
    <main className="px-4 py-10 pb-28">
      <div className="mx-auto max-w-lg">
        <Link href="/" className="text-sm font-bold text-[var(--accent)]">
          ← トップ
        </Link>

        <p className="mt-6 text-[12px] font-bold uppercase tracking-widest text-[var(--accent)]">
          LINK サービス
        </p>
        <h1 className="mt-2 text-[26px] font-bold leading-tight">新しいサイト・関連サービス</h1>
        <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
          {SITE.nameJa} と一緒に使えるサービス一覧です。新しいサイトの追加・共同運用の相談も受け付けています。
        </p>

        <div className="mt-8 space-y-3">
          {RELATED_SITES.map((site) => {
            const card = (
              <>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[16px] font-bold text-[var(--ink)]">{site.name}</p>
                  {site.badge && (
                    <span className="shrink-0 rounded-full bg-[var(--bg-sub)] px-2 py-0.5 text-[10px] font-bold text-[var(--muted)]">
                      {site.badge}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{site.description}</p>
                <p className="mt-3 text-sm font-bold text-[var(--accent)]">
                  {site.external ? "開く ↗" : "見る →"}
                </p>
              </>
            );

            if (site.external) {
              return (
                <a
                  key={site.id}
                  href={site.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm transition hover:border-[var(--accent)]/30"
                >
                  {card}
                </a>
              );
            }

            return (
              <Link
                key={site.id}
                href={site.href}
                className="block rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm transition hover:border-[var(--accent)]/30"
              >
                {card}
              </Link>
            );
          })}
        </div>

        <section className="mt-10 rounded-2xl border border-[var(--accent)]/20 bg-[var(--bg-sub)] p-5">
          <h2 className="text-[18px] font-bold">新しいサイトを作る</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            受験・学習系の新サービスを一緒に立ち上げたい場合は、下記まで連絡してください。GOUKAKU
            LINK と同じ Supabase・運用フローで追加できます。
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            <li>· サービス名・やりたいこと</li>
            <li>· 想定ユーザー（受験生 / 運営 など）</li>
            <li>· 公開希望時期</li>
          </ul>
          <a
            href={`mailto:${NEW_SITE_CONTACT_EMAIL}?subject=${encodeURIComponent("新しいサイトの相談（GOUKAKU LINK）")}`}
            className="mt-5 block rounded-xl bg-[var(--accent)] px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-[var(--accent-hover)]"
          >
            メールで相談する
          </a>
        </section>
      </div>
    </main>
  );
}
