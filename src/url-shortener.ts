// url-shortener.ts
import { pool } from "./db";

const BASE_URL = "http://sho.rt/";
const SHORT_KEY_LENGTH = 6;

export default class UrlShortener {
  async encode(longUrl: string): Promise<string> {
    const existing = await pool.query(
      `SELECT short_key FROM urls WHERE long_url = $1`,
      [longUrl]
    );
    if (existing.rowCount > 0) {
      return BASE_URL + existing.rows[0].short_key;
    }

    let shortKey: string;
    do {
      shortKey = Math.random()
        .toString(36)
        .substring(2, 2 + SHORT_KEY_LENGTH);
      const { rowCount } = await pool.query(
        `SELECT 1 FROM urls WHERE short_key = $1`,
        [shortKey]
      );
      if (rowCount === 0) break;
    } while (true);

    await pool.query(`INSERT INTO urls (short_key, long_url) VALUES ($1, $2)`, [
      shortKey,
      longUrl,
    ]);

    return BASE_URL + shortKey;
  }

  async decode(shortUrl: string): Promise<string> {
    const shortKey = shortUrl.replace(BASE_URL, "");
    const result = await pool.query(
      `UPDATE urls SET click_count = click_count + 1 WHERE short_key = $1 RETURNING long_url`,
      [shortKey]
    );
    if (result.rowCount === 0) {
      throw new Error("Short URL not found");
    }
    return result.rows[0].long_url;
  }

  async makeCustom(shortUrl: string, customAlias: string): Promise<string> {
    const shortKey = shortUrl.replace(BASE_URL, "");

    // Check custom alias format
    if (!/^[a-zA-Z0-9_-]{1,64}$/.test(customAlias)) {
      throw new Error("Invalid alias");
    }

    const original = await pool.query(
      `SELECT long_url, click_count FROM urls WHERE short_key = $1`,
      [shortKey]
    );
    if (original.rowCount === 0)
      throw new Error("Original short URL not found");

    const conflict = await pool.query(
      `SELECT 1 FROM urls WHERE short_key = $1`,
      [customAlias]
    );
    if (conflict.rowCount > 0) throw new Error("Alias already taken");

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(`DELETE FROM urls WHERE short_key = $1`, [shortKey]);
      await client.query(
        `INSERT INTO urls (short_key, long_url, click_count) VALUES ($1, $2, $3)`,
        [customAlias, original.rows[0].long_url, original.rows[0].click_count]
      );
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }

    return BASE_URL + customAlias;
  }

  async getClickStats(shortUrl: string): Promise<number> {
    const shortKey = shortUrl.replace(BASE_URL, "");
    const result = await pool.query(
      `SELECT click_count FROM urls WHERE short_key = $1`,
      [shortKey]
    );
    if (result.rowCount === 0) throw new Error("Short URL not found");
    return result.rows[0].click_count;
  }
}
