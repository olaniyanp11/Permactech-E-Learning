import { NextRequest, NextResponse } from "next/server";
import {
  countQuestionsByExamId,
  findActiveExamByPassword,
} from "@/lib/db/repository";
import { getExamAvailability } from "@/lib/exam-availability";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const exam = await findActiveExamByPassword(password);

    if (!exam) {
      return NextResponse.json({ error: "Invalid or inactive examination password" }, { status: 401 });
    }

    const availability = getExamAvailability(exam);
    if (!availability.ok) {
      return NextResponse.json({ error: availability.message }, { status: 403 });
    }

    const questionCount = await countQuestionsByExamId(exam.id);

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
