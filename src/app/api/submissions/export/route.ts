import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getSubmittedSubmissions } from "@/lib/db/repository";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const examId = searchParams.get("examId");

  const submissions = await getSubmittedSubmissions(examId ?? undefined);

  const sorted = [...submissions].sort((a, b) =>
    a.studentName.localeCompare(b.studentName, undefined, { sensitivity: "base" })
  );

  const headers = ["Student Name", "Student ID", "Score"];
  const rows = sorted.map((s) => [s.studentName, s.studentId, `${s.score}/${s.maxScore}`]);

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
