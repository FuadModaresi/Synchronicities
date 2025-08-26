
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "day-weaver-q3g5q.firebaseapp.com",
  projectId: "day-weaver-q3g5q",
  storageBucket: "day-weaver-q3g5q.firebasestorage.app",
  messagingSenderId: "117331109533",
  appId: "1:117331109533:web:55bf9476d0f1304eaf5674",
  measurementId: "G-RWFEBSWT24"
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

const db = getFirestore(app);

// Correctly initialize Auth for client-side
const getFirebaseAuth = () => getAuth(app);


export { app, db, getFirebaseAuth };
