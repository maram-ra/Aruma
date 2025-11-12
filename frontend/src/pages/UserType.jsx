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
      style={{ position: "relative", overflow: "hidden", minHeight: "100vh" }} // Desktop baseline (unchanged)
    >
      {/* الخلفية */}
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
          zIndex: -2,
          filter: "brightness(0.8)", // Desktop baseline (unchanged)
        }}
      />

      {/* تظليل خفيف لتحسين التباين على الشاشات الأصغر */}
      <div
        className="hero-overlay"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          background: "transparent", // Desktop baseline (unchanged)
        }}
      />

      {/* المحتوى */}
      <div
        className="container text-center d-flex flex-column justify-content-center align-items-center hero-content"
        style={{ minHeight: "100vh", color: "#fff" }} // Desktop baseline (unchanged)
      >
        <h1
          className="fw-bold mb-3 hero-title"
          style={{ fontSize: "3rem", color: "#f5f5ee" }} // Desktop baseline (unchanged)
        >
          Choose Your <span style={{ color: "#ffffff" }}>Creative Path</span>
        </h1>

        <p
          className="lead mb-5 hero-subtext"
          style={{
            maxWidth: "600px",
            color: "#f5f5ee",
            lineHeight: "1.6",
            fontSize: "1.1rem", // Desktop baseline (unchanged)
          }}
        >
          Step into the world of handmade artistry whether you're here to
          create or to connect, your journey begins with one choice.
        </p>

        {/* الأزرار */}
        <div className="d-flex flex-column flex-md-row gap-3 mt-3 hero-actions">
          <button
            onClick={() => handleSelect("client")}
            className="btn fw-semibold hero-btn"
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
              e.currentTarget.style.backgroundColor = "#f5f5ee";
              e.currentTarget.style.color = "#5b2a2a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.color = "#3a0b0b";
            }}
          >
            Client
          </button>

          <button
            onClick={() => handleSelect("artisan")}
            className="btn fw-semibold hero-btn"
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
              e.currentTarget.style.backgroundColor = "#f5f5ee";
              e.currentTarget.style.color = "#5b2a2a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.color = "#3a0b0b";
            }}
          >
            Artisan
          </button>
        </div>
      </div>

      {/* ===== Responsive tweaks (لا تغيّر شكل الديسكتوب) ===== */}
      <style>{`
        /* تابلت وما دون (≤ 991.98px) */
        @media (max-width: 991.98px){
          .hero-section { min-height: 100svh; } /* أدق على الهواتف */
          .hero-content { min-height: 100svh !important; padding: 0 1rem; }
          .hero-title { font-size: clamp(2rem, 4.2vw, 2.4rem) !important; }
          .hero-subtext {
            font-size: clamp(0.98rem, 2.2vw, 1.05rem) !important;
            max-width: 60ch !important;
            text-wrap: balance;
          }
          .hero-overlay {
            background: linear-gradient(
              to bottom,
              rgba(0,0,0,0.35), 
              rgba(0,0,0,0.25)
            ) !important; /* تباين أعلى للنص */
          }
          .hero-actions .hero-btn{
            padding: 12px 28px !important;
            font-size: 1rem !important;
          }
        }

        /* جوال صغير (≤ 575.98px) */
        @media (max-width: 575.98px){
          .hero-title { font-size: clamp(1.7rem, 7vw, 2rem) !important; }
          .hero-subtext { font-size: 0.98rem !important; }
          .hero-actions { width: min(100%, 440px); margin-inline: auto; }
          .hero-actions .hero-btn{
            width: 100%;
            border-radius: 999px;
            padding: 14px 20px !important; /* مساحة لمس أريح */
          }
          /* مراعاة الحواف الآمنة */
          .hero-content{ padding-bottom: max(24px, env(safe-area-inset-bottom)); }
        }

        @media (prefers-reduced-motion: reduce){
          * { transition: none !important; animation: none !important; }
        }
      `}</style>
    </section>
  );
}