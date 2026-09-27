import { CONFIG } from "./config.ts";
import pg from "pg";

export const pool = new pg.Pool(CONFIG)

export const execute = async (query: string, values?: any[]): Promise<pg.QueryResult> => {
  return pool.query(query, values);
};
