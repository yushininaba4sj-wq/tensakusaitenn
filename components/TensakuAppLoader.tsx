"use client";

import { useSearchParams } from "next/navigation";
import { TensakuApp } from "@/components/TensakuApp";
import type { TensakuType } from "@/lib/services";

function parseInitialType(value: string | null): TensakuType {
  if (value === "eibun" || value === "shoronbun") return value;
  return "shoronbun";
}

export function TensakuAppLoader() {
  const searchParams = useSearchParams();
  const initialType = parseInitialType(searchParams.get("type"));

  return <TensakuApp initialType={initialType} />;
}
