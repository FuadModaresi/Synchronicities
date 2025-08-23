
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
  number: z.string(),
  date: z.string(),
  time: z.string(),
  location: z.string(),
  emotionalState: z.string(),
  peoplePresent: z.string().optional(),
  additionalDetails: z.string().optional(),
  insight: z.string().optional(),
  myInterpretation: z.string().optional(),
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
      number: String(e.number), // Ensure number is always a string
      date: e.date,
      time: e.time,
      location: e.location,
      emotionalState: e.emotionalState,
      peoplePresent: e.peoplePresent,
      additionalDetails: e.additionalDetails,
      insight: e.insight,
      myInterpretation: e.myInterpretation,
  }));
  return generateDashboardInsightsFlow({ events: eventsForAI, locale: input.locale });
}

const prompt = ai.definePrompt({
  name: 'generateDashboardInsightsPrompt',
  input: {schema: GenerateDashboardInsightsInputSchema},
  output: {schema: GenerateDashboardInsightsOutputSchema},
  prompt: `You are a holistic life strategist and pattern analyst. Your expertise lies in synthesizing disparate life events into a coherent, insightful narrative that reveals deeper truths and actionable wisdom. A user has provided their journal of synchronicity events. Your task is to perform a deep analysis of this history and provide a "bigger picture" insight. Respond in the language of the provided locale: {{{locale}}}.

Instead of merely summarizing, your goal is to uncover the underlying story. Look for:
- **Core Thematic Arcs:** What is the central story being told through these events? Is it a story of transformation, of facing a fear, of opening up to new possibilities?
- **Interconnectedness:** How do the recurring signs, emotional states, locations, and the user's own interpretations weave together? Don't just list them; explain their interplay.
- **Emotional Harmonics:** What is the underlying emotional frequency of this journey? Go beyond single emotions and identify the emotional progression or recurring state. How does this emotional state influence the user's perception of these events?
- **Potential Blind Spots or Growth Areas:** Based on the patterns, what might the user be overlooking? Where is there an opportunity for growth, a change in perspective, or a call to action?
- **Synthesized Message:** What is the essential, synthesized message for the user right now? Distill the entire history into a core insight that is both profound and practical. Avoid clichés and generic advice.

Provide a concise, deep, and empowering analysis. Your tone should be wise, insightful, and direct, like a trusted mentor.

Here is the user's event history:
{{#each events}}
- Number/Sign: {{this.number}}, Date: {{this.date}} at {{this.time}}, Location: {{this.location}}, Emotion: {{this.emotionalState}}{{#if this.peoplePresent}}, People: {{this.peoplePresent}}{{/if}}{{#if this.additionalDetails}}, Details: {{this.additionalDetails}}{{/if}}{{#if this.myInterpretation}}, User's Interpretation: {{this.myInterpretation}}{{/if}}{{#if this.insight}}, AI Insight: {{this.insight}}{{/if}}
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
