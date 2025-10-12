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

          {/* ===== Right: Text (محاذاة يسار) ===== */}
          <div className="col-12 col-md-6 text-md-start">
            <h1
              className="fw-bold mb-3"
              style={{
                color: "#3a0b0b",
                fontSize: "3rem",
                lineHeight: "1.2",
                maxWidth: "480px",
              }}
            >
              Discover unique <br /> handmade creations
            </h1>

            <p
              className="lead"
              style={{
                color: "#4a4a4a",
                maxWidth: "480px",
              }}
            >
              Book workshops, and connect directly with talented makers — all in one place.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
