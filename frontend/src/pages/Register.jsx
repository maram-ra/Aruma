import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const userType = new URLSearchParams(location.search).get("type");
  const [slide, setSlide] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          
          role: userType,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registration successful!");
        navigate(`/login?type=${userType}`);
      } else alert(data.detail || "Registration failed");
    } catch {
      alert("Network error");
    }
  };

  const handleSlide = () => {
    setSlide(true);
    setTimeout(() => navigate(`/login?type=${userType}`), 800);
  };

  return (
    <div
      className={`auth-container position-relative d-flex overflow-hidden ${
        slide ? "slide-left" : ""
      }`}
    >
      {/* ===== Register Form ===== */}
      <div className="form-section d-flex align-items-center justify-content-center bg-white">
        <div className="p-5" style={{ maxWidth: "420px", width: "100%" }}>
          <header className="text-center mb-4">
            <Link to="/UserType">
              <img
                src="/logo.png"
                alt="Aruma Logo"
                style={{ height: "55px", objectFit: "contain" }}
              />
            </Link>
          </header>
          <h1
            className="fw-bold mb-4"
            style={{ color: "#3a0b0b", fontSize: "2rem" }}
          >
            Create Account
          </h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="form-control bg-light mb-3"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="form-control bg-light mb-3"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="form-control bg-light mb-4"
              required
            />
            <button type="submit" className="btn-main w-100">
              Sign Up
            </button>
          </form>
        </div>
      </div>

      {/* ===== Purple Overlay ===== */}
      <div className="overlay d-flex flex-column justify-content-center align-items-center text-white p-5">
        <h1 className="fw-bold mb-3" style={{ fontSize: "2.2rem" }}>
          Welcome Back! 
        </h1>
        <p
          className="mb-4 text-center"
          style={{ maxWidth: "280px", lineHeight: "1.6" }}
        >
          To keep connected with us please login with your info.
        </p>
        <button
          onClick={handleSlide}
          style={{
            backgroundColor: "#f5f5ee",
            color: "#3a0b0b",
            border: "none",
            borderRadius: "30px",
            padding: "12px 34px",
            fontWeight: 700,
            fontSize: "1.05rem",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#3a0b0b";
            e.target.style.color = "#f5f5ee";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#f5f5ee";
            e.target.style.color = "#3a0b0b";
          }}
        >
          Sign In
        </button>
      </div>

      {/* ===== Animation & Style ===== */}
      <style>{`
        .auth-container {
          height: 100vh;
          width: 100%;
          background-color: #f5f5ee;
        }
        .overlay {
          background: #3a0b0b;
          width: 50%;
          min-height: 100%;
          position: absolute;
          right: 0;
          top: 0;
          transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1);
          z-index: 2;
        }
        .form-section {
          width: 50%;
          height: 100vh;
          transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1);
        }
        .slide-left .overlay {
          transform: translateX(-100%);
        }
        .slide-left .form-section {
          transform: translateX(-100%);
        }
        .form-control:focus {
          box-shadow: 0 0 0 3px rgba(132, 132, 166, 0.25);
          border-color: #8484A6;
        }
        @media (max-width: 768px) {
          .overlay, .form-section {
            width: 100%;
            position: relative;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
