import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar({
  showHome = true,
  showAccount = true,
  showLogin = true,
}) {
  return (
    <nav
      className="navbar navbar-expand-lg py-3 shadow-0"
      style={{
        backgroundColor: "#f5f5ee",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      <div className="container d-flex justify-content-between align-items-center">
        {/* ===== Left Links ===== */}
        <div className="d-flex gap-4 align-items-center">
          {showHome && (
            <a
              href="/"
              className="text-decoration-none fw-semibold small nav-link-custom"
              style={{
                color: "#3a0b0b",
                letterSpacing: "0.3px",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Home
            </a>
          )}
          {showAccount && (
            <a
              href="#"
              className="text-decoration-none fw-semibold small nav-link-custom"
              style={{
                color: "#3a0b0b",
                letterSpacing: "0.3px",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Account
            </a>
          )}
        </div>

        {/* ===== Logo (Centered) ===== */}
        <a
          href="/"
          className="navbar-brand m-0 d-flex justify-content-center align-items-center w-100 position-absolute start-50 translate-middle-x"
        >
          <img
            src="/logo.png"
            alt="Aruma Logo"
            width="52"
            style={{
              filter: "contrast(90%) brightness(95%)",
              opacity: "0.95",
            }}
          />
        </a>

        {/* ===== Auth Link (Right Side) ===== */}
        <div className="d-flex justify-content-end align-items-center" style={{ minWidth: "100px" }}>
          {showLogin ? (
            <a
              href="/login"
              className="text-decoration-none fw-semibold small nav-link-custom"
              style={{
                color: "#3a0b0b",
                letterSpacing: "0.3px",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Login
            </a>
          ) : (
            <a
              href="/usertype"
              className="text-decoration-none fw-semibold small nav-link-custom"
              style={{
                color: "#3a0b0b",
                letterSpacing: "0.3px",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Log out
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
