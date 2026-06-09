"use client";

import { useState } from "react";
import { ScoreBars } from "@/components/ScoreBars";
import { WeaknessPreview } from "@/components/WeaknessPreview";

type CorrectionPreviewProps = {
  type: "shoronbun" | "eibun" | "kakomon";
};

const MOCK = {
  shoronbun: {
    scores: [
      { label: "課題理解", score: 78 },
      { label: "構成", score: 65 },
      { label: "論理性", score: 72 },
      { label: "発想力", score: 70 },
      { label: "説得力", score: 68 },
      { label: "誤字脱字", score: 85 },
    ],
    good: ["問いへの答えが明確で、序論の入りが良い", "具体例が説得力を支えている"],
    improve: ["結論と本論の接続が弱い", "反対論点への言及が不足"],
    next: ["結論→根拠→具体例→まとめの型で1本書き直す"],
  },
  eibun: {
    scores: [
      { label: "文法", score: 82 },
      { label: "語彙", score: 74 },
      { label: "自然な表現", score: 70 },
      { label: "論理構成", score: 76 },
    ],
    good: ["主語と動詞の一致が取れている", "接続詞の使い方が適切"],
    improve: ["同じ語彙の繰り返しがある", "結論が最後に来ており、問いへの直接回答が遅い"],
    next: ["修正版を参考に、結論ファーストで書き直す"],
    revised:
      "In conclusion, online learning benefits students by offering flexibility. This allows them to study at their own pace while balancing other commitments.",
    mistakes: ["benefit → benefits（主語が複数）", "conclusion を冒頭にも配置すべき"],
    similar: ["provide flexibility", "enable self-paced study", "accommodate busy schedules"],
  },
  kakomon: {
    scores: [{ label: "総合得点", score: 68, max: 100 }],
    good: ["計算ミスが少ない", "途中式が丁寧"],
    improve: ["記述の結論が曖昧", "部分点を取りこぼしている設問あり"],
    next: ["設問(2)の記述結論を1文で明示する"],
    byQuestion: [
      { q: "大問1", score: 18, max: 20 },
      { q: "大問2", score: 22, max: 30 },
      { q: "大問3", score: 28, max: 50 },
    ],
    deductions: ["(2) 結論のキーワード不足 -3", "(3) 式の途中で条件を読み落とし -5"],
    avgDiff: "-7点（合格者平均比）",
  },
};

export function CorrectionPreview({ type }: CorrectionPreviewProps) {
  const [show, setShow] = useState(false);
  const data = MOCK[type];

  if (!show) {
    return (
      <button
        type="button"
        onClick={() => setShow(true)}
        className="mt-6 w-full rounded-xl border border-dashed border-[var(--accent)]/40 py-3 text-sm font-bold text-[var(--accent)]"
      >
        添削結果サンプルを見る（デモ）
      </button>
    );
  }

  return (
    <div className="mt-6 space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-5">
      <h3 className="font-bold">添削結果（サンプル）</h3>
      <ScoreBars items={data.scores} />

      {"byQuestion" in data && (
        <div className="rounded-xl bg-white p-4">
          <p className="text-sm font-bold">設問別得点</p>
          <ul className="mt-2 space-y-1 text-sm">
            {data.byQuestion.map((q) => (
              <li key={q.q} className="flex justify-between">
                <span>{q.q}</span>
                <span className="font-bold">
                  {q.score}/{q.max}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm font-bold">減点理由</p>
          <ul className="mt-1 space-y-1 text-sm text-[var(--muted)]">
            {data.deductions.map((d) => (
              <li key={d}>· {d}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm font-bold text-[var(--accent)]">
            合格者平均との差：{data.avgDiff}
          </p>
        </div>
      )}

      {"revised" in data && (
        <div className="rounded-xl bg-white p-4 text-sm">
          <p className="font-bold">修正版</p>
          <p className="mt-2 leading-relaxed text-[var(--muted)]">{data.revised}</p>
          <p className="mt-3 font-bold">間違い箇所</p>
          <ul className="mt-1 space-y-1 text-[var(--muted)]">
            {data.mistakes.map((m) => (
              <li key={m}>· {m}</li>
            ))}
          </ul>
          <p className="mt-3 font-bold">類似表現</p>
          <p className="mt-1 text-[var(--muted)]">{data.similar.join(" / ")}</p>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-3">
          <p className="text-xs font-bold text-[var(--accent)]">良かった点</p>
          <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
            {data.good.map((g) => (
              <li key={g}>· {g}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-white p-3">
          <p className="text-xs font-bold text-[var(--accent)]">改善点</p>
          <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
            {data.improve.map((g) => (
              <li key={g}>· {g}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-white p-3">
          <p className="text-xs font-bold text-[var(--accent)]">次回までの課題</p>
          <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
            {data.next.map((g) => (
              <li key={g}>· {g}</li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-bold">弱点分析（添削・採点結果に含まれます）</p>
        <WeaknessPreview embedded />
      </div>
    </div>
  );
}
