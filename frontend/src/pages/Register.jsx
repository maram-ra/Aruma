import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { alertSuccess, alertError } from "../components/ArumaAlert";

// API base
const API = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const userType = new URLSearchParams(location.search).get("type");
  const [slide, setSlide] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    craftType: "",
    phone: "",
    services: [],
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userType) {
      await alertError("Please choose user type first.");
      navigate("/UserType");
      return;
    }

    const url = `${API}/auth/${userType}/register`;

    const payload =
      userType === "artisan"
        ? {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            craftType: formData.craftType,
            offersWorkshop: formData.services.includes("Workshops"),
            offersLiveShow: formData.services.includes("Live Shows"),
          }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        await alertSuccess("Registration successful! Redirecting...");
        setTimeout(() => navigate(`/login?type=${userType}`), 1500);
      } else {
        await alertError(data.detail || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      await alertError("Network error. Please try again later.");
    }
  };

  const handleSlide = () => {
    setSlide(true);
    setTimeout(() => navigate(`/login?type=${userType || ""}`), 800);
  };

  const craftOptions = [
    "Pottery & Ceramics",
    "Sadu Weaving",
    "Palm Frond Weaving",
    "Leatherwork",
    "Jewelry & Silverwork",
    "Wood Engraving & Doors",
    "Painting & Wall Art",
    "Calligraphy & Arabic Typography",
    "Home Decor & Candle Making",
    "Notebook & Stationery",
  ];

  return (
    <div
      className={`auth-container d-flex flex-column flex-lg-row position-relative overflow-hidden ${
        slide ? "slide-left" : ""
      }`}
    >
      {/* ===== LEFT / FORM ===== */}
      <div className="form-section d-flex align-items-center justify-content-center p-4 p-md-5">
        <div className="form-wrapper w-100" style={{ maxWidth: 420 }}>
          <h1 className="fw-bold mb-3 text-center" style={{ color: "#3a0b0b", fontSize: "clamp(1.6rem, 3.2vw, 2rem)" }}>
            Create Account
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
            Join our community of makers and art lovers — your journey starts here.
          </p>

          <form onSubmit={handleSubmit} className="d-grid gap-3">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-control w-100"
              style={{
                borderRadius: 10,
                border: "1px solid #cbbeb3",
                padding: "12px 14px",
                backgroundColor: "#f5f5ee",
                color: "#3a0b0b",
              }}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-control w-100"
              style={{
                borderRadius: 10,
                border: "1px solid #cbbeb3",
                padding: "12px 14px",
                backgroundColor: "#f5f5ee",
                color: "#3a0b0b",
              }}
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="form-control w-100"
              style={{
                borderRadius: 10,
                border: "1px solid #cbbeb3",
                padding: "12px 14px",
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
              required
              className="form-control w-100 mb-1"
              style={{
                borderRadius: 10,
                border: "1px solid #cbbeb3",
                padding: "12px 14px",
                backgroundColor: "#f5f5ee",
                color: "#3a0b0b",
              }}
            />

            {userType === "artisan" && (
              <>
                <label className="form-label fw-semibold small" style={{ color: "#3a0b0b" }}>
                  Craft Type
                </label>
                <select
                  name="craftType"
                  value={formData.craftType}
                  onChange={handleChange}
                  required
                  className="form-select w-100"
                  style={{
                    borderRadius: 10,
                    border: "1px solid #cbbeb3",
                    backgroundColor: "#f5f5ee",
                    color: "#3a0b0b",
                    padding: "10px 12px",
                  }}
                >
                  <option value="">Select a craft type</option>
                  {craftOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </>
            )}

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
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#5c2d2d")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3a0b0b")}
            >
              Sign Up
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

      {/* ===== RIGHT / OVERLAY ===== */}
      <div className="overlay d-flex flex-column justify-content-center align-items-center p-4 p-md-5">
        <h1 className="fw-bold mb-3" style={{ fontSize: "clamp(1.8rem, 3.8vw, 2.2rem)" }}>
          Welcome Back
        </h1>
        <p className="mb-4 text-center" style={{ maxWidth: 320, lineHeight: 1.6 }}>
          Continue your journey — where creativity and connection grow
        </p>

        <button
          onClick={handleSlide}
          className="fw-bold"
          style={{
            backgroundColor: "#dcdcd0",
            color: "#3a0b0b",
            border: "none",
            borderRadius: 30,
            padding: "12px 34px",
            fontSize: "1.05rem",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#bcb9b2")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#dcdcd0")}
        >
          Sign In
        </button>
      </div>

      {/* ===== Styles ===== */}
      <style>{`
        .auth-container {
          min-height: 100vh;
          width: 100%;
          background-color: var(--color-background);
        }

        /* halves */
        .form-section, .overlay {
          width: 100%;
          min-height: 50vh;
        }

        /* desktop: split 50/50 */
        @media (min-width: 992px) {
          .form-section, .overlay { width: 50%; min-height: 100vh; }
        }

        /* backgrounds */
        .form-section { background: #dcdcd0; }
        .overlay { background: #3a0b0b; color: #f9f7f2; }

        /* slide animation — desktop only */
        .slide-left {}
        @media (min-width: 992px) {
          .auth-container { position: relative; }
          .form-section, .overlay {
            transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1);
          }
          .slide-left .overlay { transform: translateX(-100%); }
          .slide-left .form-section { transform: translateX(-100%); }
        }

        /* spacing + inputs full width on small screens handled via bootstrap; ensure no horizontal scroll */
        html, body { overflow-x: hidden; }

        /* tighter padding on very small screens */
        @media (max-width: 576px) {
          .form-section input { font-size: 0.95rem; padding: 10px 12px; }
          .form-section button[type="submit"] { padding: 12px 14px; }
        }
      `}</style>
    </div>
  );
}
