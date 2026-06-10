import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  deleteExam,
  getExamById,
  getQuestionsByExamId,
  updateExam,
} from "@/lib/db/repository";
import type { Question } from "@/types";

function stripAnswers(questions: Question[]): Omit<Question, "correctAnswer">[] {
  return questions.map(({ correctAnswer: _, ...q }) => q);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();
  const exam = await getExamById(id);

  if (!exam) {
    return NextResponse.json({ error: "Exam not found" }, { status: 404 });
  }

  const questions = await getQuestionsByExamId(id);

  return NextResponse.json({
    exam: session
      ? exam
      : {
          id: exam.id,
          title: exam.title,
          instructions: exam.instructions,
          durationMinutes: exam.durationMinutes,
        },
    questions: session ? questions : stripAnswers(questions),
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const updated = await updateExam(id, body);

  if (!updated) {
    return NextResponse.json({ error: "Exam not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteExam(id);

  if (!deleted) {
    return NextResponse.json({ error: "Exam not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
