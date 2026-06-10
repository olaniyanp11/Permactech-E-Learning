import {
  boolean,
  integer,
  jsonb,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import type { Answer, DeviceInfo } from "@/types";

export const admins = pgTable("admins", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
});

export const exams = pgTable("exams", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  instructions: text("instructions").notNull().default(""),
  password: text("password").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull(),
});

export const questions = pgTable("questions", {
  id: text("id").primaryKey(),
  examId: text("exam_id")
    .notNull()
    .references(() => exams.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  text: text("text").notNull(),
  options: jsonb("options").$type<string[]>(),
  correctAnswer: text("correct_answer").notNull(),
  points: integer("points").notNull(),
  order: integer("order").notNull(),
});

export const submissions = pgTable(
  "submissions",
  {
    id: text("id").primaryKey(),
    examId: text("exam_id")
      .notNull()
      .references(() => exams.id, { onDelete: "cascade" }),
    studentName: text("student_name").notNull(),
    studentId: text("student_id").notNull(),
    studentClass: text("student_class").notNull(),
    answers: jsonb("answers").$type<Answer[]>().notNull(),
    score: integer("score").notNull(),
    maxScore: integer("max_score").notNull(),
    percentage: real("percentage").notNull(),
    deviceInfo: jsonb("device_info").$type<DeviceInfo>().notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true, mode: "string" }).notNull(),
    startedAt: timestamp("started_at", { withTimezone: true, mode: "string" }).notNull(),
    status: text("status").notNull(),
  },
  (table) => [
    uniqueIndex("submissions_exam_student_idx").on(table.examId, table.studentId),
  ]
);
