/**
 * @fileOverview A service for fetching news articles based on date and location.
 *
 * This file provides a Genkit tool that allows the AI to search for news
 * events. This gives the AI context about what was happening in the world
 * or a specific region at the time of a user's synchronicity event.
 *
 * - searchNews: A function to fetch news (currently mocked).
 * - getNewsForEvent: The Genkit tool definition that the AI will use.
 */
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

/**
 * Searches for news articles based on a given date and query.
 * In a real application, this would call a News API.
 * For this prototype, it returns mock data.
 * @param date - The date for the news search (e.g., "2024-05-20").
 * @param query - The search term (e.g., "San Francisco").
 * @returns A promise that resolves to a string containing news headlines.
 */
async function searchNews(date: string, query: string): Promise<string> {
  // In a real-world scenario, you would integrate a News API here.
  // For demonstration, we'll return some mock data based on the query.
  console.log(`Searching news for: ${query} on ${date}`);
  
  const mockNews: { [key: string]: string[] } = {
    'default': [
      "Global markets see unexpected surge.",
      "New study on climate change impact released.",
      "Major tech conference announces breakthrough in AI.",
    ],
    'new york': [
      "Massive power outage affects downtown Manhattan.",
      "Broadway celebrates record-breaking ticket sales.",
      "UN General Assembly discusses new global peace initiative.",
    ],
    'london': [
      "Historic heatwave sweeps across the UK.",
      "TfL announces major update to the Tube network.",
      "New art exhibition opens at the Tate Modern.",
    ],
  };

  const key = query.toLowerCase();
  const headlines = mockNews[key] || mockNews['default'];
  
  return `Top news for ${query} on ${date}: ${headlines.join(' ')}`;
}


export const getNewsForEvent = ai.defineTool(
  {
    name: 'getNewsForEvent',
    description: 'Get news headlines for a specific date and location to provide context for a synchronicity event.',
    inputSchema: z.object({
      date: z.string().describe('The date of the event, in YYYY-MM-DD format.'),
      location: z.string().describe('The city or region to search for news, e.g., "San Francisco".'),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    return await searchNews(input.date, input.location);
  }
);
