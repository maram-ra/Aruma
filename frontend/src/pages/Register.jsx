import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../index.css";

export default function Register() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userType = params.get("type"); // "client" or "artisan"

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    category: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Registering as ${userType}`, formData);
  };

  return (
    <div className="register-page">
      <header className="login-header">
        <a href="/UserType" className="Home-link">Home</a>
        <img src="/logo.png" alt="Aruma Logo" className="login-logo" />
        <a href={`/login?type=${userType}`} className="login-link">Login</a>
      </header>

      <div className="login-content">
        <div className="login-left">
          <h2 className="login-title">Create an Account</h2>
          <p className="login-subtitle">Please fill in the details.</p>
        </div>

        <div className="login-box">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

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
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            
            </div>

            {/* Show extra field only for artisan */}
            {userType === "artisan" && (
              <div className="form-group">
                <label>Craft Type</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  <option value="pottery">Pottery</option>
                  <option value="jewelry">Jewelry</option>
                  <option value="textiles">Textiles</option>
                  <option value="woodwork">Woodwork</option>
                </select>
              </div>
            )}

            <button type="submit" className="login-btn">Register</button>

            <p className="create-account">
              Already have an account?{" "}
              <a href={`/login?type=${userType}`}>Login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
