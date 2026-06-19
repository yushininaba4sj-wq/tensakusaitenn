import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SeoLandingPage } from "@/components/SeoLandingPage";
import { SHORONBUN_LANDING } from "@/lib/seoContent";
import { breadcrumbJsonLd, buildPageMetadata, serviceJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: SHORONBUN_LANDING.title,
  description: SHORONBUN_LANDING.description,
  path: "/shoronbun",
  keywords: [...SHORONBUN_LANDING.keywords],
});

export default function ShoronbunPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "ホーム", path: "/" },
            { name: "小論文添削", path: "/shoronbun" },
          ]),
          serviceJsonLd({
            name: "小論文添削",
            description: SHORONBUN_LANDING.description,
            path: "/shoronbun",
            price: "500",
          }),
        ]}
      />
      <SeoLandingPage
        title={SHORONBUN_LANDING.title}
        intro={SHORONBUN_LANDING.intro}
        points={SHORONBUN_LANDING.points}
        ctaHref={SHORONBUN_LANDING.ctaHref}
        ctaLabel={SHORONBUN_LANDING.ctaLabel}
      />
    </>
  );
}
