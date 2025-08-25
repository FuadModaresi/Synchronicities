/**
 * @fileOverview This file contains shared Zod schemas for Genkit flows.
 * Separating schemas into their own file avoids issues with Next.js server actions,
 * which only allow async functions to be exported from 'use server' files.
 */

import { z } from 'zod';

export const GenerateSynchronicityInsightsInputSchema = z.object({
    number: z.string().describe('The number or sign associated with the synchronicity event.'),
    date: z.string().describe('The date of the synchronicity event.'),
    time: z.string().describe('The time of the synchronicity event.'),
    location: z.string().describe('The location of the synchronicity event.'),
    emotionalState: z.string().describe('The emotional state of the user during the event.'),
    photoDataUri: z.string().optional().describe(
      'A photo related to the event, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
    peoplePresent: z.string().optional().describe('The people present during the event.'),
    additionalDetails: z.string().optional().describe('Any additional details about the event.'),
    myInterpretation: z.string().optional().describe("The user's own interpretation of the event."),
    locale: z.string().optional().describe('The locale for the response language, e.g., "en" or "fa".'),
  });
