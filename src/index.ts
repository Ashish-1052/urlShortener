import { pool } from './db/utils.ts'
import { app } from './app.ts'
import redisClient from './redis/redisClient.ts';

app.listen(3000, () => {
  console.log('Server running on PORT 3000')
})

process.on("SIGTERM", async () => {
  await pool.end();
  process.exit(0);
});

const connectToRedis = () => {
  try {
    if (redisClient.isReady()) {
      console.info("Redis Connnected");
    } else {
      console.warn("Redis is not available");
    }
  } catch (e) {
    console.warn("Redis Connection failed")
  }
}

connectToRedis();