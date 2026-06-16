import type { SupabaseClient } from "@supabase/supabase-js";
import type { SenpaiApiPayload } from "@/lib/senpaiApi";
import { submitToSenpaiApi } from "@/lib/senpaiApi";
import { SUBMISSION_IMAGE_BUCKET } from "@/lib/submissionImages";
import { notifyOpsSlack } from "@/lib/slackNotify";
import { SERVICE_LABELS, type SubmissionService } from "@/lib/submissions";

/** SENPAI LINK student_service_requests が期待する service_type */
export const SERVICE_TYPE_MAP: Record<SubmissionService, string> = {
  tensaku: "correction",
  kakomon: "kakomon_bunseki",
  qa: "study_room",
  plan: "plan",
};

type Attachment = {
  url: string;
  type: "image";
  name?: string;
  bucket?: string;
  path?: string;
};

export function buildSenpaiServiceMessage(
  service: SubmissionService,
  title: string | null,
  content: string,
): string {
  const header = `[GOUKAKU LINK / ${SERVICE_LABELS[service]}]`;
  return title ? `${header}\n${title}\n\n${content}` : `${header}\n${content}`;
}

export function buildSenpaiAttachments(
  imageUrls: string[],
  imagePaths: string[] = [],
  imageNames: string[] = [],
): Attachment[] {
  return imageUrls.map((url, index) => ({
    url,
    type: "image" as const,
    bucket: SUBMISSION_IMAGE_BUCKET,
    path: imagePaths[index],
    name: imageNames[index] ?? imagePaths[index]?.split("/").pop(),
  }));
}

async function insertSenpaiServiceRequest(
  supabase: SupabaseClient,
  input: {
    userId: string;
    service: SubmissionService;
    title: string | null;
    content: string;
    imageUrls: string[];
    imagePaths?: string[];
    imageNames?: string[];
  },
): Promise<{ error?: string }> {
  const { error } = await supabase.from("student_service_requests").insert({
    user_id: input.userId,
    service_type: SERVICE_TYPE_MAP[input.service],
    message: buildSenpaiServiceMessage(input.service, input.title, input.content),
    status: "new",
    attachments:
      input.imageUrls.length > 0
        ? buildSenpaiAttachments(input.imageUrls, input.imagePaths, input.imageNames)
        : [],
  });

  if (error) {
    return { error: error.message };
  }

  return {};
}

export type SenpaiSyncResult = {
  error?: string;
  notifyWarning?: string;
  channel: "senpai_api" | "direct_db";
};

/**
 * SENPAI LINK 管理者連携:
 * 1. SENPAI LINK API（Slack 通知込み）を優先
 * 2. 失敗時は DB 直接 INSERT + GOUKAKU LINK 側 Slack 通知
 */
export async function syncSubmissionToSenpaiAdmin(
  supabase: SupabaseClient,
  input: {
    accessToken: string | null;
    userId: string;
    userEmail?: string | null;
    service: SubmissionService;
    title: string | null;
    content: string;
    imageUrls: string[];
    imagePaths?: string[];
    imageNames?: string[];
  },
): Promise<SenpaiSyncResult> {
  if (input.accessToken) {
    const payload: SenpaiApiPayload = {
      service_type: SERVICE_TYPE_MAP[input.service],
      message: buildSenpaiServiceMessage(input.service, input.title, input.content),
      attachments:
        input.imageUrls.length > 0
          ? buildSenpaiAttachments(input.imageUrls, input.imagePaths, input.imageNames)
          : [],
    };
    const apiResult = await submitToSenpaiApi(input.accessToken, payload);
    if (apiResult.ok) {
      return { channel: "senpai_api" };
    }
    console.warn(
      "[senpaiSync] SENPAI LINK API failed, falling back to direct DB + Slack:",
      apiResult.error,
    );
  } else {
    console.warn("[senpaiSync] No access token; using direct DB + Slack fallback");
  }

  const dbResult = await insertSenpaiServiceRequest(supabase, input);
  if (dbResult.error) {
    console.warn("[senpaiSync] direct DB insert failed:", dbResult.error);

    const slackResult = await notifyOpsSlack({
      service: input.service,
      title: input.title,
      content: input.content,
      userId: input.userId,
      userEmail: input.userEmail,
      imageCount: input.imageUrls.length,
      imageUrls: input.imageUrls,
    });

    if (!slackResult.error) {
      return {
        channel: "direct_db",
        notifyWarning: `管理者画面への登録に失敗（RLS）。Slack のみ通知済み: ${dbResult.error}`,
      };
    }

    return {
      error: dbResult.error,
      channel: "direct_db",
    };
  }

  const slackResult = await notifyOpsSlack({
    service: input.service,
    title: input.title,
    content: input.content,
    userId: input.userId,
    userEmail: input.userEmail,
    imageCount: input.imageUrls.length,
    imageUrls: input.imageUrls,
  });

  if (slackResult.error) {
    return {
      channel: "direct_db",
      notifyWarning: slackResult.error,
    };
  }

  return { channel: "direct_db" };
}

/** @deprecated Use syncSubmissionToSenpaiAdmin */
export async function syncToSenpaiServiceRequests(
  supabase: SupabaseClient,
  input: {
    userId: string;
    service: SubmissionService;
    title: string | null;
    content: string;
    imageUrls: string[];
    imagePaths?: string[];
  },
): Promise<{ error?: string }> {
  const result = await syncSubmissionToSenpaiAdmin(supabase, {
    ...input,
    accessToken: null,
  });

  if (result.error) {
    return { error: result.error };
  }

  return {};
}
