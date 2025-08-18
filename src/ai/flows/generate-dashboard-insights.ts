// This file holds the Genkit flow for generating a high-level analysis of all synchronicity events.
'use server';

/**
 * @fileOverview Generates a "bigger picture" analysis of a user's synchronicity event history.
 *
 * - generateDashboardInsights - A function that generates a holistic analysis of events.
 * - GenerateDashboardInsightsInput - The input type for the function.
 * - GenerateDashboardInsightsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { SynchronicityEvent } from '@/lib/types';

// We define the event schema without the 'id' for the AI's purpose.
const EventSchema = z.object({
  number: z.number(),
  date: z.string(),
  time: z.string(),
  location: z.string(),
  emotionalState: z.string(),
  peoplePresent: z.string().optional(),
  additionalDetails: z.string().optional(),
  insight: z.string().optional(),
});

const GenerateDashboardInsightsInputSchema = z.object({
  events: z.array(EventSchema).describe("The user's history of synchronicity events."),
  locale: z.string().optional().describe('The locale for the response language, e.g., "en" or "fa".'),
});

export type GenerateDashboardInsightsInput = z.infer<typeof GenerateDashboardInsightsInputSchema>;

const GenerateDashboardInsightsOutputSchema = z.object({
  analysis: z.string().describe('A high-level analysis of patterns, themes, and the bigger picture from the events.'),
});

export type GenerateDashboardInsightsOutput = z.infer<typeof GenerateDashboardInsightsOutputSchema>;

export async function generateDashboardInsights(input: GenerateDashboardInsightsInput): Promise<GenerateDashboardInsightsOutput> {
  // Map the full event objects to what the schema expects, omitting the 'id' and 'photoDataUri'.
  const eventsForAI = input.events.map(e => ({
      number: e.number,
      date: e.date,
      time: e.time,
      location: e.location,
      emotionalState: e.emotionalState,
      peoplePresent: e.peoplePresent,
      additionalDetails: e.additionalDetails,
      insight: e.insight,
  }));
  return generateDashboardInsightsFlow({ events: eventsForAI, locale: input.locale });
}

const prompt = ai.definePrompt({
  name: 'generateDashboardInsightsPrompt',
  input: {schema: GenerateDashboardInsightsInputSchema},
  output: {schema: GenerateDashboardInsightsOutputSchema},
  prompt: `You are a wise, empathetic guide specializing in interpreting life's patterns and synchronicities. A user has provided their journal of synchronicity events. Your task is to analyze this entire history and provide a "bigger picture" insight. Respond in the language of the provided locale: {{{locale}}}.

Look for the following:
- **Recurring Numbers/Signs:** Are there numbers or symbols that appear frequently? What might they signify collectively?
- **Emotional Themes:** What is the overarching emotional state across these events (e.g., hope, anxiety, curiosity)? How do the events correlate with these feelings?
- **Contextual Patterns:** Do events cluster around certain locations, times, or the presence of specific people?
- **Overarching Message:** Based on the entire history, what is the core message or theme the universe might be communicating to this person? What should they focus on or be mindful of?

Provide a concise, holistic, and encouraging analysis. Avoid simply listing the events. Instead, synthesize the information into a cohesive narrative.

Here is the user's event history:
{{#each events}}
- Number/Sign: {{this.number}}, Date: {{this.date}} at {{this.time}}, Location: {{this.location}}, Emotion: {{this.emotionalState}}{{#if this.peoplePresent}}, People: {{this.peoplePresent}}{{/if}}{{#if this.additionalDetails}}, Details: {{this.additionalDetails}}{{/if}}{{#if this.insight}}, AI Insight: {{this.insight}}{{/if}}
{{/each}}

Respond in {{{locale}}}.`,
});

const generateDashboardInsightsFlow = ai.defineFlow(
  {
    name: 'generateDashboardInsightsFlow',
    inputSchema: GenerateDashboardInsightsInputSchema,
    outputSchema: GenerateDashboardInsightsOutputSchema,
  },
  async input => {
    if (input.events.length === 0) {
      return { analysis: "There are no events to analyze yet. Start by recording a synchronicity to see your bigger picture." };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
