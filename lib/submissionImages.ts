import type { SupabaseClient } from "@supabase/supabase-js";

export const SUBMISSION_IMAGE_BUCKET = "service-attachments";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 5;

export function validateImageFiles(files: File[]): string | null {
  if (files.length > MAX_FILES) {
    return `画像は${MAX_FILES}枚までです`;
  }
  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      return "画像ファイルのみアップロードできます";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "1枚あたり10MB以下にしてください";
    }
  }
  return null;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^\w.\-]+/g, "_").slice(0, 80) || "image";
}

export async function uploadSubmissionImages(
  supabase: SupabaseClient,
  userId: string,
  files: File[],
): Promise<{ urls: string[]; paths: string[]; error?: string }> {
  const validationError = validateImageFiles(files);
  if (validationError) return { urls: [], paths: [], error: validationError };
  if (files.length === 0) return { urls: [], paths: [] };

  const urls: string[] = [];
  const paths: string[] = [];

  for (const file of files) {
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
    const path = `${userId}/${crypto.randomUUID()}-${sanitizeFilename(file.name || `upload.${ext}`)}`;

    const { error: uploadError } = await supabase.storage
      .from(SUBMISSION_IMAGE_BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "image/jpeg",
      });

    if (uploadError) {
      return { urls: [], paths: [], error: uploadError.message };
    }

    const { data: signed, error: signError } = await supabase.storage
      .from(SUBMISSION_IMAGE_BUCKET)
      .createSignedUrl(path, 60 * 60 * 24 * 365);

    if (signError || !signed?.signedUrl) {
      return { urls: [], paths: [], error: signError?.message ?? "画像URLの取得に失敗しました" };
    }

    paths.push(path);
    urls.push(signed.signedUrl);
  }

  return { urls, paths };
}
