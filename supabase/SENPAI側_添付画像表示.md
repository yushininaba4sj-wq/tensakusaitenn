# SENPAI LINK 側：管理画面で GOUKAKU 添付画像を表示する

GOUKAKU LINK からの依頼は `student_service_requests.attachments` に次の形式で保存されます。

```json
{
  "url": "https://...supabase.co/storage/v1/object/sign/service-request-attachments/{userId}/{file}?token=...",
  "type": "image",
  "bucket": "service-request-attachments",
  "path": "{userId}/{uuid}-filename.jpg",
  "name": "filename.jpg"
}
```

## 画像が見えない典型原因

1. **管理画面が `path` だけ参照している**  
   管理者セッションでは他ユーザーのフォルダに RLS で読めない → **`<img src={attachment.url}>` を使う**（署名付き URL は誰でも開ける）

2. **`bucket` + `path` でクライアントから再取得している**  
   同上で RLS 拒否 → **サーバー側（service_role）で `createSignedUrl` してから表示**

3. **ファイル名だけ表示している**  
   現状の UI が `name` のみ → **リンクを `attachment.url` にする**

## juku-matching での修正例（方針）

```tsx
// attachments 表示部
{attachments.map((file, i) => (
  <a key={i} href={file.url} target="_blank" rel="noreferrer">
    <img src={file.url} alt={file.name ?? `添付${i + 1}`} />
  </a>
))}
```

または API route で:

```ts
const { data } = await supabaseAdmin.storage
  .from(file.bucket)
  .createSignedUrl(file.path, 3600);
```

## GOUKAKU 側で今回入れた対応

- Slack 通知に **添付画像 URL を直リンク**（Slack から即プレビュー可能）
- Slack の管理画面リンクを **`/admin/login?next=/admin/dashboard`** に固定
- `attachments[].name` を付与

管理画面での画像プレビューは **SENPAI LINK（juku-matching）側の UI 修正**が必要です。
