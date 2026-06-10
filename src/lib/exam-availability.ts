import type { Exam } from "@/types";
import { formatExamDate, parseTimestamp } from "./utils";

export type ExamAvailability =
  | { ok: true }
  | { ok: false; message: string };

function toMinuteMs(date: Date): number {
  return Math.floor(date.getTime() / 60_000) * 60_000;
}

export function getExamAvailability(
  exam: Pick<Exam, "startsAt" | "endsAt">,
  now = new Date()
): ExamAvailability {
  const nowMinute = toMinuteMs(now);

  if (exam.startsAt) {
    const start = parseTimestamp(exam.startsAt);
    if (start && nowMinute < toMinuteMs(start)) {
      return {
        ok: false,
        message: `This exam opens on ${formatExamDate(start)}.`,
      };
    }
  }

  if (exam.endsAt) {
    const end = parseTimestamp(exam.endsAt);
    if (end && nowMinute > toMinuteMs(end)) {
      return {
        ok: false,
        message: `This exam closed on ${formatExamDate(end)}.`,
      };
    }
  }

  return { ok: true };
}
