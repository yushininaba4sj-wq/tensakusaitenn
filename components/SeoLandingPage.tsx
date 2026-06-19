import Link from "next/link";
import { TARGET_UNIVERSITIES } from "@/lib/seoContent";
import { SITE } from "@/lib/services";

type SeoLandingPageProps = {
  title: string;
  intro: string;
  points: readonly string[];
  ctaHref: string;
  ctaLabel: string;
};

export function SeoLandingPage({
  title,
  intro,
  points,
  ctaHref,
  ctaLabel,
}: SeoLandingPageProps) {
  return (
    <main className="px-4 py-10">
      <div className="mx-auto max-w-lg">
        <Link href="/" className="text-sm font-bold text-[var(--accent)]">
          ← {SITE.name} トップ
        </Link>
        <h1 className="mt-6 text-[26px] font-bold leading-tight md:text-[32px]">{title}</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">{intro}</p>
        <p className="mt-3 text-[13px] leading-relaxed text-[var(--muted)]">
          対応例：{TARGET_UNIVERSITIES.join(" · ")}
        </p>
        <ul className="mt-6 space-y-2 text-sm leading-relaxed text-[var(--muted)]">
          {points.map((point) => (
            <li key={point}>· {point}</li>
          ))}
        </ul>
        <Link
          href={ctaHref}
          className="mt-8 block rounded-xl bg-[var(--accent)] px-6 py-4 text-center text-[15px] font-bold text-white transition hover:bg-[var(--accent-hover)]"
        >
          {ctaLabel}
        </Link>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/tensaku" className="text-[var(--accent)] hover:underline">
            添削トップ
          </Link>
          <Link href="/kakomon" className="text-[var(--accent)] hover:underline">
            過去問採点
          </Link>
          <Link href="/qa" className="text-[var(--accent)] hover:underline">
            わからない質問
          </Link>
        </div>
      </div>
    </main>
  );
}
