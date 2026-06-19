import type { Metadata } from "next";
import { SITE } from "./services";

export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

type PageMeta = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  /** ログイン・マイページなど検索に載せたくないページ */
  privatePage?: boolean;
};

const defaultOgImage = {
  url: "/icon.png",
  width: 512,
  height: 512,
  alt: SITE.nameJa,
};

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
  privatePage = false,
}: PageMeta): Metadata {
  const url = `${getSiteUrl()}${path}`;
  const fullTitle = path === "/" ? title : `${title} | ${SITE.name}`;

  return {
    title: fullTitle,
    description,
    keywords: [...SITE.keywords, ...keywords],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "ja_JP",
      url,
      siteName: SITE.nameJa,
      title: fullTitle,
      description,
      images: [defaultOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [defaultOgImage.url],
    },
    robots: privatePage
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

export function getGoogleSiteVerification(): string | undefined {
  return process.env.GOOGLE_SITE_VERIFICATION?.trim() || undefined;
}

export function organizationJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.nameJa,
    alternateName: SITE.alternateNames,
    url,
    description: SITE.description,
    sameAs: [SITE.senpaiLink],
  };
}

export function webSiteJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.nameJa,
    alternateName: SITE.alternateNames,
    url,
    description: SITE.description,
    inLanguage: "ja-JP",
    publisher: {
      "@type": "Organization",
      name: SITE.nameJa,
      url,
    },
  };
}

export function serviceJsonLd(service: {
  name: string;
  description: string;
  path: string;
  price: string;
}) {
  const url = `${getSiteUrl()}${service.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url,
    provider: {
      "@type": "Organization",
      name: SITE.nameJa,
      url: getSiteUrl(),
    },
    areaServed: "JP",
    offers: {
      "@type": "Offer",
      price: service.price.replace(/[^\d]/g, "") || "500",
      priceCurrency: "JPY",
      availability: "https://schema.org/InStock",
    },
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${getSiteUrl()}${item.path}`,
    })),
  };
}
