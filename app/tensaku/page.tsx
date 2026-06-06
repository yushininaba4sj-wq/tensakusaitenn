import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { ServicePageShell } from "@/components/ServicePageShell";
import { TensakuApp } from "@/components/TensakuApp";
import { getService } from "@/lib/services";
import { breadcrumbJsonLd, buildPageMetadata, serviceJsonLd } from "@/lib/seo";

const service = getService("tensaku");

export const metadata: Metadata = buildPageMetadata({
  title: "小論文・英作文添削",
  description:
    "小論文・英作文をオンラインで添削。課題理解・構成・文法・語彙を数値化。弱点分析・改善提案もセットで返却。",
  path: "/tensaku",
  keywords: ["小論文 添削", "英作文 添削", "大学受験 添削"],
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
      <TensakuApp />
    </ServicePageShell>
  );
}
