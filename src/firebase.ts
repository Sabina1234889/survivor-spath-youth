// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDnLSalAg9SLb9mZx0b_0S9bE_dFZHJhAI",
  authDomain: "survivor-spath-yoth-2ce06.firebaseapp.com",
  projectId: "survivor-spath-yoth-2ce06",
  storageBucket: "survivor-spath-yoth-2ce06.firebasestorage.app",
  messagingSenderId: "884715955582",
  appId: "1:884715955582:web:f9c6e94aca77d3493e7f2f",
  measurementId: "G-58S6GM9CTQ"
};

// Initialize Firebase safely
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Analytics Initialization with safe environment check
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch((err) => {
      console.warn("Firebase Analytics not initialized:", err);
    });
}

// Firestore Database Initialize and Export
export const db = getFirestore(app);

// Authentication Initialize and Export
export const auth = getAuth(app);
