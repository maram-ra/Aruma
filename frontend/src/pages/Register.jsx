import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// قاعدة عنوان الـ API
const API =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

/* ===================== Elegant Alert Dialog (Aruma Style) ===================== */
const theme = {
  primary: "#3a0b0b",
  beige: "#f9f7f2",
  border: "#cbbeb3",
  success: "#3c7c59",
  error: "#a13a3a",
  text: "#5c4b45",
};

function showAlert({ type = "info", title = "Message", message = "", confirmText = "OK" } = {}) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.35)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      backdropFilter: "blur(2px)",
    });

    const dialog = document.createElement("div");
    Object.assign(dialog.style, {
      backgroundColor: theme.beige,
      borderRadius: "16px",
      padding: "28px 26px 24px",
      width: "90%",
      maxWidth: "420px",
      boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
      border: `1px solid ${theme.border}`,
      fontFamily: "inherit",
      textAlign: "center",
      opacity: 0,
      transform: "scale(0.9)",
      transition: "all 0.25s ease",
    });

    const icon = document.createElement("div");
    icon.textContent = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";
    Object.assign(icon.style, {
      fontSize: "28px",
      color: type === "success" ? theme.success : type === "error" ? theme.error : theme.primary,
      marginBottom: "12px",
    });

    const titleEl = document.createElement("h4");
    titleEl.textContent = title;
    Object.assign(titleEl.style, { color: theme.primary, fontWeight: 700, fontSize: "1.15rem", margin: "0 0 8px" });

    const msgEl = document.createElement("p");
    msgEl.textContent = message;
    Object.assign(msgEl.style, { color: theme.text, lineHeight: 1.6, fontSize: "0.95rem", margin: "0 0 20px", whiteSpace: "pre-wrap" });

    const confirmBtn = document.createElement("button");
    confirmBtn.textContent = confirmText;
    Object.assign(confirmBtn.style, {
      borderRadius: "20px",
      border: "none",
      padding: "8px 16px",
      fontWeight: 600,
      backgroundColor: type === "error" ? theme.error : type === "success" ? theme.success : theme.primary,
      color: "#fff",
      cursor: "pointer",
      transition: "opacity 0.2s",
    });
    confirmBtn.onmouseover = () => (confirmBtn.style.opacity = "0.85");
    confirmBtn.onmouseout = () => (confirmBtn.style.opacity = "1");

    confirmBtn.onclick = () => {
      dialog.style.opacity = "0";
      dialog.style.transform = "scale(0.9)";
      setTimeout(() => {
        overlay.remove();
        resolve(true);
      }, 200);
    };

    dialog.appendChild(icon);
    dialog.appendChild(titleEl);
    dialog.appendChild(msgEl);
    dialog.appendChild(confirmBtn);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    setTimeout(() => {
      dialog.style.opacity = "1";
      dialog.style.transform = "scale(1)";
    }, 10);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.remove();
        resolve(false);
      }
    });
    window.addEventListener("keydown", (e) => e.key === "Escape" && overlay.remove());
  });
}

const alertSuccess = (msg, opts) => showAlert({ type: "success", message: msg, title: "Success", ...opts });
const alertError = (msg, opts) => showAlert({ type: "error", message: msg, title: "Error", ...opts });
/* ============================================================================ */

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

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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

  const craftOptions = ["Pottery", "Woodwork", "Textiles", "Jewelry", "Calligraphy", "Leatherwork"];
  const serviceOptions = ["Workshops", "Products", "Live Shows"];

  return (
    <div className={`auth-container position-relative d-flex overflow-hidden ${slide ? "slide-left" : ""}`}>
      {/* ===== Register Form ===== */}
      <div className="form-section d-flex align-items-center justify-content-center" style={{ backgroundColor: "#dcdcd0" }}>
        <div className="p-5" style={{ maxWidth: "420px", width: "100%" }}>
          <h1 className="fw-bold mb-3 text-center" style={{ color: "#3a0b0b", fontSize: "2rem" }}>
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

          {/* === Form === */}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-control mb-3"
              style={{
                borderRadius: "10px",
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
              className="form-control mb-3"
              style={{
                borderRadius: "10px",
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
              className="form-control mb-3"
              style={{
                borderRadius: "10px",
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
              className="form-control mb-4"
              style={{
                borderRadius: "10px",
                border: "1px solid #cbbeb3",
                padding: "12px 14px",
                backgroundColor: "#f5f5ee",
                color: "#3a0b0b",
              }}
            />

            {/* ===== Artisan-Specific Fields ===== */}
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

                <label className="form-label fw-semibold small" style={{ color: "#3a0b0b" }}>
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
              onMouseOver={(e) => (e.target.style.backgroundColor = "#5c2d2d")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#3a0b0b")}
            >
              Sign Up
            </button>

            <div className="text-center mt-3">
              <button
                type="button"
                onClick={() => navigate("/UserType")}
                className="btn btn-link p-0"
                style={{
                  color: "#3a0b0b",
                  textDecoration: "underline",
                  fontWeight: "600",
                }}
              >
                ← Back to User Type
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ===== Overlay ===== */}
      <div className="overlay d-flex flex-column justify-content-center align-items-center p-5">
        <h1 className="fw-bold mb-3" style={{ fontSize: "2.2rem" }}>
          Welcome Back
        </h1>
        <p className="mb-4 text-center" style={{ maxWidth: "280px", lineHeight: "1.6" }}>
          Continue your journey — where creativity and connection grow
        </p>

        <button
          onClick={handleSlide}
          style={{
            backgroundColor: "#dcdcd0",
            color: "#3a0b0b",
            border: "none",
            borderRadius: "30px",
            padding: "12px 34px",
            fontWeight: 700,
            fontSize: "1.05rem",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#bcb9b2")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#dcdcd0")}
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
          color: #f9f7f2;
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
