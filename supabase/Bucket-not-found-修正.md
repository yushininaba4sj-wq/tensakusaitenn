# Bucket not found 修正手順

## 原因

本番 Supabase に、GOUKAKU LINK が使う Storage バケット **`service-request-attachments`** へのアクセス権（RLS）がない、またはバケット自体が存在しない。

> **注意:** 旧仕様の `service-attachments` バケットは使いません。SENPAI LINK と共有の `service-request-attachments` に統一しています。

## 手順

### 1. バケットの存在確認

Supabase Dashboard → **Storage** で `service-request-attachments` があるか確認。

- **ある** → 手順 2（RLS のみ）へ
- **ない** → SENPAI LINK 管理者にバケット作成を依頼（GOUKAKU 側では新規作成しない）

### 2. RLS ポリシー追加

SQL Editor で `supabase/storage.sql` をそのまま実行。

```sql
-- 内容は storage.sql を参照（Goukakulink users upload/read service request attachments）
```

### 3. 確認

1. Supabase Dashboard → **Storage** → `service-request-attachments` が表示される
2. https://goukakulink.vercel.app でログイン後、添削フォームから画像付きで送信
3. Bucket not found が出ないこと

## 3箇所の bucket 名を一致させること

| 箇所 | バケット名 |
|------|-----------|
| `lib/submissionImages.ts`（アップロード先） | `service-request-attachments` |
| `lib/senpaiSync.ts`（attachments[].bucket） | `service-request-attachments` |
| Storage RLS（`storage.sql`） | `service-request-attachments` |

1つでもズレると、管理画面で画像が開けない／将来の AI 処理で破綻します。
