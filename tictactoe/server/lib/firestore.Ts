// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdlw8k9XcNd3F_b2CJ6junWiCQSbiqQq8",
  authDomain: "tictactoe-ef6cf.firebaseapp.com",
  projectId: "tictactoe-ef6cf",
  storageBucket: "tictactoe-ef6cf.appspot.com",
  messagingSenderId: "242389883836",
  appId: "1:242389883836:web:7646e63359525629fde9b9",
  measurementId: "G-X97E2JS4TD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


export const firestoreDb = getFirestore(app)