import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { KakomonApp } from "@/components/KakomonApp";
import { ServicePageShell } from "@/components/ServicePageShell";
import { getService } from "@/lib/services";
import { breadcrumbJsonLd, buildPageMetadata, serviceJsonLd } from "@/lib/seo";

const service = getService("kakomon");

export const metadata: Metadata = buildPageMetadata({
  title: "大学受験 過去問採点",
  description:
    "大学受験の過去問答案をオンラインで採点。慶應・早稲田・MARCH向けに総合得点・設問別得点・部分点・減点理由・弱点分析を返却。",
  path: "/kakomon",
  keywords: [
    "過去問 採点",
    "大学受験 過去問",
    "早慶 過去問",
    "慶應 過去問",
    "早稲田 過去問",
    "MARCH 過去問",
  ],
});

export default function KakomonPage() {
  return (
    <ServicePageShell service={service}>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "ホーム", path: "/" },
            { name: "過去問採点", path: "/kakomon" },
          ]),
          serviceJsonLd({
            name: service.title,
            description: service.short,
            path: service.href,
            price: service.price,
          }),
        ]}
      />
      <KakomonApp />
    </ServicePageShell>
  );
}
