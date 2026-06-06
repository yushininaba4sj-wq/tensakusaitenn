"use client";

import { useMemo, useState } from "react";
import { BookPlanFields, getInitialBooks } from "@/components/plan/BookPlanFields";
import { StudyHeatmap } from "@/components/plan/StudyHeatmap";
import {
  type BookPlanInput,
  bookBreakdown,
  buildBookTasks,
  calcBookQuota,
  countStudyDaysUntil,
  defaultBooksIfEmpty,
  formatMinutes,
  formatHoursDecimal,
} from "@/lib/planLogic";

type PlanInput = {
  school: string;
  currentDev: string;
  targetDev: string;
  examDate: string;
  hoursPerDay: string;
  weakSubjects: string[];
  books: string;
};

const SUBJECTS = ["英語", "数学", "国語", "理科", "社会"] as const;

function daysUntil(dateStr: string): number {
  if (!dateStr) return 0;
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((target.getTime() - today.getTime()) / 86400000));
}

function todayLabel(): string {
  const d = new Date();
  const wd = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()];
  return `${d.getMonth() + 1}月${d.getDate()}日（${wd}）`;
}

function buildPlan(input: PlanInput, bookPlans: BookPlanInput[]) {
  const daysLeft = daysUntil(input.examDate);
  const current = Number(input.currentDev) || 50;
  const target = Number(input.targetDev) || 60;
  const gap = Math.max(0, target - current);
  const progress = Math.min(100, Math.round((current / target) * 100));
  const hours = Number(input.hoursPerDay) || 3;

  const activeBooks = defaultBooksIfEmpty(bookPlans, input.examDate);
  const bookTasks = buildBookTasks(activeBooks);
  const nextTask = bookTasks.find((t) => !t.done) ?? bookTasks[0];
  const completedCount = bookTasks.filter((t) => t.done).length;
  const quotaPct =
    bookTasks.length === 0 ? 0 : Math.round((completedCount / bookTasks.length) * 100);

  const studyMinutesToday =
    bookTasks.filter((t) => !t.done).reduce((s, t) => s + t.minutes, 0) || 84;

  return {
    daysLeft,
    progress,
    achievement: 68,
    studyMinutesToday,
    weeklyHours: hours * 7,
    annual: `${input.school || "志望校"}合格に向け、基礎→標準→過去問の3フェーズ`,
    monthly: `残り${Math.ceil(daysLeft / 30)}ヶ月：${input.weakSubjects.join("・") || "全科目"}を重点強化`,
    weekly: `週${hours * 7}時間：参考書${activeBooks.length}冊を並行して進める`,
    gap,
    school: input.school || "志望校",
    bookTasks,
    nextTask,
    quotaPct,
    completedCount,
    activeBooks,
    breakdown: bookBreakdown(activeBooks),
    streak: 23,
    totalHours: 184,
    streakBest: 31,
  };
}

function QuotaRing({ pct }: { pct: number }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <svg width="72" height="72" className="-rotate-90">
      <circle cx="36" cy="36" r={r} fill="none" stroke="var(--line)" strokeWidth="6" />
      <circle
        cx="36"
        cy="36"
        r={r}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="6"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
      <text
        x="36"
        y="40"
        textAnchor="middle"
        className="rotate-90 fill-[var(--ink)] text-sm font-bold"
        style={{ transformOrigin: "36px 36px" }}
      >
        {pct}%
      </text>
    </svg>
  );
}

