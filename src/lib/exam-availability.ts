import type { Exam } from "@/types";
import { formatDate } from "./utils";

export type ExamAvailability =
  | { ok: true }
  | { ok: false; message: string };

export function getExamAvailability(
  exam: Pick<Exam, "startsAt" | "endsAt">,
  now = new Date()
): ExamAvailability {
  if (exam.startsAt) {
    const start = new Date(exam.startsAt);
    if (now < start) {
      return {
        ok: false,
        message: `This exam opens on ${formatDate(exam.startsAt)}.`,
      };
    }
  }

  if (exam.endsAt) {
    const end = new Date(exam.endsAt);
    if (now > end) {
      return {
        ok: false,
        message: `This exam closed on ${formatDate(exam.endsAt)}.`,
      };
    }
  }

  return { ok: true };
}
