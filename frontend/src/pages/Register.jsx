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

    if (userType === "client") {
      navigate("/Marketplace");
    } else {
      navigate("/artisan/Profile");
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
      {/* ===== Header (Logo) ===== */}
      <header className="d-flex justify-content-center align-items-center py-4">
        <Link to="/UserType">
          <img
            src="/logo.png"
            alt="Aruma Logo"
            style={{ height: "50px", objectFit: "contain" }}
          />
        </Link>
      </header>

      {/* ===== Register Section ===== */}
      <div className="container d-flex flex-column flex-md-row align-items-center justify-content-center flex-grow-1 py-5">
        {/* ===== Left Intro Text ===== */}
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

        {/* ===== Register Form ===== */}
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
                  <div className="d-flex flex-wrap gap-2">
                    {["Pottery", "Jewelry", "Woodwork"].map((craft) => (
                      <button
                        key={craft}
                        type="button"
                        className={`btn-outline ${
                          formData.craftTypes.includes(craft) ? "btn-main" : ""
                        } btn-small`}
                        onClick={() => toggleSelection("craftTypes", craft)}
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
                  <div className="d-flex flex-wrap gap-2">
                    {["Products", "Workshops", "Live Show"].map((service) => (
                      <button
                        key={service}
                        type="button"
                        className={`btn-outline ${
                          formData.services.includes(service) ? "btn-main" : ""
                        } btn-small`}
                        onClick={() => toggleSelection("services", service)}
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
              <button type="submit" className="btn-main w-100">
                Register
              </button>
            </div>

            {/* Already Have Account */}
            <p className="text-center" style={{ color: "#4a4a4a" }}>
              Already have an account?{" "}
              <Link
                to={`/login?type=${userType}`}
                className="btn-text fw-semibold"
                style={{ textDecoration: "underline" }}
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
