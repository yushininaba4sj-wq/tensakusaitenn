import Image from "next/image";
import Link from "next/link";
import { AuthLinks } from "@/components/AuthLinks";
import { SenpaiBrandName, SenpaiLink } from "@/components/SenpaiLink";
import { SITE } from "@/lib/services";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-2 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/goukakulink-mark.png"
            alt="GOUKAKULINK"
            width={32}
            height={32}
            className="h-8 w-8"
            priority
          />
          <span className="text-sm font-bold tracking-tight">{SITE.name}</span>
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
