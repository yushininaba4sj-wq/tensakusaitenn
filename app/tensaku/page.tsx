import type { Metadata } from "next";
import { Suspense } from "react";
import { JsonLd } from "@/components/JsonLd";
import { ServicePageShell } from "@/components/ServicePageShell";
import { TensakuAppLoader } from "@/components/TensakuAppLoader";
import { getService } from "@/lib/services";
import { breadcrumbJsonLd, buildPageMetadata, serviceJsonLd } from "@/lib/seo";

const service = getService("tensaku");

export const metadata: Metadata = buildPageMetadata({
  title: "大学受験 小論文・英作文添削",
  description:
    "大学受験の小論文・英作文をオンラインで添削。慶應・早稲田・MARCH向けに課題理解・構成・文法・語彙を数値化。弱点分析・改善提案つき。",
  path: "/tensaku",
  keywords: [
    "大学受験 添削",
    "小論文 添削",
    "英作文 添削",
    "早慶 添削",
    "慶應 英作文",
    "早稲田 小論文",
    "MARCH 添削",
  ],
});

export default function TensakuPage() {
  return (
    <ServicePageShell service={service}>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "ホーム", path: "/" },
            { name: "添削", path: "/tensaku" },
          ]),
          serviceJsonLd({
            name: service.title,
            description: service.short,
            path: service.href,
            price: service.price,
          }),
        ]}
      />
      <Suspense fallback={<p className="text-sm text-[var(--muted)]">読み込み中…</p>}>
        <TensakuAppLoader />
      </Suspense>
    </ServicePageShell>
  );
}
