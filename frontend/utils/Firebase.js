import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "login-e-commerce-b0046.firebaseapp.com",
  projectId: "login-e-commerce-b0046",
  storageBucket: "login-e-commerce-b0046.firebasestorage.app",
  messagingSenderId: "1028869444599",
  appId: "1:1028869444599:web:a7f4676640e7ff956ad4f2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()


export {auth , provider}