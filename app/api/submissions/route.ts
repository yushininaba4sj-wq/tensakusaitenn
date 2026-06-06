import { createClient } from "@/lib/supabase/server";
import { SERVICE_LABELS, type SubmissionService } from "@/lib/submissions";
import { NextResponse } from "next/server";

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
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ submission: data });
}
