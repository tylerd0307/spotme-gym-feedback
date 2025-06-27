import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyArwPNzaSzK6jTq_QqD_JR7l3Dx4j7ODrM",
    authDomain: "spotme-gym-feedback.firebaseapp.com",
    projectId: "spotme-gym-feedback",
    storageBucket: "spotme-gym-feedback.firebasestorage.app",
    messagingSenderId: "470355372677",
    appId: "1:470355372677:web:b63575ab79002c29c657ec",
    measurementId: "G-MN517SHWGP"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);