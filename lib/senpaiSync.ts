import type { SupabaseClient } from "@supabase/supabase-js";
import { SERVICE_LABELS, type SubmissionService } from "@/lib/submissions";

const SERVICE_TYPE_MAP: Record<SubmissionService, string> = {
  tensaku: "correction",
  kakomon: "kakomon",
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
): Attachment[] {
  return imageUrls.map((url, index) => ({
    url,
    type: "image" as const,
    bucket: "service-attachments",
    path: imagePaths[index],
  }));
}

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
  const { error } = await supabase.from("student_service_requests").insert({
    user_id: input.userId,
    service_type: SERVICE_TYPE_MAP[input.service],
    message: buildSenpaiServiceMessage(input.service, input.title, input.content),
    status: "pending",
    attachments:
      input.imageUrls.length > 0
        ? buildSenpaiAttachments(input.imageUrls, input.imagePaths)
        : [],
  });

  if (error) {
    return { error: error.message };
  }

  return {};
}
