import React from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

export default function UserType() {
  const navigate = useNavigate();

  return (
    <div className="user-type-page">
      {/* Logo section */}
      <div className="logo-container">
        <img src="/logo.png" alt="Aruma Logo" className="aruma-logo" />
      </div>

      {/* Heading and Buttons section */}
      <div className="buttons-container">
        <h2 className="user-heading">Choose your account type</h2>

        <div className="d-flex gap-4 justify-content-center">
          <button
            className="user-btn"
            onClick={() => navigate("/login?type=client")}
          >
            Client
          </button>
          <button
            className="user-btn"
            onClick={() => navigate("/login?type=artisan")}
          >
            Artisan
          </button>
        </div>
      </div>
    </div>
  );
}
