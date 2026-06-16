"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AttachmentList } from "@/components/AttachmentList";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  SERVICE_LABELS,
  STATUS_LABELS,
  type SubmissionRow,
} from "@/lib/submissions";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MyPageClient() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured()) {
        setLoading(false);
        setError("ログイン機能の設定が完了していません。");
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login?next=/mypage");
        return;
      }

      setEmail(user.email ?? null);

      const res = await fetch("/api/submissions");
      if (!res.ok) {
        setError("依頼一覧の取得に失敗しました。");
        setLoading(false);
        return;
      }

      const json = await res.json();
      setSubmissions(json.submissions ?? []);
      setLoading(false);
    }

    load();
  }, [router]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return <p className="text-sm text-[var(--muted)]">読み込み中…</p>;
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
        <p className="text-xs font-bold text-[var(--accent)]">マイページ</p>
        <h1 className="mt-1 text-xl font-bold">依頼と返答</h1>
        {email && (
          <p className="mt-2 text-sm text-[var(--muted)]">
            ログイン中: {email}
          </p>
        )}
        <p className="mt-2 text-sm text-[var(--muted)]">
          添削・採点・質問の依頼状況と、返答結果をここで確認できます。返答が届くとメールでもお知らせします。
        </p>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 text-xs font-bold text-[var(--muted)] underline"
        >
          ログアウト
        </button>
      </div>

      {error && (
        <p className="rounded-xl bg-[#fff7f8] px-4 py-3 text-sm text-[var(--accent)]">
          {error}
        </p>
      )}

      {submissions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--line)] p-8 text-center">
          <p className="text-sm text-[var(--muted)]">まだ依頼がありません</p>
          <Link
            href="/tensaku"
            className="mt-4 inline-block text-sm font-bold text-[var(--accent)]"
          >
            添削を依頼する →
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {submissions.map((item) => {
            const replyText = item.response ?? item.admin_reply;
            const replyAttachments = item.reply_attachments ?? [];
            const hasReply = Boolean(replyText) || replyAttachments.length > 0;

            return (
            <li
              key={item.id}
              className="rounded-2xl border border-[var(--line)] bg-white p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-[var(--accent)]">
                    {SERVICE_LABELS[item.service]}
                  </p>
                  <p className="font-bold">{item.title}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    item.status === "answered"
                      ? "bg-[var(--senpai)]/10 text-[var(--senpai-dark)]"
                      : "bg-[var(--bg)] text-[var(--muted)]"
                  }`}
                >
                  {STATUS_LABELS[item.status]}
                </span>
              </div>
              <p className="mt-3 text-sm text-[var(--muted)] whitespace-pre-wrap">
                {item.content}
              </p>
              {item.image_urls && item.image_urls.length > 0 && (
                <AttachmentList
                  label="送信した画像"
                  attachments={item.image_urls.map((url) => ({ url, type: "image" }))}
                />
              )}
              <p className="mt-2 text-[10px] text-[var(--muted)]">
                依頼: {formatDate(item.created_at)}
              </p>

              {hasReply && (
                <div className="mt-4 rounded-xl border border-[var(--senpai)]/25 bg-[#e8fafe]/50 p-4">
                  <p className="text-xs font-bold text-[var(--senpai-dark)]">
                    返答
                    {item.response_at && ` · ${formatDate(item.response_at)}`}
                  </p>
                  {replyText && (
                    <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">
                      {replyText}
                    </p>
                  )}
                  <AttachmentList label="返信の添付" attachments={replyAttachments} />
                </div>
              )}
            </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
