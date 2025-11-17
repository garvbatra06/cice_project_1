import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

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
    <div className="auth-page-wrapper">
      <div className="back-to-home">
        <a onClick={() => navigate("/")}>← Back to Home</a>
      </div>

      <div className="auth-container">
        <h2>Sign in to MyHustl</h2>
        <p className="auth-subtitle">Welcome back! Enter your credentials to continue</p>
        
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button onClick={handleEmailLogin}>Sign in</button>
        
        <div className="auth-divider">
          <span>or</span>
        </div>
        
        <button onClick={handleGoogleLogin}>
          <span>Continue with Google</span>
        </button>

        <div className="auth-toggle">
          New to MyHustl? <a onClick={() => navigate("/signup")}>Create an account</a>
        </div>
      </div>
    </div>
  );
}