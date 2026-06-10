import fs from "fs";
import path from "path";
import type { Database } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

function ensureDb(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    const seed = fs.readFileSync(
      path.join(process.cwd(), "data", "db.json"),
      "utf-8"
    );
    fs.writeFileSync(DB_PATH, seed);
  }
}

export function readDb(): Database {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw) as Database;
}

export function writeDb(data: Database): void {
  ensureDb();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function getDbPath(): string {
  return DB_PATH;
}
