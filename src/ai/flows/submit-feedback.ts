// This file holds the Genkit flow for submitting user feedback to Firestore.
'use server';

/**
 * @fileOverview Saves user feedback and ratings to a Firestore collection.
 *
 * - submitFeedback - A function that saves feedback data.
 * - SubmitFeedbackInput - The input type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getFirebaseAdminApp} from '@/lib/firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';


const SubmitFeedbackInputSchema = z.object({
  rating: z.number().min(0).max(5).describe('The user\'s star rating for the app, from 0 to 5.'),
  feedback: z.string().optional().describe('The user\'s written feedback message.'),
  userId: z.string().optional().describe('The UID of the authenticated user.'),
  userEmail: z.string().optional().describe('The email of the authenticated user.'),
});

export type SubmitFeedbackInput = z.infer<typeof SubmitFeedbackInputSchema>;

export async function submitFeedback(input: SubmitFeedbackInput): Promise<{success: boolean}> {
  return submitFeedbackFlow(input);
}

const submitFeedbackFlow = ai.defineFlow(
  {
    name: 'submitFeedbackFlow',
    inputSchema: SubmitFeedbackInputSchema,
    outputSchema: z.object({success: z.boolean()}),
  },
  async (input) => {
    try {
      console.log('Attempting to write feedback to Firestore.');
      const app = getFirebaseAdminApp();
      const firestoreDb = getFirestore(app);
      const feedbackRef = firestoreDb.collection('feedback');
      
      await feedbackRef.add({
        ...input,
        createdAt: new Date().toISOString(),
      });

      console.log(`Feedback successfully written to Firestore.`);
      return { success: true };
    } catch (error) {
      console.error('CRITICAL: Error writing feedback to Firestore:', error);
      return { success: false };
    }
  }
);
