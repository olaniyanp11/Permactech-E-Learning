import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { formatDate, formatPercent } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const examId = searchParams.get("examId");

  const db = readDb();
  let submissions = db.submissions.filter((s) => s.status === "submitted");

  if (examId) {
    submissions = submissions.filter((s) => s.examId === examId);
  }

  const exams = Object.fromEntries(db.exams.map((e) => [e.id, e.title]));

  const headers = [
    "Student Name",
    "Student ID",
    "Class",
    "Exam",
    "Score",
    "Max Score",
    "Percentage",
    "Submitted At",
    "Browser",
    "Platform",
    "Screen",
    "IP Address",
    "Fingerprint",
  ];

  const rows = submissions.map((s) => [
    s.studentName,
    s.studentId,
    s.studentClass,
    exams[s.examId] ?? s.examId,
    s.score.toString(),
    s.maxScore.toString(),
    formatPercent(s.percentage),
    formatDate(s.submittedAt),
    s.deviceInfo.browser,
    s.deviceInfo.platform,
    s.deviceInfo.screenResolution,
    s.deviceInfo.ipAddress ?? "N/A",
    s.deviceInfo.fingerprint,
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="teacheros-results-${Date.now()}.csv"`,
    },
  });
}
