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
        console.log("Firebase Admin SDK already initialized.");
        return getApps()[0];
    }
    
    const credentialsPath = path.join(process.cwd(), 'day-weaver-q3g5q-firebase-adminsdk-fbsvc-52abe06b29.json');
    console.log(`Attempting to load credentials from: ${credentialsPath}`);

    try {
        if (!fs.existsSync(credentialsPath)) {
            throw new Error(`Credentials file not found at: ${credentialsPath}`);
        }
        const serviceAccount = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
        
        console.log("Service account credentials loaded successfully. Initializing Firebase Admin SDK...");
        const app = initializeApp({
            credential: cert(serviceAccount),
        });
        console.log("Firebase Admin SDK initialized successfully.");
        return app;

    } catch (error) {
        console.error("CRITICAL: Failed to initialize Firebase Admin SDK.", error);
        throw new Error("Could not initialize Firebase Admin SDK due to a credentials error.");
    }
}

let firestoreDb: ReturnType<typeof getFirestore> | null = null;
try {
    firestoreDb = getFirestore(getFirebaseAdminApp());
} catch (e) {
    // Error is already logged in getFirebaseAdminApp
}


const SubmitFeedbackInputSchema = z.object({
  rating: z.number().min(0).max(5).describe('The user\'s star rating for the app, from 0 to 5.'),
  feedback: z.string().optional().describe('The user\'s written feedback message.'),
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
