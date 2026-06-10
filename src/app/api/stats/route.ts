import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";
import { rankSubmissions } from "@/lib/scoring";
import type { DashboardStats } from "@/types";

function getScoreDistribution(submissions: { percentage: number; status: string }[]) {
  const ranges = [
    { range: "0-49%", min: 0, max: 49 },
    { range: "50-69%", min: 50, max: 69 },
    { range: "70-89%", min: 70, max: 89 },
    { range: "90-100%", min: 90, max: 100 },
  ];

  const submitted = submissions.filter((s) => s.status === "submitted");

  return ranges.map(({ range, min, max }) => ({
    range,
    count: submitted.filter((s) => s.percentage >= min && s.percentage <= max).length,
  }));
}

export async function GET() {
  const db = readDb();
  const submitted = db.submissions.filter((s) => s.status === "submitted");
  const uniqueStudents = new Set(submitted.map((s) => s.studentId));

  const stats: DashboardStats = {
    totalStudents: uniqueStudents.size,
    totalSubmissions: submitted.length,
    activeTests: db.exams.filter((e) => e.isActive).length,
    averageScore:
      submitted.length > 0
        ? submitted.reduce((sum, s) => sum + s.percentage, 0) / submitted.length
        : 0,
    duplicateAttemptsBlocked: 0,
  };

  const ranked = rankSubmissions(db.submissions);
  const ranks = Object.fromEntries(ranked.map((s) => [s.id, s.rank]));

  return NextResponse.json({
    stats,
    scoreDistribution: getScoreDistribution(db.submissions),
    recentSubmissions: submitted.slice(-10).reverse(),
    ranks,
    exams: db.exams,
  });
}
