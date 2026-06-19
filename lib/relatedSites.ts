export type RelatedSite = {
  id: string;
  name: string;
  description: string;
  href: string;
  external?: boolean;
  badge?: string;
};

export const RELATED_SITES: RelatedSite[] = [
  {
    id: "goukaku",
    name: "GOUKAKU LINK",
    description: "学習計画・英作文・小論文添削・過去問採点・質問（このサイト）",
    href: "/",
  },
  {
    id: "senpai",
    name: "SENPAI LINK",
    description: "同じ境遇の先輩に直接相談できるマッチングサービス",
    href: "https://senpailink.vercel.app",
    external: true,
    badge: "関連",
  },
  {
    id: "studystyle",
    name: "StudyStyle診断",
    description: "24問・約3〜5分の無料勉強タイプ診断（16タイプ）",
    href: "https://studystyle-shindan.vercel.app",
    external: true,
    badge: "関連",
  },
];

export const NEW_SITE_CONTACT_EMAIL = "senpailink2026@gmail.com";