export function StudyPlanApp() {
  const [generated, setGenerated] = useState(false);
  const [view, setView] = useState<"today" | "analysis">("today");
  const [input, setInput] = useState<PlanInput>({
    school: "",
    currentDev: "",
    targetDev: "",
    examDate: "",
    hoursPerDay: "3",
    weakSubjects: [],
    books: "",
  });
  const [bookPlans, setBookPlans] = useState<BookPlanInput[]>(getInitialBooks);

  const plan = useMemo(
    () => buildPlan(input, bookPlans),
    [input, bookPlans, generated],
  );

  function toggleSubject(subject: string) {
    setInput((prev) => ({
      ...prev,
      weakSubjects: prev.weakSubjects.includes(subject)
        ? prev.weakSubjects.filter((s) => s !== subject)
        : [...prev.weakSubjects, subject],
    }));
  }

  if (!generated) {
    return (
      <form
        className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          setGenerated(true);
        }}
      >
        <h2 className="text-lg font-bold">学習計画を立てる</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          志望校の全体計画に加え、参考書ごとの1日ノルマも一緒に決められます。
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-sm font-semibold">志望校</span>
            <input
              required
              className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm"
              placeholder="例：早稲田大学 政治経済学部"
              value={input.school}
              onChange={(e) => setInput({ ...input, school: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">現在偏差値</span>
            <input
              required
              type="number"
              min={30}
              max={80}
              className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm"
              value={input.currentDev}
              onChange={(e) => setInput({ ...input, currentDev: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">目標偏差値</span>
            <input
              required
              type="number"
              min={30}
              max={80}
              className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm"
              value={input.targetDev}
              onChange={(e) => setInput({ ...input, targetDev: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">試験日</span>
            <input
              required
              type="date"
              className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm"
              value={input.examDate}
              onChange={(e) => setInput({ ...input, examDate: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">1日の勉強可能時間（時間）</span>
            <input
              required
              type="number"
              min={1}
              max={16}
              className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm"
              value={input.hoursPerDay}
              onChange={(e) => setInput({ ...input, hoursPerDay: e.target.value })}
            />
          </label>
          <div className="block sm:col-span-2">
            <span className="text-sm font-semibold">苦手科目</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {SUBJECTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSubject(s)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                    input.weakSubjects.includes(s)
                      ? "bg-[var(--accent)] text-white"
                      : "border border-[var(--line)] bg-[var(--bg)]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <BookPlanFields
          books={bookPlans}
          onChange={setBookPlans}
          defaultTargetDate={input.examDate}
        />

        <button
          type="submit"
          className="mt-5 w-full rounded-xl bg-[var(--accent)] py-3 text-sm font-bold text-white"
        >
          学習計画を立てる
        </button>
        <p className="mt-3 text-center text-xs text-[var(--muted)]">
          志望校合格の現役大学生への相談も可能（キャンペーン中無料）
        </p>
      </form>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex rounded-xl border border-[var(--line)] bg-[var(--bg)] p-1">
        {(
          [
            { id: "today" as const, label: "今日" },
            { id: "analysis" as const, label: "分析" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setView(tab.id)}
            className={`flex-1 rounded-lg py-2.5 text-sm font-bold ${
              view === tab.id ? "bg-white text-[var(--accent)] shadow-sm" : "text-[var(--muted)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {view === "today" ? (
        <>
          <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[var(--accent)]">今日</p>
                <p className="mt-1 text-lg font-bold">{todayLabel()}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  今日のノルマ {plan.completedCount}/{plan.bookTasks.length}タスク
                  {plan.bookTasks.length > plan.completedCount &&
                    ` · あと${plan.bookTasks.length - plan.completedCount}`}
                </p>
              </div>
              <QuotaRing pct={plan.quotaPct} />
            </div>
          </div>

          {plan.nextTask && (
            <div className="rounded-2xl bg-[var(--ink)] p-5 text-white">
              <p className="text-xs font-bold text-white/60">次やること</p>
              <p className="mt-2 text-sm text-white/80">{plan.nextTask.bookName}</p>
              <p className="mt-1 text-lg font-bold">{plan.nextTask.detail}</p>
              <p className="mt-2 text-sm text-white/70">
                約{plan.nextTask.minutes}分 · {plan.nextTask.count}問
              </p>
              <button
                type="button"
                className="mt-4 w-full rounded-xl bg-white py-3 text-sm font-bold text-[var(--ink)]"
              >
                集中して始める
              </button>
            </div>
          )}

          <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
            <h2 className="font-bold">今日のタスク</h2>
            <ul className="mt-4 space-y-3">
              {plan.bookTasks.map((task) => (
                <li
                  key={task.id}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-3 ${
                    task.done ? "border-[var(--line)] bg-[var(--bg)] opacity-60" : "border-[var(--line)] bg-white"
                  }`}
                >
                  <span
                    className="h-8 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: task.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold" style={{ color: task.color }}>
                      {task.label}
                    </p>
                    <p className="truncate text-sm font-semibold">{task.bookName}</p>
                    <p className="text-xs text-[var(--muted)]">{task.detail}</p>
                  </div>
                  <div className="shrink-0 text-right text-xs font-bold text-[var(--muted)]">
                    <p>{task.count}問</p>
                    <p>{task.minutes}分</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "試験日まで", value: `${plan.daysLeft}日` },
              { label: "到達度", value: `${plan.progress}%` },
              { label: "今日の学習", value: formatMinutes(plan.studyMinutesToday) },
              { label: "連続記録", value: `${plan.streak}日` },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-2xl border border-[var(--line)] bg-white p-3 text-center"
              >
                <p className="text-[10px] text-[var(--muted)]">{m.label}</p>
                <p className="mt-1 text-lg font-bold text-[var(--accent)]">{m.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
            <h2 className="font-bold">{plan.school}までの到達度</h2>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-[var(--line)]">
              <div
                className="h-full rounded-full bg-[var(--accent)]"
                style={{ width: `${plan.progress}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">
              目標偏差値まであと {plan.gap}。毎日の進捗に合わせて計画を見直します。
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { title: "年間計画", body: plan.annual },
              { title: "月間計画", body: plan.monthly },
              { title: "週間計画", body: plan.weekly },
            ].map((block) => (
              <div
                key={block.title}
                className="rounded-2xl border border-[var(--line)] bg-white p-4"
              >
                <p className="text-xs font-bold text-[var(--accent)]">{block.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{block.body}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[var(--line)] bg-white p-4">
              <p className="text-xs text-[var(--muted)]">合計時間</p>
              <p className="mt-1 text-2xl font-bold">{plan.totalHours}時間</p>
              <p className="mt-1 text-xs font-bold text-green-600">+22% 先月比</p>
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-white p-4">
              <p className="text-xs text-[var(--muted)]">連続記録</p>
              <p className="mt-1 text-2xl font-bold">{plan.streak}日</p>
              <p className="mt-1 text-xs text-[var(--muted)]">過去最長 {plan.streakBest}日</p>
            </div>
          </div>

          <StudyHeatmap />

          <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
            <h2 className="font-bold">教材別</h2>
            <ul className="mt-4 space-y-4">
              {plan.breakdown.map((item) => {
                const max = Math.max(...plan.breakdown.map((b) => b.minutes), 1);
                return (
                  <li key={item.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold">{item.name}</span>
                      <span className="font-bold text-[var(--muted)]">
                        {formatHoursDecimal(item.minutes)}
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--line)]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.round((item.minutes / max) * 100)}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
            <h2 className="font-bold">参考書ごとの1日ノルマ</h2>
            <ul className="mt-4 space-y-3">
              {plan.activeBooks.map((book) => {
                const q = calcBookQuota(book);
                const days = countStudyDaysUntil(book.targetDate || input.examDate, book.studyDays);
                return (
                  <li
                    key={book.id}
                    className="rounded-xl bg-[var(--bg)] px-4 py-3 text-sm"
                  >
                    <p className="font-bold">{book.name}</p>
                    <p className="mt-1 text-[var(--muted)]">
                      合計{q.total}問 × {book.rounds}周 · 残り{days}日（学習日）
                    </p>
                    <p className="mt-2 text-lg font-bold text-[var(--accent)]">
                      {q.daily}問 / 日
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      目安 {q.minutesPerDay}分/日 · 実績に合わせて見直します
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}

      <button
        type="button"
        onClick={() => setGenerated(false)}
        className="text-sm font-bold text-[var(--accent)]"
      >
        ← 条件を変更する
      </button>
    </div>
  );
}
