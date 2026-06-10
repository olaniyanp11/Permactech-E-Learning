import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { admins, exams, questions, submissions } from "../src/lib/db/schema";
import { buildAdmin, seedExams, seedQuestions } from "./seed-data";

config({ path: ".env.local" });

async function seed() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is required. Copy .env.local.example to .env.local");
    process.exit(1);
  }

  const client = postgres(url, { max: 1 });
  const db = drizzle(client);

  console.log("Clearing existing data...");
  await db.delete(submissions);
  await db.delete(questions);
  await db.delete(exams);
  await db.delete(admins);

  const admin = await buildAdmin();

  console.log("Inserting admin...");
  await db.insert(admins).values(admin);

  console.log(`Inserting ${seedExams.length} exam(s)...`);
  await db.insert(exams).values(seedExams);

  console.log(`Inserting ${seedQuestions.length} question(s)...`);
  await db.insert(questions).values(seedQuestions);

  console.log("\nSeed complete.");
  console.log("─────────────────────────────────────────");
  console.log(`  Admin:  ${admin.email} / admin123`);
  console.log("");

  for (const exam of seedExams) {
    const examQuestions = seedQuestions.filter((q) => q.examId === exam.id);
    const maxScore = examQuestions.reduce((sum, q) => sum + q.points, 0);
    console.log(`  Exam:      ${exam.title}`);
    console.log(`  Password:  ${exam.password}`);
    console.log(`  Questions: ${examQuestions.length} (${maxScore} pts) · ${exam.durationMinutes} min`);
    console.log("");
  }

  console.log("─────────────────────────────────────────");

  await client.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
