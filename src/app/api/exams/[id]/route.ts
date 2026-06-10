import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readDb, writeDb } from "@/lib/db";
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
  const db = readDb();
  const exam = db.exams.find((e) => e.id === id);

  if (!exam) {
    return NextResponse.json({ error: "Exam not found" }, { status: 404 });
  }

  const questions = db.questions
    .filter((q) => q.examId === id)
    .sort((a, b) => a.order - b.order);

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
  const db = readDb();
  const index = db.exams.findIndex((e) => e.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Exam not found" }, { status: 404 });
  }

  const body = await request.json();
  db.exams[index] = {
    ...db.exams[index],
    ...body,
    updatedAt: new Date().toISOString(),
  };
  writeDb(db);

  return NextResponse.json(db.exams[index]);
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
  const db = readDb();
  db.exams = db.exams.filter((e) => e.id !== id);
  db.questions = db.questions.filter((q) => q.examId !== id);
  db.submissions = db.submissions.filter((s) => s.examId !== id);
  writeDb(db);

  return NextResponse.json({ success: true });
}
