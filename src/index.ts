import { pool } from './db/utils.ts'
import { app } from './app.ts'

app.listen(3000, () => {
  console.log('Server running on PORT 3000')
})

process.on("SIGTERM", async () => {
  await pool.end();
  process.exit(0);
})