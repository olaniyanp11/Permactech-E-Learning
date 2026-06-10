import { config } from "dotenv";
import fs from "fs";
import path from "path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { admins, exams, questions, submissions } from "../src/lib/db/schema";
import type { Database } from "../src/types";

config({ path: ".env.local" });

async function seed() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  const seedPath = path.join(process.cwd(), "data", "db.json");
  const raw = fs.readFileSync(seedPath, "utf-8");
  const data = JSON.parse(raw) as Database;

  const client = postgres(url, { max: 1 });
  const db = drizzle(client);

  console.log("Seeding database...");

  await db.delete(submissions);
  await db.delete(questions);
  await db.delete(exams);
  await db.delete(admins);

  if (data.admins.length > 0) {
    await db.insert(admins).values(data.admins);
  }

  if (data.exams.length > 0) {
    await db.insert(exams).values(data.exams);
  }

  if (data.questions.length > 0) {
    await db.insert(questions).values(data.questions);
  }

  if (data.submissions.length > 0) {
    await db.insert(submissions).values(data.submissions);
  }

  console.log(
    `Seeded ${data.admins.length} admins, ${data.exams.length} exams, ${data.questions.length} questions, ${data.submissions.length} submissions`
  );

  await client.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
