import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

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
    icon.textContent =
      type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";
    Object.assign(icon.style, {
      fontSize: "28px",
      color:
        type === "success"
          ? theme.success
          : type === "error"
          ? theme.error
          : theme.primary,
      marginBottom: "12px",
    });

    const titleEl = document.createElement("h4");
    titleEl.textContent = title;
    Object.assign(titleEl.style, {
      color: theme.primary,
      fontWeight: 700,
      fontSize: "1.15rem",
      margin: "0 0 8px",
    });

    const msgEl = document.createElement("p");
    msgEl.textContent = message;
    Object.assign(msgEl.style, {
      color: theme.text,
      lineHeight: 1.6,
      fontSize: "0.95rem",
      margin: "0 0 20px",
      whiteSpace: "pre-wrap",
    });

    const confirmBtn = document.createElement("button");
    confirmBtn.textContent = confirmText;
    Object.assign(confirmBtn.style, {
      borderRadius: "20px",
      border: "none",
      padding: "8px 16px",
      fontWeight: 600,
      backgroundColor:
        type === "error"
          ? theme.error
          : type === "success"
          ? theme.success
          : theme.primary,
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

        await alertSuccess("Login successful! 🌿");
        navigate(
          data.user_type === "client"
            ? "/marketplace"
            : "/artisan/Profile"
        );
      } else {
        await alertError(data.detail || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      await alertError("Network error. Please try again later.");
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
      {/* ===== Overlay ===== */}
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
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#ede9e0";
          }}
        >
          Sign Up
        </button>
      </div>

      {/* ===== Login Form ===== */}
      <div
        className="form-section d-flex align-items-center justify-content-center"
        style={{
          backgroundColor: "#dcdcd0",
        }}
      >
        <div className="p-5" style={{ maxWidth: "420px", width: "100%" }}>
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

      {/* ===== CSS ===== */}
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
          color: #f9f7f2;
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
