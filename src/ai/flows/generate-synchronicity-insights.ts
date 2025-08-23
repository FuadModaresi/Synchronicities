
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
  prompt: `You are a multi-disciplinary expert in symbolism, psychology, and mythology. Your goal is to provide a deep, non-superficial analysis of a synchronicity event. Respond in the language of the provided locale: {{{locale}}}.
  
First, use the getNewsForEvent tool to understand the wider context of the day in that location.

Then, synthesize all the provided information to offer a profound interpretation. Your analysis should:
- **Go Beyond the Obvious:** Avoid generic "angel number" meanings. Instead, connect the sign/number to deeper symbolic, numerological, or mythological concepts.
- **Integrate Psychology:** Consider the user's emotional state from a psychological perspective (e.g., Jungian archetypes, cognitive biases, emotional states influencing perception).
- **Weave a Narrative:** Connect the external event (the sign, the news) with the user's internal state (emotions, personal interpretation). How might the external world be mirroring an internal process?
- **Be Specific:** Ground your analysis in the details provided. Refer directly to the location, the people present, and other context. Avoid clichés.

Here is the event:
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

Based on a deep synthesis of these elements and the contextual news, what is the core message or insight this user can reflect on? Provide a thoughtful, layered interpretation. Respond only with the final insight, do not add any preamble. Respond in {{{locale}}}.`,
});

const generateSynchronicityInsightsFlow = ai.defineFlow(
  {
    name: 'generateSynchronicityInsightsFlow',
    inputSchema: GenerateSynchronicityInsightsInputSchema,
    outputSchema: GenerateSynchronicityInsightsOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        throw new Error('AI did not produce an output.');
      }
      return output;
    } catch (error) {
      console.error('Error in generateSynchronicityInsightsFlow:', error);
      // Return a user-friendly error message that still fits the schema
      return { insight: 'An error occurred while generating the insight. The AI model may be temporarily unavailable or the request may have been filtered. Please try again later.' };
    }
  }
);
