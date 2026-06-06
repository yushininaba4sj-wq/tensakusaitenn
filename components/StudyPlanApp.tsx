"use client";

import { useMemo, useState } from "react";

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

function buildMockPlan(input: PlanInput) {
  const daysLeft = daysUntil(input.examDate);
  const current = Number(input.currentDev) || 50;
  const target = Number(input.targetDev) || 60;
  const gap = Math.max(0, target - current);
  const progress = Math.min(100, Math.round((current / target) * 100));
  const hours = Number(input.hoursPerDay) || 3;

  const todayTasks = [
    ...(input.weakSubjects.includes("英語") || input.weakSubjects.length === 0
      ? [{ subject: "英語", task: "長文1題＋単語100語", minutes: 60 }]
      : []),
    ...(input.weakSubjects.includes("数学")
      ? [{ subject: "数学", task: "場合の数 例題10問", minutes: 50 }]
      : []),
    { subject: "国語", task: "小論文 構成メモ1本", minutes: 40 },
    { subject: "復習", task: "昨日のミス直し", minutes: 30 },
  ].slice(0, 4);

  return {
    daysLeft,
    progress,
    achievement: 68,
    studyMinutesToday: todayTasks.reduce((s, t) => s + t.minutes, 0),
    weeklyHours: hours * 7,
    annual: `${input.school || "志望校"}合格に向け、基礎→標準→過去問の3フェーズ`,
    monthly: `残り${Math.ceil(daysLeft / 30)}ヶ月：${input.weakSubjects.join("・") || "全科目"}を重点強化`,
    weekly: `週${hours * 7}時間：${input.books || "指定参考書"}を進める`,
    todayTasks,
    gap,
    school: input.school || "志望校",
  };
}

export function StudyPlanApp() {
  const [generated, setGenerated] = useState(false);
  const [input, setInput] = useState<PlanInput>({
    school: "",
    currentDev: "",
    targetDev: "",
    examDate: "",
    hoursPerDay: "3",
    weakSubjects: [],
    books: "",
  });

  const plan = useMemo(() => buildMockPlan(input), [input, generated]);

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
          入力内容をもとに、年間・月間・週間・今日のタスクまで計画します。進捗に合わせて毎日見直します。
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
          <label className="block sm:col-span-2">
            <span className="text-sm font-semibold">使用参考書</span>
            <textarea
              className="mt-2 w-full min-h-[80px] rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm"
              placeholder="例：システム英単語、青チャート、現代文キーワード読解"
              value={input.books}
              onChange={(e) => setInput({ ...input, books: e.target.value })}
            />
          </label>
        </div>
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
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "試験日まで", value: `${plan.daysLeft}日` },
          { label: "達成率", value: `${plan.achievement}%` },
          { label: "今日の学習", value: `${plan.studyMinutesToday}分` },
          { label: "到達度", value: `${plan.progress}%` },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-2xl border border-[var(--line)] bg-white p-4 text-center"
          >
            <p className="text-xs text-[var(--muted)]">{m.label}</p>
            <p className="mt-1 text-xl font-bold text-[var(--accent)]">{m.value}</p>
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

      <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
        <h2 className="font-bold">今日のタスク</h2>
        <ul className="mt-4 space-y-3">
          {plan.todayTasks.map((t) => (
            <li
              key={`${t.subject}-${t.task}`}
              className="flex items-center justify-between rounded-xl bg-[var(--bg)] px-4 py-3"
            >
              <div>
                <p className="text-xs font-bold text-[var(--accent)]">{t.subject}</p>
                <p className="text-sm font-semibold">{t.task}</p>
              </div>
              <span className="text-sm font-bold text-[var(--muted)]">{t.minutes}分</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
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
