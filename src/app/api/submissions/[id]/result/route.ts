import { NextRequest, NextResponse } from "next/server";
import { getExamById, getSubmissionById } from "@/lib/db/repository";
import { formatDate, formatPercent } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId");

  if (!studentId) {
    return NextResponse.json({ error: "Student ID required" }, { status: 400 });
  }

  const submission = await getSubmissionById(id);

  if (!submission) {
    return NextResponse.json({ error: "Result not found" }, { status: 404 });
  }

  if (submission.studentId.toLowerCase() !== studentId.toLowerCase()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const exam = await getExamById(submission.examId);

  if (!exam) {
    return NextResponse.json({ error: "Exam not found" }, { status: 404 });
  }

  const summaryRows = [
    ["TeacherOS Assessment Result"],
    [],
    ["Student Name", submission.studentName],
    ["Student ID", submission.studentId],
    ["Class", submission.studentClass],
    ["Examination", exam.title],
    ["Score", submission.score.toString()],
    ["Max Score", submission.maxScore.toString()],
    ["Percentage", formatPercent(submission.percentage)],
    ["Submitted", formatDate(submission.submittedAt)],
  ];

  const csv = summaryRows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const safeName = submission.studentName.replace(/[^a-zA-Z0-9-_]/g, "_");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="result-${safeName}-${exam.title.replace(/[^a-zA-Z0-9-_]/g, "_")}.csv"`,
    },
  });
}
