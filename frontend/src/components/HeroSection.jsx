import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import headerImage from "../assets/header2.png";

export default function HeroSection() {
  return (
    <section
      className="hero-section"
      style={{ position: "relative", overflow: "hidden", minHeight: "100vh" }} // ← Desktop baseline (كما هو)
    >
      {/* خلفية الصورة */}
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

      {/* تظليل ناعم */}
      <div
        className="hero-overlay"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(58, 11, 11, 0.35)",
          zIndex: -1,
        }}
      />

      {/* المحتوى */}
      <div
        className="container hero-content text-center"
        style={{
          color: "#fff",
          position: "relative",
          zIndex: 1,
          paddingTop: "12rem",   // ← Desktop baseline
          paddingBottom: "8rem", // ← Desktop baseline
        }}
      >
        <h1
          className="hero-title fw-bold mb-3"
          style={{
            fontSize: "3rem",     // ← Desktop baseline
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
            fontSize: "1.1rem",   // ← Desktop baseline
            lineHeight: "1.6",
          }}
        >
          Aruma is a space that celebrates the beauty of handmade creation
          where every detail tells a story, and every maker finds their rhythm.
        </p>
      </div>

      {/* تعديلات للأجهزة غير الكبيرة فقط */}
      <style>{`
        /* تابلت وما دون (≤ 991.98px) */
@media (max-width: 991.98px) {
  .hero-section { min-height: 100svh; } /* أدق على الجوال */

  /* تموضع مريح للنص فوق المنتصف قليلاً */
  .hero-content {
    padding-top: 9rem !important;
    padding-bottom: 6rem !important;
  }

  /* هرمية أوضح للعنوان والفقرة */
  .hero-title {
    font-size: clamp(2.2rem, 6.5vw, 2.6rem) !important;
    letter-spacing: .3px;
    transform: translateY(6px);
    opacity: 0;
    animation: rise .6s ease .1s forwards;
  }

  .hero-subtext {
    font-size: clamp(.9rem, 2.6vw, 1rem) !important;
    max-width: 56ch !important;
    padding-inline: 12px;
    line-height: 1.65;
    opacity: .92;
    transform: translateY(8px);
    animation: rise .6s ease .18s forwards;
  }

  /* تباين أعلى قليلاً */
  .hero-overlay { background: rgba(58, 11, 11, 0.38) !important; }

  /* تدرّج سفلي خفيف يحافظ على قابلية القراءة أياً كانت الصورة */
  .hero-section::after{
    content:"";
    position:absolute; inset:0;
    background: linear-gradient(180deg, transparent 55%, rgba(0,0,0,.28) 100%);
    pointer-events:none;
    z-index: -1;
  }

  /* أيقونة الهامبرقر أوضح فوق الصور الداكنة */
  .navbar-toggler-icon{
    filter: invert(100%) brightness(200%);
    opacity: .95;
  }
}

/* جوال صغير (≤ 576px) */
@media (max-width: 575.98px) {
  .hero-content {
    padding-top: 7rem !important;
    padding-bottom: 4.25rem !important;
  }
  .hero-title { font-size: 2rem !important; }
  .hero-subtext { font-size: 0.95rem !important; max-width: 60ch !important; }
}

/* حركة دخول رشيقة */
@keyframes rise { to { transform: translateY(0); opacity: 1; } }

/* احترام تفضيل تقليل الحركة */
@media (prefers-reduced-motion: reduce) {
  .hero-title, .hero-subtext { animation: none !important; transform: none !important; opacity: 1 !important; }
}

      `}</style>
    </section>
  );
}
