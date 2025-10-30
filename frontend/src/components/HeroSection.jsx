import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import headerImage from "../assets/header2.png"; // ← استدعاء الصورة نفسها

export default function HeroSection() {
  return (
    <section
      className="hero-section"
      style={{ position: "relative", overflow: "hidden", minHeight: "100vh" }}
    >
      {/* ===== خلفية الصورة ===== */}
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
          filter: "brightness(0.9)",

        }}
      />

      {/* ===== تظليل ناعم فوق الصورة ===== */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(58, 11, 11, 0.35)", 
          zIndex: -1,
        }}
      ></div>

      {/* ===== المحتوى ===== */}
      <div
        className="container hero-content text-center"
        style={{
          color: "#fff",
          position: "relative",
          zIndex: 1,
          paddingTop: "12rem",
          paddingBottom: "8rem",
        }}
      >
        <h1
          className="hero-title fw-bold mb-3"
          style={{
            fontSize: "3rem",
            lineHeight: "1.2",
          }}
        >
          Where <span style={{ color: "#cbbeb3" }}>craft</span>
          <br />
          Becomes <span style={{ color: "#cbbeb3" }}>connection</span>
        </h1>

        <p
          className="hero-subtext"
          style={{
            maxWidth: "600px",
            margin: "1.5rem auto 0",
            color: "#f5f5ee",
            fontSize: "1.1rem",
            lineHeight: "1.6",
          }}
        >
          Aruma is a space that celebrates the beauty of handmade creation 
          where every detail tells a story, and every maker finds their rhythm.
        </p>
      </div>
    </section>
  );
}
