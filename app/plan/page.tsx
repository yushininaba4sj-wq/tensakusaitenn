import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { ServicePageShell } from "@/components/ServicePageShell";
import { StudyPlanApp } from "@/components/StudyPlanApp";
import { getService } from "@/lib/services";
import { breadcrumbJsonLd, buildPageMetadata, serviceJsonLd } from "@/lib/seo";

const service = getService("plan");

export const metadata: Metadata = buildPageMetadata({
  title: "大学受験 学習計画",
  description:
    "大学受験向けの学習計画を自動作成。志望校・偏差値・試験日から年間・月間・週間・今日のタスクまで、早慶・MARCH志望の受験生向けに1日ノルマを計算。",
  path: "/plan",
  keywords: [
    "大学受験 学習計画",
    "学習計画",
    "受験 スケジュール",
    "早慶 学習計画",
  ],
});

export default function PlanPage() {
  return (
    <ServicePageShell service={service}>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "ホーム", path: "/" },
            { name: "学習計画", path: "/plan" },
          ]),
          serviceJsonLd({
            name: service.title,
            description: service.short,
            path: service.href,
            price: service.price,
          }),
        ]}
      />
      <StudyPlanApp />
    </ServicePageShell>
  );
}
