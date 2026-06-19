import Link from "next/link";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { SenpaiBrandName, SenpaiLink } from "@/components/SenpaiLink";
import { ServiceCard } from "@/components/ServiceCard";
import { FAQ_ITEMS } from "@/lib/faq";
import { CAMPAIGN, SERVICES, SITE } from "@/lib/services";
import { faqJsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <main>
      <JsonLd data={faqJsonLd([...FAQ_ITEMS])} />

      {/* ↓ デザイン修正: ヒーローセクション */}
      <section className="bg-white px-4 py-14 md:py-20">
        <div className="mx-auto max-w-lg md:max-w-2xl">
          {/* ↓ デザイン修正: SENPAI LINK 関連バッジ */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg-sub)] px-3.5 py-1.5 text-[12px] text-[var(--muted)]">
            <span className="font-bold text-[var(--ink)]">SENPAI LINK</span>
            <span aria-hidden="true">·</span>
            <span>関連サービス</span>
          </div>

          {CAMPAIGN.active && (
            <div className="mt-5 rounded-xl border border-[var(--accent)]/20 bg-white px-4 py-3 text-center shadow-sm">
              <p className="text-[12px] font-bold tracking-wide text-[var(--accent)]">
                {CAMPAIGN.label}
              </p>
              <p className="mt-1 text-base font-bold text-[var(--ink)]">
                {CAMPAIGN.message}
              </p>
            </div>
          )}

          <p className="mt-6 text-[12px] font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
            {SITE.tagline}
          </p>

          <h1 className="mt-4 text-[28px] font-bold leading-[1.16] tracking-tight sm:text-[32px] md:text-[48px]">
            <span className="block text-[22px] text-[var(--accent)] sm:text-[26px] md:text-[32px]">
              GOUKAKU LINK（合格リンク）
            </span>
            <span className="mt-2 block">学習計画から</span>
            <span className="block sm:hidden">添削・採点・</span>
            <span className="block sm:hidden">質問まで。</span>
            <span className="hidden sm:block">添削・採点・質問まで。</span>
          </h1>

          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[var(--muted)] md:text-[16px]">
            予備校講師、現役早慶生が対応。添削・採点の結果には弱点分析もセットで返ります。
          </p>

          {/* ↓ デザイン修正: CTAボタン（赤アクセント） */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/plan"
              className="rounded-xl bg-[var(--accent)] px-6 py-4 text-center text-[15px] font-bold text-white shadow-sm transition hover:bg-[var(--accent-hover)]"
            >
              学習計画を作る
            </Link>
            <Link
              href="/tensaku"
              className="rounded-xl border border-[var(--line)] bg-white px-6 py-4 text-center text-[15px] font-bold text-[var(--ink)] transition hover:border-[var(--accent)]/30 hover:text-[var(--accent)]"
            >
              添削を依頼する
            </Link>
          </div>

          <SenpaiLink className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-[var(--line)] bg-[var(--bg-sub)] px-5 py-4 text-[14px] font-bold transition hover:border-[var(--accent)]/25">
            <span className="min-w-0 text-[var(--ink)]">同じ境遇の先輩に相談</span>
            <span className="shrink-0 whitespace-nowrap text-[var(--muted)]">
              <SenpaiBrandName /> →
            </span>
          </SenpaiLink>
        </div>
      </section>

      {/* ↓ デザイン修正: サービス一覧 */}
      <section className="bg-[var(--bg-sub)] px-4 py-14 md:py-16" id="services">
        <div className="mx-auto max-w-lg md:max-w-2xl">
          <h2 className="text-[24px] font-bold md:text-[28px]">サービス一覧</h2>
          <p className="mt-3 max-w-[17rem] text-[13px] leading-relaxed text-[var(--muted)] md:max-w-none md:text-[14px]">
            必要なものだけ、必要なタイミングで使えます。
          </p>
          <div className="mt-8 grid gap-4">
            {SERVICES.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </div>
      </section>

      {/* ↓ デザイン修正: 使い方セクション */}
      <section className="border-y border-[var(--line)] bg-white px-4 py-14 md:py-16">
        <div className="mx-auto max-w-lg md:max-w-2xl">
          <h2 className="text-[24px] font-bold md:text-[28px]">使い方</h2>
          <p className="mt-3 text-[13px] text-[var(--muted)]">
            4つのサービスを、必要なときにそのまま使えます。
          </p>
          <div className="mt-8 space-y-4">
            {[
              {
                step: "01",
                title: "学習計画",
                body: "参考書の範囲・周回数から1日ノルマを計算。今日やるタスクが届く。",
                href: "/plan",
              },
              {
                step: "02",
                title: "添削（小論文・英作文）",
                body: "タブで切り替えて提出。弱点分析つきの添削結果が返る。",
                href: "/tensaku",
              },
              {
                step: "03",
                title: "過去問採点",
                body: "答案画像を送る → 得点・減点理由・弱点分析が返る。",
                href: "/kakomon",
              },
              {
                step: "04",
                title: "わからない質問",
                body: "問題の解き方や勉強法を、そのまま質問できる。",
                href: "/qa",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex gap-4 rounded-2xl border border-[var(--line)] bg-white p-5 transition hover:border-[var(--accent)]/25 hover:shadow-sm"
              >
                <span className="shrink-0 text-[13px] font-bold text-[var(--accent)]">
                  {item.step}
                </span>
                <div>
                  <p className="text-[16px] font-bold text-[var(--ink)] group-hover:text-[var(--accent)]">
                    {item.title}
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-[var(--muted)]">
                    {item.body}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FaqSection />

      {/* ↓ デザイン修正: 下部CTA（白基調＋赤ボタン） */}
      <section className="bg-[var(--bg-sub)] px-4 py-14 md:py-16">
        <div className="mx-auto max-w-lg rounded-2xl border border-[var(--line)] bg-white px-6 py-10 text-center shadow-sm md:max-w-2xl md:px-10 md:py-12">
          <h2 className="text-[24px] font-bold md:text-[28px]">
            {CAMPAIGN.active ? "今だけ全サービス無料" : `${SITE.name}で始める`}
          </h2>
          <p className="mt-3 text-[13px] text-[var(--muted)]">
            まずは学習計画から。アカウントは SENPAI LINK と共通です。
          </p>
          <Link
            href="/plan"
            className="mt-8 inline-block w-full rounded-xl bg-[var(--accent)] py-4 text-[15px] font-bold text-white transition hover:bg-[var(--accent-hover)] sm:max-w-xs"
          >
            無料で始める
          </Link>
          <SenpaiLink className="mt-3 block w-full rounded-xl border border-[var(--line)] py-4 text-[14px] font-bold text-[var(--ink)] transition hover:border-[var(--accent)]/25 sm:max-w-xs sm:mx-auto">
            <SenpaiBrandName /> で先輩を探す →
          </SenpaiLink>
        </div>
      </section>
    </main>
  );
}
