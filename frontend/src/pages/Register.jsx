import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const userType = new URLSearchParams(location.search).get("type");
  const [slide, setSlide] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    craftType: "",
    services: [],
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const addService = (value) => {
    if (value && !formData.services.includes(value)) {
      setFormData({ ...formData, services: [...formData.services, value] });
    }
  };

  const removeService = (value) => {
    setFormData({
      ...formData,
      services: formData.services.filter((item) => item !== value),
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const url = `http://127.0.0.1:8000/api/v1/auth/${userType}/register`;

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
  setAlertMessage({ type: "success", text: "Registration successful! Redirecting..." });
  setTimeout(() => navigate(`/login?type=${userType}`), 2000);
} else {
  setAlertMessage({ type: "danger", text: data.detail || "Registration failed" });
}

  } catch (error) {
    console.error("Registration error:", error);
    alert("Network error");
  }
};

  const handleSlide = () => {
    setSlide(true);
    setTimeout(() => navigate(`/login?type=${userType}`), 800);
  };

  // الخيارات المحدثة
  const craftOptions = [
    "Pottery",
    "Woodwork",
    "Textiles",
    "Jewelry",
    "Calligraphy",
    "Leatherwork",
  ];

  const serviceOptions = ["Workshops", "Products", "Live Shows"];

  return (
    <div
      className={`auth-container position-relative d-flex overflow-hidden ${
        slide ? "slide-left" : ""
      }`}
    >{/* ===== Register Form ===== */}
<div
  className="form-section d-flex align-items-center justify-content-center"
  style={{
    backgroundColor: "#dcdcd0",
    
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
      Create Account
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
      Join our community of makers and art lovers — your journey starts here.
    </p>

    {/* === Alert Messages === */}
    {alertMessage && (
      <div
        className={`alert alert-${alertMessage.type} text-center small`}
        style={{
          borderRadius: "8px",
          color: alertMessage.type === "success" ? "#2e5c3a" : "#7a1a1a",
          backgroundColor:
            alertMessage.type === "success" ? "#d8f0dc" : "#f8d7da",
          border: "1px solid rgba(0,0,0,0.1)",
          letterSpacing: "0.3px",
          marginBottom: "1rem",
        }}
      >
        {alertMessage.text}
      </div>
    )}

    {/* === Form === */}
    <form onSubmit={handleSubmit}>
      {/* Name */}
      <div className="mb-3">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="form-control"
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

      {/* Email */}
      <div className="mb-3">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="form-control"
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

          {/* Phone Number */}
<div className="mb-3">
  <input
    type="text"
    name="phone"
    placeholder="Phone Number"
    value={formData.phone}
    onChange={handleChange}
    className="form-control"
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

      

      {/* Password */}
      <div className="mb-4">
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="form-control"
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

      {/* ===== Artisan-Specific Fields ===== */}
      {userType === "artisan" && (
        <>
          {/* Craft Type */}
          <label
            className="form-label fw-semibold small"
            style={{ color: "#3a0b0b" }}
          >
            Craft Type
          </label>
          <select
            name="craftType"
            value={formData.craftType}
            onChange={handleChange}
            required
            className="form-select mb-3"
            style={{
              borderRadius: "10px",
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

          {/* Services Offered */}
          <label
            className="form-label fw-semibold small"
            style={{ color: "#3a0b0b" }}
          >
            Services Offered
          </label>
          <div className="mb-4">
            <select
              className="form-select"
              onChange={(e) => addService(e.target.value)}
              defaultValue=""
              style={{
                borderRadius: "10px",
                border: "1px solid #cbbeb3",
                backgroundColor: "#f5f5ee",
                color: "#3a0b0b",
                padding: "10px 12px",
              }}
            >
              <option value="" disabled>
                Select a service
              </option>
              {serviceOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            {/* Badges */}
            <div className="mt-2 d-flex flex-wrap gap-2">
              {formData.services.map((srv) => (
                <span
                  key={srv}
                  className="badge rounded-pill px-3 py-2"
                  style={{
                    backgroundColor: "#6f4e37",
                    color: "#f5f5ee",
                    cursor: "pointer",
                  }}
                  onClick={() => removeService(srv)}
                >
                  {srv} ✕
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Submit Button */}
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
        Sign Up
      </button>
    </form>
  </div>
</div>


      {/* ===== Purple Overlay ===== */}
      <div className="overlay d-flex flex-column justify-content-center align-items-center p-5">


      <h1 className="fw-bold mb-3" style={{ fontSize: "2.2rem" }}>
Welcome Back </h1>
<p
  className="mb-4 text-center"
  style={{ maxWidth: "280px", lineHeight: "1.6" }}
>
  Continue your journey - where creativity and connection grow
</p>



        <button
          onClick={handleSlide}
         style={{
  backgroundColor: "#dcdcd0ff",
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
  e.target.style.backgroundColor = "#bcb9b2"; 
  e.target.style.color = "#3a0b0b";
}}
onMouseOut={(e) => {
  e.target.style.backgroundColor = "#dcdcd0ff";
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
          background-color: var(--color-background);
    
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
        .form-control:focus, .form-select:focus {
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
