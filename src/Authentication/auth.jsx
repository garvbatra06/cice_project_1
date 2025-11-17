import { useNavigate } from "react-router-dom";
import "./auth.css";

export default function Auth() {
  const navigate = useNavigate();

  return (
    <div className="auth-page-wrapper">
      <div className="back-to-home">
        <a onClick={() => navigate("/")}>← Back to Home</a>
      </div>

      <div className="auth-container">
        <div className="auth-logo">⚡ HackMate</div>
        <h2>Welcome to HackMate</h2>
        <p className="auth-subtitle">Choose how you'd like to get started</p>
        
        <div className="auth-buttons">
          <button className="auth-button primary" onClick={() => navigate("/signup")}>
            Create an account
          </button>
          <button className="auth-button secondary" onClick={() => navigate("/login")}>
            Sign in
          </button>
        </div>

        <div className="auth-footer-text">
          By continuing, you agree to HackMate's Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
}