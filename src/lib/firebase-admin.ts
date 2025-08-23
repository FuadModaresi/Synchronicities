import {initializeApp, getApps, getApp, type App} from 'firebase-admin/app';
import {credential} from 'firebase-admin';

let firebaseAdminApp: App;

export function getFirebaseAdminApp(): App {
  if (firebaseAdminApp) {
    return firebaseAdminApp;
  }

  if (getApps().length > 0) {
    firebaseAdminApp = getApp();
    return firebaseAdminApp;
  }

  let serviceAccount;
  try {
    // This is for Vercel environment
    serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS!);
  } catch (e) {
    console.error(
      'Failed to parse GOOGLE_APPLICATION_CREDENTIALS, trying file path...'
    );
    // This is for local development
    serviceAccount = require('../../day-weaver-q3g5q-firebase-adminsdk-fbsvc-52abe06b29.json');
  }

  firebaseAdminApp = initializeApp({
    credential: credential.cert(serviceAccount),
  });

  return firebaseAdminApp;
}
