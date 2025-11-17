// src/App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Bg from "./bg.jsx"
import Home from "./Home";
import Auth from "./Authentication/auth";
import Login from "./Authentication/Login";
import Signup from "./Authentication/SignUp";
import Default from "./Default";

export default function App() {
  const location = useLocation();
  
  // Only show Vanta.js background on Home page
  const showBackground = location.pathname === "/";

  return (
    <div className="app">
      {/* Background - only on home page */}
      {showBackground && <Bg />}

      {/* Foreground Content */}
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/default" element={<Default />} />
        </Routes>
      </div>
    </div>
  );
}