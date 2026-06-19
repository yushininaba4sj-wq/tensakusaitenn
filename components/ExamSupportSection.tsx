import Link from "next/link";
import { HOME_EXAM_SUPPORT, TARGET_UNIVERSITIES } from "@/lib/seoContent";

export function ExamSupportSection() {
  return (
    <section className="border-t border-[var(--line)] bg-white px-4 py-14 md:py-16" id="exam-support">
      <div className="mx-auto max-w-lg md:max-w-2xl">
        <p className="text-[12px] font-bold uppercase tracking-widest text-[var(--accent)]">
          大学受験
        </p>
        <h2 className="mt-2 text-[24px] font-bold md:text-[28px]">{HOME_EXAM_SUPPORT.title}</h2>
        <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)] md:text-[15px]">
          {HOME_EXAM_SUPPORT.lead}
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-[var(--muted)]">
          対応例：{TARGET_UNIVERSITIES.join(" · ")}
        </p>
        <div className="mt-8 space-y-4">
          {HOME_EXAM_SUPPORT.blocks.map((block) => (
            <article
              key={block.heading}
              className="rounded-2xl border border-[var(--line)] bg-[var(--bg-sub)] p-5"
            >
              <h3 className="text-[16px] font-bold text-[var(--ink)]">{block.heading}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{block.body}</p>
              <Link
                href={block.href}
                className="mt-4 inline-block text-sm font-bold text-[var(--accent)] hover:underline"
              >
                {block.linkLabel} →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
