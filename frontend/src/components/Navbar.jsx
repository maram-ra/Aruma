import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar({
  showHome = true,
  showAccount = true,
  showLogin = true,
}) {
  return (
    <nav
      className="navbar navbar-expand-lg py-3"
      style={{ backgroundColor: "#f5f5ee" }}
    >
      <div className="container d-flex justify-content-between align-items-center">
        {/* ===== Left Links ===== */}
        <div className="d-flex gap-4">
          {showHome && (
            <a
              href="#"
              className="text-decoration-none fw-semibold small"
              style={{ color: "#3a0b0b" }}
            >
              Home
            </a>
          )}
          {showAccount && (
            <a
              href="#"
              className="text-decoration-none fw-semibold small"
              style={{ color: "#3a0b0b" }}
            >
              Account
            </a>
          )}
        </div>

        {/* ===== Logo ===== */}
        <a href="#" className="navbar-brand m-0 d-flex justify-content-center w-100">
          <img src="/logo.png" alt="Aruma Logo" width="50" />
        </a>

        {/* ===== Login Link ===== */}
        {showLogin && (
          <a
            href="#"
            className="text-decoration-none fw-semibold small"
            style={{ color: "#3a0b0b" }}
          >
            Login
          </a>
        )}
      </div>
    </nav>
  );
}
