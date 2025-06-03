import axios from 'axios';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';
dotenv.config();

const DB_PATH = './src/db.sqlite';

// Define your categories and regions (simplified sample)
const CATEGORIES = ['top', 'world', 'business', 'technology', 'entertainment', 'sports', 'health', 'science'];
const REGIONS = ['US', 'IN', 'GB', 'AU', 'CA']; // Expand as needed

const NEWS_API_URL = 'https://newsdata.io/api/1/news';
const API_KEY = process.env.NEWS_API_KEY;

async function ensureTable() {
  const db = await open({ filename: DB_PATH, driver: sqlite3.Database });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      summary TEXT,
      url TEXT,
      source_name TEXT,
      source_url TEXT,
      publishedAt TEXT,
      region TEXT,
      category TEXT,
      lang TEXT,
      UNIQUE(url, region, category, lang)
    )
  `);
  await db.close();
}

export async function fetchAndCacheNews() {
  await ensureTable();
  const db = await open({ filename: DB_PATH, driver: sqlite3.Database });

  for (const region of REGIONS) {
    for (const category of CATEGORIES) {
      try {
        // Map categories to API parameters if needed
        const params = {
          apikey: API_KEY,
          country: region.toLowerCase(),
          category: category === 'top' ? '' : category,
          language: 'en',
          page: 1,
        };

        const { data } = await axios.get(NEWS_API_URL, { params });

        if (data?.results) {
          for (const n of data.results) {
            try {
              await db.run(
                `INSERT OR IGNORE INTO news
                  (title, summary, url, source_name, source_url, publishedAt, region, category, lang)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  n.title || '',
                  n.description || '',
                  n.link,
                  n.source_id || n.source || '',
                  n.link, // use link as source_url if not provided
                  n.pubDate || new Date().toISOString(),
                  region,
                  category,
                  'en'
                ]
              );
            } catch (err) {
              // Ignore duplicate or bad inserts
            }
          }
        }
      } catch (err) {
        console.error(`[${region}/${category}] News fetch error:`, err?.response?.data || err.message);
      }
    }
  }
  await db.close();
  console.log('[News] Fetched and cached news for all categories/regions.');
}