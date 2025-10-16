import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import heroImg from "../assets/Header.png";

export default function HeroSection() {
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
          {/* ===== Left: Text ===== */}
          <div className="col-12 col-md-6 mb-5 mb-md-0">
            <h1
              className="fw-bold mb-4"
              style={{
                color: "#3a0b0b",
                fontSize: "4.2rem", 
                lineHeight: "1.15",
                letterSpacing: "0.5px",
                maxWidth: "580px",
                fontFamily: '"Playfair Display", serif',
                textShadow: "0 2px 3px rgba(0,0,0,0.04)",
              }}
            >
              Discover Unique <br />
              <span
                style={{
                  color: "#7a7392",
                  fontWeight: 500,
                  fontSize: "4rem",
                }}
              >
                Handmade Creations
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
                marginTop: "1.5rem",
              }}
            >
              Experience artistry and authenticity — book workshops, and connect
              directly with passionate makers.
            </p>
          </div>

          {/* ===== Right: Image ===== */}
          <div className="col-12 col-md-6 d-flex justify-content-center">
            <img
              src={heroImg}
              alt="Aruma visual"
              className="img-fluid"
              style={{
                maxWidth: "85%",
                height: "auto",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                filter: "brightness(0.97) contrast(0.98)",
              }}
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
          }
        `}
      </style>
    </section>
  );
}
