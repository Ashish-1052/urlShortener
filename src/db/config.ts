import "dotenv/config";

export const CONFIG = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: Number(process.env.DB_PORT),
  ssl: process.env.DB_SSL === "true",
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
};