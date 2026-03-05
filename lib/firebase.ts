import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBWbwOGKOzED8fiS6f6E7v3nLXCdYmoaTE",
    authDomain: "museum-29bdd.firebaseapp.com",
    projectId: "museum-29bdd",
    storageBucket: "museum-29bdd.firebasestorage.app",
    messagingSenderId: "226297214594",
    appId: "1:226297214594:web:f42140f0f30f76eb85a69b",
    measurementId: "G-ZVW7QNHDTV"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = typeof window !== "undefined" ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null;

export { app, auth, db, analytics };

