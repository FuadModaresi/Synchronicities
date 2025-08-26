
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7owJU_Xr8KcZVKEbAeErGfR4WwRd9HqE",
  authDomain: "day-weaver-q3g5q.firebaseapp.com",
  projectId: "day-weaver-q3g5q",
  storageBucket: "day-weaver-q3g5q.firebasestorage.app",
  messagingSenderId: "117331109533",
  appId: "1:117331109533:web:55bf9476d0f1304eaf5674",
  measurementId: "G-RWFEBSWT24"
};

// Initialize Firebase for client-side, ensuring it's only done once.
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Function to get the auth instance, which is now initialized once.
const getFirebaseAuth = () => auth;

export { app, db, getFirebaseAuth };
