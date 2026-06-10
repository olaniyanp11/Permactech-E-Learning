import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAllExams, getSubmittedSubmissions } from "@/lib/db/repository";
import { rankSubmissions } from "@/lib/scoring";
import { formatDate } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const examId = searchParams.get("examId");

  const [submissions, exams] = await Promise.all([
    getSubmittedSubmissions(examId ?? undefined),
    getAllExams(),
  ]);
  const examsById = Object.fromEntries(exams.map((e) => [e.id, e]));

  const byExam = new Map<string, typeof submissions>();
  for (const submission of submissions) {
    const list = byExam.get(submission.examId) ?? [];
    list.push(submission);
    byExam.set(submission.examId, list);
  }

  const ranksBySubmissionId = new Map<string, number>();
  for (const group of byExam.values()) {
    for (const ranked of rankSubmissions(group)) {
      ranksBySubmissionId.set(ranked.id, ranked.rank);
    }
  }

  const sorted = [...submissions].sort((a, b) => {
    const titleA = examsById[a.examId]?.title ?? "";
    const titleB = examsById[b.examId]?.title ?? "";
    const titleCompare = titleA.localeCompare(titleB, undefined, { sensitivity: "base" });
    if (titleCompare !== 0) return titleCompare;
    const rankA = ranksBySubmissionId.get(a.id) ?? 999;
    const rankB = ranksBySubmissionId.get(b.id) ?? 999;
    if (rankA !== rankB) return rankA - rankB;
    return a.studentName.localeCompare(b.studentName, undefined, { sensitivity: "base" });
  });

  const headers = [
    "Exam",
    "Student Name",
    "Student ID",
    "Class",
    "Score",
    "Max Score",
    "Percentage",
    "Rank",
    "Submitted",
  ];
  const rows = sorted.map((s) => [
    examsById[s.examId]?.title ?? "Unknown exam",
    s.studentName,
    s.studentId,
    s.studentClass,
    s.score.toString(),
    s.maxScore.toString(),
    `${Math.round(s.percentage)}%`,
    (ranksBySubmissionId.get(s.id) ?? "").toString(),
    formatDate(s.submittedAt),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="scores-${Date.now()}.csv"`,
    },
  });
}
