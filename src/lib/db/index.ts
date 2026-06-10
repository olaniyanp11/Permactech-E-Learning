import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Db = PostgresJsDatabase<typeof schema>;

declare global {
  var __teacherosPg: ReturnType<typeof postgres> | undefined;
  var __teacherosDb: Db | undefined;
}

function createDb(): { client: ReturnType<typeof postgres>; db: Db } {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  const client = postgres(url, { max: 10 });
  const db = drizzle(client, { schema });
  return { client, db };
}

export function getDb(): Db {
  if (!globalThis.__teacherosDb) {
    const { client, db } = createDb();
    globalThis.__teacherosPg = client;
    globalThis.__teacherosDb = db;
  }
  return globalThis.__teacherosDb;
}

export { schema };
