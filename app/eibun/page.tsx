import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SeoLandingPage } from "@/components/SeoLandingPage";
import { EIBUN_LANDING } from "@/lib/seoContent";
import { breadcrumbJsonLd, buildPageMetadata, serviceJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: EIBUN_LANDING.title,
  description: EIBUN_LANDING.description,
  path: "/eibun",
  keywords: [...EIBUN_LANDING.keywords],
});

export default function EibunPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "ホーム", path: "/" },
            { name: "英作文添削", path: "/eibun" },
          ]),
          serviceJsonLd({
            name: "英作文添削",
            description: EIBUN_LANDING.description,
            path: "/eibun",
            price: "500",
          }),
        ]}
      />
      <SeoLandingPage
        title={EIBUN_LANDING.title}
        intro={EIBUN_LANDING.intro}
        points={EIBUN_LANDING.points}
        ctaHref={EIBUN_LANDING.ctaHref}
        ctaLabel={EIBUN_LANDING.ctaLabel}
      />
    </>
  );
}
