import cron from 'node-cron';
import { fetchAndCacheNews } from '../utils/fetchAndCache.js';

export function scheduleNewsJob() {
  // Fetch every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    console.log('[CRON] Fetching news...');
    await fetchAndCacheNews();
  }, { scheduled: true, timezone: "UTC" });
}