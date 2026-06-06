export type SubmissionService = "tensaku" | "kakomon" | "qa" | "plan";

export type SubmissionRow = {
  id: string;
  user_id: string;
  service: SubmissionService;
  title: string | null;
  content: string;
  status: "pending" | "answered";
  response: string | null;
  response_at: string | null;
  created_at: string;
};

export const SERVICE_LABELS: Record<SubmissionService, string> = {
  tensaku: "添削",
  kakomon: "過去問採点",
  qa: "わからない質問",
  plan: "学習計画",
};

export const STATUS_LABELS = {
  pending: "返答待ち",
  answered: "返答あり",
} as const;
