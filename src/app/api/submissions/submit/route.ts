import { NextRequest, NextResponse } from "next/server";
import {
  createSubmission,
  findDeviceDuplicate,
  findStudentDuplicate,
  getExamById,
  getQuestionsByExamId,
} from "@/lib/db/repository";
import { calculateScore } from "@/lib/scoring";
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

    const studentDuplicate = await findStudentDuplicate(examId, studentId);

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

    const deviceDuplicate = await findDeviceDuplicate(examId, deviceInfo.fingerprint);

    if (deviceDuplicate) {
      return NextResponse.json(
        {
          error: "Duplicate submission detected",
          duplicate: true,
          reason: "device",
          message: "A submission already exists from this device. Only one attempt per device is allowed.",
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
      studentId,
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
