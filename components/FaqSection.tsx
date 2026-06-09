import { FAQ_ITEMS } from "@/lib/faq";
import { SITE } from "@/lib/services";

export function FaqSection() {
  return (
    <section className="border-t border-[var(--line)] bg-white px-4 py-14 md:py-16" id="faq">
      <div className="mx-auto max-w-lg md:max-w-2xl">
        <p className="text-[12px] font-bold uppercase tracking-widest text-[var(--accent)]">
          FAQ
        </p>
        <h2 className="mt-2 text-[24px] font-bold md:text-[28px]">よくある質問</h2>
        <p className="mt-3 text-[14px] leading-relaxed text-[var(--muted)]">
          {SITE.nameJa}の英作文添削・小論文添削・過去問採点について、よくある質問をまとめました。
        </p>
        <dl className="mt-8 space-y-4">
          {FAQ_ITEMS.map((item) => (
            <div
              key={item.question}
              className="rounded-2xl border border-[var(--line)] bg-[var(--bg-sub)] p-5"
            >
              <dt className="font-bold">{item.question}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
