import { execute } from "../db/utils.ts";
import redisClient from "../redis/redisClient.ts";

export interface createShortUrlParams {
  longUrl: string;
  expiresInDays?: number;
  alias?: string;
}

class UrlSerivces {
  createShortUrl = async(params: createShortUrlParams) => {
    try {
      const { longUrl, expiresInDays, alias } = params;
      let query: string;
      const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 86400000)
      : null;
      let values: any[];

      if (alias) {
        query = `
        INSERT INTO short_urls (id, long_url, expires_at, is_custom)
        VALUES ($1, $2, $3, $4)
        RETURNING id
        `;
        values = [alias, longUrl, expiresAt, true]
      } else {
        query = `
        INSERT INTO short_urls (long_url, expires_at, is_custom)
        VALUES ($1, $2, $3)
        RETURNING id
        `;
        values = [longUrl, expiresAt, false]
      }
      const res = await execute(query, values);
      // redisClient.set(res.rows[0].id, longUrl, 86400 * 2);
      return res;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  getLongUrlByShortUrlId = async (shortUrlId: string): Promise<string | null> => {
    try {
      if (redisClient.isReady()) {
        const cachedUrl = await redisClient.get(shortUrlId);
        if (cachedUrl) return cachedUrl;
      }
      
      const query = `
      SELECT long_url from short_urls where id = ($1)
      `
      const values = [shortUrlId];
      const res = await execute(query, values);
      
      if (res.rows.length === 0) return null;
      
      const longUrl = res.rows[0].long_url;
      
      if (redisClient.isReady()) {
        await redisClient.set(shortUrlId, longUrl, 86400 * 2);
      }
      
      return longUrl;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  getClickCountByShortUrlId = async (shortUrlId: string) => {
    try {
      const query = `
      SELECT count(*) from clicks where code_id = ($1)
      `;
      const values = [shortUrlId];
      return execute(query, values);
    } catch (e) {
      console.error(e)
      throw e;
    } 
  }

  recordClick = async (shortUrlId: string) => {
    try {
      const query = `
      INSERT INTO clicks (code_id, clicked_at)
      VALUES ($1, $2);
      `;
      const values = [shortUrlId, new Date()];
      return execute(query, values);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

export default new UrlSerivces();