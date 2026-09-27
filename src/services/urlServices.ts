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
      ? Date.now() + expiresInDays * 86400000
      : null;
      let values: any[];

      if (alias) {
        query = `
        INSERT INTO short_urls (id, long_url, expires_at)
        VALUES ($1, $2, $3)
        `;
        values = [alias, longUrl, expiresAt]
      } else {
        query = `
        INSERT INTO short_urls (long_url, expires_at)
        VALUES ($1, $2)
        `;
        values = [longUrl, expiresAt]
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
}

export default new UrlSerivces();