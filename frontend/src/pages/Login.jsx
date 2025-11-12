import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { alertSuccess, alertError } from "../components/ArumaAlert";

// API base
const API =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const userType = new URLSearchParams(location.search).get("type");
  const [slide, setSlide] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userType) {
      alertError("Please select user type first.");
      navigate("/UserType");
      return;
    }

    try {
      const response = await fetch(`${API}/auth/${userType}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("userRole", data.user_type);
        localStorage.setItem("userId", data.user_id);
        localStorage.setItem("userName", data.name || "User");

        alertSuccess("Login successful!");
        setTimeout(() => {
          navigate(
            data.user_type === "client" ? "/marketplace" : "/artisan/Profile"
          );
        }, 1000);
      } else {
        alertError(data.detail || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alertError("Network error. Please try again later.");
    }
  };

  const handleSlide = () => {
    setSlide(true);
    setTimeout(() => navigate(`/register?type=${userType || ""}`), 800);
  };

  return (
    <div
      className={`auth-container d-flex flex-column flex-lg-row position-relative overflow-hidden ${
        slide ? "slide-right" : ""
      }`}
    >
      {/* ===== LEFT / OVERLAY ===== */}
      <div className="overlay d-flex flex-column justify-content-center align-items-center p-4 p-md-5">
        <h1 className="fw-bold mb-3" style={{ fontSize: "clamp(1.8rem, 3.8vw, 2.2rem)" }}>
          First time here?
        </h1>
        <p className="mb-4 text-center" style={{ maxWidth: 320, lineHeight: 1.6 }}>
          Discover a space where craft and community come alive
        </p>

        <button
          onClick={handleSlide}
          className="fw-bold"
          style={{
            backgroundColor: "#ede9e0",
            color: "#3a0b0b",
            border: "none",
            borderRadius: 30,
            padding: "12px 34px",
            fontSize: "1.05rem",
            transition: "all 0.25s ease",
            cursor: "pointer",
          }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#d2c5b8"; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#ede9e0"; }}
        >
          Sign Up
        </button>
      </div>

      {/* ===== RIGHT / LOGIN FORM ===== */}
      <div className="form-section d-flex align-items-center justify-content-center p-4 p-md-5">
        <div className="w-100" style={{ maxWidth: 420 }}>
          <h1
            className="fw-bold mb-3 text-center"
            style={{
              color: "#3a0b0b",
              fontSize: "clamp(1.6rem, 3.2vw, 2rem)",
              letterSpacing: "0.5px",
            }}
          >
            Welcome Back
          </h1>
          <p
            className="text-center mb-4"
            style={{
              color: "#5c4b45",
              fontSize: "clamp(0.95rem, 2.4vw, 1rem)",
              opacity: 0.85,
              lineHeight: 1.6,
            }}
          >
            Continue your journey — Where creativity meets connection.
          </p>

          <form onSubmit={handleSubmit} className="d-grid gap-3">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
              style={{
                borderRadius: 10,
                border: "1px solid #cbbeb3",
                padding: "12px 14px",
                fontSize: "0.95rem",
                backgroundColor: "#f5f5ee",
                color: "#3a0b0b",
              }}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              required
              style={{
                borderRadius: 10,
                border: "1px solid #cbbeb3",
                padding: "12px 14px",
                fontSize: "0.95rem",
                backgroundColor: "#f5f5ee",
                color: "#3a0b0b",
              }}
            />

            <button
              type="submit"
              className="btn w-100 fw-semibold"
              style={{
                backgroundColor: "#3a0b0b",
                color: "#f5f5ee",
                borderRadius: 25,
                padding: "10px 0",
                fontSize: "1rem",
                letterSpacing: "0.3px",
                transition: "all 0.25s ease",
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#5c2d2d"; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#3a0b0b"; }}
            >
              Sign In
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/UserType")}
                className="btn btn-link p-0"
                style={{
                  color: "#3a0b0b",
                  textDecoration: "underline",
                  fontWeight: 600,
                }}
              >
                ← Back to User Type
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ===== Styles (Responsive + Desktop-only animation) ===== */}
      <style>{`
        .auth-container {
          min-height: 100vh;
          width: 100%;
          background-color: var(--color-background);
        }

        /* halves default to full width (stack) */
        .overlay, .form-section {
          width: 100%;
          min-height: 50vh;
        }

        /* desktop split 50/50 */
        @media (min-width: 992px) {
          .overlay, .form-section { width: 50%; min-height: 100vh; }
        }

        /* backgrounds */
        .overlay { background: #3a0b0b; color: #f9f7f2; }
        .form-section { background: #dcdcd0; }

        /* desktop-only slide animation */
        @media (min-width: 992px) {
          .overlay, .form-section {
            transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1);
          }
          .slide-right .overlay { transform: translateX(100%); }
          .slide-right .form-section { transform: translateX(100%); }
        }

        /* prevent horizontal scroll */
        html, body { overflow-x: hidden; }

        /* small phones tweaks */
        @media (max-width: 575.98px){
          .form-section input { font-size: 0.95rem; padding: 10px 12px; }
          .form-section button[type="submit"] { padding: 12px 14px; }
        }

        @media (prefers-reduced-motion: reduce){
          * { transition: none !important; animation: none !important; }
        }
      `}</style>
    </div>
  );
}
