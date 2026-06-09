"use client";

import { useState } from "react";
import { CorrectionPreview } from "@/components/CorrectionPreview";
import { SubmitForm } from "@/components/SubmitForm";
import { KAKOMON_SUBJECTS } from "@/lib/services";

export function KakomonApp() {
  const [subject, setSubject] = useState<string>(KAKOMON_SUBJECTS[0]);

  return (
    <>
      <SubmitForm
        service="kakomon"
        title="過去問答案を提出する"
        placeholder="大学名、年度、知りたいこと（配点・採点・傾向など）を書いてください。"
        tips={[
          "大学名・年度・科目を必ず選んでください。",
          "答案画像を添付してください。",
        ]}
        imageLabel="過去問・答案画像"
        submitLabel="過去問を採点依頼する"
        formatSubmission={(content) => ({
          title: `過去問採点（${subject}）`,
          content: `【科目: ${subject}】\n${content}`,
        })}
        extraFields={
          <div>
            <span className="text-sm font-semibold">科目</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {KAKOMON_SUBJECTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSubject(s)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                    subject === s
                      ? "bg-[var(--accent)] text-white"
                      : "border border-[var(--line)] bg-[var(--bg)]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        }
      />
      <p className="mt-4 text-xs text-[var(--muted)]">
        ※採点結果に弱点分析・改善提案もセットで返却します
      </p>
      <CorrectionPreview type="kakomon" />
    </>
  );
}
