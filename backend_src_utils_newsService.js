// News fetching/caching logic (simplified)
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const DB_PATH = './src/db.sqlite';

export async function getNews({ region, category, lang }) {
  const db = await open({ filename: DB_PATH, driver: sqlite3.Database });
  const rows = await db.all(
    `SELECT * FROM news WHERE region=? AND category=? AND lang=? ORDER BY publishedAt DESC LIMIT 50`,
    [region, category, lang]
  );
  await db.close();
  return rows;
}