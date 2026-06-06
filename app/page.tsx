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

      <section className="border-b border-[var(--line)] bg-white px-4 py-10">
        <div className="mx-auto max-w-lg">
          {CAMPAIGN.active && (
            <div className="mb-5 rounded-2xl border border-[var(--accent)]/30 bg-[#fff7f8] px-4 py-3 text-center">
              <p className="text-xs font-bold text-[var(--accent)]">{CAMPAIGN.label}</p>
              <p className="mt-1 text-base font-bold">{CAMPAIGN.message}</p>
            </div>
          )}
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
            {SITE.tagline}
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight">
            学習計画から
            <br />
            添削・採点・質問まで。
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
            予備校講師、現役早慶生が対応。添削・採点の結果には弱点分析もセットで返ります。
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/plan"
              className="rounded-xl bg-[var(--accent)] px-5 py-3.5 text-center text-sm font-bold text-white"
            >
              学習計画を作る
            </Link>
            <Link
              href="/tensaku"
              className="rounded-xl border border-[var(--line)] bg-white px-5 py-3.5 text-center text-sm font-bold"
            >
              添削を依頼する
            </Link>
          </div>
          <SenpaiLink className="mt-4 flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm font-bold">
            <span>同じ境遇の先輩に相談</span>
            <span className="text-[var(--muted)]">
              <SenpaiBrandName /> →
            </span>
          </SenpaiLink>
        </div>
      </section>

      <section className="px-4 py-10" id="services">
        <div className="mx-auto max-w-lg">
          <h2 className="text-xl font-bold">サービス</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            下のタブからすぐ移動できます。
          </p>
          <div className="mt-5 grid gap-3">
            {SERVICES.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-white px-4 py-10">
        <div className="mx-auto max-w-lg">
          <h2 className="text-xl font-bold">使い方</h2>
          <div className="mt-4 space-y-3">
            {[
              {
                title: "学習計画",
                body: "志望校・偏差値・試験日を入力 → 今日やるタスクが届く。",
                href: "/plan",
              },
              {
                title: "添削（小論文・英作文）",
                body: "タブで切り替えて提出。弱点分析つきの添削結果が返る。",
                href: "/tensaku",
              },
              {
                title: "過去問採点",
                body: "答案画像を送る → 得点・減点理由・弱点分析が返る。",
                href: "/kakomon",
              },
              {
                title: "わからない質問",
                body: "問題の解き方や勉強法を、そのまま質問できる。",
                href: "/qa",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-4"
              >
                <p className="font-bold">{item.title}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{item.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FaqSection />

      <section className="px-4 py-10">
        <div className="mx-auto max-w-lg rounded-2xl bg-[var(--ink)] px-5 py-8 text-center text-white">
          <h2 className="text-xl font-bold">
            {CAMPAIGN.active ? "今だけ全サービス無料" : "GOUKAKU LINKで始める"}
          </h2>
          <Link
            href="/plan"
            className="mt-5 inline-block w-full rounded-xl bg-white py-3.5 text-sm font-bold text-[var(--ink)]"
          >
            無料で始める
          </Link>
          <SenpaiLink className="mt-3 block w-full rounded-xl border border-white/30 py-3.5 text-sm font-bold text-white">
            <SenpaiBrandName /> で先輩を探す →
          </SenpaiLink>
        </div>
      </section>
    </main>
  );
}
