// This file holds the Genkit flow for generating insightful interpretations of synchronicity events.
'use server';

/**
 * @fileOverview Generates insightful interpretations of synchronicity events based on the numbers and associated details.
 *
 * - generateSynchronicityInsights - A function that generates synchronicity insights.
 * - GenerateSynchronicityInsightsInput - The input type for the generateSynchronicityInsights function.
 * - GenerateSynchronicityInsightsOutput - The return type for the generateSynchronicityInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getNewsForEvent } from '@/services/news';

const GenerateSynchronicityInsightsInputSchema = z.object({
  number: z.number().describe('The number or sign associated with the synchronicity event.'),
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

export type GenerateSynchronicityInsightsInput = z.infer<typeof GenerateSynchronicityInsightsInputSchema>;

const GenerateSynchronicityInsightsOutputSchema = z.object({
  insight: z.string().describe('An insightful interpretation of the synchronicity event.'),
});

export type GenerateSynchronicityInsightsOutput = z.infer<typeof GenerateSynchronicityInsightsOutputSchema>;

export async function generateSynchronicityInsights(input: GenerateSynchronicityInsightsInput): Promise<GenerateSynchronicityInsightsOutput> {
  return generateSynchronicityInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSynchronicityInsightsPrompt',
  input: {schema: GenerateSynchronicityInsightsInputSchema},
  output: {schema: GenerateSynchronicityInsightsOutputSchema},
  tools: [getNewsForEvent],
  prompt: `You are a guide specialized in interpreting synchronicity events. Respond in the language of the provided locale: {{{locale}}}. 
  
First, use the getNewsForEvent tool to find out about any significant news or events that happened on the given date in the specified location. This context is crucial.

Then, consider the following details of a recorded synchronicity event and provide an insightful interpretation. Your interpretation should weave together the user's personal experience with the broader context of what was happening in the world or their region at that time.

Number/Sign: {{{number}}}
Date: {{{date}}}
Time: {{{time}}}
Location: {{{location}}}
Emotional State: {{{emotionalState}}}
{{#if photoDataUri}}
Photo: {{media url=photoDataUri}}
{{/if}}
{{#if peoplePresent}}
People Present: {{{peoplePresent}}}
{{/if}}
{{#if additionalDetails}}
Additional Details: {{{additionalDetails}}}
{{/if}}
{{#if myInterpretation}}
User's Interpretation: {{{myInterpretation}}}
{{/if}}

Based on all these details, including any relevant news events you found, what deeper meaning or message could be associated with this synchronicity? Keep the interpretation concise and insightful. Respond in {{{locale}}}.`,
});

const generateSynchronicityInsightsFlow = ai.defineFlow(
  {
    name: 'generateSynchronicityInsightsFlow',
    inputSchema: GenerateSynchronicityInsightsInputSchema,
    outputSchema: GenerateSynchronicityInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
