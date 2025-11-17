import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("✅ Signed up:", userCredential.user);
      alert("🎉 Account created successfully!");
      navigate("/default");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("✅ Google Signup/Login:", result.user);
      alert("🎉 Account created successfully!");
      navigate("/default");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="back-to-home">
        <a onClick={() => navigate("/")}>← Back to Home</a>
      </div>

      <div className="auth-container">
        <h2>Create your account</h2>
        <p className="auth-subtitle">Join thousands of developers building the future</p>
        
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password (minimum 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button onClick={handleEmailSignup}>Create account</button>
        
        <div className="auth-divider">
          <span>or</span>
        </div>
        
        <button onClick={handleGoogleSignup}>
          <span>Continue with Google</span>
        </button>

        <div className="auth-toggle">
          Already have an account? <a onClick={() => navigate("/login")}>Sign in</a>
        </div>
      </div>
    </div>
  );
}