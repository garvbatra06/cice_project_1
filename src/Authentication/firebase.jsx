// firebase.jsx
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 👈 added

const firebaseConfig = {
  apiKey: "AIzaSyDGMfZOmwyZuLCezGHk_aS0iZf70HCgTVg",
  authDomain: "hackmate-72e42.firebaseapp.com",
  projectId: "hackmate-72e42",
  storageBucket: "hackmate-72e42.firebasestorage.app",
  messagingSenderId: "845544652345",
  appId: "1:845544652345:web:9b6806f3629ab6f3f4d7e8",
  measurementId: "G-1XHD4VTLFG"
};

// Initialize app ONCE here
const app = initializeApp(firebaseConfig);

// Export initialized services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app); // 👈 added

export default app;
