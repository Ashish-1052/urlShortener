import { pool } from './db/utils.ts'

process.on("SIGTERM", async () => {
  await pool.end();
  process.exit(0);
})