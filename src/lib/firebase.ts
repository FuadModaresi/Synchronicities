// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
