import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";


export default function Register() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const userType = params.get("type"); // "client" or "artisan"

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    craftTypes: [],
    services: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleSelection = (field, value) => {
    setFormData((prev) => {
      const current = prev[field];
      return {
        ...prev,
        [field]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Registering as ${userType}`, formData);

    // بعد التسجيل الناجح
    if (userType === "client") {
      navigate("/Marketplace");
    } else {
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

      {/* ===== Register Content ===== */}
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
            Create your account
          </h2>
          <p className="lead" style={{ color: "#4a4a4a", maxWidth: "420px" }}>
            Join Aruma as a {userType === "artisan" ? "creator" : "client"} and
            start connecting with the handmade community.
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
            Register as {userType === "artisan" ? "Artisan" : "Client"}
          </h4>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ color: "#3a0b0b" }}>
                Name
              </label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ borderRadius: "8px" }}
              />
            </div>

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
            <div className="mb-4">
              <label className="form-label fw-semibold" style={{ color: "#3a0b0b" }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ borderRadius: "8px" }}
              />
            </div>
{/* ===== Only for Artisan ===== */}
{userType === "artisan" && (
  <>
    {/* Craft Type */}
    <div className="mb-4 text-start">
      <label className="form-label fw-semibold" style={{ color: "#3a0b0b" }}>
        Craft Type
      </label>
      <div className="d-flex flex-wrap gap-2 justify-content-start">
        {["Pottery", "Jewelry", "Woodwork"].map((craft) => (
          <button
            key={craft}
            type="button"
            className="btn fw-medium px-3 py-1"
            style={{
              backgroundColor: formData.craftTypes.includes(craft)
                ? "#3a0b0b"
                : "#f1eee7", // بيج فاتح ناعم
              color: formData.craftTypes.includes(craft)
                ? "#f5f5ee"
                : "#3a0b0b",
              border: "none",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
            onClick={() => toggleSelection("craftTypes", craft)}
            onMouseEnter={(e) => {
              if (!formData.craftTypes.includes(craft)) {
                e.target.style.backgroundColor = "#e7e3da";
              }
            }}
            onMouseLeave={(e) => {
              if (!formData.craftTypes.includes(craft)) {
                e.target.style.backgroundColor = "#f1eee7";
              }
            }}
          >
            {craft}
          </button>
        ))}
      </div>
    </div>

    {/* Services Offered */}
    <div className="mb-4 text-start">
      <label className="form-label fw-semibold" style={{ color: "#3a0b0b" }}>
        Services Offered
      </label>
      <div className="d-flex flex-wrap gap-2 justify-content-start">
        {["Products", "Workshops", "Live Show"].map((service) => (
          <button
            key={service}
            type="button"
            className="btn fw-medium px-3 py-1"
            style={{
              backgroundColor: formData.services.includes(service)
                ? "#3a0b0b"
                : "#f1eee7",
              color: formData.services.includes(service)
                ? "#f5f5ee"
                : "#3a0b0b",
              border: "none",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
            onClick={() => toggleSelection("services", service)}
            onMouseEnter={(e) => {
              if (!formData.services.includes(service)) {
                e.target.style.backgroundColor = "#e7e3da";
              }
            }}
            onMouseLeave={(e) => {
              if (!formData.services.includes(service)) {
                e.target.style.backgroundColor = "#f1eee7";
              }
            }}
          >
            {service}
          </button>
        ))}
      </div>
    </div>
  </>
)}

{/* Register Button */}
<div className="mb-4 text-start">
  <button
    type="submit"
    className="btn fw-semibold py-2"
    style={{
      backgroundColor: "#3a0b0b",
      color: "#f5f5ee",
      borderRadius: "8px",
      width: "100%", // ← الزر عريض بنفس الحاوية
      transition: "all 0.3s ease",
    }}
    onMouseEnter={(e) => {
      e.target.style.backgroundColor = "#5b2a2a";
    }}
    onMouseLeave={(e) => {
      e.target.style.backgroundColor = "#3a0b0b";
    }}
  >
    Register
  </button>
</div>

            {/* Already Have Account */}
            <p className="text-center" style={{ color: "#4a4a4a" }}>
              Already have an account?{" "}
              <Link
                to={`/login?type=${userType}`}
                className="fw-semibold"
                style={{ color: "#3a0b0b", textDecoration: "underline" }}
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
