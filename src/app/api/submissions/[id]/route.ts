import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getExamById,
  getQuestionsByExamId,
  getSubmissionById,
} from "@/lib/db/repository";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const submission = await getSubmissionById(id);

  if (!submission) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [exam, questions] = await Promise.all([
    getExamById(submission.examId),
    getQuestionsByExamId(submission.examId),
  ]);

  return NextResponse.json({ submission, exam, questions });
}
