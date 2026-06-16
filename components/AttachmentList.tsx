import type { FileAttachment } from "@/lib/replyAttachments";

type AttachmentListProps = {
  attachments: FileAttachment[];
  label?: string;
};

export function AttachmentList({ attachments, label }: AttachmentListProps) {
  if (attachments.length === 0) return null;

  return (
    <div className="mt-3">
      {label && (
        <p className="mb-2 text-xs font-bold text-[var(--muted)]">{label}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {attachments.map((file, index) => {
          const alt = file.name ?? `添付${index + 1}`;
          const isImage = file.type === "image" || /\.(jpe?g|png|gif|webp|heic)$/i.test(file.url);

          if (isImage) {
            return (
              <a
                key={`${file.url}-${index}`}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-lg border border-[var(--line)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={file.url} alt={alt} className="max-h-48 w-auto object-cover" />
              </a>
            );
          }

          return (
            <a
              key={`${file.url}-${index}`}
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-[var(--line)] px-3 py-2 text-xs font-bold text-[var(--accent)] underline"
            >
              {alt}
            </a>
          );
        })}
      </div>
    </div>
  );
}
