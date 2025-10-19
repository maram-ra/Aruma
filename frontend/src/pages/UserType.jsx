import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import heroImg from "../assets/Header.png";
import { useNavigate } from "react-router-dom";

export default function UserType() {
  const navigate = useNavigate();

  const handleSelect = (type) => {
    navigate(`/login?type=${type}`);
  };

  return (
    <section
      style={{
        backgroundColor: "#f5f5ee",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "7rem 0",
        animation: "fadeInUp 1.2s ease",
      }}
    >
      <div className="container">
        <div className="row align-items-center justify-content-center text-center text-md-start">
          {/* ===== Left: Text + Buttons ===== */}
          <div className="col-12 col-md-6 mb-5 mb-md-0">
            <h1
              className="fw-bold mb-4"
              style={{
                color: "#3a0b0b",
                fontSize: "4rem",
                lineHeight: "1.15",
                letterSpacing: "0.5px",
                maxWidth: "580px",
                fontFamily: '"Playfair Display", serif',
                textShadow: "0 2px 3px rgba(0,0,0,0.04)",
              }}
            >
              Choose Your <br />
              <span
                style={{
                  color: "#7a7392",
                  fontWeight: 500,
                  fontSize: "3.8rem",
                }}
              >
                Creative Path
              </span>
            </h1>

            <p
              style={{
                color: "#5c4b45",
                maxWidth: "520px",
                fontSize: "1.3rem",
                lineHeight: "1.9",
                fontWeight: "400",
                letterSpacing: "0.2px",
                fontFamily: '"Inter", sans-serif',
                opacity: "0.9",
                marginBottom: "2.5rem",
              }}
            >
              Whether you’re here to craft, connect, or explore —  
              choose your role and step into the world of handmade artistry.
            </p>

            {/* ===== Buttons ===== */}
            <div className="d-flex flex-column flex-md-row gap-4 justify-content-md-start align-items-md-start">
  <button
    onClick={() => handleSelect("client")}
    className="btn btn-outline"
  >
    Client
  </button>

  <button
    onClick={() => handleSelect("artisan")}
    className="btn btn-outline"
  >
    Artisan
  </button>
</div>

          </div>

          {/* ===== Right: Image ===== */}
          <div className="col-12 col-md-6 d-flex justify-content-center">
            <img
              src={heroImg}
              alt="Craftsman working in a handmade studio"
              className="img-fluid"
              style={{
                maxWidth: "85%",
                height: "auto",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                filter: "brightness(0.97) contrast(0.98)",
              }}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>

      {/* ===== Animation Keyframes ===== */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(25px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (max-width: 768px) {
            h1 {
              font-size: 2.6rem !important;
              line-height: 1.2;
            }
            p {
              font-size: 1.05rem !important;
            }
            .btn {
              font-size: 1rem !important;
              padding: 12px 28px !important;
            }
          }
        `}
      </style>
    </section>
  );
}
