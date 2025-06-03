import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import newsRoutes from './api/news.js';
import { scheduleNewsJob } from './jobs/newsJob.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/news', newsRoutes);

// Health check
app.get('/', (_, res) => res.send('News Flow Backend API running.'));

// Schedule news fetching job
scheduleNewsJob();

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});