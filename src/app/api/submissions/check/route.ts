import { NextRequest, NextResponse } from "next/server";
import { readDb } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { examId, studentId, fingerprint } = await request.json();
    const db = readDb();

    const studentDuplicate = db.submissions.find(
      (s) =>
        s.examId === examId &&
        s.studentId.toLowerCase() === studentId.toLowerCase() &&
        s.status === "submitted"
    );

    const deviceDuplicate = db.submissions.find(
      (s) =>
        s.examId === examId &&
        s.deviceInfo.fingerprint === fingerprint &&
        s.status === "submitted"
    );

    return NextResponse.json({
      studentDuplicate: Boolean(studentDuplicate),
      deviceDuplicate: Boolean(deviceDuplicate),
      duplicate: Boolean(studentDuplicate || deviceDuplicate),
      message: studentDuplicate
        ? "A submission already exists for this Student ID."
        : deviceDuplicate
          ? "A submission already exists from this device."
          : null,
    });
  } catch {
    return NextResponse.json({ error: "Check failed" }, { status: 500 });
  }
}
