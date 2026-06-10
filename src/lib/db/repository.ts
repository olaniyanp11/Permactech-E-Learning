import { and, asc, desc, eq, sql } from "drizzle-orm";
import { normalizeTimestamp } from "@/lib/utils";
import { getDb } from "./index";
import { admins, exams, questions, submissions } from "./schema";
import type {
  Admin,
  Answer,
  DeviceInfo,
  Exam,
  Question,
  Submission,
} from "@/types";

function mapExam(row: typeof exams.$inferSelect): Exam {
  return {
    id: row.id,
    title: row.title,
    instructions: row.instructions,
    password: row.password,
    durationMinutes: row.durationMinutes,
    isActive: row.isActive,
    startsAt: normalizeTimestamp(row.startsAt),
    endsAt: normalizeTimestamp(row.endsAt),
    allowedStudentIds: row.allowedStudentIds ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function mapQuestion(row: typeof questions.$inferSelect): Question {
  return {
    id: row.id,
    examId: row.examId,
    type: row.type as Question["type"],
    text: row.text,
    options: row.options ?? undefined,
    correctAnswer: row.correctAnswer,
    points: row.points,
    order: row.order,
  };
}

function mapSubmission(row: typeof submissions.$inferSelect): Submission {
  return {
    id: row.id,
    examId: row.examId,
    studentName: row.studentName,
    studentId: row.studentId,
    studentClass: row.studentClass,
    answers: row.answers,
    score: row.score,
    maxScore: row.maxScore,
    percentage: row.percentage,
    deviceInfo: row.deviceInfo,
    submittedAt: row.submittedAt,
    startedAt: row.startedAt,
    status: row.status as Submission["status"],
  };
}

export async function findAdminByEmail(email: string): Promise<Admin | null> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(admins)
    .where(sql`lower(${admins.email}) = lower(${email})`)
    .limit(1);
  return row ?? null;
}

export async function getAllExams(): Promise<Exam[]> {
  const db = getDb();
  const rows = await db.select().from(exams).orderBy(desc(exams.createdAt));
  return rows.map(mapExam);
}

export async function createExam(exam: Exam): Promise<Exam> {
  const db = getDb();
  await db.insert(exams).values(exam);
  return exam;
}

export async function getExamById(id: string): Promise<Exam | null> {
  const db = getDb();
  const [row] = await db.select().from(exams).where(eq(exams.id, id)).limit(1);
  return row ? mapExam(row) : null;
}

export async function updateExam(id: string, data: Partial<Exam>): Promise<Exam | null> {
  const db = getDb();
  const updates: Partial<Exam> & { updatedAt: string } = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  if ("startsAt" in data) {
    updates.startsAt = normalizeTimestamp(data.startsAt);
  }
  if ("endsAt" in data) {
    updates.endsAt = normalizeTimestamp(data.endsAt);
  }
  const [row] = await db
    .update(exams)
    .set(updates)
    .where(eq(exams.id, id))
    .returning();
  return row ? mapExam(row) : null;
}

export async function deleteExam(id: string): Promise<boolean> {
  const db = getDb();
  const result = await db.delete(exams).where(eq(exams.id, id)).returning({ id: exams.id });
  return result.length > 0;
}

export async function findActiveExamByPassword(password: string): Promise<Exam | null> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(exams)
    .where(and(eq(exams.password, password), eq(exams.isActive, true)))
    .limit(1);
  return row ? mapExam(row) : null;
}

export async function getQuestionsByExamId(examId: string): Promise<Question[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(questions)
    .where(eq(questions.examId, examId))
    .orderBy(asc(questions.order));
  return rows.map(mapQuestion);
}

export async function createQuestion(question: Question): Promise<Question> {
  const db = getDb();
  await db.insert(questions).values(question);
  return question;
}

export async function updateQuestion(
  examId: string,
  questionId: string,
  data: Partial<Question>
): Promise<Question | null> {
  const db = getDb();
  const [row] = await db
    .update(questions)
    .set(data)
    .where(and(eq(questions.id, questionId), eq(questions.examId, examId)))
    .returning();
  return row ? mapQuestion(row) : null;
}

export async function deleteQuestion(examId: string, questionId: string): Promise<boolean> {
  const db = getDb();
  const result = await db
    .delete(questions)
    .where(and(eq(questions.id, questionId), eq(questions.examId, examId)))
    .returning({ id: questions.id });
  return result.length > 0;
}

export async function countQuestionsByExamId(examId: string): Promise<number> {
  const db = getDb();
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(questions)
    .where(eq(questions.examId, examId));
  return row?.count ?? 0;
}

export async function getAllSubmissions(examId?: string): Promise<Submission[]> {
  const db = getDb();
  const rows = examId
    ? await db.select().from(submissions).where(eq(submissions.examId, examId))
    : await db.select().from(submissions);
  return rows.map(mapSubmission);
}

export async function getSubmissionById(id: string): Promise<Submission | null> {
  const db = getDb();
  const [row] = await db.select().from(submissions).where(eq(submissions.id, id)).limit(1);
  return row ? mapSubmission(row) : null;
}

export async function findStudentDuplicate(
  examId: string,
  studentId: string
): Promise<Submission | null> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(submissions)
    .where(
      and(
        eq(submissions.examId, examId),
        eq(submissions.status, "submitted"),
        sql`lower(${submissions.studentId}) = lower(${studentId})`
      )
    )
    .limit(1);
  return row ? mapSubmission(row) : null;
}

export async function createSubmission(submission: Submission): Promise<Submission> {
  const db = getDb();
  await db.insert(submissions).values(submission);
  return submission;
}

export async function getSubmittedSubmissions(examId?: string): Promise<Submission[]> {
  const db = getDb();
  const conditions = examId
    ? and(eq(submissions.status, "submitted"), eq(submissions.examId, examId))
    : eq(submissions.status, "submitted");

  const rows = await db.select().from(submissions).where(conditions);
  return rows.map(mapSubmission);
}

export async function getDashboardData() {
  const [allExams, allSubmissions] = await Promise.all([
    getAllExams(),
    getAllSubmissions(),
  ]);

  return { exams: allExams, submissions: allSubmissions };
}

export type { Answer, DeviceInfo };
