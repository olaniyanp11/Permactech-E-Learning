import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { deleteQuestion, updateQuestion } from "@/lib/db/repository";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; questionId: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: examId, questionId } = await params;
  const body = await request.json();
  const updated = await updateQuestion(examId, questionId, body);

  if (!updated) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
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
  const deleted = await deleteQuestion(examId, questionId);

  if (!deleted) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
