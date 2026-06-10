import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createExam, getAllExams, getSubmissionCountsByExam } from "@/lib/db/repository";
import { generateId, normalizeTimestamp } from "@/lib/utils";
import type { Exam } from "@/types";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [exams, submissionCounts] = await Promise.all([
    getAllExams(),
    getSubmissionCountsByExam(),
  ]);

  return NextResponse.json(
    exams.map((exam) => ({
      ...exam,
      submissionCount: submissionCounts[exam.id] ?? 0,
    }))
  );
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const now = new Date().toISOString();

    const exam: Exam = {
      id: generateId(),
      title: body.title,
      instructions: body.instructions ?? "",
      password: body.password,
      durationMinutes: Number(body.durationMinutes) || 60,
      isActive: body.isActive ?? true,
      startsAt: normalizeTimestamp(body.startsAt),
      endsAt: normalizeTimestamp(body.endsAt),
      allowedStudentIds: body.allowedStudentIds ?? null,
      createdAt: now,
      updatedAt: now,
    };

    await createExam(exam);
    return NextResponse.json(exam, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create exam" }, { status: 500 });
  }
}
