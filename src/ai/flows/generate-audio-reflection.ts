'use server';
/**
 * @fileOverview Converts text into speech using a Genkit flow.
 *
 * - generateAudioReflection - A function that handles the text-to-speech conversion.
 * - GenerateAudioReflectionInput - The input type for the function.
 * - GenerateAudioReflectionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';
import { googleAI } from '@genkit-ai/googleai';

const GenerateAudioReflectionInputSchema = z.object({
  text: z.string().describe('The text to be converted to speech.'),
});
export type GenerateAudioReflectionInput = z.infer<typeof GenerateAudioReflectionInputSchema>;

const GenerateAudioReflectionOutputSchema = z.object({
  audioDataUri: z.string().describe('The generated audio as a data URI.'),
});
export type GenerateAudioReflectionOutput = z.infer<typeof GenerateAudioReflectionOutputSchema>;

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

    let bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const generateAudioReflectionFlow = ai.defineFlow(
  {
    name: 'generateAudioReflectionFlow',
    inputSchema: GenerateAudioReflectionInputSchema,
    outputSchema: GenerateAudioReflectionOutputSchema,
  },
  async ({ text }) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: text,
    });
    
    if (!media) {
      throw new Error('No audio media returned from the model.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    const wavBase64 = await toWav(audioBuffer);
    
    return {
      audioDataUri: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);


export async function generateAudioReflection(input: GenerateAudioReflectionInput): Promise<GenerateAudioReflectionOutput> {
  return generateAudioReflectionFlow(input);
}
