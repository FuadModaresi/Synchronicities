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
import { getApps, initializeApp, type App, cert } from 'firebase-admin/app';
import path from 'path';
import fs from 'fs';

// This function initializes and returns the Firebase Admin App instance.
// It ensures that the app is initialized only once.
function getFirebaseAdminApp(): App {
    if (getApps().length > 0) {
        return getApps()[0];
    }
    
    // Construct the path to the credentials file.
    // path.join combines path segments into one path.
    // process.cwd() gives the current working directory where the node process was started.
    const credentialsPath = path.join(process.cwd(), 'day-weaver-q3g5q-firebase-adminsdk-fbsvc-52abe06b29.json');

    try {
        const serviceAccount = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
        
        return initializeApp({
            credential: cert(serviceAccount),
        });
    } catch (error) {
        console.error("Failed to load or parse service account credentials.", error);
        // If we can't initialize, we throw an error to prevent the app from running in a broken state.
        throw new Error("Could not initialize Firebase Admin SDK.");
    }
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
