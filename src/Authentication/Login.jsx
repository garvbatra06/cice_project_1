import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Email login
  const handleEmailLogin = async () => {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length === 0) {
        alert("⚠️ No account found for this email. Please sign up first.");
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Logged in with Email");
      navigate("/default");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  // Google login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("✅ Logged in with Google");
      navigate("/default");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleEmailLogin}>Login with Email</button>
      <button onClick={handleGoogleLogin}>Continue with Google</button>
    </div>
  );
}
