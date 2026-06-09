import type { Metadata } from "next";
import { BottomTabs } from "@/components/BottomTabs";
import { CampaignBanner } from "@/components/CampaignBanner";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE } from "@/lib/services";
import {
  buildPageMetadata,
  getSiteUrl,
  organizationJsonLd,
  webSiteJsonLd,
} from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  ...buildPageMetadata({
    title: SITE.seoTitle,
    description: SITE.seoDescription,
    path: "/",
  }),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className="h-full">
      <head>
        <JsonLd data={[organizationJsonLd(), webSiteJsonLd()]} />
      </head>
      <body className="flex min-h-full flex-col antialiased pb-16">
        <SiteHeader />
        <CampaignBanner />
        <div className="flex-1">{children}</div>
        <SiteFooter />
        <BottomTabs />
      </body>
    </html>
  );
}
