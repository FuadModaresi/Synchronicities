import {initializeApp, getApps, getApp, type App, cert} from 'firebase-admin/app';

let firebaseAdminApp: App;

export function getFirebaseAdminApp(): App {
  if (getApps().length > 0) {
    return getApp();
  }

  let serviceAccount;
  try {
    // This is for Vercel environment or environments where the creds are a string
    serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS!);
     return initializeApp({
        credential: cert(serviceAccount),
    });
  } catch (e) {
     throw new Error('Could not initialize Firebase Admin SDK. Ensure GOOGLE_APPLICATION_CREDENTIALS is set correctly.');
  }
}
