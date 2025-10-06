import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase"; 
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Email login
  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Logged in with Email");
      navigate("/default"); // go to Default page
    } catch (err) {
      alert(err.message);
    }
  };

  // Google login
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("✅ Logged in with Google");
      navigate("/default"); // go to Default page
    } catch (err) {
      alert(err.message);
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
