import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readDb, writeDb } from "@/lib/db";
import { generateId } from "@/lib/utils";
import type { Exam } from "@/types";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = readDb();
  return NextResponse.json(db.exams);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const db = readDb();
    const now = new Date().toISOString();

    const exam: Exam = {
      id: generateId(),
      title: body.title,
      instructions: body.instructions ?? "",
      password: body.password,
      durationMinutes: Number(body.durationMinutes) || 60,
      isActive: body.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };

    db.exams.push(exam);
    writeDb(db);

    return NextResponse.json(exam, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create exam" }, { status: 500 });
  }
}
