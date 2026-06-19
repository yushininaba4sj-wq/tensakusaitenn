import Link from "next/link";
import { SenpaiBrandName, SenpaiLink } from "@/components/SenpaiLink";
import { SERVICES, SITE } from "@/lib/services";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)] bg-white px-4 py-8 pb-24">
      <div className="mx-auto max-w-lg">
        <p className="font-bold">{SITE.name}</p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          {SITE.seoDescription}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {SERVICES.map((s) => (
            <Link key={s.id} href={s.href} className="text-sm font-semibold text-[var(--accent)]">
              {s.title}
            </Link>
          ))}
          <Link href="/eibun" className="text-sm font-semibold text-[var(--accent)]">
            英作文添削
          </Link>
          <Link href="/shoronbun" className="text-sm font-semibold text-[var(--accent)]">
            小論文添削
          </Link>
        </div>
        <SenpaiLink className="mt-4 inline-block text-sm">
          <SenpaiBrandName />
        </SenpaiLink>
        <p className="mt-6 text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} {SITE.name}
        </p>
      </div>
    </footer>
  );
}
