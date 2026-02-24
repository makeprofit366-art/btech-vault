// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBi4Udgz97OJo1sei1pAmCJ9oiBT4BSGMw",
  authDomain: "btech-vault.firebaseapp.com",
  projectId: "btech-vault",
  storageBucket: "btech-vault.firebasestorage.app",
  messagingSenderId: "8508597620",
  appId: "1:8508597620:web:f36418f8c702e8a21c3821",
  measurementId: "G-X0TY8S1TPB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
