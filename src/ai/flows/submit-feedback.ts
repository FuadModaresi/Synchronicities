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
    if (getApps().length > 0) {
        return getApp();
    }

    // This is the standard way to anuthenticate in a Vercel environment.
    // It relies on the GOOGLE_APPLICATION_CREDENTIALS environment variable
    // being set with the JSON content of the service account key.
    const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!serviceAccount) {
        throw new Error('The GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.');
    }
    
    // Initialize the app with the service account credentials
    return initializeApp({
        credential: cert(JSON.parse(serviceAccount))
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
      console.log('Attempting to initialize Firebase Admin SDK...');
      const adminApp = getFirebaseAdminApp();
      console.log('Firebase Admin SDK initialized successfully.');

      console.log('Attempting to get Firestore instance...');
      const firestoreDb = getFirestore(adminApp);
      console.log('Firestore instance retrieved successfully.');

      const feedbackRef = firestoreDb.collection('feedback');
      console.log(`Attempting to write feedback to Firestore for user: ${input.userEmail}`);
      
      await feedbackRef.add({
        ...input,
        createdAt: new Date().toISOString(),
      });

      console.log(`Feedback successfully written to Firestore.`);
      return { success: true };
    } catch (error) {
      console.error('CRITICAL: Error in submitFeedbackFlow:', error);
      return { success: false };
    }
  }
);
