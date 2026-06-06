import { mockHeatmap, WEEKDAYS } from "@/lib/planLogic";

const LEVELS = ["bg-[var(--line)]", "bg-neutral-300", "bg-neutral-400", "bg-neutral-600", "bg-[var(--ink)]"];

export function StudyHeatmap() {
  const grid = mockHeatmap();

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-bold">学習ヒートマップ</h2>
        <span className="text-xs text-[var(--muted)]">過去16週</span>
      </div>
      <div className="mt-4 overflow-x-auto">
        <div className="inline-flex min-w-full gap-1">
          <div className="flex flex-col gap-1 pr-1 pt-4 text-[9px] text-[var(--muted)]">
            {WEEKDAYS.map((d) => (
              <span key={d} className="flex h-3 items-center">
                {d}
              </span>
            ))}
          </div>
          <div className="flex gap-1">
            {grid[0].map((_, col) => (
              <div key={col} className="flex flex-col gap-1">
                {grid.map((row, rowIdx) => (
                  <div
                    key={`${col}-${rowIdx}`}
                    className={`h-3 w-3 rounded-sm ${LEVELS[row[col]] ?? LEVELS[0]}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
