"use client";

import { useState } from "react";

const MOCK_WEAKNESS = {
  english: ["長文読解速度不足", "語彙不足"],
  math: ["場合の数が弱い", "記述力不足"],
  suggestions: [
    { book: "やっておきたい英語長文500", hours: "週5時間", priority: 1 },
    { book: "場合の数の基本問題精講", hours: "週3時間", priority: 2 },
    { book: "現代文キーワード読解", hours: "週2時間", priority: 3 },
  ],
};

type WeaknessPreviewProps = {
  embedded?: boolean;
};

export function WeaknessPreview({ embedded = false }: WeaknessPreviewProps) {
  const [show, setShow] = useState(embedded);

  if (!show) {
    return (
      <button
        type="button"
        onClick={() => setShow(true)}
        className="w-full rounded-xl border border-dashed border-[var(--accent)]/40 py-3 text-sm font-bold text-[var(--accent)]"
      >
        弱点分析サンプルを見る（デモ）
      </button>
    );
  }

  return (
    <div
      className={
        embedded
          ? "space-y-4 rounded-xl bg-white p-4"
          : "space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-5"
      }
    >
      {!embedded && <h3 className="font-bold">弱点分析（サンプル）</h3>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-[var(--bg)] p-4">
          <p className="text-sm font-bold">英語</p>
          <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
            {MOCK_WEAKNESS.english.map((w) => (
              <li key={w}>· {w}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-[var(--bg)] p-4">
          <p className="text-sm font-bold">数学</p>
          <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
            {MOCK_WEAKNESS.math.map((w) => (
              <li key={w}>· {w}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="rounded-xl bg-[var(--bg)] p-4">
        <p className="text-sm font-bold">志望校合格の現役大学生からの改善提案</p>
        <ul className="mt-3 space-y-3">
          {MOCK_WEAKNESS.suggestions.map((s) => (
            <li
              key={s.book}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 text-sm"
            >
              <span>
                <span className="mr-2 font-bold text-[var(--accent)]">優先{s.priority}</span>
                {s.book}
              </span>
              <span className="text-[var(--muted)]">{s.hours}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
