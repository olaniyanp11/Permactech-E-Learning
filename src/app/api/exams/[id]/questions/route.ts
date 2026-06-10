import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  createQuestion,
  getExamById,
  getQuestionsByExamId,
} from "@/lib/db/repository";
import { generateId } from "@/lib/utils";
import type { Question } from "@/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const questions = await getQuestionsByExamId(id);
  return NextResponse.json(questions);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: examId } = await params;
  const exam = await getExamById(examId);

  if (!exam) {
    return NextResponse.json({ error: "Exam not found" }, { status: 404 });
  }

  const body = await request.json();
  const existing = await getQuestionsByExamId(examId);

  const question: Question = {
    id: generateId(),
    examId,
    type: body.type,
    text: body.text,
    options: body.type === "mcq" ? body.options : undefined,
    correctAnswer: body.correctAnswer,
    points: Number(body.points) || 1,
    order: existing.length + 1,
  };

  await createQuestion(question);
  return NextResponse.json(question, { status: 201 });
}
