import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAyhQap-q8J7PV3NkD0mT3iuMBEXr-hgiA",
  authDomain: "lab4-bookstore-ff46c.firebaseapp.com",
  projectId: "lab4-bookstore-ff46c",
  storageBucket: "lab4-bookstore-ff46c.firebasestorage.app",
  messagingSenderId: "211092248725",
  appId: "1:211092248725:web:348cec40d8526c9c57239c"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);