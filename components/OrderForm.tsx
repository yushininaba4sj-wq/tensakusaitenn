"use client";

import { useState } from "react";

type OrderFormProps = {
  service: "tensaku" | "kakomon";
  title: string;
  placeholder: string;
  tips: string[];
};

export function OrderForm({ service, title, placeholder, tips }: OrderFormProps) {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-4 rounded-xl bg-[#fff7f8] px-4 py-3 text-sm text-[var(--accent-dark)]">
        <p className="font-bold">投稿の際のお願い</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
      <form className="mt-5 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <label className="block">
          <span className="text-sm font-semibold">内容</span>
          <textarea
            className="mt-2 w-full min-h-[120px] rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
            placeholder={placeholder}
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">
            {service === "tensaku" ? "答案画像" : "過去問・答案画像"}（任意）
          </span>
          <input
            type="file"
            accept="image/*"
            className="mt-2 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-[var(--accent)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) {
                setPreview(null);
                return;
              }
              const reader = new FileReader();
              reader.onload = () =>
                setPreview(typeof reader.result === "string" ? reader.result : null);
              reader.readAsDataURL(file);
            }}
          />
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="プレビュー"
              className="mt-3 max-h-48 rounded-lg border border-[var(--line)]"
            />
          )}
        </label>
        <button
          type="submit"
          disabled
          className="w-full rounded-xl bg-[var(--accent)] py-3 text-sm font-bold text-white opacity-80"
        >
          送信（準備中）
        </button>
      </form>
      <p className="mt-3 text-center text-xs text-[var(--muted)]">
        決済・返信機能は次のステップで接続します
      </p>
    </div>
  );
}
