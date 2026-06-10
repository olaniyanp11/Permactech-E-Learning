import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { rankSubmissions } from "@/lib/scoring";

export async function GET(request: NextRequest) {
  const session = await getSession();
  const { searchParams } = new URL(request.url);
  const examId = searchParams.get("examId");

  const db = readDb();
  let submissions = db.submissions;

  if (examId) {
    submissions = submissions.filter((s) => s.examId === examId);
  }

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ranked = rankSubmissions(submissions);
  const ranks = Object.fromEntries(ranked.map((s) => [s.id, s.rank]));

  return NextResponse.json({ submissions, ranks, ranked });
}
