"use client";

import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { Question } from "@/types";

interface QuestionRendererProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  index: number;
  disabled?: boolean;
}

export function QuestionRenderer({
  question,
  value,
  onChange,
  index,
  disabled = false,
}: QuestionRendererProps) {
  return (
    <div className="space-y-5">
      <div>
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Question {index + 1} · {question.points} pt{question.points !== 1 ? "s" : ""}
        </span>
        <h2 className="mt-2 text-lg font-medium leading-relaxed text-foreground">
          {question.text}
        </h2>
      </div>

      {question.type === "mcq" && question.options && (
        <fieldset className="space-y-2">
          <legend className="sr-only">Select an answer</legend>
          {question.options.map((option) => (
            <label
              key={option}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors",
                value === option
                  ? "border-primary bg-accent"
                  : "border-border hover:border-border hover:bg-surface"
              )}
            >
              <input
                type="radio"
                name={question.id}
                value={option}
                checked={value === option}
                onChange={() => onChange(option)}
                disabled={disabled}
                className="h-4 w-4 accent-[var(--primary)]"
              />
              {option}
            </label>
          ))}
        </fieldset>
      )}

      {question.type === "true_false" && (
        <fieldset className="flex gap-3">
          <legend className="sr-only">True or False</legend>
          {(["true", "false"] as const).map((opt) => (
            <label
              key={opt}
              className={cn(
                "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm capitalize transition-colors",
                value === opt
                  ? "border-primary bg-accent"
                  : "border-border hover:bg-surface"
              )}
            >
              <input
                type="radio"
                name={question.id}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(opt)}
                disabled={disabled}
                className="h-4 w-4 accent-[var(--primary)]"
              />
              {opt}
            </label>
          ))}
        </fieldset>
      )}

      {question.type === "short_answer" && (
        <Input
          label="Your answer"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your answer here..."
          disabled={disabled}
        />
      )}
    </div>
  );
}
