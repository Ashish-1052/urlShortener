import { execute } from "../db/utils.ts";

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
        `;
        values = [alias, longUrl, expiresAt, true]
      } else {
        query = `
        INSERT INTO short_urls (long_url, expires_at, is_custom)
        VALUES ($1, $2, $3)
        `;
        values = [longUrl, expiresAt, false]
      }
      return execute(query, values)
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  getLongUrlByShortUrlId = async (shortUrlId: string) => {
    try {
      const query = `
      SELECT long_url from short_urls where id = ($1)
      `
      const values = [shortUrlId];
      return execute(query, values);
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