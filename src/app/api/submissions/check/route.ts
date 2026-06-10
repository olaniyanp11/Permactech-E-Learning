import { NextRequest, NextResponse } from "next/server";
import {
  findDeviceDuplicate,
  findStudentDuplicate,
} from "@/lib/db/repository";

export async function POST(request: NextRequest) {
  try {
    const { examId, studentId, fingerprint } = await request.json();

    const studentDuplicate = await findStudentDuplicate(examId, studentId);
    const deviceDuplicate = await findDeviceDuplicate(examId, fingerprint);

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
