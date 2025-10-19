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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to load artisans");
          return;
        }

        const data = await response.json();
        console.log("FETCHED ARTISANS:", data);  
        setArtisans(data);
      } catch (error) {
        console.error("Error fetching artisans:", error);
      }
    };

    fetchArtisans();
  }, [token]);

  return (
    <div style={{ backgroundColor: "#f5f5ee", color: "#3a0b0b" }}>
      <Navbar />
      <HeroSection />

    <section className="container text-center py-5" style={{ padding: "10rem 0 8rem" }}>
  <h5
    className="fw-bold mb-5"
    style={{
      color: "#3a0b0b",
      fontSize: "1.25rem",
      letterSpacing: "0.5px",
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
    {artisans.length === 0 ? (
      <p className="text-muted">No artisans found yet.</p>
    ) : (
      artisans.map((artisan, index) => {
        // معالجة كل الاحتمالات للـ ID
        const id =
          artisan._id ||
          artisan.id ||
          artisan.Id ||
          artisan.ID ||
          `art_fallback_${index}`;

        console.log("🟣 Artisan ID used:", id, artisan);

        return (
          <div
            key={id}
            className="col-12 col-sm-6 col-md-4 d-flex flex-column align-items-center"
          >
            <div
              className="overflow-hidden"
              style={{
                borderRadius: "12px",
                boxShadow: "0 3px 10px rgba(32, 14, 14, 0.08)",
              }}
            >
              <img
                src={artisan.images?.[0] || "/images/artisan1.jpg"}
                alt={artisan.name}
                style={{
                  width: "100%",
                  maxWidth: "340px",
                  height: "430px",
                  objectFit: "cover",
                }}
              />
            </div>

            <h6 className="fw-bold mt-3 mb-1" style={{ color: "#3a0b0b" }}>
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
              {artisan.craftType || "Artisan"}
            </p>

            <button
              className="btn-outline"
              onClick={() => {
                if (!id || id === "undefined") {
                  console.error("⚠️ Invalid artisan ID:", artisan);
                  alert("Cannot open this profile — invalid ID");
                  return;
                }
                navigate(`/client/ArtisanProfile?id=${id}`);
              }}
              style={{
                padding: "8px 24px",
                fontSize: "0.9rem",
              }}
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
    </div>
  );
}
