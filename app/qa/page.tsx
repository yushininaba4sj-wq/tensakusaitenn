import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { QaForm } from "@/components/QaForm";
import { ServicePageShell } from "@/components/ServicePageShell";
import { getService } from "@/lib/services";
import { breadcrumbJsonLd, buildPageMetadata, serviceJsonLd } from "@/lib/seo";

const service = getService("qa");

export const metadata: Metadata = buildPageMetadata({
  title: "わからない質問",
  description:
    "勉強でわからないところをそのまま質問。英語・数学・国語・理科・社会・小論文・総合型選抜に対応。予備校講師、現役早慶生が回答。",
  path: "/qa",
  keywords: ["受験 質問", "勉強 わからない", "大学受験 Q&A"],
});

export default function QaPage() {
  return (
    <ServicePageShell service={service}>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "ホーム", path: "/" },
            { name: "わからない質問", path: "/qa" },
          ]),
          serviceJsonLd({
            name: service.title,
            description: service.short,
            path: service.href,
            price: service.price,
          }),
        ]}
      />
      <div className="mb-6 rounded-2xl border border-[var(--line)] bg-[#fff7f8] px-4 py-4">
        <p className="text-sm font-bold text-[var(--accent-dark)]">
          こんなときに使う
        </p>
        <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
          <li>· 問題の解き方がわからない</li>
          <li>· この勉強法で合ってるか不安</li>
          <li>· 志望校選びで迷っている</li>
        </ul>
      </div>
      <QaForm title="わからないところを質問する" />
    </ServicePageShell>
  );
}
