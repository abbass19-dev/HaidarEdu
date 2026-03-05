import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBWbwOGKOzED8fiS6f6E7v3nLXCdYmoaTE",
  authDomain: "museum-29bdd.firebaseapp.com",
  projectId: "museum-29bdd",
  storageBucket: "museum-29bdd.firebasestorage.app",
  messagingSenderId: "226297214594",
  appId: "1:226297214594:web:f42140f0f30f76eb85a69b",
  measurementId: "G-ZVW7QNHDTV"
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const db = getFirestore(app);
const auth = getAuth(app);

export { db, analytics, auth };
