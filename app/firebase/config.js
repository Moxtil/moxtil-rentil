// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-jOGQOtfDOIiRkc6Rha2XfZZNMIx3KlQ",
  authDomain: "rentil-5dac1.firebaseapp.com",
  projectId: "rentil-5dac1",
  storageBucket: "rentil-5dac1.firebasestorage.app",
  messagingSenderId: "804310602221",
  appId: "1:804310602221:web:29008e90d1d24913be17e4",
  measurementId: "G-YL963QSLLK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const db = getFirestore(app);
