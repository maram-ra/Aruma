import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ForgotPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const userType = params.get("type"); // "client" or "artisan"

  const [formData, setFormData] = useState({ email: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call for password reset
    try {
      console.log(`Sending password reset for ${userType}`, formData);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error sending reset email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate(`/login?type=${userType}`);
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

      {/* ===== Forgot Password Content ===== */}
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
            Reset your password
          </h2>
          <p className="lead" style={{ color: "#4a4a4a", maxWidth: "420px" }}>
            {!isSubmitted 
              ? "Enter your email address and we'll send you instructions to reset your password."
              : "Check your email for reset instructions. The link will expire in 1 hour."
            }
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
            Forgot Password - {userType === "artisan" ? "Artisan" : "Client"}
          </h4>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-4">
                <label className="form-label fw-semibold" style={{ color: "#3a0b0b" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: "8px" }}
                  disabled={isLoading}
                />
                <div className="form-text" style={{ color: "#6c757d" }}>
                  Enter the email address associated with your account.
                </div>
              </div>

              {/* Actions */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={handleBackToLogin}
                  style={{ color: "#3a0b0b", textDecoration: "none" }}
                  disabled={isLoading}
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  className="btn fw-semibold px-4 py-2"
                  style={{
                    backgroundColor: "#3a0b0b",
                    color: "#f5f5ee",
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                    minWidth: "120px",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.target.style.backgroundColor = "#5b2a2a";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.target.style.backgroundColor = "#3a0b0b";
                    }
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </div>

              {/* Create Account Link */}
              <p className="text-center" style={{ color: "#4a4a4a" }}>
                Don't have an account?{" "}
                <Link
                  to={`/register?type=${userType}`}
                  className="fw-semibold"
                  style={{ color: "#3a0b0b", textDecoration: "underline" }}
                >
                  Create one
                </Link>
              </p>
            </form>
          ) : (
            /* Success Message */
            <div className="text-center">
              <div className="mb-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#d4edda",
                    color: "#155724",
                    fontSize: "2rem",
                  }}
                >
                  ✓
                </div>
                <h5 style={{ color: "#3a0b0b" }}>Reset Email Sent!</h5>
                <p style={{ color: "#4a4a4a" }}>
                  We've sent password reset instructions to:<br />
                  <strong>{formData.email}</strong>
                </p>
              </div>

              <div className="d-flex flex-column gap-3">
                <button
                  onClick={handleBackToLogin}
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
                  Back to Login
                </button>
              </div>

              <p className="mt-4 small" style={{ color: "#6c757d" }}>
                Didn't receive the email? Check your spam folder or{" "}
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                  }}
                  className="btn btn-link p-0 fw-semibold"
                  style={{ color: "#3a0b0b", textDecoration: "underline" }}
                >
                  try again
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}