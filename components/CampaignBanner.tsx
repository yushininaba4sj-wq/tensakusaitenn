import Link from "next/link";
import { CAMPAIGN } from "@/lib/services";

export function CampaignBanner() {
  if (!CAMPAIGN.active) return null;

  return (
    <div className="border-b border-[var(--accent)]/20 bg-gradient-to-r from-[#fff1f3] via-[#fff7f8] to-[#fff1f3]">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            {CAMPAIGN.label}
          </span>
          <p className="text-sm font-bold text-[var(--accent-dark)]">
            {CAMPAIGN.message}
          </p>
        </div>
        <Link
          href="/plan"
          className="text-xs font-bold text-[var(--accent)] underline-offset-2 hover:underline"
        >
          今すぐ使う →
        </Link>
      </div>
      <p className="mx-auto max-w-5xl px-4 pb-2 text-[10px] text-[var(--muted)]">
        ※{CAMPAIGN.note}
      </p>
    </div>
  );
}
