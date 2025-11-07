// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Add this import

const firebaseConfig = {
  apiKey: "AIzaSyCdrQjzXJCmwb-Z-Oxyf0qUaopl1IOw5SE",
  authDomain: "moviebooth-fca1c.firebaseapp.com",
  projectId: "moviebooth-fca1c",
  storageBucket: "moviebooth-fca1c.firebasestorage.app",
  messagingSenderId: "1038866403479",
  appId: "1:1038866403479:web:b8e7a85eca6dc4339359d2",
  measurementId: "G-L3FMSX97XS"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp); // Initialize Auth

export { db, auth }; // Export both db and auth