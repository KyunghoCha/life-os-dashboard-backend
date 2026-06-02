import { DatabaseSync } from "node:sqlite";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { env } from "../config/env.js";

const dbFile = resolve(env.dbPath);
mkdirSync(dirname(dbFile), { recursive: true });

export const db = new DatabaseSync(dbFile);
db.exec(readFileSync(new URL("./schema.sql", import.meta.url), "utf8"));

export function transaction(work) {
  db.exec("BEGIN");
  try {
    const result = work();
    db.exec("COMMIT");
    return result;
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}

export function closeDatabase() {
  db.close();
}
