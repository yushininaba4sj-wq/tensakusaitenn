"use client";

import { useState } from "react";
import { QA_CATEGORIES } from "@/lib/services";

type QaFormProps = {
  title: string;
};

export function QaForm({ title }: QaFormProps) {
  const [category, setCategory] = useState<string>(QA_CATEGORIES[0]);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        わからない問題・勉強法・志望校のこと、何でも聞いてください。
      </p>
      <form
        className="mt-5 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <div>
          <span className="text-sm font-semibold">科目・カテゴリ</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {QA_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                  category === c
                    ? "bg-[var(--accent)] text-white"
                    : "border border-[var(--line)] bg-[var(--bg)]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <label className="block">
          <span className="text-sm font-semibold">質問内容</span>
          <textarea
            required
            className="mt-2 w-full min-h-[140px] rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
            placeholder="例：関係代名詞の which と that の使い分けがいつも迷います…"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">問題の写真（任意）</span>
          <input
            type="file"
            accept="image/*"
            className="mt-2 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-[var(--accent)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-xl bg-[var(--accent)] py-3.5 text-sm font-bold text-white"
        >
          {submitted ? "投稿しました（デモ）" : "質問を送る"}
        </button>
      </form>
      {submitted && (
        <p className="mt-3 text-center text-xs text-[var(--muted)]">
          予備校講師、現役早慶生が24時間以内を目安に回答します。
        </p>
      )}
    </div>
  );
}
