import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import HeroSection from "../../components/HeroSection";

export default function Marketplace() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: "#f5f5ee", color: "#3a0b0b" }}>
      {/* ===== Navbar ===== */}
      <Navbar />

      {/* ===== Hero Section ===== */}
      <HeroSection />

      {/* ===== Artisans Section ===== */}
      <section className="container text-center py-5" style={{ padding: "10rem 0 8rem" }}>
        <h5
          className="fw-bold mb-5"
          style={{
            color: "#3a0b0b",
            fontSize: "1.25rem",
            letterSpacing: "0.5px",
            position: "relative",
          }}
        >
          Meet the Artisans
          <div
            style={{
              width: "50px",
              height: "2px",
              backgroundColor: "#cbbeb3",
              margin: "10px auto 0",
              opacity: "0.8",
            }}
          ></div>
        </h5>

        <div className="row justify-content-center" style={{ rowGap: "60px" }}>
          {[
            {
              id: 1,
              img: "/images/artisan1.jpg",
              name: "Mariam Al-Sulami",
              craft: "Ceramic Artist",
            },
            {
              id: 2,
              img: "/images/artisan2.jpg",
              name: "Faisal Al-Harbi",
              craft: "Woodworker",
            },
            {
              id: 3,
              img: "/images/artisan3.jpg",
              name: "Laila Al-Yami",
              craft: "Textile Weaver",
            },
            {
              id: 4,
              img: "/images/artisan4.jpg",
              name: "Sara Al-Qahtani",
              craft: "Jewelry Maker",
            },
            {
              id: 5,
              img: "/images/artisan5.jpg",
              name: "Noura Al-Mutairi",
              craft: "Calligrapher",
            },
            {
              id: 6,
              img: "/images/artisan6.jpg",
              name: "Salem Al-Hazmi",
              craft: "Leather Crafter",
            },
          ].map((artisan, index) => (
            <div
              key={index}
              className="col-12 col-sm-6 col-md-4 d-flex flex-column align-items-center"
              style={{
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              {/* صورة الحرفي */}
              <div
                className="overflow-hidden"
                style={{
                  borderRadius: "12px",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                }}
              >
                <img
                  src={artisan.img}
                  alt={artisan.name}
                  style={{
                    width: "100%",
                    maxWidth: "340px",
                    height: "430px",
                    objectFit: "cover",
                    transition: "transform 0.4s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
              </div>

              {/* الاسم والحرفة */}
              <h6
                className="fw-bold mt-3 mb-1"
                style={{
                  color: "#3a0b0b",
                  fontSize: "1rem",
                  letterSpacing: "0.3px",
                }}
              >
                {artisan.name}
              </h6>
              <p
                className="mb-3"
                style={{
                  color: "#6f4e37",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                }}
              >
                {artisan.craft}
              </p>

              {/* زر عرض البروفايل */}
              <button
                className="btn-outline"
                onClick={() => navigate("/client/ArtisanProfile")}
                style={{
                  padding: "8px 24px",
                  fontSize: "0.9rem",
                }}
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
