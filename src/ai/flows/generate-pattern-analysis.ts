
// This file holds the Genkit flow for generating an analysis of patterns between a new event and past events.
'use server';

/**
 * @fileOverview Generates an analysis of how a new synchronicity event connects to past events.
 *
 * - generatePatternAnalysis - A function that generates the pattern analysis.
 * - GeneratePatternAnalysisInput - The input type for the function.
 * - GeneratePatternAnalysisOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { GenerateSynchronicityInsightsInputSchema } from '@/ai/schemas';

// Schema for past events, slightly simplified for the AI's purpose.
const PastEventSchema = z.object({
  number: z.string(),
  date: z.string(),
  emotionalState: z.string(),
  myInterpretation: z.string().optional(),
  insight: z.string().optional(),
});

const GeneratePatternAnalysisInputSchema = z.object({
  newEvent: GenerateSynchronicityInsightsInputSchema.describe("The new event that was just submitted."),
  pastEvents: z.array(PastEventSchema).describe("The user's history of past synchronicity events."),
  locale: z.string().optional().describe('The locale for the response language, e.g., "en" or "fa".'),
});

export type GeneratePatternAnalysisInput = z.infer<typeof GeneratePatternAnalysisInputSchema>;

const GeneratePatternAnalysisOutputSchema = z.object({
  patternAnalysis: z.string().describe('An analysis of connections, recurring themes, and patterns between the new event and past events.'),
});

export type GeneratePatternAnalysisOutput = z.infer<typeof GeneratePatternAnalysisOutputSchema>;

export async function generatePatternAnalysis(input: GeneratePatternAnalysisInput): Promise<GeneratePatternAnalysisOutput> {
  return generatePatternAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePatternAnalysisPrompt',
  input: { schema: GeneratePatternAnalysisInputSchema },
  output: { schema: GeneratePatternAnalysisOutputSchema },
  prompt: `You are a pattern recognition expert specializing in life events and synchronicity. A user has just recorded a new event, and you have access to their past events. Your task is to analyze how this new event connects with the previous ones. Respond in the language of the provided locale: {{{locale}}}.

Focus on identifying meaningful connections:
- **Recurring Signs/Numbers:** Is the sign/number from the new event something that has appeared before? If so, in what context?
- **Emotional Sequences:** Does the emotional state of the new event follow a pattern from past events (e.g., a feeling of anxiety followed by a sign of reassurance)?
- **Thematic Links:** Do the user's interpretations or the AI insights for past events share themes with the new event?
- **Escalation or Evolution:** Is this new event a more intense or evolved version of a previous pattern? For example, seeing the number 111, then 1111.

Provide a concise analysis that highlights the most significant pattern. Your tone should be insightful and encouraging, helping the user see the bigger story unfolding.

**New Event:**
- Number/Sign: {{{newEvent.number}}}
- Date: {{{newEvent.date}}}
- Emotion: {{{newEvent.emotionalState}}}
{{#if newEvent.myInterpretation}}- User's Interpretation: {{{newEvent.myInterpretation}}}{{/if}}

**Past Event History:**
{{#each pastEvents}}
- Sign: {{this.number}}, Date: {{this.date}}, Emotion: {{this.emotionalState}}{{#if this.myInterpretation}}, User Interpretation: {{this.myInterpretation}}{{/if}}{{#if this.insight}}, AI Insight: {{this.insight}}{{/if}}
{{/each}}

Based on this, what is the most important pattern or connection this new event highlights? Respond in {{{locale}}}.`,
});


const generatePatternAnalysisFlow = ai.defineFlow(
  {
    name: 'generatePatternAnalysisFlow',
    inputSchema: GeneratePatternAnalysisInputSchema,
    outputSchema: GeneratePatternAnalysisOutputSchema,
  },
  async (input) => {
    // If there are no past events, there's nothing to compare.
    if (input.pastEvents.length === 0) {
      return { patternAnalysis: "This is your first event, so we're just getting started. As you add more, we'll begin to find patterns here." };
    }
    const { output } = await prompt(input);
    return output!;
  }
);
