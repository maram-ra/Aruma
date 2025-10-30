import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import headerImage from "../assets/header1.png";

export default function UserTypeHero() {
  const navigate = useNavigate();

  const handleSelect = (type) => {
    navigate(`/login?type=${type}`);
  };

  return (
    <section
      className="hero-section"
      style={{ position: "relative", overflow: "hidden", minHeight: "100vh" }}
    >
      {/* =====  الصورة ===== */}
      <img
        src={headerImage}
        alt="Hero background"
        className="hero-image"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
          filter: "brightness(0.8)",
        }}
      />

      {/* ===== المحتوى ===== */}
      <div
        className="container text-center d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "100vh", color: "#fff" }}
      >
        <h1 className="fw-bold mb-3" style={{ fontSize: "3rem", color: "#f5f5ee" }}>
          Choose Your <span style={{ color: "#ffffff" }}>Creative Path</span>
        </h1>

        <p
          className="lead mb-5"
          style={{
            maxWidth: "600px",
            color: "#f5f5ee",
            lineHeight: "1.6",
            fontSize: "1.1rem",
          }}
        >
          Step into the world of handmade artistry whether you're here to
          create or to connect, your journey begins with one choice.
        </p>

        {/* ===== الأزرار ===== */}
        <div className="d-flex flex-column flex-md-row gap-3 mt-3">
          <button
            onClick={() => handleSelect("client")}
            className="btn fw-semibold"
            style={{
              backgroundColor: "#ffffff",
              color: "#3a0b0b",
              borderRadius: "30px",
              padding: "12px 36px",
              fontSize: "1rem",
              border: "2px solid #ffffff",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#f5f5ee";
              e.target.style.color = "#5b2a2a";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#ffffff";
              e.target.style.color = "#3a0b0b";
            }}
          >
            Client
          </button>

          <button
            onClick={() => handleSelect("artisan")}
            className="btn fw-semibold"
            style={{
              backgroundColor: "#ffffff",
              color: "#3a0b0b",
              borderRadius: "30px",
              padding: "12px 36px",
              fontSize: "1rem",
              border: "2px solid #ffffff",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#f5f5ee";
              e.target.style.color = "#5b2a2a";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#ffffff";
              e.target.style.color = "#3a0b0b";
            }}
          >
            Artisan
          </button>
        </div>
      </div>
    </section>
  );
}
