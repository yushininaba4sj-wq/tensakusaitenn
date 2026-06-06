import { SITE } from "@/lib/services";

export function SenpaiBrandName({ className = "" }: { className?: string }) {
  return (
    <span className={`font-bold text-[var(--senpai)] ${className}`.trim()}>
      {SITE.senpaiName}
    </span>
  );
}

type SenpaiLinkProps = {
  className?: string;
  children?: React.ReactNode;
};

/** SENPAI LINK の文字だけ水色。周りのレイアウトは className / children で指定 */
export function SenpaiLink({ className = "", children }: SenpaiLinkProps) {
  return (
    <a
      href={SITE.senpaiLink}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children ?? <SenpaiBrandName />}
    </a>
  );
}
