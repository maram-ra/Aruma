import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import HeroSection from "../../components/HeroSection";

export default function Marketplace() {
  const navigate = useNavigate();
  const [artisans, setArtisans] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/artisans", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          console.error("Failed to load artisans");
          return;
        }
        const data = await response.json();
        setArtisans(data || []);
      } catch (error) {
        console.error("Error fetching artisans:", error);
      }
    };
    fetchArtisans();
  }, [token]);

  return (
    <div className="marketplace-page">
      <Navbar />
      <HeroSection />

      {/* ===== Meet the Artisans ===== */}
      <section className="container text-center py-5 artisans-block" style={{ padding: "10rem 0 8rem" }}>
        <h5
          className="fw-bold mb-5 artisans-title"
          style={{ color: "#3a0b0b", fontSize: "1.25rem", letterSpacing: "0.5px" }}
        >
          Meet the Artisans
          <div
            style={{
              width: "50px",
              height: "2px",
              backgroundColor: "#cbbeb3",
              margin: "10px auto 0",
              opacity: 0.8,
            }}
          />
        </h5>

        <div className="row justify-content-center" style={{ rowGap: "60px" }}>
          {artisans.length === 0 ? (
            <p className="text-muted">No artisans found yet.</p>
          ) : (
            artisans.map((artisan, index) => {
              // آمن ضد اختلاف شكل الـ id من الباك
              const id =
                artisan._id ||
                artisan.id ||
                artisan.Id ||
                artisan.ID ||
                `art_fallback_${index}`;

              return (
                <div
                  key={id}
                  className="col-12 col-sm-6 col-md-4 d-flex flex-column align-items-center"
                >
                  <div
                    className="overflow-hidden artisan-card shadow-sm"
                    style={{ borderRadius: "12px", boxShadow: "0 3px 10px rgba(32,14,14,.08)" }}
                  >
                    <img
                      src={artisan.images?.[0] || "/images/artisan1.jpg"}
                      alt={artisan.name}
                      className="artisan-img"
                      style={{
                        width: "100%",
                        maxWidth: "340px",   // baseline للديسكتوب
                        height: "430px",     // baseline للديسكتوب
                        objectFit: "cover",
                        display: "block",
                      }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <h6 className="fw-bold mt-3 mb-1" style={{ color: "#3a0b0b" }}>
                    {artisan.name}
                  </h6>
                  <p
                    className="mb-3"
                    style={{ color: "#6f4e37", fontSize: "0.9rem", fontWeight: 500 }}
                  >
                    {artisan.craftType || "Artisan"}
                  </p>

                  <button
                    className="btn-outline view-btn"
                    onClick={() => {
                      if (!id || id === "undefined") {
                        console.error("Invalid artisan ID:", artisan);
                        alert("Cannot open this profile — invalid ID");
                        return;
                      }
                      navigate(`/client/ArtisanProfile?id=${id}`);
                    }}
                    style={{ padding: "8px 24px", fontSize: "0.9rem" }}
                  >
                    View Profile
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>

      <Footer />

      {/* ===== Responsive styles (desktop unchanged) ===== */}
      <style>{`
        /* لا تغييرات بصرية على الديسكتوب، فقط تحسينات للجوال/التابلت */

        /* تابلت وما دون (≤ 991.98px) */
        @media (max-width: 991.98px){
          .artisans-block{
            padding-top: 6rem !important;   /* أقل لأن الهيرو طويل */
            padding-bottom: 4.5rem !important;
          }
          .artisans-title{
            font-size: clamp(1.05rem, 1.8vw, 1.2rem) !important;
          }

          /* بدل ارتفاع ثابت للصورة: نسبة 4:5 لكروت مرتبة */
          .artisan-card{
            width: min(100%, 360px);
            aspect-ratio: 4 / 5;
            border-radius: 12px;
          }
          .artisan-img{
            width: 100% !important;
            height: 100% !important;
            max-width: none !important;
            object-fit: cover;
          }

          .view-btn{
            padding: 10px 18px !important;
            font-size: .95rem !important;
          }
        }

        /* جوال صغير (≤ 575.98px) */
        @media (max-width: 575.98px){
          .artisans-block{
            padding-top: 4.75rem !important;
            padding-bottom: 3.5rem !important;
          }
          .artisan-card{ width: 100%; }
          .view-btn{ width: 100%; }  /* زر يمتد بعرض الكارد لسهولة النقر */
        }

        /* احترام تقليل الحركة */
        @media (prefers-reduced-motion: reduce){
          *{ transition: none !important; animation: none !important; }
        }
      `}</style>
    </div>
  );
}
