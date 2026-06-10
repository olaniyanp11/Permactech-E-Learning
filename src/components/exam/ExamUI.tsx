"use client";

import { useEffect, useState } from "react";
import { cn, parseTimestamp } from "@/lib/utils";
import type { Question } from "@/types";

interface ExamTimerProps {
  durationMinutes: number;
  startedAt: string;
  endsAt?: string | null;
  onTimeUp: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function ExamTimer({ durationMinutes, startedAt, endsAt, onTimeUp }: ExamTimerProps) {
  const totalSeconds = durationMinutes * 60;
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    const startMs = new Date(startedAt).getTime();
    const durationEndMs = startMs + totalSeconds * 1000;
    const windowEndMs = endsAt ? parseTimestamp(endsAt)?.getTime() ?? null : null;
    const effectiveEndMs =
      windowEndMs != null ? Math.min(durationEndMs, windowEndMs) : durationEndMs;

    const tick = () => {
      const left = Math.max(0, Math.floor((effectiveEndMs - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) onTimeUp();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt, totalSeconds, endsAt, onTimeUp]);

  const isLow = remaining <= 300;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium tabular-nums",
        isLow
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-border bg-surface text-foreground"
      )}
      role="timer"
      aria-live="polite"
      aria-label={`Time remaining: ${formatTime(remaining)}`}
    >
      <span className="text-xs text-muted-foreground">Time left</span>
      {formatTime(remaining)}
    </div>
  );
}

export function ProgressIndicator({
  current,
  total,
  answered,
}: {
  current: number;
  total: number;
  answered: number;
}) {
  const pct = total > 0 ? (answered / total) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          Question {current} of {total}
        </span>
        <span>{answered}/{total} answered</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={answered}
          aria-valuemin={0}
          aria-valuemax={total}
        />
      </div>
    </div>
  );
}

export function QuestionNavigation({
  questions,
  currentIndex,
  answers,
  onNavigate,
}: {
  questions: Question[];
  currentIndex: number;
  answers: Record<string, string>;
  onNavigate: (index: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="navigation" aria-label="Question navigation">
      {questions.map((q, i) => {
        const answered = Boolean(answers[q.id]?.trim());
        const isCurrent = i === currentIndex;
        return (
          <button
            key={q.id}
            type="button"
            onClick={() => onNavigate(i)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md border text-xs font-medium transition-colors",
              isCurrent && "border-primary bg-primary text-primary-foreground",
              !isCurrent && answered && "border-success/30 bg-success-bg text-success",
              !isCurrent && !answered && "border-border text-muted-foreground hover:border-border hover:text-foreground"
            )}
            aria-label={`Question ${i + 1}${answered ? ", answered" : ", unanswered"}${isCurrent ? ", current" : ""}`}
            aria-current={isCurrent ? "step" : undefined}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}
