import { createClient } from "@/lib/supabase/server";
import { syncSubmissionToSenpaiAdmin } from "@/lib/senpaiSync";
import { SERVICE_LABELS, type SubmissionService } from "@/lib/submissions";
import { NextResponse } from "next/server";

function parseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.length > 0);
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("goukakulink_submissions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ submissions: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const body = await request.json();
  const service = body.service as SubmissionService;
  const content = String(body.content ?? "").trim();
  const title = body.title ? String(body.title) : SERVICE_LABELS[service];
  const imageUrls = parseStringArray(body.image_urls);
  const imagePaths = parseStringArray(body.image_paths);
  const clientAccessToken =
    typeof body.access_token === "string" && body.access_token.length > 0
      ? body.access_token
      : null;

  if (!service || !(service in SERVICE_LABELS)) {
    return NextResponse.json({ error: "不正なサービスです" }, { status: 400 });
  }

  if (!content) {
    return NextResponse.json({ error: "内容を入力してください" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("goukakulink_submissions")
    .insert({
      user_id: user.id,
      service,
      title,
      content,
      image_urls: imageUrls,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const syncResult = await syncSubmissionToSenpaiAdmin(supabase, {
    accessToken: clientAccessToken ?? session?.access_token ?? null,
    userId: user.id,
    userEmail: user.email,
    service,
    title,
    content,
    imageUrls,
    imagePaths,
  });

  if (syncResult.error) {
    return NextResponse.json(
      {
        error:
          "依頼は保存しましたが、管理者画面への連携に失敗しました。友達（管理者）に連絡してください。",
        submission: data,
        syncError: syncResult.error,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    submission: data,
    syncChannel: syncResult.channel,
    notifyWarning: syncResult.notifyWarning ?? null,
  });
}
