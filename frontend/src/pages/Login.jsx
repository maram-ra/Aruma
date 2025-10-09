import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./login.css";

export default function Login() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userType = params.get("type"); // "client" or "artisan"

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Logging in as ${userType}`, formData);
  };

  return (
    <div className={`login-page ${userType === "artisan" ? "artisan-bg" : "client-bg"}`}>
      <header className="login-header">
        <span className="home-text">Home</span>
        <img src="/logo.png" alt="Aruma Logo" className="login-logo" />
        <a href="/login" className="login-link">Login</a>
      </header>

      <div className="login-content">
        <div className="login-left">
          <h2 className="login-title">Login</h2>
          <p className="login-subtitle">Please fill in the details.</p>
        </div>

        <div className="login-box">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-actions">
              <button type="button" className="forgot-btn">Forgot Password?</button>
              <button type="submit" className="login-btn">Login</button>
            </div>

            <p className="create-account">
             Don’t have an account?{" "}
             <a href={`/register?type=${userType}`}>Create Account</a>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}
