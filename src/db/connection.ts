import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/** Lazy DB connection - only connects when actually used (not during build) */
function createDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  const client = postgres(connectionString, { max: 10 });
  return drizzle(client, { schema });
}

// Singleton pattern: reuse connection across requests
let _db: ReturnType<typeof createDb> | null = null;
export function getDb() {
  if (!_db) _db = createDb();
  return _db;
}
