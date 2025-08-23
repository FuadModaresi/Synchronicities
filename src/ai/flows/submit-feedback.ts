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
import {initializeApp, getApps, cert, getApp} from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';


const SubmitFeedbackInputSchema = z.object({
  rating: z.number().min(0).max(5).describe('The user\'s star rating for the app, from 0 to 5.'),
  feedback: z.string().optional().describe('The user\'s written feedback message.'),
  userId: z.string().optional().describe('The UID of the authenticated user.'),
  userEmail: z.string().optional().describe('The email of the authenticated user.'),
});

export type SubmitFeedbackInput = z.infer<typeof SubmitFeedbackInputSchema>;

// Helper function to initialize Firebase Admin SDK in a serverless environment
function getFirebaseAdminApp() {
    if (getApps().length) {
        return getApp();
    }

    let serviceAccount;
    // Vercel and other environments store the service account JSON as a string
    // in an environment variable.
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        try {
            serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
        } catch (e) {
            console.error("Failed to parse GOOGLE_APPLICATION_CREDENTIALS. Ensure it's a valid JSON string.", e);
            throw new Error("Invalid service account credentials format.");
        }
    } else {
        // This is a critical configuration error.
        throw new Error("GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.");
    }
    
    // Initialize the app with the service account credentials
    return initializeApp({
        credential: cert(serviceAccount)
    });
}


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
      console.log('Initializing Firebase Admin and attempting to write feedback to Firestore.');
      const adminApp = getFirebaseAdminApp();
      const firestoreDb = getFirestore(adminApp);
      const feedbackRef = firestoreDb.collection('feedback');
      
      await feedbackRef.add({
        ...input,
        createdAt: new Date().toISOString(),
      });

      console.log(`Feedback successfully written to Firestore for user: ${input.userEmail}`);
      return { success: true };
    } catch (error) {
      // Log the detailed error for debugging in the Vercel logs.
      console.error('CRITICAL: Error writing feedback to Firestore:', error);
      return { success: false };
    }
  }
);
