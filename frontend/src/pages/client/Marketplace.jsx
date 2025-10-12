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

      {/* ===== Explore Section ===== */}
      <section className="container text-center" style={sectionStyle}>
        <h5 className="fw-bold mb-4" style={{ color: "#3a0b0b" }}>
          Explore
        </h5>

        <div
          className="row justify-content-center"
          style={{ rowGap: "40px" }}
        >
          {[
            { img: "/images/work1.jpg", title: "Lapis Stud" },
            { img: "/images/work2.jpg", title: "Vintage Fetish Bear Necklace" },
            { img: "/images/work3.jpg", title: "Lapis Stud" },
            { img: "/images/work4.jpg", title: "Vintage Turquoise Ring" },
            { img: "/images/work5.jpg", title: "Misawa Mini Hoop Earrings - Pair" },
            { img: "/images/work6.jpg", title: "Bonnie Bracelet" },
          ].map((work, index) => (
            <div
              className="col-12 col-md-4 d-flex flex-column align-items-center"
              key={index}
            >
              <img
                src={work.img}
                alt={work.title}
                style={{
                  width: "100%",
                  maxWidth: "340px",
                  height: "430px",
                  objectFit: "cover",
                  borderRadius: "0",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.03)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
              <p
                className="mb-0 mt-1 fw-medium"
                style={{
                  color: "#3a0b0b",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                {work.title}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Footer ===== */}
      <Footer />
    </div>
  );
}
