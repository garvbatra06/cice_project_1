import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="home-wrapper">
      {/* GitHub-Style Navigation Bar */}
      <nav className="navbar">
        <div className="logo">HackMate</div>
        
        <button 
          className="menu-toggle" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li><a href="#features">Features</a></li>
          <li><a href="#stats">Stats</a></li>
          <li><a href="#about">About</a></li>
          <li>
            <button className="nav-btn" onClick={() => navigate("/auth")}>
              Sign in
            </button>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero">
          <h1 className="title">
            Let's build from here, <br />
            <span className="gradient-text">together</span>
          </h1>
          <p className="subtitle">
            The complete platform for building hackathon teams. Connect with developers,
            showcase your projects, and create something amazing.
          </p>

          <div className="actions">
            <button className="btn" onClick={() => navigate("/auth")}>
              Sign up for HackMate →
            </button>
            <button className="btn btn-outline" onClick={() => navigate("/default")}>
              Explore projects
            </button>
          </div>

          {/* Features Cards */}
          <div className="features" id="features">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Smart Matching</h3>
              <p>
                Our intelligent algorithm connects you with developers who complement
                your skills and share your passion for innovation.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>
                Set up your profile in minutes and start collaborating. No complex
                onboarding, just pure productivity.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🛠️</div>
              <h3>Powerful Tools</h3>
              <p>
                Filter by technology, experience level, and availability. Find exactly
                who you need, when you need them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" id="stats">
        <div className="stat">
          <div className="stat-number">1,000+</div>
          <div className="stat-label">Developers</div>
        </div>
        <div className="stat">
          <div className="stat-number">500+</div>
          <div className="stat-label">Projects</div>
        </div>
        <div className="stat">
          <div className="stat-number">200+</div>
          <div className="stat-label">Teams formed</div>
        </div>
        <div className="stat">
          <div className="stat-number">50+</div>
          <div className="stat-label">Hackathons won</div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" id="about">
        <h2>Ready to start building?</h2>
        <p>Join thousands of developers creating the future</p>
        <button className="btn" onClick={() => navigate("/auth")}>
          Get started for free →
        </button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Product</h3>
            <a href="#features">Features</a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Coming soon!"); }}>
              Security
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Coming soon!"); }}>
              Enterprise
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Coming soon!"); }}>
              Changelog
            </a>
          </div>

          <div className="footer-section">
            <h3>Platform</h3>
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Coming soon!"); }}>
              Developer API
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Coming soon!"); }}>
              Partners
            </a>
            <a href="#stats">Statistics</a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Coming soon!"); }}>
              Status
            </a>
          </div>

          <div className="footer-section">
            <h3>Support</h3>
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Coming soon!"); }}>
              Docs
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Coming soon!"); }}>
              Community Forum
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Coming soon!"); }}>
              Professional Services
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Coming soon!"); }}>
              Contact
            </a>
          </div>

          <div className="footer-section">
            <h3>Company</h3>
            <a href="#about">About</a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Coming soon!"); }}>
              Blog
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Coming soon!"); }}>
              Careers
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Coming soon!"); }}>
              Press
            </a>
            <div className="social-links">
              <div className="social-icon" onClick={() => alert("Twitter coming soon!")}>
                𝕏
              </div>
              <div className="social-icon" onClick={() => alert("GitHub coming soon!")}>
                ⚡
              </div>
              <div className="social-icon" onClick={() => alert("LinkedIn coming soon!")}>
                in
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 HackMate, Inc. Terms · Privacy · Sitemap</p>
        </div>
      </footer>
    </div>
  );
}