// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCW8TgcLS_-wT9_p8GeQNoQDgENdOr8di4",
  authDomain: "ufuq-digital.firebaseapp.com",
  projectId: "ufuq-digital",
  storageBucket: "ufuq-digital.firebasestorage.app",
  messagingSenderId: "329193921560",
  appId: "1:329193921560:web:2961f6255528c9013b776d",
  measurementId: "G-18SDWFSSWJ"
};

// Initialize Firebase (check if app already exists to prevent duplicate)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };