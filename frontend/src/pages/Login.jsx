import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const userType = params.get("type"); // "client" or "artisan"

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Logging in as ${userType}`, formData);

    //  توجيه بعد تسجيل الدخول
    if (userType === "client") {
      navigate("/Marketplace");
    } else if (userType === "artisan") {
      navigate("/Dashboard");
    }
  };

  return (
    <section
      style={{
        backgroundColor: "#f5f5ee",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ===== Header (Logo Only) ===== */}
      <header
        className="d-flex justify-content-center align-items-center py-4"
        style={{ backgroundColor: "#f5f5ee" }}
      >
        <Link to="/UserType">
          <img
            src="/logo.png"
            alt="Aruma Logo"
            style={{ height: "50px", objectFit: "contain" }}
          />
        </Link>
      </header>

      {/* ===== Login Content ===== */}
      <div className="container d-flex flex-column flex-md-row align-items-center justify-content-center flex-grow-1 py-5">
        {/* ===== Left Text ===== */}
        <div className="col-12 col-md-6 mb-5 mb-md-0 text-md-start text-center px-4">
          <h2
            className="fw-bold mb-3"
            style={{
              color: "#3a0b0b",
              fontSize: "2.8rem",
              lineHeight: "1.2",
            }}
          >
            Welcome back
          </h2>
          <p className="lead" style={{ color: "#4a4a4a", maxWidth: "420px" }}>
            Log in to continue your creative journey and connect with the Aruma community.
          </p>
        </div>

        {/* ===== Form Box ===== */}
        <div
          className="col-12 col-md-5 p-5 shadow-sm"
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            maxWidth: "450px",
          }}
        >
          <h4 className="fw-bold mb-4" style={{ color: "#3a0b0b" }}>
            Login as {userType === "artisan" ? "Artisan" : "Client"}
          </h4>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ color: "#3a0b0b" }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ borderRadius: "8px" }}
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ color: "#3a0b0b" }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ borderRadius: "8px" }}
              />
            </div>

            {/* Actions */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <button
                type="button"
                className="btn btn-link p-0"
                style={{ color: "#3a0b0b", textDecoration: "none" }}
              >
                Forgot Password?
              </button>
              <button
                type="submit"
                className="btn fw-semibold px-4 py-2"
                style={{
                  backgroundColor: "#3a0b0b",
                  color: "#f5f5ee",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#5b2a2a";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#3a0b0b";
                }}
              >
                Login
              </button>
            </div>

            {/* Create Account Link */}
            <p className="text-center" style={{ color: "#4a4a4a" }}>
              Don’t have an account?{" "}
              <Link
                to={`/register?type=${userType}`}
                className="fw-semibold"
                style={{ color: "#3a0b0b", textDecoration: "underline" }}
              >
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
