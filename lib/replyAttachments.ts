import type { SubmissionService } from "@/lib/submissions";
import { SERVICE_TYPE_MAP } from "@/lib/senpaiSync";

export type FileAttachment = {
  url: string;
  path?: string;
  name?: string;
  type?: string;
};

export type StudentServiceRequestRow = {
  id: string;
  service_type: string;
  message: string;
  admin_reply: string | null;
  reply_attachments: unknown;
  created_at: string;
};

export function parseFileAttachments(value: unknown): FileAttachment[] {
  if (!Array.isArray(value)) return [];

  const attachments: FileAttachment[] = [];

  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    if (typeof record.url !== "string" || record.url.length === 0) continue;
    attachments.push({
      url: record.url,
      path: typeof record.path === "string" ? record.path : undefined,
      name: typeof record.name === "string" ? record.name : undefined,
      type: typeof record.type === "string" ? record.type : undefined,
    });
  }

  return attachments;
}

const MATCH_WINDOW_MS = 15 * 60 * 1000;

export function matchServiceRequestToSubmission(
  submission: { service: SubmissionService; created_at: string },
  requests: StudentServiceRequestRow[],
  usedRequestIds: Set<string>,
): StudentServiceRequestRow | null {
  const expectedType = SERVICE_TYPE_MAP[submission.service];
  const submissionTime = new Date(submission.created_at).getTime();

  let best: StudentServiceRequestRow | null = null;
  let bestDiff = Infinity;

  for (const request of requests) {
    if (usedRequestIds.has(request.id)) continue;
    if (request.service_type !== expectedType) continue;
    if (!request.message.includes("[GOUKAKU LINK")) continue;

    const diff = Math.abs(new Date(request.created_at).getTime() - submissionTime);
    if (diff > MATCH_WINDOW_MS) continue;
    if (diff < bestDiff) {
      best = request;
      bestDiff = diff;
    }
  }

  if (best) {
    usedRequestIds.add(best.id);
  }

  return best;
}
