import type { Metadata } from "next";
import { CorrectionPreview } from "@/components/CorrectionPreview";
import { JsonLd } from "@/components/JsonLd";
import { ServicePageShell } from "@/components/ServicePageShell";
import { SubmitForm } from "@/components/SubmitForm";
import { getService } from "@/lib/services";
import { breadcrumbJsonLd, buildPageMetadata, serviceJsonLd } from "@/lib/seo";

const service = getService("kakomon");

export const metadata: Metadata = buildPageMetadata({
  title: "過去問採点",
  description:
    "過去問の答案画像を提出して採点。総合得点・設問別得点・部分点・減点理由・合格者平均との差を返却。",
  path: "/kakomon",
  keywords: ["過去問 採点", "過去問 添削", "大学受験 過去問"],
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
      <SubmitForm
        service="kakomon"
        title="過去問答案を提出する"
        placeholder="大学名、年度、教科、知りたいこと（配点・採点・傾向など）を書いてください。"
        tips={[
          "大学名・年度・教科を必ず書いてください。",
          "答案画像を添付してください。",
          "「何点取れているか」「どこで減点されたか」を具体的に。",
        ]}
        imageLabel="過去問・答案画像"
        submitLabel="過去問を採点依頼する"
      />
      <p className="mt-4 text-xs text-[var(--muted)]">
        ※採点結果に弱点分析・改善提案もセットで返却します
      </p>
      <CorrectionPreview type="kakomon" />
    </ServicePageShell>
  );
}
