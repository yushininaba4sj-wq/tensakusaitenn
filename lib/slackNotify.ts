import { SERVICE_LABELS, type SubmissionService } from "@/lib/submissions";
import { SITE } from "@/lib/services";

type SlackNotifyInput = {
  service: SubmissionService;
  title: string | null;
  content: string;
  userId: string;
  userEmail?: string | null;
  imageCount: number;
};

function truncate(text: string, max = 1200): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}…`;
}

export function buildSlackSubmissionMessage(input: SlackNotifyInput): string {
  const lines = [
    `[GOUKAKU LINK] 新規依頼: ${SERVICE_LABELS[input.service]}`,
    input.title ? `タイトル: ${input.title}` : null,
    input.userEmail ? `ユーザー: ${input.userEmail}` : `ユーザーID: ${input.userId}`,
    `添付画像: ${input.imageCount}枚`,
    "",
    truncate(input.content),
    "",
    `管理画面: ${SITE.senpaiLink}`,
  ].filter(Boolean);

  return lines.join("\n");
}

export async function notifyOpsSlack(input: SlackNotifyInput): Promise<{ error?: string }> {
  const webhookUrl = process.env.OPS_SLACK_WEBHOOK_URL ?? process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    return { error: "Slack webhook URL is not configured" };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: buildSlackSubmissionMessage(input),
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { error: body || `Slack webhook failed (${res.status})` };
    }

    return {};
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Slack webhook request failed",
    };
  }
}
