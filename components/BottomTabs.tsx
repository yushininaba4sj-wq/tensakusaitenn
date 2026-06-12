"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TabIcon } from "@/components/TabIcons";
import { TAB_NAV } from "@/lib/services";

export function BottomTabs() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--line)] bg-white/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
      aria-label="サービスナビゲーション"
    >
      <div className="mx-auto flex max-w-lg">
        {TAB_NAV.map((tab) => {
          const active = tab.match(pathname);
          const className = `flex flex-1 flex-col items-center gap-1 px-1 py-2 text-center transition ${
            active
              ? "text-[var(--accent)]"
              : "text-[var(--muted)] active:text-[var(--ink)]"
          }`;

          const inner = (
            <>
              <span
                className={`h-1 w-5 rounded-full ${active ? "bg-[var(--accent)]" : "bg-transparent"}`}
              />
              <span className="flex h-4 items-center justify-center">
                <TabIcon name={tab.icon} active={active} />
              </span>
              <span className="text-[10px] font-bold leading-tight">{tab.label}</span>
            </>
          );

          if (tab.external) {
            return (
              <a
                key={tab.href}
                href={tab.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {inner}
              </a>
            );
          }

          return (
            <Link key={tab.href} href={tab.href} className={className}>
              {inner}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
