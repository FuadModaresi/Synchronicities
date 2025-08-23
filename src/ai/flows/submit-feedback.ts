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
import { credential } from 'firebase-admin';


// This function initializes and returns the Firebase Admin App instance.
// It ensures that the app is initialized only once.
function getFirebaseAdminApp(): App | null {
    if (getApps().length > 0) {
        return getApps()[0];
    }
    
    try {
        // When no credentials are provided, the SDK attempts to fall back to the
        // GOOGLE_APPLICATION_CREDENTIALS environment variable.
        console.log("Attempting to initialize Firebase Admin SDK with default credentials...");
        const app = initializeApp();
        console.log("Firebase Admin SDK initialized successfully.");
        return app;

    } catch (error) {
        console.error("CRITICAL: Failed to initialize Firebase Admin SDK.", error);
        return null;
    }
}

let firestoreDb: ReturnType<typeof getFirestore> | null = null;
const adminApp = getFirebaseAdminApp();
if (adminApp) {
    firestoreDb = getFirestore(adminApp);
}

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
    if (!firestoreDb) {
        console.error("Firestore DB is not available. Cannot submit feedback.");
        return { success: false };
    }
    try {
      console.log('Attempting to write feedback to Firestore:', input);
      const feedbackRef = firestoreDb.collection('feedback');
      const docRef = await feedbackRef.add({
        ...input,
        createdAt: new Date().toISOString(),
      });
      console.log(`Feedback successfully written to Firestore with document ID: ${docRef.id}.`);
      return { success: true };
    } catch (error) {
      console.error('Error writing feedback to Firestore:', error);
      return { success: false };
    }
  }
);
