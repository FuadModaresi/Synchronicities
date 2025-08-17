// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// IMPORTANT: To fix the API key error, replace the placeholder values below
// with the configuration object from your own Firebase project.
// You can get this from the Firebase console:
// 1. Go to your Project Settings (gear icon).
// 2. In the "Your apps" card, select your web app.
// 3. Find the "Firebase SDK snippet" and select "Config".
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replace with your API key
  authDomain: "YOUR_AUTH_DOMAIN", // Replace with your auth domain
  projectId: "YOUR_PROJECT_ID", // Replace with your project ID
  storageBucket: "YOUR_STORAGE_BUCKET", // Replace with your storage bucket
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Replace with your messaging sender ID
  appId: "YOUR_APP_ID" // Replace with your app ID
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
