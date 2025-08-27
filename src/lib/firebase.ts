
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
<<<<<<< HEAD
  authDomain: "day-weaver-q3g5q.firebaseapp.com",
  projectId: "day-weaver-q3g5q",
  storageBucket: "day-weaver-q3g5q.firebasestorage.app",
  messagingSenderId: "117331109533",
  appId: "1:117331109533:web:55bf9476d0f1304eaf5674",
  measurementId: "G-RWFEBSWT24"
=======
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
>>>>>>> e37a078375c3ecf0751ca4d26a4350091b58d90c
};

// Helper function to initialize Firebase
function initializeFirebaseApp() {
  if (getApps().length) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}

const app: FirebaseApp = initializeFirebaseApp();
const db = getFirestore(app);
const auth = getAuth(app);

// Function to get the auth instance, which is now initialized once.
const getFirebaseAuth = () => auth;

export { app, db, getFirebaseAuth };
