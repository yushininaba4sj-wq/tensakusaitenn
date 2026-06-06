import Link from "next/link";
import type { ReactNode } from "react";
import type { ServiceInfo } from "@/lib/services";
import { CAMPAIGN, displayPrice } from "@/lib/services";

type ServicePageShellProps = {
  service: ServiceInfo;
  children: ReactNode;
};

export function ServicePageShell({ service, children }: ServicePageShellProps) {
  return (
    <main className="px-4 py-8">
      <div className="mx-auto max-w-lg">
        <Link href="/" className="text-sm font-bold text-[var(--accent)]">
          ← GOUKAKU LINK トップ
        </Link>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
          {service.id}
        </p>
        <h1 className="mt-2 text-3xl font-bold">{service.title}</h1>
        <p className="mt-3 text-[var(--muted)]">{service.short}</p>
        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          {CAMPAIGN.active ? (
            <>
              <p className="text-2xl font-bold text-[var(--accent)]">無料</p>
              <p className="text-sm text-[var(--muted)] line-through">
                {service.price}
                {service.priceNote}
              </p>
              <span className="rounded-full bg-[var(--accent)]/10 px-2 py-0.5 text-xs font-bold text-[var(--accent)]">
                キャンペーン中
              </span>
            </>
          ) : (
            <p className="text-2xl font-bold">{displayPrice(service)}</p>
          )}
        </div>
        {service.reviewers && (
          <p className="mt-3 text-sm text-[var(--muted)]">
            対応：{service.reviewers.join(" · ")}
          </p>
        )}
        <ul className="mt-4 space-y-1 text-sm text-[var(--muted)]">
          {service.features.map((f) => (
            <li key={f}>· {f}</li>
          ))}
        </ul>
        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}
