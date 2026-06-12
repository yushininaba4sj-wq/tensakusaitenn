"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SubmitLoginNoticeProps = {
  className?: string;
  detail?: string;
};

export function SubmitLoginNotice({
  className = "mt-4",
  detail = "内容の入力はできますが、提出時にログイン画面へ進みます。",
}: SubmitLoginNoticeProps) {
  const pathname = usePathname();

  return (
    <div
      className={`${className} rounded-xl border border-[var(--line)] bg-[var(--bg-sub)] px-4 py-3 text-sm text-[var(--muted)]`}
    >
      <p className="font-bold text-[var(--ink)]">送信にはログインが必要です</p>
      <p className="mt-1 leading-relaxed">{detail}</p>
      <Link
        href={`/login?next=${encodeURIComponent(pathname)}`}
        className="mt-3 inline-block font-bold text-[var(--accent)]"
      >
        ログインしてから使う →
      </Link>
    </div>
  );
}
