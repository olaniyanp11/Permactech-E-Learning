import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readDb, writeDb } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; questionId: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: examId, questionId } = await params;
  const db = readDb();
  const index = db.questions.findIndex(
    (q) => q.id === questionId && q.examId === examId
  );

  if (index === -1) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  const body = await request.json();
  db.questions[index] = { ...db.questions[index], ...body };
  writeDb(db);

  return NextResponse.json(db.questions[index]);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; questionId: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: examId, questionId } = await params;
  const db = readDb();
  db.questions = db.questions.filter(
    (q) => !(q.id === questionId && q.examId === examId)
  );
  writeDb(db);

  return NextResponse.json({ success: true });
}
