import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg py-3"
      style={{ backgroundColor: "#f5f5ee" }}
    >
      <div className="container d-flex justify-content-between align-items-center">
        <div className="d-flex gap-3">
          <a href="#" className="text-decoration-none text-dark small">
            Home
          </a>
          <a href="#" className="text-decoration-none text-dark small">
            Account
          </a>
        </div>

        {/* الشعار */}
        <a href="#" className="navbar-brand m-0">
          <img src="/logo.png" alt="Aruma Logo" width="50" />
        </a>

        {/* زر تسجيل الدخول */}
        <a
          href="/UserType"
          className="text-decoration-none fw-semibold small text-dark"
        >
          Log out
        </a>
      </div>
    </nav>
  );
}
