// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Bg from "./bg.jsx"
import Home from "./Home";
import Auth from "./Authentication/auth"; // your auth page
import Login from "./Authentication/Login";
import Signup from "./Authentication/SignUp";
import Default from "./Default";

export default function App() {
  return (
    <div className="app">
      {/* Background */}
      <Bg />

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
