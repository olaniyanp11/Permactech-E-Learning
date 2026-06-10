import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAllSubmissions } from "@/lib/db/repository";
import { rankSubmissions } from "@/lib/scoring";

export async function GET(request: NextRequest) {
  const session = await getSession();
  const { searchParams } = new URL(request.url);
  const examId = searchParams.get("examId");

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const submissions = await getAllSubmissions(examId ?? undefined);
  const ranked = rankSubmissions(submissions);
  const ranks = Object.fromEntries(ranked.map((s) => [s.id, s.rank]));

  return NextResponse.json({ submissions, ranks, ranked });
}
