import type { Exam } from "@/types";
import { formatExamDate, parseTimestamp } from "./utils";

export type ExamAvailability =
  | { ok: true }
  | { ok: false; message: string };

export function getExamAvailability(
  exam: Pick<Exam, "startsAt" | "endsAt">,
  now = new Date()
): ExamAvailability {
  const nowMs = now.getTime();

  if (exam.startsAt) {
    const start = parseTimestamp(exam.startsAt);
    if (start && nowMs < start.getTime()) {
      return {
        ok: false,
        message: `This exam opens on ${formatExamDate(exam.startsAt)}.`,
      };
    }
  }

  if (exam.endsAt) {
    const end = parseTimestamp(exam.endsAt);
    if (end && nowMs >= end.getTime()) {
      return {
        ok: false,
        message: `This exam closed on ${formatExamDate(exam.endsAt)}.`,
      };
    }
  }

  return { ok: true };
}
