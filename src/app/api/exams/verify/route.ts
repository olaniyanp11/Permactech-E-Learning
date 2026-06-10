import { NextRequest, NextResponse } from "next/server";
import {
  countQuestionsByExamId,
  findActiveExamByPassword,
} from "@/lib/db/repository";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const exam = await findActiveExamByPassword(password);

    if (!exam) {
      return NextResponse.json({ error: "Invalid or inactive examination password" }, { status: 401 });
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
