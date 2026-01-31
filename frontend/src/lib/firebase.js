import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBVVIJIUvZ07kK0E8OnjCJDXlIY_TR9_kA",
  authDomain: "health-tracker-3ac50.firebaseapp.com",
  projectId: "health-tracker-3ac50",
  storageBucket: "health-tracker-3ac50.firebasestorage.app",
  messagingSenderId: "491428519209",
  appId: "1:491428519209:web:4cd0cd2c6751f08ccc2b38"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
