import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readDb } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const db = readDb();
  const submission = db.submissions.find((s) => s.id === id);

  if (!submission) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const exam = db.exams.find((e) => e.id === submission.examId);
  const questions = db.questions.filter((q) => q.examId === submission.examId);

  return NextResponse.json({ submission, exam, questions });
}
