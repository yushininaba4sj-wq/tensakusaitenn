export const SITE = {
  name: "GOUKAKU LINK",
  nameJa: "GOUKAKU LINK（合格リンク）",
  alternateNames: ["合格リンク", "ゴウカクリンク", "goukakulink", "GOUKAKULINK"],
  tagline: "学習計画・添削・採点・質問",
  description:
    "学習計画づくり、小論文・英作文添削、過去問採点、わからないところの質問ができる大学受験サービス。",
  seoTitle: "GOUKAKU LINK | 学習計画・英作文・小論文添削・過去問採点",
  seoDescription:
    "GOUKAKU LINK（合格リンク）。学習計画、小論文・英作文添削、過去問採点、わからないところを質問。予備校講師、現役早慶生が対応。リリース記念で今だけ無料。",
  keywords: [
    "GOUKAKU LINK",
    "goukakulink",
    "合格リンク",
    "学習計画",
    "英作文 添削",
    "小論文 添削",
    "過去問 採点",
    "大学受験 質問",
    "予備校 講師",
    "現役 早慶生",
  ],
  senpaiLink: "https://senpailink.vercel.app",
  senpaiName: "SENPAI LINK",
} as const;

export const CAMPAIGN = {
  active: true,
  label: "リリース記念キャンペーン",
  message: "今だけ全サービス無料",
  note: "キャンペーンは予告なく終了する場合があります",
} as const;

export type ServiceId = "plan" | "tensaku" | "kakomon" | "qa";

export type TensakuType = "shoronbun" | "eibun";

export type ServiceInfo = {
  id: ServiceId;
  title: string;
  short: string;
  tabLabel: string;
  price: string;
  priceNote: string;
  href: string;
  features: string[];
  reviewers?: string[];
};

export const SERVICES: ServiceInfo[] = [
  {
    id: "plan",
    title: "学習計画",
    short: "全体計画＋参考書ごとの1日ノルマ",
    tabLabel: "計画",
    price: "¥980",
    priceNote: "/ 月〜",
    href: "/plan",
    features: [
      "志望校・偏差値・試験日から全体計画を立てる",
      "参考書ごとに範囲・周回数・1日ノルマを計算",
      "今日のタスク・教材別の進捗を確認",
    ],
  },
  {
    id: "tensaku",
    title: "添削",
    short: "小論文・英作文を提出して添削",
    tabLabel: "添削",
    price: "¥500",
    priceNote: "/ 枚〜",
    href: "/tensaku",
    features: [
      "小論文：課題理解・構成・論理性など6項目を数値化",
      "英作文：文法・語彙・表現・論理構成で採点",
      "添削結果に弱点分析・改善提案もセット",
    ],
    reviewers: ["現役予備校講師", "早慶上智生", "難関大学生"],
  },
  {
    id: "kakomon",
    title: "過去問採点",
    short: "答案画像を提出して採点",
    tabLabel: "採点",
    price: "¥500",
    priceNote: "/ 教科〜",
    href: "/kakomon",
    features: [
      "総合得点・設問別得点・部分点",
      "減点理由・合格者平均との差",
      "採点結果に弱点分析・改善提案もセット",
    ],
    reviewers: ["現役予備校講師", "早慶上智生", "難関大学生"],
  },
  {
    id: "qa",
    title: "わからない質問",
    short: "勉強でわからないところをそのまま質問",
    tabLabel: "質問",
    price: "¥500",
    priceNote: "/ 件〜",
    href: "/qa",
    features: [
      "英語・数学・国語・理科・社会・小論文・総合型",
      "24時間以内を目安に返信",
      "予備校講師、現役早慶生が回答",
    ],
  },
];

export type TabItem = {
  href: string;
  label: string;
  external?: boolean;
  match: (pathname: string) => boolean;
};

export const TAB_NAV: TabItem[] = [
  { href: "/", label: "ホーム", match: (p) => p === "/" },
  ...SERVICES.map((s) => ({
    href: s.href,
    label: s.tabLabel,
    match: (p: string) => p.startsWith(s.href),
  })),
  {
    href: SITE.senpaiLink,
    label: "先輩",
    external: true,
    match: () => false,
  },
];

export const QA_CATEGORIES = [
  "英語",
  "数学",
  "国語",
  "理科",
  "社会",
  "小論文",
  "総合型選抜",
] as const;

export const SHORONBUN_CRITERIA = [
  "課題理解",
  "構成",
  "論理性",
  "表現力",
  "説得力",
  "誤字脱字",
] as const;

export const EIBUN_CRITERIA = ["文法", "語彙", "自然な表現", "論理構成"] as const;

export function getService(id: ServiceId): ServiceInfo {
  const service = SERVICES.find((s) => s.id === id);
  if (!service) throw new Error(`Unknown service: ${id}`);
  return service;
}

export function displayPrice(service: ServiceInfo): string {
  if (CAMPAIGN.active) return "無料";
  return `${service.price}${service.priceNote}`;
}
