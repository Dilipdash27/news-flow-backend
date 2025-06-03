import { Router } from 'express';
import { getNews } from '../utils/newsService.js';

const router = Router();

// GET /api/news?region=IN&category=technology&lang=en
router.get('/', async (req, res) => {
  const { region = 'US', category = 'top', lang = 'en' } = req.query;
  try {
    const news = await getNews({ region, category, lang });
    res.json(news);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch news.' });
  }
});

export default router;