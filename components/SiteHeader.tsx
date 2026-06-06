import Link from "next/link";
import { AuthLinks } from "@/components/AuthLinks";
import { SenpaiBrandName, SenpaiLink } from "@/components/SenpaiLink";
import { SITE } from "@/lib/services";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-2 px-4 py-3">
        <Link href="/" className="shrink-0 font-bold tracking-tight lowercase">
          {SITE.name}
        </Link>
        <div className="flex items-center gap-2">
          <AuthLinks />
          <SenpaiLink className="hidden rounded-full border border-[var(--line)] px-3 py-2 text-[11px] sm:inline-block">
            <SenpaiBrandName />
          </SenpaiLink>
          <Link
            href="/plan"
            className="rounded-full bg-[var(--accent)] px-3 py-2 text-[11px] font-bold text-white"
          >
            無料で始める
          </Link>
        </div>
      </div>
    </header>
  );
}
