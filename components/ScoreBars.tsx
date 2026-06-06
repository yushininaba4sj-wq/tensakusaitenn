type ScoreItem = { label: string; score: number; max?: number };

export function ScoreBars({ items }: { items: ScoreItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const max = item.max ?? 100;
        const pct = Math.round((item.score / max) * 100);
        return (
          <div key={item.label}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">{item.label}</span>
              <span className="font-bold text-[var(--accent)]">{item.score}</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--line)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
