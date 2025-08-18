import { config } from 'dotenv';
config();

import '@/services/news.ts';
import '@/ai/flows/generate-synchronicity-insights.ts';
import '@/ai/flows/generate-dashboard-insights.ts';
