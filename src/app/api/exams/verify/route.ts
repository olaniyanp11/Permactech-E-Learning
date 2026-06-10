import { NextRequest, NextResponse } from "next/server";
import { readDb } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const db = readDb();

    const exam = db.exams.find(
      (e) => e.password === password && e.isActive
    );

    if (!exam) {
      return NextResponse.json({ error: "Invalid or inactive examination password" }, { status: 401 });
    }

    const questionCount = db.questions.filter((q) => q.examId === exam.id).length;

    return NextResponse.json({
      exam: {
        id: exam.id,
        title: exam.title,
        instructions: exam.instructions,
        durationMinutes: exam.durationMinutes,
        questionCount,
      },
    });
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
