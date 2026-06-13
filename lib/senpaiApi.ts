import { SITE } from "@/lib/services";

export type SenpaiApiAttachment = {
  url: string;
  type: "image";
  name?: string;
  bucket?: string;
  path?: string;
};

export type SenpaiApiPayload = {
  service_type: string;
  message: string;
  attachments: SenpaiApiAttachment[];
};

export async function submitToSenpaiApi(
  accessToken: string,
  payload: SenpaiApiPayload,
): Promise<{ ok: boolean; error?: string }> {
  const origin = process.env.SENPAI_LINK_ORIGIN ?? SITE.senpaiLink;

  try {
    const res = await fetch(`${origin}/api/student/service-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      return { ok: true };
    }

    const body = await res.json().catch(() => ({}));
    const message =
      typeof body.error === "string"
        ? body.error
        : typeof body.message === "string"
          ? body.message
          : `SENPAI LINK API failed (${res.status})`;

    return { ok: false, error: message };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "SENPAI LINK API request failed",
    };
  }
}
