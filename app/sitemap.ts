import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/services";
import { getSiteUrl } from "@/lib/seo";

const SEO_LANDING_PATHS = ["/eibun", "/shoronbun"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...SERVICES.map((s) => ({
      url: `${base}${s.href}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...SEO_LANDING_PATHS.map((path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
  ];
}
