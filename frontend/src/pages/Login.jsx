import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

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

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/v1/auth/${userType}/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
  localStorage.setItem("token", data.access_token);
  localStorage.setItem("userRole", data.user_type);
  localStorage.setItem("userId", data.user_id);  
  localStorage.setItem("userName", data.name || "User");

  navigate(
    data.user_type === "client"
      ? "/marketplace"
      : "/artisan/Profile"
  );
    } else {
      alert(data.detail || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Network error");
  }
};



  const handleSlide = () => {
    setSlide(true);
    setTimeout(() => navigate(`/register?type=${userType}`), 800);
  };

  return (
    <div
      className={`auth-container position-relative d-flex overflow-hidden ${
        slide ? "slide-right" : ""
      }`}
    >
      {/* ===== Purple Overlay ===== */}
      <div className="overlay d-flex flex-column justify-content-center align-items-center p-5">

    <h1 className="fw-bold mb-3" style={{ fontSize: "2.2rem" }}>
  First time here?
</h1>
<p
  className="mb-4 text-center"
  style={{ maxWidth: "280px", lineHeight: "1.6" }}
>
  Discover a space where craft and community come alive

</p>


        <button
          onClick={handleSlide}
          style={{
          backgroundColor: "#ede9e0", 
          color: "#3a0b0b",
          border: "none",
          borderRadius: "30px",
          padding: "12px 34px",
          fontWeight: 700,
          fontSize: "1.05rem",
          transition: "var(--transition-fast)",
          cursor: "pointer",
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = "#d2c5b8"; 
          e.target.style.color = "#3a0b0b";
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = "#ede9e0";
          e.target.style.color = "#3a0b0b";
        }}

        >
          Sign Up
        </button>
      </div>

     {/* ===== Login Form ===== */}
<div
  className="form-section d-flex align-items-center justify-content-center"
  style={{
    backgroundColor: "#dcdcd0", // لون هادئ مقابل الخلفية العنابية
  }}
>
  <div className="p-5" style={{ maxWidth: "420px", width: "100%" }}>
    

    {/* === Title === */}
    <h1
      className="fw-bold mb-3 text-center"
      style={{
        color: "#3a0b0b",
        fontSize: "2rem",
        letterSpacing: "0.5px",
      }}
    >
      Welcome Back
    </h1>
    <p
      className="text-center mb-4"
      style={{
        color: "#5c4b45",
        fontSize: "1rem",
        opacity: "0.85",
        lineHeight: "1.6",
      }}
    >
      Continue your journey — Where creativity meets connection.
    </p>

    {/* === Form === */}
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="form-control"
          required
          style={{
            borderRadius: "10px",
            border: "1px solid #cbbeb3",
            padding: "12px 14px",
            fontSize: "0.95rem",
            backgroundColor: "#f5f5ee",
            color: "#3a0b0b",
          }}
        />
      </div>

      <div className="mb-4">
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="form-control"
          required
          style={{
            borderRadius: "10px",
            border: "1px solid #cbbeb3",
            padding: "12px 14px",
            fontSize: "0.95rem",
            backgroundColor: "#f5f5ee",
            color: "#3a0b0b",
          }}
        />
      </div>

      <button
        type="submit"
        className="btn w-100 fw-semibold"
        style={{
          backgroundColor: "#3a0b0b",
          color: "#f5f5ee",
          borderRadius: "25px",
          padding: "10px 0",
          fontSize: "1rem",
          letterSpacing: "0.3px",
          transition: "all 0.25s ease",
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = "#5c2d2d";
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = "#3a0b0b";
        }}
      >
        Sign In
      </button>
    </form>
  </div>
</div>

      {/* ===== Animation & Style ===== */}
      <style>{`
        .auth-container {
          height: 100vh;
          width: 100%;
         background-color: var(--color-background);
        }
        .overlay {
          background: #3a0b0b;
          width: 50%;
          min-height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1);
          z-index: 2;
        }
        .form-section {
          width: 50%;
          margin-left: 50%;
          height: 100vh;
          transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1);
        }
        .slide-right .overlay {
          transform: translateX(100%);
        }
        .slide-right .form-section {
          transform: translateX(100%);
        }
        .form-control:focus {
          box-shadow: 0 0 0 3px rgba(132, 132, 166, 0.25);
          border-color: #8484A6;
        }
        @media (max-width: 768px) {
          .overlay, .form-section {
            width: 100%;
            position: relative;
            margin: 0;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
