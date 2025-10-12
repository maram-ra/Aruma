import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import heroImg from "../assets/Header.png";
import { useNavigate } from "react-router-dom";

export default function UserType() {
  const navigate = useNavigate();

  const handleSelect = (type) => {
    navigate(`/login?type=${type}`);
  };

  const baseButtonStyle = {
    backgroundColor: "transparent",
    color: "#3a0b0b",
    border: "2px solid #3a0b0b",
    borderRadius: "8px", 
    textAlign: "left",
    transition: "all 0.3s ease",
  };

  return (
    <section
      style={{
        backgroundColor: "#f5f5ee",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 0",
      }}
    >
      <div className="container">
        <div className="row align-items-center justify-content-center">
          {/* ===== Left: Image ===== */}
          <div className="col-12 col-md-6 d-flex justify-content-center mb-4 mb-md-0">
            <img
              src={heroImg}
              alt="Aruma visual"
              className="img-fluid"
              style={{
                maxWidth: "85%",
                height: "auto",
              }}
            />
          </div>

          {/* ===== Right: Text + Buttons ===== */}
          <div className="col-12 col-md-6 text-md-start">
            <h1
              className="fw-bold mb-4"
              style={{
                color: "#3a0b0b",
                fontSize: "3rem",
                lineHeight: "1.2",
                maxWidth: "480px",
              }}
            >
              Choose your creative path
            </h1>

            <p
              className="lead mb-5"
              style={{
                color: "#4a4a4a",
                maxWidth: "480px",
              }}
            >
              Whether you're here to craft, connect, or explore — select your role to start
              connecting with a world of handmade artistry.
            </p>

            {/* ===== Buttons (كلاهما بنفس التصميم) ===== */}
            <div className="d-flex flex-column flex-md-row gap-3 justify-content-md-start align-items-md-start">
              {/* Client Button */}
              <button
                onClick={() => handleSelect("client")}
                className="btn px-4 py-2 fw-semibold"
                style={baseButtonStyle}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#3a0b0b";
                  e.target.style.color = "#f5f5ee";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "#3a0b0b";
                }}
              >
                Client
              </button>

              {/* Artisan Button */}
              <button
                onClick={() => handleSelect("artisan")}
                className="btn px-4 py-2 fw-semibold"
                style={baseButtonStyle}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#3a0b0b";
                  e.target.style.color = "#f5f5ee";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "#3a0b0b";
                }}
              >
                Artisan
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
