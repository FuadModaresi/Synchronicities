// This file holds the Genkit flow for generating audio from text.
'use server';

/**
 * @fileOverview Converts text analysis into speech using a TTS model.
 *
 * - generateAudioAnalysis - A function that generates audio from text.
 * - GenerateAudioAnalysisOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

export type GenerateAudioAnalysisOutput = z.infer<typeof GenerateAudioAnalysisOutputSchema>;

const GenerateAudioAnalysisOutputSchema = z.object({
  media: z.string().describe("The base64-encoded WAV audio data URI."),
});


/**
 * Converts PCM audio data to WAV format.
 * @param pcmData The raw PCM audio buffer.
 * @returns A promise that resolves to a base64-encoded WAV string.
 */
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

export async function generateAudioAnalysis(text: string): Promise<GenerateAudioAnalysisOutput> {
  return generateAudioAnalysisFlow(text);
}

const generateAudioAnalysisFlow = ai.defineFlow(
  {
    name: 'generateAudioAnalysisFlow',
    inputSchema: z.string(),
    outputSchema: GenerateAudioAnalysisOutputSchema,
  },
  async (text) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' }, // A calm, suitable voice
          },
        },
      },
      prompt: text,
    });

    if (!media || !media.url) {
      throw new Error('No audio media was returned from the AI model.');
    }

    // The data URI is base64 encoded PCM audio, we need to convert it to WAV
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavBase64 = await toWav(audioBuffer);
    
    return {
      media: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);
