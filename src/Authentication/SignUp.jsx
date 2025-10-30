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
      navigate("/default"); // redirect after signup
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
    <div className="auth-container">
      <h2>Sign Up</h2>
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
      <button onClick={handleEmailSignup}>Sign Up with Email</button>
      <button onClick={handleGoogleSignup}>Continue with Google</button>
    </div>
  );
}
