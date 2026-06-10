import { NextRequest, NextResponse } from "next/server";
import {
  countQuestionsByExamId,
  findActiveExamByPassword,
  findStudentDuplicate,
} from "@/lib/db/repository";
import { getExamAvailability } from "@/lib/exam-availability";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { isStudentIdAllowed, normalizeStudentId } from "@/lib/student-ids";

const VERIFY_LIMIT = 30;
const VERIFY_WINDOW_MS = 60_000;

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`verify:${ip}`, VERIFY_LIMIT, VERIFY_WINDOW_MS);
    if (!rateLimit.ok) {
      return NextResponse.json(
        {
          error: `Too many attempts. Please wait ${rateLimit.retryAfterSec} seconds and try again.`,
        },
        { status: 429 }
      );
    }

    const { password, studentId } = await request.json();
    const exam = await findActiveExamByPassword(password);

    if (!exam) {
      return NextResponse.json({ error: "Invalid or inactive examination password" }, { status: 401 });
    }

    const availability = getExamAvailability(exam);
    if (!availability.ok) {
      return NextResponse.json({ error: availability.message }, { status: 403 });
    }

    if (!studentId?.trim()) {
      return NextResponse.json({ error: "Student ID is required." }, { status: 400 });
    }

    const normalizedStudentId = normalizeStudentId(studentId);

    if (exam.allowedStudentIds?.length) {
      if (!isStudentIdAllowed(normalizedStudentId, exam.allowedStudentIds)) {
        return NextResponse.json(
          { error: "This Student ID is not on the allowed list for this exam." },
          { status: 403 }
        );
      }
    }

    const existingSubmission = await findStudentDuplicate(exam.id, normalizedStudentId);
    if (existingSubmission) {
      return NextResponse.json(
        {
          error: "You have already submitted this examination. Only one attempt is allowed.",
          alreadySubmitted: true,
        },
        { status: 409 }
      );
    }

    const questionCount = await countQuestionsByExamId(exam.id);

    return NextResponse.json({
      exam: {
        id: exam.id,
        title: exam.title,
        instructions: exam.instructions,
        durationMinutes: exam.durationMinutes,
        endsAt: exam.endsAt,
        questionCount,
      },
    });
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
