"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitLoginNotice } from "@/components/SubmitLoginNotice";
import type { SubmissionService } from "@/lib/submissions";
import { uploadSubmissionImages } from "@/lib/submissionImages";
import { createClient, getAccessToken, isSupabaseConfigured } from "@/lib/supabase/client";
import { useAuthReady } from "@/lib/useAuthReady";

type SubmitFormProps = {
  service: SubmissionService;
  title: string;
  placeholder: string;
  tips: string[];
  imageLabel?: string;
  extraFields?: React.ReactNode;
  submitLabel?: string;
  onPreviewSubmit?: () => void;
  formatSubmission?: (content: string) => { title?: string; content: string };
};

export function SubmitForm({
  service,
  title,
  placeholder,
  tips,
  imageLabel = "画像（任意）",
  extraFields,
  submitLabel = "送信する",
  onPreviewSubmit,
  formatSubmission,
}: SubmitFormProps) {
  const router = useRouter();
  const { requiresLogin } = useAuthReady();
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured()) {
      setSubmitted(true);
      onPreviewSubmit?.();
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setLoading(true);

    let imageUrls: string[] = [];
    let imagePaths: string[] = [];

    if (imageFile) {
      const upload = await uploadSubmissionImages(supabase, user.id, [imageFile]);
      if (upload.error) {
        setLoading(false);
        setError(upload.error);
        return;
      }
      imageUrls = upload.urls;
      imagePaths = upload.paths;
    }

    const payload = formatSubmission?.(content) ?? { content };
    const accessToken = await getAccessToken(supabase);
    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service,
        content: payload.content,
        title: payload.title ?? title,
        image_urls: imageUrls,
        image_paths: imagePaths,
        access_token: accessToken,
      }),
    });
    setLoading(false);

    if (res.status === 401) {
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "送信に失敗しました");
      return;
    }

    setSubmitted(true);
    onPreviewSubmit?.();
  }

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold">{title}</h2>
      {requiresLogin && <SubmitLoginNotice />}
      <div className="mt-4 rounded-xl bg-[#fff7f8] px-4 py-3 text-sm text-[var(--accent-dark)]">
        <p className="font-bold">投稿の際のお願い</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        {extraFields}
        <label className="block">
          <span className="text-sm font-semibold">内容</span>
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-2 w-full min-h-[120px] rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
            placeholder={placeholder}
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">{imageLabel}</span>
          <input
            type="file"
            accept="image/*"
            className="mt-2 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-[var(--accent)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) {
                setPreview(null);
                setImageFile(null);
                return;
              }
              setImageFile(file);
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
        {error && <p className="text-sm text-[var(--accent)]">{error}</p>}
        <button
          type="submit"
          disabled={loading || submitted}
          className="w-full rounded-xl bg-[var(--accent)] py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          {loading
            ? "送信中…"
            : submitted
              ? "送信しました"
              : requiresLogin
                ? "ログインして送信する"
                : submitLabel}
        </button>
      </form>
      {submitted && (
        <div className="mt-3 space-y-2 text-center text-xs text-[var(--muted)]">
          <p>24時間以内を目安に返却します。</p>
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
