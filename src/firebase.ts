// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // ফায়ারস্টোর ডাটাবেজ ইমপোর্ট করা হলো
import { getAuth } from "firebase/auth"; // অথেনটিকেশন ইমপোর্ট করা হলো

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOw0_ONlGnVGyWDn_ACMTHY8ol8MGpEdA",
  authDomain: "survivor-spath-yoth.firebaseapp.com",
  projectId: "survivor-spath-yoth",
  storageBucket: "survivor-spath-yoth.firebasestorage.app",
  messagingSenderId: "601804608613",
  appId: "1:601804608613:web:3b259bc7aa5527072fe28c",
  measurementId: "G-QFHMCGDS2X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Initialize Cloud Firestore and Auth, then export them for global use
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;

