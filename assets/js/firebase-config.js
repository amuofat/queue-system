// Uses standard Firebase CDN modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, runTransaction, onValue, set, push, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// TODO: Replace with your actual Firebase config keys
const firebaseConfig = {
  apiKey: "AIzaSyBGvXPEtG6VbTihVPAvgglnJEsIQTACOzk",
  authDomain: "khenchela-queue.firebaseapp.com",
  projectId: "khenchela-queue",
  storageBucket: "khenchela-queue.firebasestorage.app",
  messagingSenderId: "451510465069",
  appId: "1:451510465069:web:ed57c9b2e690a5dd0e3ea4",
  measurementId: "G-CPNC1C21HL"
};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, runTransaction, onValue, set, push, get };
