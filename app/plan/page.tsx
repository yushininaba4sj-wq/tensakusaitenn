import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { ServicePageShell } from "@/components/ServicePageShell";
import { StudyPlanApp } from "@/components/StudyPlanApp";
import { getService } from "@/lib/services";
import { breadcrumbJsonLd, buildPageMetadata, serviceJsonLd } from "@/lib/seo";

const service = getService("plan");

export const metadata: Metadata = buildPageMetadata({
  title: "学習計画",
  description:
    "志望校・偏差値・試験日から年間・月間・週間・今日のタスクまで、あなたに合った学習計画を立てる。進捗に合わせて毎日見直し。",
  path: "/plan",
  keywords: ["学習計画", "受験 スケジュール", "学習計画 立て方"],
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
