import { NextRequest, NextResponse } from "next/server";
import { findStudentDuplicate } from "@/lib/db/repository";

export async function POST(request: NextRequest) {
  try {
    const { examId, studentId } = await request.json();

    const studentDuplicate = await findStudentDuplicate(examId, studentId);

    return NextResponse.json({
      duplicate: Boolean(studentDuplicate),
      message: studentDuplicate
        ? "A submission already exists for this Student ID. Only one attempt is allowed."
        : null,
    });
  } catch {
    return NextResponse.json({ error: "Check failed" }, { status: 500 });
  }
}
