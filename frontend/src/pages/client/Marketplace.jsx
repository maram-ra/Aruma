import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import HeroSection from "../../components/HeroSection";


export default function Marketplace() {
  const navigate = useNavigate();

  const handleLoginClick = () => navigate("/login?type=client");

  const sectionStyle = {
    padding: "12rem 0", // مسافة فوق وتحت
  };

  return (
    <div style={{ backgroundColor: "#f5f5ee", color: "#3a0b0b" }}>
      {/* ===== Navbar ===== */}
      <Navbar />

      {/* ===== Hero Section ===== */}
      <HeroSection />

    {/* ===== Artisans Section ===== */}
<section className="container text-center" style={sectionStyle}>
  <h5 className="fw-bold mb-4" style={{ color: "#3a0b0b" }}>
    Meet the Artisans
  </h5>

  <div className="row justify-content-center" style={{ rowGap: "40px" }}>
    {[
      {
        img: "/images/artisan1.jpg",
        name: "Mariam Al-Sulami",
        craft: "Ceramic Artist",
      },
      {
        img: "/images/artisan2.jpg",
        name: "Faisal Al-Harbi",
        craft: "Woodworker",
      },
      {
        img: "/images/artisan3.jpg",
        name: "Laila Al-Yami",
        craft: "Textile Weaver",
      },
      {
        img: "/images/artisan4.jpg",
        name: "sara Al-Qahtani",
        craft: "Jewelry Maker",
      },
      {
        img: "/images/artisan5.jpg",
        name: "Noura Al-Mutairi",
        craft: "Calligrapher",
      },
      {
        img: "/images/artisan6.jpg",
        name: "Salem Al-Hazmi",
        craft: "Leather Crafter",
      },
    ].map((artisan, index) => (
      <div
        className="col-12 col-md-4 d-flex flex-column align-items-center"
        key={index}
      >
        <img
          src={artisan.img}
          alt={artisan.name}
          style={{
            width: "100%",
            maxWidth: "340px",
            height: "430px",
            objectFit: "cover",
            borderRadius: "12px",
            boxShadow: "0 1px 6px rgba(0,0,0,0.12)",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.03)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "scale(1)")
          }
        />
        <h6
          className="mb-0 mt-3 fw-bold"
          style={{ color: "#3a0b0b", fontSize: "1rem" }}
        >
          {artisan.name}
        </h6>
        <p
          className="mb-2"
          style={{
            color: "#6f4e37",
            fontSize: "0.9rem",
            fontWeight: "500",
          }}
        >
          {artisan.craft}
        </p>
          <button
                className="btn-main"
                onClick={() => navigate(`/artisan/${artisan.id}`)}
              >
                View Profile
              </button>
      </div>
    ))}
  </div>
</section>





      {/* ===== Footer ===== */}
      <Footer />
    </div>
  );
}
