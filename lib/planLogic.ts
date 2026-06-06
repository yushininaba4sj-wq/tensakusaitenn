export type BookPlanInput = {
  id: string;
  name: string;
  subject: string;
  rangeStart: number;
  rangeEnd: number;
  chapter: string;
  targetDate: string;
  rounds: number;
  studyDays: number[];
  color: string;
};

export const WEEKDAYS = ["月", "火", "水", "木", "金", "土", "日"] as const;

export const BOOK_COLORS = ["#2563eb", "#16a34a", "#ea580c", "#9333ea", "#64748b"] as const;

export function createEmptyBook(index: number): BookPlanInput {
  return {
    id: `book-${index}`,
    name: "",
    subject: "",
    rangeStart: 1,
    rangeEnd: 100,
    chapter: "",
    targetDate: "",
    rounds: 3,
    studyDays: [0, 1, 2, 3, 4, 5],
    color: BOOK_COLORS[index % BOOK_COLORS.length],
  };
}

export function countStudyDaysUntil(targetDate: string, studyDays: number[]): number {
  if (!targetDate || studyDays.length === 0) return 1;
  const end = new Date(targetDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  if (end <= today) return 1;

  let count = 0;
  const cursor = new Date(today);
  while (cursor <= end) {
    const dow = (cursor.getDay() + 6) % 7;
    if (studyDays.includes(dow)) count += 1;
    cursor.setDate(cursor.getDate() + 1);
  }
  return Math.max(count, 1);
}

export function calcBookQuota(book: BookPlanInput) {
  const total = Math.max(book.rangeEnd - book.rangeStart + 1, 1);
  const studyDays = countStudyDaysUntil(book.targetDate || book.targetDate, book.studyDays);
  const daily = Math.max(1, Math.ceil((total * book.rounds) / studyDays));
  const minutesPerDay = Math.round(daily * 5.8);
  return { total, studyDays, daily, minutesPerDay };
}

export type TodayBookTask = {
  id: string;
  bookName: string;
  label: string;
  detail: string;
  count: number;
  minutes: number;
  color: string;
  done: boolean;
};

export function buildBookTasks(books: BookPlanInput[]): TodayBookTask[] {
  return books
    .filter((b) => b.name.trim())
    .map((book, index) => {
      const { daily, minutesPerDay } = calcBookQuota(book);
      const chapter = book.chapter || `例題 ${book.rangeStart}〜${book.rangeStart + daily - 1}`;
      return {
        id: book.id,
        bookName: book.name,
        label: book.subject || book.name.split(" ")[0] || "参考書",
        detail: chapter,
        count: daily,
        minutes: minutesPerDay,
        color: book.color,
        done: index === 3,
      };
    });
}

export function defaultBooksIfEmpty(books: BookPlanInput[], examDate: string): BookPlanInput[] {
  const filled = books.filter((b) => b.name.trim());
  if (filled.length > 0) return filled;

  const target = examDate || new Date(Date.now() + 173 * 86400000).toISOString().slice(0, 10);
  return [
    {
      id: "demo-1",
      name: "青チャート 数IA",
      subject: "数学IA",
      rangeStart: 1,
      rangeEnd: 488,
      chapter: "第3章 二次関数 例題15-22",
      targetDate: target,
      rounds: 3,
      studyDays: [0, 1, 2, 3, 4, 5],
      color: BOOK_COLORS[0],
    },
    {
      id: "demo-2",
      name: "ターゲット1900",
      subject: "英単語",
      rangeStart: 401,
      rangeEnd: 1900,
      chapter: "4章 #401-450",
      targetDate: target,
      rounds: 2,
      studyDays: [0, 1, 2, 3, 4, 5, 6],
      color: BOOK_COLORS[1],
    },
    {
      id: "demo-3",
      name: "化学重要問題集",
      subject: "化学",
      rangeStart: 1,
      rangeEnd: 120,
      chapter: "無機化学 演習17-20",
      targetDate: target,
      rounds: 2,
      studyDays: [0, 1, 2, 3, 4, 5],
      color: BOOK_COLORS[2],
    },
  ];
}

export function formatMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m}分`;
  if (m === 0) return `${h}時間`;
  return `${h}時間 ${m}分`;
}

export function formatHoursDecimal(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}時間 ${String(m).padStart(2, "0")}分`;
}

/** デモ用ヒートマップ（過去16週） */
export function mockHeatmap(): number[][] {
  const weeks = 16;
  const rows = 7;
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: weeks }, (_, col) => {
      const seed = (row + 1) * (col + 3);
      if (row === 6 && col > 12) return 0;
      return seed % 5;
    }),
  );
}

export function bookBreakdown(books: BookPlanInput[]) {
  return books.map((book) => {
    const { minutesPerDay } = calcBookQuota(book);
    const weeksLeft = Math.max(1, Math.ceil(countStudyDaysUntil(book.targetDate, book.studyDays) / 7));
    const totalMinutes = minutesPerDay * countStudyDaysUntil(book.targetDate, book.studyDays);
    return {
      name: book.name,
      color: book.color,
      minutes: totalMinutes,
      label: formatHoursDecimal(totalMinutes).replace("時間", "h ").replace("分", "m"),
      weeksLeft,
    };
  });
}
