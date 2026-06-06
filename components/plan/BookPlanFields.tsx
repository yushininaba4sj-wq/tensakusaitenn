"use client";

import {
  BOOK_COLORS,
  type BookPlanInput,
  WEEKDAYS,
  createEmptyBook,
} from "@/lib/planLogic";

type BookPlanFieldsProps = {
  books: BookPlanInput[];
  onChange: (books: BookPlanInput[]) => void;
  defaultTargetDate: string;
};

export function BookPlanFields({ books, onChange, defaultTargetDate }: BookPlanFieldsProps) {
  function updateBook(id: string, patch: Partial<BookPlanInput>) {
    onChange(books.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }

  function toggleDay(book: BookPlanInput, day: number) {
    const studyDays = book.studyDays.includes(day)
      ? book.studyDays.filter((d) => d !== day)
      : [...book.studyDays, day].sort();
    updateBook(book.id, { studyDays });
  }

  return (
    <div className="mt-6 space-y-4 border-t border-[var(--line)] pt-6">
      <div>
        <h3 className="font-bold">参考書の計画</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">
          教材名・範囲・目標日・周回数から、1日のノルマを計算します。
        </p>
      </div>

      {books.map((book, index) => (
        <div
          key={book.id}
          className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-4"
        >
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: book.color }}
            />
            <p className="text-sm font-bold">参考書 {index + 1}</p>
          </div>

          <div className="mt-3 grid gap-3">
            <label className="block">
              <span className="text-xs font-semibold">教材名</span>
              <input
                className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm"
                placeholder="例：青チャート 数IA"
                value={book.name}
                onChange={(e) => updateBook(book.id, { name: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold">章・単元（任意）</span>
              <input
                className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm"
                placeholder="例：第3章 二次関数"
                value={book.chapter}
                onChange={(e) => updateBook(book.id, { chapter: e.target.value })}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-semibold">範囲（開始）</span>
                <input
                  type="number"
                  min={1}
                  className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm"
                  value={book.rangeStart}
                  onChange={(e) =>
                    updateBook(book.id, { rangeStart: Number(e.target.value) || 1 })
                  }
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold">範囲（終了）</span>
                <input
                  type="number"
                  min={1}
                  className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm"
                  value={book.rangeEnd}
                  onChange={(e) =>
                    updateBook(book.id, { rangeEnd: Number(e.target.value) || 1 })
                  }
                />
              </label>
            </div>
            <label className="block">
              <span className="text-xs font-semibold">目標日</span>
              <input
                type="date"
                className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm"
                value={book.targetDate || defaultTargetDate}
                onChange={(e) => updateBook(book.id, { targetDate: e.target.value })}
              />
            </label>
            <div>
              <span className="text-xs font-semibold">周回数</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => updateBook(book.id, { rounds: n })}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                      book.rounds === n
                        ? "bg-[var(--ink)] text-white"
                        : "border border-[var(--line)] bg-white"
                    }`}
                  >
                    {n}周
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold">学習曜日</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {WEEKDAYS.map((label, day) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => toggleDay(book, day)}
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                      book.studyDays.includes(day)
                        ? "bg-[var(--ink)] text-white"
                        : "border border-[var(--line)] bg-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          onChange([...books, createEmptyBook(books.length)])
        }
        className="w-full rounded-xl border border-dashed border-[var(--line)] py-2.5 text-sm font-bold text-[var(--muted)]"
      >
        ＋ 参考書を追加
      </button>
    </div>
  );
}

export function getInitialBooks(): BookPlanInput[] {
  return [createEmptyBook(0)];
}

export { BOOK_COLORS };
