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
import { getFirestore } from 'firebase-admin/firestore';
import { getApps, initializeApp, type App } from 'firebase-admin/app';

// This function initializes and returns the Firebase Admin App instance.
// It ensures that the app is initialized only once.
function getFirebaseAdminApp(): App {
    if (getApps().length > 0) {
        return getApps()[0];
    }
    // If GOOGLE_APPLICATION_CREDENTIALS is set, Firebase Admin SDK will automatically
    // use it to initialize, so we don't need to pass any credential options.
    return initializeApp();
}

const firestoreDb = getFirestore(getFirebaseAdminApp());


const SubmitFeedbackInputSchema = z.object({
  rating: z.number().min(0).max(5).describe('The user\'s star rating for the app, from 0 to 5.'),
  feedback: z.string().optional().describe('The user\'s written feedback message.'),
  userId: z.string().optional().describe('The ID of the user submitting the feedback.'),
  userEmail: z.string().optional().describe('The email of the user submitting the feedback.'),
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
      const feedbackRef = firestoreDb.collection('feedback');
      await feedbackRef.add({
        ...input,
        createdAt: new Date().toISOString(),
      });
      console.log('Feedback successfully written to Firestore.');
      return { success: true };
    } catch (error) {
      console.error('Error writing feedback to Firestore:', error);
      // In a real app, you'd want more robust error handling here.
      return { success: false };
    }
  }
);
