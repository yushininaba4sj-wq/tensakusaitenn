import Link from "next/link";
import type { ServiceInfo } from "@/lib/services";
import { CAMPAIGN, displayPrice } from "@/lib/services";

export function ServiceCard({ service }: { service: ServiceInfo }) {
  return (
    <Link
      href={service.href}
      className="group block rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm transition hover:border-[var(--accent)]/30 hover:shadow-md"
    >
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
        {service.title}
      </p>
      <p className="mt-2 text-[17px] font-bold leading-tight sm:text-lg">{service.short}</p>
      <div className="mt-3 flex flex-wrap items-baseline gap-2">
        {CAMPAIGN.active ? (
          <>
            <p className="text-2xl font-bold text-[var(--accent)]">無料</p>
            <p className="text-sm text-[var(--muted)] line-through">
              {service.price}
              {service.priceNote}
            </p>
          </>
        ) : (
          <p className="text-2xl font-bold">{displayPrice(service)}</p>
        )}
      </div>
      <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
        {service.features.slice(0, 3).map((f) => (
          <li key={f}>· {f}</li>
        ))}
      </ul>
      <p className="mt-5 text-sm font-bold text-[var(--accent)] group-hover:underline">
        使う →
      </p>
    </Link>
  );
}
