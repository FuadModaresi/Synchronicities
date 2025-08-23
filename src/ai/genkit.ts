import {genkit, Flow} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {firebase} from '@genkit-ai/firebase';
import {getFirebaseAdminApp} from '@/lib/firebase-admin';
import {getFirestore} from 'firebase-admin/firestore';

export const ai = genkit({
  plugins: [
    googleAI(),
    firebase({
      firestore: {
        client: (flow: Flow<any, any, any>) => {
          return getFirestore(getFirebaseAdminApp());
        },
      },
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
