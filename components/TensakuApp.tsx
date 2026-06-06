"use client";

import { useState } from "react";
import { CorrectionPreview } from "@/components/CorrectionPreview";
import { ScoreBars } from "@/components/ScoreBars";
import { SubmitForm } from "@/components/SubmitForm";
import {
  EIBUN_CRITERIA,
  SHORONBUN_CRITERIA,
  type TensakuType,
} from "@/lib/services";

const TABS: { id: TensakuType; label: string }[] = [
  { id: "shoronbun", label: "小論文" },
  { id: "eibun", label: "英作文" },
];

export function TensakuApp() {
  const [type, setType] = useState<TensakuType>("shoronbun");

  return (
    <div>
      <div className="flex rounded-xl border border-[var(--line)] bg-[var(--bg)] p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setType(tab.id)}
            className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition ${
              type === tab.id
                ? "bg-white text-[var(--accent)] shadow-sm"
                : "text-[var(--muted)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {type === "shoronbun" ? (
        <>
          <div className="mt-6 rounded-2xl border border-[var(--line)] bg-white p-5">
            <h2 className="text-sm font-bold">評価項目</h2>
            <ScoreBars
              items={SHORONBUN_CRITERIA.map((label, i) => ({
                label,
                score: [78, 65, 72, 70, 68, 85][i],
              }))}
            />
            <p className="mt-3 text-xs text-[var(--muted)]">
              ※返却時に弱点分析・改善提案もセットで届きます
            </p>
          </div>
          <SubmitForm
            title="小論文を提出する"
            placeholder="大学名、テーマ、字数、本文を書いてください。"
            tips={[
              "テーマと字数を必ず明記してください。",
              "答案はテキストまたは画像で提出できます。",
              "課題文がある場合は一緒に貼ってください。",
            ]}
            imageLabel="答案画像"
            submitLabel="小論文を添削依頼する"
          />
          <CorrectionPreview type="shoronbun" />
        </>
      ) : (
        <>
          <div className="mt-6 rounded-2xl border border-[var(--line)] bg-white p-5">
            <h2 className="text-sm font-bold">採点項目</h2>
            <ScoreBars
              items={EIBUN_CRITERIA.map((label, i) => ({
                label,
                score: [82, 74, 70, 76][i],
              }))}
            />
            <p className="mt-3 text-xs text-[var(--muted)]">
              ※返却時に弱点分析・改善提案もセットで届きます
            </p>
          </div>
          <SubmitForm
            title="英作文を提出する"
            placeholder="大学名・テーマ・語数・本文を書いてください。"
            tips={[
              "英検級または大学名・学部を明記してください。",
              "本文冒頭に英単語数を半角数字で記載（例: 104語）。",
              "答案はテキストまたは画像で提出できます。",
            ]}
            imageLabel="答案画像"
            submitLabel="英作文を添削依頼する"
          />
          <CorrectionPreview type="eibun" />
        </>
      )}
    </div>
  );
}
