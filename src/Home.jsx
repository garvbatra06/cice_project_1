import { useNavigate } from "react-router-dom";
import "./Home.css"; // link your CSS file

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      <div className="hero">
        <h1 className="title">Welcome to HackMate</h1>
        <p className="subtitle">Find your perfect teammates for hackathons!</p>

        <div className="actions">
          <button
            className="btn"
            onClick={() => navigate("/auth")}
          >
            Get Started
          </button>
          <button
            className="btn btn-outline"
            onClick={() => alert("Learn more page coming soon!")}
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
