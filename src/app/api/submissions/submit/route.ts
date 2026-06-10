import { NextRequest, NextResponse } from "next/server";
import {
  createSubmission,
  findStudentDuplicate,
  getExamById,
  getQuestionsByExamId,
} from "@/lib/db/repository";
import { getExamAvailability } from "@/lib/exam-availability";
import { calculateScore } from "@/lib/scoring";
import { isStudentIdAllowed, normalizeStudentId } from "@/lib/student-ids";
import { generateId } from "@/lib/utils";
import type { Answer, DeviceInfo, Submission } from "@/types";

function getClientIp(request: NextRequest): string | undefined {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    undefined
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      examId,
      studentName,
      studentId,
      studentClass,
      password,
      answers,
      deviceInfo,
      startedAt,
    } = body as {
      examId: string;
      studentName: string;
      studentId: string;
      studentClass: string;
      password: string;
      answers: Answer[];
      deviceInfo: DeviceInfo;
      startedAt: string;
    };

    const exam = await getExamById(examId);

    if (!exam || !exam.isActive) {
      return NextResponse.json({ error: "Exam not found or inactive" }, { status: 404 });
    }

    if (exam.password !== password) {
      return NextResponse.json({ error: "Invalid examination password" }, { status: 401 });
    }

    const availability = getExamAvailability(exam);
    if (!availability.ok) {
      return NextResponse.json({ error: availability.message }, { status: 403 });
    }

    const normalizedStudentId = normalizeStudentId(studentId);

    if (!isStudentIdAllowed(normalizedStudentId, exam.allowedStudentIds)) {
      return NextResponse.json(
        { error: "This Student ID is not on the allowed list for this exam." },
        { status: 403 }
      );
    }

    const studentDuplicate = await findStudentDuplicate(examId, normalizedStudentId);

    if (studentDuplicate) {
      return NextResponse.json(
        {
          error: "Duplicate submission detected",
          duplicate: true,
          reason: "student_id",
          message: "A submission already exists for this Student ID. Only one attempt is allowed.",
        },
        { status: 409 }
      );
    }

    const questions = await getQuestionsByExamId(examId);
    const scoring = calculateScore(questions, answers);
    const ipAddress = getClientIp(request);

    const submission: Submission = {
      id: generateId(),
      examId,
      studentName,
      studentId: normalizedStudentId,
      studentClass,
      answers,
      ...scoring,
      deviceInfo: { ...deviceInfo, ipAddress },
      submittedAt: new Date().toISOString(),
      startedAt,
      status: "submitted",
    };

    await createSubmission(submission);

    return NextResponse.json({ submission }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
