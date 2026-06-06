"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { QA_CATEGORIES } from "@/lib/services";
import { isSupabaseConfigured } from "@/lib/supabase/client";

type QaFormProps = {
  title: string;
};

export function QaForm({ title }: QaFormProps) {
  const router = useRouter();
  const [category, setCategory] = useState<string>(QA_CATEGORIES[0]);
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured()) {
      setSubmitted(true);
      return;
    }

    setLoading(true);
    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service: "qa",
        title: `わからない質問（${category}）`,
        content: `【${category}】\n${content}`,
      }),
    });
    setLoading(false);

    if (res.status === 401) {
      router.push("/login?next=/qa");
      return;
    }

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "送信に失敗しました");
      return;
    }

    setSubmitted(true);
  }

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        わからない問題・勉強法・志望校のこと、何でも聞いてください。
      </p>
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
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
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
        {error && <p className="text-sm text-[var(--accent)]">{error}</p>}
        <button
          type="submit"
          disabled={loading || submitted}
          className="w-full rounded-xl bg-[var(--accent)] py-3.5 text-sm font-bold text-white disabled:opacity-60"
        >
          {loading ? "送信中…" : submitted ? "投稿しました" : "質問を送る"}
        </button>
      </form>
      {submitted && (
        <div className="mt-3 space-y-2 text-center text-xs text-[var(--muted)]">
          <p>予備校講師、現役早慶生が24時間以内を目安に回答します。</p>
          {isSupabaseConfigured() && (
            <Link href="/mypage" className="font-bold text-[var(--accent)]">
              マイページで返答を確認 →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
