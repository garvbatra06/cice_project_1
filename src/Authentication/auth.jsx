import { useNavigate } from "react-router-dom";
import "./auth.css";

export default function Auth() {
  const navigate = useNavigate();

  return (
    <div className="auth">
      <button className="auth-button" onClick={() => navigate("/signup")}>Sign Up</button>
      <button className="auth-button" onClick={() => navigate("/login")}>Login</button>
    </div>
  );
}
